import React from 'react';
import { User } from 'lucide-react';

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">
        <span className="bg-gradient-to-r from-accent-purple to-accent-orange bg-clip-text text-transparent">
          About MessyNotes
        </span>
      </h1>

      <div className="space-y-8">
        <div className="bg-background-secondary rounded-xl border border-accent-purple/20 p-8">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-text-secondary">
            At MessyNotes, we're revolutionizing the way people interact with their notes. Our AI-powered platform transforms messy, unstructured notes into clear, organized, and actionable information. We believe that everyone deserves a smart, intuitive tool that adapts to their unique way of thinking and working.
          </p>
        </div>

        <div className="bg-background-secondary rounded-xl border border-accent-purple/20 p-8">
          <h2 className="text-2xl font-semibold mb-6">Leadership</h2>
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-accent-purple to-accent-orange flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Fred Calvert</h3>
              <p className="text-text-secondary">Founder</p>
              <p className="text-text-secondary mt-2">
                A passionate developer and entrepreneur with a vision to make note-taking smarter and more efficient for everyone.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-background-secondary rounded-xl border border-accent-purple/20 p-8">
          <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-text-secondary">
                We continuously push the boundaries of what's possible with AI and note-taking technology.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">User-Centric</h3>
              <p className="text-text-secondary">
                Everything we build is designed with our users' needs and experiences in mind.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Privacy</h3>
              <p className="text-text-secondary">
                We prioritize the security and privacy of our users' data above all else.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}