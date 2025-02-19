import React, { useEffect, useState } from 'react';
import { X, Shield } from 'lucide-react';

const EEA_COUNTRIES = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 
  'DE', 'GR', 'HU', 'IS', 'IE', 'IT', 'LV', 'LI', 'LT', 'LU', 
  'MT', 'NL', 'NO', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
  'GB' // Including UK for broader coverage
];

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isEEAUser, setIsEEAUser] = useState(false);

  useEffect(() => {
    const checkLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const isInEEA = EEA_COUNTRIES.includes(data.country_code);
        setIsEEAUser(isInEEA);
        
        // Only show banner for EEA users who haven't made a choice
        const consent = localStorage.getItem('cookie-consent');
        if (isInEEA && !consent) {
          setIsVisible(true);
        }
      } catch (error) {
        console.error('Error checking location:', error);
        // If location check fails, show banner by default for safety
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
          setIsVisible(true);
        }
      }
    };

    checkLocation();
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    window.gtag?.('consent', 'update', {
      'ad_storage': 'granted',
      'analytics_storage': 'granted'
    });
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    window.gtag?.('consent', 'update', {
      'ad_storage': 'denied',
      'analytics_storage': 'denied'
    });
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-background via-background-secondary to-background border-t border-accent-purple/20 p-4 shadow-lg z-50 animate-slide-up backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1 flex items-start gap-3">
            <Shield className="h-5 w-5 text-accent-purple flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold mb-1 bg-gradient-to-r from-accent-purple to-accent-orange bg-clip-text text-transparent">
                Your Privacy Matters
              </h3>
              <p className="text-sm text-text-secondary">
                We use cookies to enhance your experience and analyze our traffic. Your data is handled in accordance with our privacy policy.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReject}
              className="px-4 py-2 text-sm font-medium border border-accent-purple/20 rounded-md hover:bg-background-secondary transition-all duration-200 hover:border-accent-purple/40"
            >
              Reject All
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-accent-purple to-accent-orange text-white rounded-md hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Accept All
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-background-secondary rounded-full transition-all duration-200"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
