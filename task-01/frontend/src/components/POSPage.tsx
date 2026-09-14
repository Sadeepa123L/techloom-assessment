import { useState } from 'react';
import { ProductCard } from './ProductCard';
import { Cart } from './Cart';
import { PaymentModal } from './PaymentModal';
import { orderService } from '../services/orderService';
import type { Product } from './ProductCard';
import type { CartItem } from './Cart';

export function POSPage({ products, onUpdateProductStock, reloadProducts }: { products: Product[], onUpdateProductStock: (id: number, quantityChange: number) => void, reloadProducts: () => Promise<void> }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState<number | null>(null);

  const handleAddToCart = (product: Product) => {
    onUpdateProductStock(product.id, -1);
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (id: number) => {
    const itemToRemove = cart.find(item => item.id === id);
    if (!itemToRemove) return;
    onUpdateProductStock(id, itemToRemove.quantity);
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckout = async () => {
    try {
      const items = cart.map(item => ({ productId: item.id, quantity: item.quantity }));
      const order = await orderService.createOrder(items);
      setActiveOrderId(order.id);
      setShowPayment(true);
    } catch (error: any) {
      alert(`Checkout failed: ${error.message}`);
      await reloadProducts(); // Reload stock if checkout fails due to backend stock validation
      setCart([]);
    }
  };

  const handlePaymentSimulation = async (status: 'SUCCESS' | 'FAILED' | 'TIMEOUT') => {
    if (!activeOrderId) return;
    setShowPayment(false);
    
    try {
      await orderService.processPayment(activeOrderId, status);
      if (status === 'SUCCESS') {
        alert('Payment Successful! Order Paid.');
      } else {
        alert(`Payment ${status}. Stock reserved lock released.`);
      }
    } catch (error: any) {
      alert(`Payment processing error: ${error.message}`);
    } finally {
      setCart([]);
      setActiveOrderId(null);
      await reloadProducts(); // Fetch fresh stock from DB
    }
  };

  return (
    <div style={{ display: 'flex', height: '100%', width: '100%' }}>
      <div className="products-section">
        <div className="header">
          <h1>Point of Sale</h1>
        </div>
        <div className="grid">
          {products.map(p => (
            <ProductCard key={p.id} product={p} onAdd={handleAddToCart} />
          ))}
        </div>
      </div>
      <Cart items={cart} onCheckout={handleCheckout} onRemove={handleRemoveFromCart} />
      {showPayment && <PaymentModal onSimulate={handlePaymentSimulation} />}
    </div>
  );
}
