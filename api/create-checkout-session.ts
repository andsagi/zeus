import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return res.status(500).json({ error: 'STRIPE_SECRET_KEY environment variable is missing.' });
  }
  
  const stripeClient = new Stripe(key);

  try {
    const { priceId } = req.body;
    
    // In Vercel, req.headers.origin or host can be used. Vercel sets x-forwarded-host
    const origin = req.headers.origin || `https://${req.headers.host}`;

    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId, 
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/settings?success=true`,
      cancel_url: `${origin}/settings?canceled=true`,
    });

    res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message });
  }
}
