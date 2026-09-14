import { fetchApi } from './api';
import type { Product } from '../components/ProductCard';

export const productService = {
  getAll: () => fetchApi<Product[]>('/products'),
  getById: (id: number) => fetchApi<Product>(`/products/${id}`),
  create: (data: Omit<Product, 'id'>) => fetchApi<Product>('/products', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: Omit<Product, 'id'>) => fetchApi<Product>(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => fetchApi<void>(`/products/${id}`, {
    method: 'DELETE',
  }),
};
