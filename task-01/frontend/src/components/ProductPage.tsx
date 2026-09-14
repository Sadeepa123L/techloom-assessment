import { useState } from 'react';
import type { Product } from './ProductCard';

export function ProductPage({ products, onSave, onDelete }: { products: Product[], onSave: (p: Omit<Product, 'id'>, id?: number) => void, onDelete: (id: number) => void }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !stock) return;
    onSave({
      name,
      price: parseFloat(price),
      availableStock: parseInt(stock, 10)
    }, editingId || undefined);
    
    setName(''); setPrice(''); setStock('');
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (p: Product) => {
    setName(p.name);
    setPrice(p.price.toString());
    setStock(p.availableStock.toString());
    setEditingId(p.id);
    setShowForm(true);
  };

  return (
    <div className="products-section" style={{ width: '100%' }}>
      <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Manage Products</h1>
        <button className="btn btn-primary" onClick={() => {
          setShowForm(!showForm);
          if (editingId) {
            setEditingId(null);
            setName(''); setPrice(''); setStock('');
          }
        }}>
          {showForm ? 'Cancel' : '➕ Add New Product'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', background: 'var(--panel-bg)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
          <h3 style={{ marginBottom: '1rem' }}>{editingId ? 'Edit Product' : 'Create Product'}</h3>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <input type="text" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} className="input-field" required />
            <input type="number" placeholder="Price ($)" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="input-field" required />
            <input type="number" placeholder="Initial Stock" value={stock} onChange={(e) => setStock(e.target.value)} className="input-field" required />
          </div>
          <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Save'}</button>
        </form>
      )}

      <div className="grid">
        {products.map(p => (
          <div key={p.id} className="card">
            <div className="card-img-placeholder"></div>
            <div className="card-title">{p.name}</div>
            <div className="card-stock">{p.availableStock} in stock</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
              <div className="card-price">${p.price.toFixed(2)}</div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn" onClick={() => handleEdit(p)}>Edit</button>
                <button className="btn btn-danger" onClick={() => onDelete(p.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
        {products.length === 0 && <div style={{ color: 'var(--text-secondary)' }}>No products available. Add one above!</div>}
      </div>
    </div>
  );
}
