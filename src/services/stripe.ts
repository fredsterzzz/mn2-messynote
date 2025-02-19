import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Replace with your actual Stripe price ID for the £9.99 subscription
export const SUBSCRIPTION_PRICE = 'price_1QrnqvLK65TTfVqUWDYQvPKzTX91coMBbPS0WNdp6CFocJTgo4isv5dhxRy6wzSoemZV0fZQc1QYOXuQdFMjl9a800z4kTXoEd';

export async function createCheckoutSession(userId: string) {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: SUBSCRIPTION_PRICE,
        userId,
        successUrl: `${window.location.origin}/auth/callback?subscription=completed`,
        cancelUrl: `${window.location.origin}/pricing`,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create checkout session');
    }

    const { sessionId } = await response.json();
    const stripe = await stripePromise;
    
    if (!stripe) {
      throw new Error('Stripe failed to initialize');
    }

    const { error } = await stripe.redirectToCheckout({ sessionId });
    if (error) throw error;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function createPortalSession(userId: string): Promise<{ url: string }> {
  const response = await fetch('/api/create-portal-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      returnUrl: `${window.location.origin}/settings`,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create portal session');
  }

  const { url } = await response.json();
  if (!url) {
    throw new Error('No portal URL received');
  }

  return { url };
}