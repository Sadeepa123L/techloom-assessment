import { fetchApi } from './api';

export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

export interface OrderResponse {
  orderId: number;
  status: string;
  totalAmount: number;
}

export const orderService = {
  getAllOrders: () => fetchApi<OrderResponse[]>('/api/orders'),
  createOrder: (items: OrderItemRequest[]) => fetchApi<OrderResponse>('/api/orders', {
    method: 'POST',
    body: JSON.stringify({ items }),
  }),
  processPayment: (orderId: number, paymentStatus: 'SUCCESS' | 'FAILED' | 'TIMEOUT') => fetchApi<string>('/api/orders/payment', {
    method: 'POST',
    body: JSON.stringify({ orderId, paymentStatus }),
  }),
  cancelOrder: (orderId: number) => fetchApi<string>(`/api/orders/${orderId}/cancel`, {
    method: 'POST',
  }),
};
