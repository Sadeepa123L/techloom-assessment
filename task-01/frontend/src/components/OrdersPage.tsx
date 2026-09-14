import { useState, useEffect } from 'react';
import { orderService } from '../services/orderService';
import type { OrderResponse } from '../services/orderService';

export function OrdersPage() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (error: any) {
      console.error('Failed to load orders', error);
      alert(`Failed to load orders: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="products-section" style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
      <div className="header">
        <h1>All Orders</h1>
      </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem', background: 'var(--panel-bg)', backdropFilter: 'blur(12px)', borderRadius: '12px', overflow: 'hidden' }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.05)', textAlign: 'left' }}>
              <th style={{ padding: '1rem' }}>Order ID</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.orderId} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '1rem' }}>#{order.orderId}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '999px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    backgroundColor: order.status === 'PAID' ? '#dcfce7' : order.status === 'FAILED' ? '#fee2e2' : order.status === 'CANCELLED' ? '#f3f4f6' : '#fef9c3',
                    color: order.status === 'PAID' ? '#166534' : order.status === 'FAILED' ? '#991b1b' : order.status === 'CANCELLED' ? '#374151' : '#854d0e'
                  }}>
                    {order.status}
                  </span>
                </td>
                <td style={{ padding: '1rem', fontWeight: 600 }}>${order.totalAmount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
