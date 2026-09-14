import { useState } from 'react';
import type { Product } from './ProductCard';

export function ProductManagerModal({ 
  products, 
  onClose, 
  onSave, 
  onDelete 
}: { 
  products: Product[], 
  onClose: () => void, 
  onSave: (product: Omit<Product, 'id'>, id?: number) => void,
  onDelete: (id: number) => void
}) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !stock) return;
    onSave({
      name,
      price: parseFloat(price),
      availableStock: parseInt(stock, 10)
    }, editingId || undefined);
    
    setName('');
    setPrice('');
    setStock('');
    setEditingId(null);
  };

  const handleEdit = (p: Product) => {
    setName(p.name);
    setPrice(p.price.toString());
    setStock(p.availableStock.toString());
    setEditingId(p.id);
  };

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ width: '600px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2>Manage Products</h2>
          <button className="btn" onClick={onClose}>X</button>
        </div>

        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <input 
            type="text" 
            placeholder="Product Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="input-field"
            required 
          />
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', marginBottom: '1rem' }}>
            <input 
              type="number" 
              placeholder="Price ($)" 
              step="0.01" 
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
              className="input-field"
              required 
            />
            <input 
              type="number" 
              placeholder="Stock" 
              value={stock} 
              onChange={(e) => setStock(e.target.value)} 
              className="input-field"
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
            {editingId ? 'Update Product' : 'Add New Product'}
          </button>
          {editingId && (
            <button 
              type="button" 
              className="btn" 
              style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
              onClick={() => {
                setEditingId(null);
                setName(''); setPrice(''); setStock('');
              }}
            >
              Cancel Edit
            </button>
          )}
        </form>

        <div style={{ overflowY: 'auto', flex: 1, borderTop: '1px solid var(--glass-border)', paddingTop: '1rem', textAlign: 'left' }}>
          {products.map(p => (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>${p.price.toFixed(2)} | Stock: {p.availableStock}</div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn" onClick={() => handleEdit(p)} style={{ padding: '0.3rem 0.6rem', fontSize: '0.9rem' }}>Edit</button>
                <button className="btn btn-danger" onClick={() => onDelete(p.id)} style={{ padding: '0.3rem 0.6rem', fontSize: '0.9rem' }}>Delete</button>
              </div>
            </div>
          ))}
          {products.length === 0 && <div style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>No products found.</div>}
        </div>
      </div>
    </div>
  );
}
