import React from 'react';
import { FileText, Shield, AlertCircle, HelpCircle } from 'lucide-react';

function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
        <p className="text-xl text-gray-600">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      <div className="prose prose-lg max-w-none">
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex items-center mb-6">
            <FileText className="h-8 w-8 text-indigo-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Agreement to Terms</h2>
          </div>
          <p className="text-gray-600">
            By accessing or using Messynotes.ai, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex items-center mb-6">
            <Shield className="h-8 w-8 text-indigo-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Use License</h2>
          </div>
          <div className="space-y-4">
            <p className="text-gray-600">
              Permission is granted to temporarily download one copy of the materials (information or software) on Messynotes.ai for personal, non-commercial transitory viewing only.
            </p>
            <p className="text-gray-600">This license shall automatically terminate if you violate any of these restrictions and may be terminated by Messynotes.ai at any time.</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex items-center mb-6">
            <AlertCircle className="h-8 w-8 text-indigo-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Disclaimer</h2>
          </div>
          <div className="space-y-4">
            <p className="text-gray-600">
              The materials on Messynotes.ai are provided on an 'as is' basis. Messynotes.ai makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex items-center mb-6">
            <HelpCircle className="h-8 w-8 text-indigo-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
          </div>
          <p className="text-gray-600">
            If you have any questions about these Terms of Service, please contact us at:
          </p>
          <ul className="list-disc pl-6 mt-4 text-gray-600">
            <li>Email: legal@messynotes.ai</li>
            <li>Phone: +1 (555) 123-4567</li>
            <li>Address: 123 Innovation Street, San Francisco, CA 94103</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Terms;