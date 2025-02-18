import React from 'react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-accent-purple to-accent-orange bg-clip-text text-transparent">
            Privacy Policy
          </span>
        </h1>
        <p className="text-xl text-text-secondary">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      <div className="prose prose-invert max-w-none">
        <div className="bg-background-secondary rounded-xl border border-accent-purple/20 p-8 mb-8">
          <div className="flex items-center mb-6">
            <Shield className="h-8 w-8 text-accent-purple mr-3" />
            <h2 className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-accent-purple to-accent-orange bg-clip-text text-transparent">
                Introduction
              </span>
            </h2>
          </div>
          <p className="text-text-secondary mb-4">
            At Messynotes.ai, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
          </p>
          <p className="text-text-secondary">
            Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
          </p>
        </div>

        <div className="bg-background-secondary rounded-xl border border-accent-purple/20 p-8 mb-8">
          <div className="flex items-center mb-6">
            <Lock className="h-8 w-8 text-accent-orange mr-3" />
            <h2 className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-accent-purple to-accent-orange bg-clip-text text-transparent">
                Information We Collect
              </span>
            </h2>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-text-primary">Personal Information</h3>
            <p className="text-text-secondary">
              We may collect personal information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc pl-6 text-text-secondary">
              <li>Register for an account</li>
              <li>Sign up for our newsletter</li>
              <li>Request customer support</li>
              <li>Use our note transformation services</li>
            </ul>
          </div>
        </div>

        <div className="bg-background-secondary rounded-xl border border-accent-purple/20 p-8 mb-8">
          <div className="flex items-center mb-6">
            <Eye className="h-8 w-8 text-accent-blue mr-3" />
            <h2 className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-accent-purple to-accent-orange bg-clip-text text-transparent">
                How We Use Your Information
              </span>
            </h2>
          </div>
          <p className="text-text-secondary mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 text-text-secondary">
            <li>Provide and maintain our services</li>
            <li>Improve our services and user experience</li>
            <li>Communicate with you about updates and promotions</li>
            <li>Protect against unauthorized access and abuse</li>
          </ul>
        </div>

        <div className="bg-background-secondary rounded-xl border border-accent-purple/20 p-8">
          <div className="flex items-center mb-6">
            <FileText className="h-8 w-8 text-accent-purple mr-3" />
            <h2 className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-accent-purple to-accent-orange bg-clip-text text-transparent">
                Your Rights
              </span>
            </h2>
          </div>
          <p className="text-text-secondary mb-4">
            You have the right to:
          </p>
          <ul className="list-disc pl-6 text-text-secondary">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Opt-out of marketing communications</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Privacy;