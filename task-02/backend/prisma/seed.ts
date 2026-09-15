import { PrismaClient } from '../node_modules/.prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  const products = [
    {
      name: 'Wireless Noise-Canceling Headphones',
      description: 'Premium over-ear headphones with active noise cancellation and 30-hour battery life.',
      price: 299.99,
      stock: 50,
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'],
      category: 'Electronics',
    },
    {
      name: 'Minimalist Mechanical Keyboard',
      description: 'Compact 75% mechanical keyboard with tactile switches and customizable RGB backlight.',
      price: 129.50,
      stock: 25,
      images: ['https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80'],
      category: 'Accessories',
    },
    {
      name: 'Ergonomic Office Chair',
      description: 'Adjustable ergonomic chair designed for all-day comfort with lumbar support.',
      price: 199.00,
      stock: 10,
      images: ['https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500&q=80'],
      category: 'Furniture',
    },
    {
      name: '4K Ultra HD Monitor',
      description: '27-inch 4K monitor with ultra-thin bezels and color accuracy for creators.',
      price: 349.99,
      stock: 15,
      images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80'],
      category: 'Electronics',
    },
    {
      name: 'Smart Home Hub',
      description: 'Control all your smart devices from one central touchscreen hub.',
      price: 149.99,
      stock: 40,
      images: ['https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=500&q=80'],
      category: 'Electronics',
    },
    {
      name: 'Bluetooth Portable Speaker',
      description: 'Waterproof portable speaker with 360-degree sound and deep bass.',
      price: 89.99,
      stock: 100,
      images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80'],
      category: 'Electronics',
    },
    {
      name: 'Leather Laptop Sleeve',
      description: 'Premium genuine leather sleeve designed to protect 13-inch to 15-inch laptops.',
      price: 59.99,
      stock: 60,
      images: ['https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500&q=80'],
      category: 'Accessories',
    },
    {
      name: 'Adjustable Standing Desk',
      description: 'Motorized standing desk with presets for ergonomic working postures.',
      price: 499.00,
      stock: 5,
      images: ['https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=500&q=80'],
      category: 'Furniture',
    },
  ];

  for (const p of products) {
    const product = await prisma.product.create({
      data: p,
    });
    console.log(`Created product with id: ${product.id}`);
  }
  
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
