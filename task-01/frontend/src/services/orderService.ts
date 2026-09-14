import { fetchApi } from './api';

export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

export interface OrderResponse {
  id: number;
  status: string;
  totalAmount: number;
}

export const orderService = {
  createOrder: (items: OrderItemRequest[]) => fetchApi<OrderResponse>('/orders', {
    method: 'POST',
    body: JSON.stringify({ items }),
  }),
  processPayment: (orderId: number, paymentStatus: 'SUCCESS' | 'FAILED' | 'TIMEOUT') => fetchApi<string>('/orders/payment', {
    method: 'POST',
    body: JSON.stringify({ orderId, paymentStatus }),
  }),
  cancelOrder: (orderId: number) => fetchApi<string>(`/orders/${orderId}/cancel`, {
    method: 'POST',
  }),
};
