export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  availableStock: number;
  reservedStock: number;
  images: string[];
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  totalPrice: number;
  status: 'RESERVED' | 'PAID' | 'EXPIRED' | 'FAILED';
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}
