"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";

interface CheckoutButtonProps {
  locale: string;
  className?: string;
  children: ReactNode;
}

export default function CheckoutButton({ locale, className, children }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const autoTriggered = useRef(false);

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

  // Auto-checkout : si on arrive sur /pricing?auto_checkout=1 (typique après
  // un signup avec from=pricing), on déclenche le checkout dès le mount. Le
  // ref évite tout double-trigger sur re-render.
  useEffect(() => {
    if (searchParams?.get("auto_checkout") === "1" && !autoTriggered.current) {
      autoTriggered.current = true;
      handleCheckout();
    }
    // handleCheckout est une fermeture stable (uniquement `locale`/`loading` lus
    // depuis la closure) ; on volontairement n'inclut pas dans les deps pour
    // ne déclencher qu'à l'apparition du searchParam.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

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
