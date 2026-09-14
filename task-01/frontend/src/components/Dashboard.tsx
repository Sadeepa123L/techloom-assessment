import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { POSPage } from './POSPage';
import { ProductPage } from './ProductPage';
import { productService } from '../services/productService';
import type { Product } from './ProductCard';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('POS');
  const [products, setProducts] = useState<Product[]>([]);

  const loadProducts = async () => {
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products', error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleUpdateProductStock = (id: number, quantityChange: number) => {
    // This is an optimistic local update for the cart UX.
    // The actual DB stock reservation is handled by the backend during checkout.
    setProducts(prev => prev.map(p => p.id === id ? { ...p, availableStock: p.availableStock + quantityChange } : p));
  };

  const handleSaveProduct = async (product: Omit<Product, 'id'>, id?: number) => {
    try {
      if (id) {
        await productService.update(id, product);
      } else {
        await productService.create(product);
      }
      await loadProducts(); // Refresh list from DB
    } catch (error: any) {
      console.error('Failed to save product', error);
      alert(`Failed to save product: ${error.message}`);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await productService.delete(id);
      await loadProducts(); // Refresh list from DB
    } catch (error: any) {
      console.error('Failed to delete product', error);
      alert(`Failed to delete product: ${error.message}`);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {activeTab === 'POS' && <POSPage products={products} onUpdateProductStock={handleUpdateProductStock} reloadProducts={loadProducts} />}
        {activeTab === 'PRODUCTS' && <ProductPage products={products} onSave={handleSaveProduct} onDelete={handleDeleteProduct} />}
      </div>
    </div>
  );
}
