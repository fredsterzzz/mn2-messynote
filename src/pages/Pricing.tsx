import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Pricing() {
  const { user } = useAuth();

  const handleSubscribe = async () => {
    if (!user) {
      window.location.href = '/auth?redirect=pricing';
      return;
    }

    window.location.href = 'https://buy.stripe.com/3cs9CB0A7b0C1SE144';
  };

  const features = [
    'Unlimited transformations',
    'All templates included',
    'Priority support',
    'Advanced analytics',
    'Custom templates',
    'Team collaboration',
    'Export to multiple formats',
    'Advanced tone options',
    'Priority email support'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-accent-purple to-accent-orange bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </span>
        </h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto">
          Transform your notes into professional content with our powerful AI tools.
        </p>
      </div>

      <div className="max-w-lg mx-auto">
        <div className="bg-background-secondary rounded-2xl border border-accent-purple/20 p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-text-primary mb-2">Premium Plan</h3>
            <div className="flex items-center justify-center mb-4">
              <span className="text-5xl font-bold text-text-primary">£9.99</span>
              <span className="text-text-secondary ml-2">/mo</span>
            </div>
            <p className="text-text-secondary mb-6">Everything you need to transform your notes</p>
          </div>

          <ul className="space-y-4 mb-8">
            {features.map((feature) => (
              <li key={feature} className="flex items-center text-text-primary">
                <Check className="h-5 w-5 text-accent-purple mr-2" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={handleSubscribe}
            className="w-full py-4 px-8 bg-gradient-cta text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Start Free Trial
          </button>
          <p className="text-center text-sm text-text-secondary mt-4">
            14-day free trial, cancel anytime
          </p>
        </div>

        <div className="mt-16 bg-background-secondary rounded-2xl border border-accent-purple/20 p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">
              <span className="bg-gradient-to-r from-accent-purple to-accent-orange bg-clip-text text-transparent">
                Frequently Asked Questions
              </span>
            </h2>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="font-semibold text-lg mb-2 text-text-primary">Can I cancel my subscription?</h3>
              <p className="text-text-secondary">
                Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2 text-text-primary">What payment methods do you accept?</h3>
              <p className="text-text-secondary">
                We accept all major credit cards and debit cards through our secure payment processor, Stripe.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-text-primary">Is there a free trial?</h3>
              <p className="text-text-secondary">
                Yes, we offer a 14-day free trial with full access to all features.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2 text-text-primary">Do you offer refunds?</h3>
              <p className="text-text-secondary">
                Yes, we offer a 30-day money-back guarantee if you're not satisfied with our service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricing;