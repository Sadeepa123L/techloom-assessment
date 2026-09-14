import type { Product } from './ProductCard';

export interface CartItem extends Product {
  quantity: number;
}

export function Cart({ items, onCheckout, onRemove }: { items: CartItem[], onCheckout: () => void, onRemove: (id: number) => void }) {
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="cart-section">
      <h2>Shopping Cart</h2>
      <div className="cart-items">
        {items.length === 0 && <div style={{ color: 'var(--text-secondary)' }}>Cart is empty</div>}
        {items.map(item => (
          <div className="cart-item" key={item.id}>
            <div>
              <div style={{ fontWeight: 600 }}>{item.name}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>${item.price.toFixed(2)} x {item.quantity}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontWeight: 700 }}>${(item.price * item.quantity).toFixed(2)}</div>
              <button className="btn" style={{ padding: '0.2rem 0.5rem' }} onClick={() => onRemove(item.id)}>X</button>
            </div>
          </div>
        ))}
      </div>
      <div>
        <div className="cart-total">
          <span>Total:</span>
          <span style={{ color: 'var(--accent-green)' }}>${subtotal.toFixed(2)}</span>
        </div>
        <button
          className="btn btn-primary"
          style={{ width: '100%', padding: '1rem', fontSize: '1.2rem' }}
          onClick={onCheckout}
          disabled={items.length === 0}
        >
          Checkout
        </button>
      </div>
    </div>
  );
}
