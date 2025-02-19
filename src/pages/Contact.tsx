import React, { useState } from 'react';
import { Mail, Send } from 'lucide-react';
import BackButton from '../components/BackButton';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <BackButton />
      
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-accent-purple to-accent-orange bg-clip-text text-transparent">
            Contact Us
          </span>
        </h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto">
          Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-16">
        {/* Contact Information */}
        <div className="space-y-8">
          <div className="bg-background-secondary rounded-xl border border-accent-purple/20 p-8">
            <h2 className="text-2xl font-bold mb-6">
              <span className="bg-gradient-to-r from-accent-purple to-accent-orange bg-clip-text text-transparent">
                Get in Touch
              </span>
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <Mail className="h-6 w-6 text-accent-purple mt-1 mr-4" />
                <div>
                  <h3 className="font-semibold text-text-primary">Email</h3>
                  <p className="text-text-secondary">contact@messynotes.ai</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-background-secondary rounded-xl border border-accent-purple/20 p-8">
            <h2 className="text-2xl font-bold mb-4">
              <span className="bg-gradient-to-r from-accent-purple to-accent-orange bg-clip-text text-transparent">
                Business Hours
              </span>
            </h2>
            <div className="space-y-2">
              <p className="flex justify-between">
                <span className="text-text-secondary">Monday - Friday:</span>
                <span className="text-text-primary">9:00 AM - 5:30 PM GMT</span>
              </p>
              <p className="flex justify-between">
                <span className="text-text-secondary">Saturday:</span>
                <span className="text-text-primary">10:00 AM - 2:00 PM GMT</span>
              </p>
              <p className="flex justify-between">
                <span className="text-text-secondary">Sunday:</span>
                <span className="text-text-primary">Closed</span>
              </p>
            </div>
          </div>

          <div className="bg-background-secondary rounded-xl border border-accent-purple/20 p-8">
            <h2 className="text-2xl font-bold mb-4">
              <span className="bg-gradient-to-r from-accent-purple to-accent-orange bg-clip-text text-transparent">
                Company Information
              </span>
            </h2>
            <div className="space-y-2 text-text-secondary">
              <p>MessyNotes</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-background-secondary rounded-xl border border-accent-purple/20 p-8">
          <h2 className="text-2xl font-bold mb-6">
            <span className="bg-gradient-to-r from-accent-purple to-accent-orange bg-clip-text text-transparent">
              Send us a Message
            </span>
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-lg bg-background border-accent-purple/20 text-text-primary placeholder-text-secondary focus:border-accent-purple focus:ring focus:ring-accent-purple/20"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg bg-background border-accent-purple/20 text-text-primary placeholder-text-secondary focus:border-accent-purple focus:ring focus:ring-accent-purple/20"
                required
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-text-secondary mb-1">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full rounded-lg bg-background border-accent-purple/20 text-text-primary placeholder-text-secondary focus:border-accent-purple focus:ring focus:ring-accent-purple/20"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-text-secondary mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className="w-full rounded-lg bg-background border-accent-purple/20 text-text-primary placeholder-text-secondary focus:border-accent-purple focus:ring focus:ring-accent-purple/20"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center px-8 py-4 bg-gradient-cta text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              <Send className="h-5 w-5 mr-2" />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;