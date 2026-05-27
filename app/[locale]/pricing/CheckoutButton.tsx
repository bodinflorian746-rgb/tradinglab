"use client";

import type { ReactNode } from "react";

interface CheckoutButtonProps {
  className?: string;
  children: ReactNode;
}

export default function CheckoutButton({ className, children }: CheckoutButtonProps) {
  const handleCheckout = async () => {
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: { url?: string } = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Stripe checkout error:", error);
    }
  };

  return (
    <button type="button" onClick={handleCheckout} className={className}>
      {children}
    </button>
  );
}
