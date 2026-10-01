"use client";

// Révélation à l'arrivée dans l'écran, une seule fois : un observateur unique
// marque chaque élément [data-reveal] de la page (data-revealed). L'animation
// (opacité + translation, sans effet sur la mise en page) est dans home-v2.css ;
// mouvement réduit : tout est visible d'emblée, sans animation.

import { useEffect } from "react";

export function RevealOnView() {
  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])")];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute("data-revealed", "");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
