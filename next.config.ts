import type { NextConfig } from "next";

// En-têtes de sécurité simples appliqués à toutes les réponses.
// Volontairement SANS Content-Security-Policy ni HSTS pour l'instant.
// Permissions-Policy : coupe les API navigateur non utilisées par le site
// (le presse-papiers, utilisé par les boutons « copier », n'est pas restreint).
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
