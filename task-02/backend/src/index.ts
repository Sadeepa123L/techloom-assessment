import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import cron from 'node-cron';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Get all products (with optional search and category filter)
app.get('/api/products', async (req, res) => {
  try {
    const { search, category } = req.query;
    
    const where: any = {};
    if (search) {
      where.name = {
        contains: String(search),
        mode: 'insensitive',
      };
    }
    if (category) {
      where.category = String(category);
    }

    const products = await prisma.product.findMany({
      where,
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get a single product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
    });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create an order
app.post('/api/orders/checkout', async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Invalid items' });
    }

    // Calculate total price and prepare order items
    let total = 0;
    const orderItemsToCreate: { productId: string; quantity: number; price: number }[] = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });
      if (!product) {
        return res.status(404).json({ error: `Product ${item.productId} not found` });
      }
      total += product.price * item.quantity;
      orderItemsToCreate.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price
      });
    }

    // Create the order and update stock
    const order = await prisma.$transaction(async (tx) => {
      // First, verify stock for all items
      for (const item of orderItemsToCreate) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product || product.availableStock < item.quantity) {
          throw new Error(`Insufficient stock for product ${item.productId}`);
        }
      }

      const newOrder = await tx.order.create({
        data: {
          total,
          status: 'PENDING',
          items: {
            create: orderItemsToCreate
          }
        }
      });

      for (const item of orderItemsToCreate) {
        await tx.product.update({
          where: { id: item.productId },
          data: { 
            availableStock: { decrement: item.quantity },
            reservedStock: { increment: item.quantity }
          }
        });
      }

      return newOrder;
    });

    res.json({ id: order.id, total: order.total });
  } catch (error: any) {
    console.error(error);
    if (error.message && error.message.includes('Insufficient stock')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to process checkout' });
  }
});

// Process payment
app.post('/api/payments/process', async (req, res) => {
  try {
    const { orderId, status } = req.body;
    
    if (!orderId || !status) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 'PENDING') {
      return res.status(400).json({ error: 'Order already processed' });
    }

    await prisma.$transaction(async (tx) => {
      const newStatus = status === 'SUCCESS' ? 'PAID' : 'FAILED';
      await tx.order.update({
        where: { id: orderId },
        data: { status: newStatus }
      });

      if (status !== 'SUCCESS') {
        // Revert reserved stock back to available
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              availableStock: { increment: item.quantity },
              reservedStock: { decrement: item.quantity }
            }
          });
        }
      } else {
        // Paid: permanently deduct reserved stock
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              reservedStock: { decrement: item.quantity }
            }
          });
        }
      }
    });

    const finalStatus = status === 'SUCCESS' ? 'PAID' : 'FAILED';
    res.json({ success: true, status: finalStatus });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process payment' });
  }
});

// Get my orders
app.get('/api/orders/my-orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Map total to totalPrice for the frontend
    const mappedOrders = orders.map(order => ({
      ...order,
      totalPrice: order.total
    }));

    res.json(mappedOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Cancel order
app.post('/api/orders/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status === 'CANCELLED' || order.status === 'EXPIRED') {
      return res.status(400).json({ error: `Order is already ${order.status.toLowerCase()}` });
    }

    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id },
        data: { status: 'CANCELLED' }
      });

      for (const item of order.items) {
        if (order.status === 'PENDING') {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              availableStock: { increment: item.quantity },
              reservedStock: { decrement: item.quantity }
            }
          });
        } else if (order.status === 'PAID') {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              availableStock: { increment: item.quantity }
            }
          });
        }
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

cron.schedule('* * * * *', async () => {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const expiredOrders = await prisma.order.findMany({
      where: {
        status: 'PENDING',
        createdAt: {
          lt: fiveMinutesAgo
        }
      },
      include: { items: true }
    });

    for (const order of expiredOrders) {
      await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: order.id },
          data: { status: 'EXPIRED' }
        });
        
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              availableStock: { increment: item.quantity },
              reservedStock: { decrement: item.quantity }
            }
          });
        }
      });
      console.log(`Order ${order.id} expired and stock reverted.`);
    }
  } catch (err) {
    console.error('Error in expiry cron job:', err);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
