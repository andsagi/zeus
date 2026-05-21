import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

let stripeClient: Stripe | null = null;

function getStripe() {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY environment variable is missing. Please add it to your Secrets.');
    }
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}

export const app = express();
const PORT = 3000;

app.use(express.json());

// API Route for Stripe Checkout
app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const stripe = getStripe();
    const { priceId } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId, 
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.origin}/settings?success=true`,
      cancel_url: `${req.headers.origin}/settings?canceled=true`,
    });

    res.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}
