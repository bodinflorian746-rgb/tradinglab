"use client";

import { useState, type ReactNode } from "react";

interface CheckoutButtonProps {
  locale: string;
  className?: string;
  children: ReactNode;
}

export default function CheckoutButton({ locale, className, children }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale }),
      });

      // Non connecté → on envoie vers l'inscription (jamais un bouton silencieux).
      if (response.status === 401) {
        window.location.href = `/${locale}/signup?from=pricing`;
        return;
      }

      const data: { url?: string } = await response.json().catch(() => ({}));

      if (response.ok && data.url) {
        window.location.href = data.url;
        return;
      }

      // Toute autre erreur : retour pricing avec marqueur (feedback visible).
      window.location.href = `/${locale}/pricing?stripe_error=1`;
    } catch (error) {
      console.error("Stripe checkout error:", error);
      window.location.href = `/${locale}/pricing?stripe_error=1`;
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCheckout}
      disabled={loading}
      className={className}
      aria-busy={loading}
    >
      {children}
    </button>
  );
}
