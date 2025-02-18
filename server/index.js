import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Configure CORS
const corsOptions = {
  origin: process.env.CLIENT_URL,
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'stripe-signature'],
  credentials: true
};

// Rate limiters
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(cors(corsOptions));
app.use(limiter);

// Use JSON parsing for all routes except webhooks
app.use((req, res, next) => {
  if (req.path === '/api/webhooks') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

// Create a Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { userId, successUrl, cancelUrl } = req.body;

    // Create or retrieve Stripe customer
    const { data: userCredits } = await supabase
      .from('user_credits')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single();

    let customerId = userCredits?.stripe_customer_id;

    if (!customerId) {
      const { data: user } = await supabase.auth.admin.getUserById(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { user_id: userId }
      });

      customerId = customer.id;

      // Save Stripe customer ID
      await supabase
        .from('user_credits')
        .update({ stripe_customer_id: customerId })
        .eq('user_id', userId);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{
        price: process.env.STRIPE_PRICE_ID,
        quantity: 1,
      }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { user_id: userId }
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create a Customer Portal session
app.post('/api/create-portal-session', async (req, res) => {
  try {
    const { userId } = req.body;

    const { data: userCredits } = await supabase
      .from('user_credits')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single();

    if (!userCredits?.stripe_customer_id) {
      throw new Error('No Stripe customer found');
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: userCredits.stripe_customer_id,
      return_url: `${process.env.CLIENT_URL}/settings`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Stripe webhook handler
app.post('/api/webhooks',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle specific event types
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        // Update user's subscription status in Supabase
        const { error } = await supabase
          .from('user_subscriptions')
          .upsert({
            user_id: session.client_reference_id,
            stripe_customer_id: session.customer,
            subscription_status: 'active',
            price_id: session.subscription,
            updated_at: new Date().toISOString()
          });
        
        if (error) {
          console.error('Error updating subscription:', error);
          return res.status(500).json({ error: 'Failed to update subscription' });
        }
        break;

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        const subscription = event.data.object;
        const status = event.type === 'customer.subscription.deleted' ? 'canceled' : subscription.status;
        
        const { error: subError } = await supabase
          .from('user_subscriptions')
          .update({
            subscription_status: status,
            updated_at: new Date().toISOString()
          })
          .eq('stripe_customer_id', subscription.customer);
        
        if (subError) {
          console.error('Error updating subscription:', subError);
          return res.status(500).json({ error: 'Failed to update subscription' });
        }
        break;
    }

    res.json({ received: true });
  }
);

// Google OAuth callback
app.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  
  try {
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: code as string,
      nonce: req.cookies['supabase-auth-nonce']
    });

    if (error) throw error;

    // Redirect to the app with the session
    res.redirect(`${process.env.CLIENT_URL}/auth/callback#access_token=${data.session?.access_token}`);
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.redirect(`${process.env.CLIENT_URL}/auth?error=Google authentication failed`);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});