import { fetchApi } from './api';
import type { Product } from '../components/ProductCard';

export const productService = {
  getAll: () => fetchApi<Product[]>('/api/products'),
  getById: (id: number) => fetchApi<Product>(`/api/products/${id}`),
  create: (data: Omit<Product, 'id'>) => fetchApi<Product>('/api/products', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: Omit<Product, 'id'>) => fetchApi<Product>(`/api/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => fetchApi<void>(`/api/products/${id}`, {
    method: 'DELETE',
  }),
};
