import React from 'react';
import { Sparkles, Target, Users, Shield } from 'lucide-react';
import BackButton from '../components/BackButton';

function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <BackButton />
      
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-accent-purple to-accent-orange bg-clip-text text-transparent">
            About MessyNotes.ai
          </span>
        </h1>
        <p className="text-xl text-text-secondary max-w-3xl mx-auto">
          Founded in 2024, we're revolutionizing the way people transform their unorganized thoughts into polished, professional content using the power of artificial intelligence.
        </p>
      </div>

      {/* Mission Section */}
      <div className="bg-background-secondary rounded-2xl border border-accent-purple/20 p-8 mb-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">
            <span className="bg-gradient-to-r from-accent-purple to-accent-orange bg-clip-text text-transparent">
              Our Mission
            </span>
          </h2>
          <p className="text-lg text-text-secondary leading-relaxed">
            At MessyNotes.ai, we believe that everyone deserves to communicate their ideas clearly and professionally. Our mission is to empower individuals and businesses to transform their rough notes into polished content, saving time and enhancing productivity through innovative AI technology.
          </p>
        </div>
      </div>

      {/* Values Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-background-secondary rounded-xl border border-accent-purple/20 p-6">
          <Target className="h-12 w-12 text-accent-purple mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-text-primary">Innovation First</h3>
          <p className="text-text-secondary">
            We're constantly pushing the boundaries of AI technology to provide the best possible experience for our users.
          </p>
        </div>

        <div className="bg-background-secondary rounded-xl border border-accent-purple/20 p-6">
          <Users className="h-12 w-12 text-accent-orange mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-text-primary">User-Centric</h3>
          <p className="text-text-secondary">
            Every feature and improvement is designed with our users in mind, ensuring the best possible experience.
          </p>
        </div>

        <div className="bg-background-secondary rounded-xl border border-accent-purple/20 p-6">
          <Shield className="h-12 w-12 text-accent-blue mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-text-primary">Privacy & Security</h3>
          <p className="text-text-secondary">
            We maintain the highest standards of data protection and user privacy, with full GDPR compliance.
          </p>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-background-secondary rounded-2xl border border-accent-purple/20 p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">
            <span className="bg-gradient-to-r from-accent-purple to-accent-orange bg-clip-text text-transparent">
              Leadership
            </span>
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            The vision behind MessyNotes.ai
          </p>
        </div>

        <div className="flex justify-center">
          <div className="text-center">
            <img
              src="https://raw.githubusercontent.com/fredsterzzz/mn2-messynote/main/public/fredo.png"
              alt="Fred - Founder"
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover bg-background border-2 border-accent-purple"
            />
            <h3 className="text-lg font-semibold text-text-primary">Fred</h3>
            <p className="text-text-secondary">Founder</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;