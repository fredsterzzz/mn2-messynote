import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Wand2, Brain, Zap } from 'lucide-react';

function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleTransformClick = () => {
    if (user?.credits === 0) {
      navigate('/pricing');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Hero Section */}
      <div className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-accent-purple/20 via-background to-background" />
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-background-secondary border border-accent-purple/20 mb-8">
            <Sparkles className="h-4 w-4 text-accent-purple mr-2" />
            <span className="text-sm">AI-Powered Note Transformation</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-8">
            Transform Messy Notes into
            <span className="bg-gradient-to-r from-accent-purple to-accent-orange bg-clip-text text-transparent"> Professional Content</span>
          </h1>
          <p className="text-xl text-text-secondary mb-12 max-w-3xl mx-auto">
            Using advanced AI to turn your unorganized thoughts into clean, structured, and professional content in seconds.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleTransformClick}
              className="inline-block px-8 py-3 bg-gradient-to-r from-accent-purple to-accent-orange text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              <span className="flex items-center justify-center">
                <Wand2 className="h-5 w-5 mr-2" />
                {user?.credits === 0 ? "Get Credits" : "Transform Your Notes"}
              </span>
            </button>
            <Link
              to="/pricing"
              className="px-8 py-4 bg-background-secondary text-text-primary border border-accent-purple/20 rounded-lg font-semibold hover:bg-background-secondary/80 transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-accent-purple to-accent-orange bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-background rounded-xl border border-accent-purple/20">
              <Brain className="h-12 w-12 text-accent-purple mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI-Powered</h3>
              <p className="text-text-secondary">Advanced AI algorithms understand context and structure to transform your notes perfectly.</p>
            </div>
            <div className="p-6 bg-background rounded-xl border border-accent-orange/20">
              <Zap className="h-12 w-12 text-accent-orange mb-4" />
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-text-secondary">Get professionally formatted content in seconds, not hours.</p>
            </div>
            <div className="p-6 bg-background rounded-xl border border-accent-blue/20">
              <Sparkles className="h-12 w-12 text-accent-blue mb-4" />
              <h3 className="text-xl font-semibold mb-2">Multiple Formats</h3>
              <p className="text-text-secondary">Transform notes into various professional formats - documents, presentations, and more.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-text-secondary">Start transforming your notes today</p>
          </div>
          
          <div className="max-w-lg mx-auto">
            <div className="relative bg-background-secondary rounded-2xl border border-accent-purple/20 p-8">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-cta text-white text-sm py-1 px-4 rounded-full">
                  Popular
                </span>
              </div>
              
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Premium Plan</h3>
                <div className="flex items-center justify-center mb-4">
                  <span className="text-5xl font-bold">£9.99</span>
                  <span className="text-text-secondary ml-2">/mo</span>
                </div>
                <p className="text-text-secondary mb-6">Everything you need to transform your notes</p>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  'Unlimited transformations',
                  'All templates included',
                  'Priority support',
                  'Advanced analytics',
                  'Custom templates',
                ].map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Sparkles className="h-5 w-5 text-accent-purple mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col items-center">
                <button
                  onClick={() => window.location.href = 'https://buy.stripe.com/3cs9CB0A7b0C1SE144'}
                  className="w-full bg-gradient-to-r from-accent-purple to-accent-orange text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity text-center"
                >
                  Start Free Trial
                </button>
                <p className="text-center text-sm text-text-secondary mt-4">
                  14-day free trial, cancel anytime
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;