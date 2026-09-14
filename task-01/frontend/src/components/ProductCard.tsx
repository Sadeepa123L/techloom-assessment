export interface Product {
  id: number;
  name: string;
  price: number;
  availableStock: number;
}

export function ProductCard({ product, onAdd }: { product: Product, onAdd: (p: Product) => void }) {
  return (
    <div className="card">
      <div className="card-img-placeholder"></div>
      <div className="card-title">{product.name}</div>
      <div className="card-stock">{product.availableStock} in stock</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
        <div className="card-price">${product.price.toFixed(2)}</div>
        <button className="btn" onClick={() => onAdd(product)} disabled={product.availableStock === 0}>
          + Add
        </button>
      </div>
    </div>
  );
}
