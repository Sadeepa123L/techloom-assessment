"use client";

import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useState } from "react";

interface PaymentModalProps {
  orderId: string;
  amount: number;
  onComplete: () => void;
  onClose: () => void;
}

export function PaymentModal({ orderId, amount, onComplete, onClose }: PaymentModalProps) {
  const [status, setStatus] = useState<"processing" | "success" | "failed">("processing");
  const [message, setMessage] = useState("Processing your payment...");

  const handlePayment = async (simulateStatus: "SUCCESS" | "FAILED") => {
    setStatus("processing");
    setMessage("Contacting payment gateway...");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/payments/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          status: simulateStatus
        })
      });

      if (!response.ok) {
        // Fallback for missing backend
        if (response.status === 404) {
          console.warn("Backend payment route missing. Mocking result.");
          if (simulateStatus === "SUCCESS") {
            setStatus("success");
            setMessage("Payment successful!");
            setTimeout(onComplete, 2000);
          } else {
            setStatus("failed");
            setMessage("Payment failed. Please try again.");
          }
          return;
        }
        throw new Error("Payment request failed");
      }

      if (simulateStatus === "SUCCESS") {
        setStatus("success");
        setMessage("Payment successful!");
        setTimeout(onComplete, 2000);
      } else {
        setStatus("failed");
        setMessage("Payment failed. Please try again.");
      }
    } catch (err) {
       // Frontend demo fallback
       if (simulateStatus === "SUCCESS") {
         setStatus("success");
         setMessage("Payment successful!");
         setTimeout(onComplete, 2000);
       } else {
         setStatus("failed");
         setMessage("Payment failed. Please try again.");
       }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <h3 className="text-xl font-bold text-center text-zinc-900 dark:text-zinc-100 mb-6">
          Mock Payment Gateway
        </h3>
        
        <div className="mb-8 text-center text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          ${amount.toFixed(2)}
        </div>

        {status === "processing" ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
            <p className="text-zinc-500 dark:text-zinc-400">{message}</p>
            
            <div className="mt-8 flex w-full flex-col gap-3">
              <button
                onClick={() => handlePayment("SUCCESS")}
                className="w-full rounded-md bg-green-600 px-4 py-3 font-medium text-white hover:bg-green-700"
              >
                Simulate Success
              </button>
              <button
                onClick={() => handlePayment("FAILED")}
                className="w-full rounded-md bg-red-600 px-4 py-3 font-medium text-white hover:bg-red-700"
              >
                Simulate Failure
              </button>
            </div>
          </div>
        ) : status === "success" ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
            <p className="text-lg font-medium text-green-600 dark:text-green-400">{message}</p>
            <p className="text-sm text-zinc-500">Redirecting to orders...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <XCircle className="h-16 w-16 text-red-500" />
            <p className="text-lg font-medium text-red-600 dark:text-red-400">{message}</p>
            <button
              onClick={() => setStatus("processing")}
              className="mt-4 rounded-md border border-zinc-300 px-4 py-2 font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              Try Again
            </button>
            <button
              onClick={onClose}
              className="mt-2 text-sm text-zinc-500 hover:underline"
            >
              Cancel Payment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
