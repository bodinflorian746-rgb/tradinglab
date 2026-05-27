// Server-only Stripe client.
// Importer uniquement depuis Route Handlers, Server Actions, ou autres modules
// serveur. Ne jamais importer côté browser : le secret key ne doit pas
// fuiter dans un bundle client.
//
// La clé secrète est résolue selon STRIPE_MODE via lib/stripe-config.ts.

import Stripe from "stripe";
import { getStripeSecretKey } from "./stripe-config";

export const stripe = new Stripe(getStripeSecretKey());
