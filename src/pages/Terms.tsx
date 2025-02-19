import React from 'react';

export default function Terms() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">
        <span className="bg-gradient-to-r from-accent-purple to-accent-orange bg-clip-text text-transparent">
          Terms of Service
        </span>
      </h1>

      <div className="bg-background-secondary rounded-xl border border-accent-purple/20 p-8 max-h-[600px] overflow-y-auto">
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4">1. Agreement to Terms</h2>
            <p className="text-text-secondary">
              By accessing or using Messynotes.ai, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">2. Use License</h2>
            <p className="text-text-secondary">
              Permission is granted to temporarily download one copy of the materials (information or software) on Messynotes.ai for personal, non-commercial transitory viewing only.
            </p>
            <p className="text-text-secondary">This license shall automatically terminate if you violate any of these restrictions and may be terminated by Messynotes.ai at any time.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">3. Disclaimer</h2>
            <p className="text-text-secondary">
              The materials on Messynotes.ai are provided on an 'as is' basis. Messynotes.ai makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">4. Contact Us</h2>
            <p className="text-text-secondary">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <ul className="list-disc pl-6 mt-4 text-text-secondary">
              <li>Email: legal@messynotes.ai</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}