"use client";

import { useEffect, useState } from "react";
import { Order } from "@/types";
import { Package, XCircle } from "lucide-react";
import Link from "next/link";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch("${process.env.NEXT_PUBLIC_API_URL || "${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}"}/api/orders/my-orders");
      if (!res.ok) {
        if (res.status === 404) {
          // Backend missing fallback
          console.warn("Backend orders route missing. Mocking empty orders.");
          setOrders([]);
          return;
        }
        throw new Error("Failed to fetch orders");
      }
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error(error);
      setOrders([]); // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}"}/api/orders/${orderId}/cancel`, {
        method: "POST"
      });
      
      if (!res.ok) {
        if (res.status === 404) {
          alert("Backend cancel route missing. Cannot cancel mocked order.");
          return;
        }
        throw new Error("Failed to cancel order");
      }
      
      // Refresh orders
      fetchOrders();
    } catch (error) {
      console.error(error);
      alert("Failed to cancel order");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto flex max-w-7xl items-center justify-center py-32 px-4 sm:px-6 lg:px-8">
        <div className="text-zinc-500 dark:text-zinc-400">Loading your orders...</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-32 sm:px-6 lg:px-8">
        <Package className="h-16 w-16 text-zinc-300 dark:text-zinc-700 mb-6" />
        <h2 className="mb-4 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">No orders yet</h2>
        <p className="mb-8 text-zinc-500 dark:text-zinc-400">When you place an order, it will appear here.</p>
        <Link href="/" className="rounded-full bg-indigo-600 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-8">
        Order History
      </h1>

      <div className="space-y-8">
        {orders.map((order) => (
          <div key={order.id} className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-8">
                <div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Order Number</p>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">#{order.id.slice(-8)}</p>
                </div>
                <div className="mt-2 sm:mt-0">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Date Placed</p>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-2 sm:mt-0">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Total</p>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">${order.totalPrice.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize
                  ${order.status === 'PAID' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                    order.status === 'RESERVED' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                  {order.status.toLowerCase()}
                </span>
                
                {(order.status === 'PAID' || order.status === 'RESERVED') && (
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    className="flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-500 dark:text-red-400"
                  >
                    <XCircle className="h-4 w-4" />
                    Cancel Order
                  </button>
                )}
              </div>
            </div>

            <div className="px-6 py-4">
              <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {order.items.map((item) => (
                  <li key={item.id} className="flex py-4">
                    <div className="flex-1 flex justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          {/* Assuming the backend returns product details or we just have basic info */}
                          Product ID: {item.productId}
                        </h4>
                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">${item.price.toFixed(2)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
