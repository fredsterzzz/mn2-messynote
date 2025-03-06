import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Zap, 
  Brain, 
  FileText, 
  Star, 
  ChevronRight,
  MessageSquare,
  CheckCircle
} from 'lucide-react';

const testimonials = [
  {
    text: "MessyNotes.ai turned my chaotic lecture notes into an A+ essay in seconds!",
    author: "Sarah",
    role: "Student",
    avatar: "👩‍🎓",
    rating: 5
  },
  {
    text: "I saved hours on my work reports—best tool ever!",
    author: "Mark",
    role: "Professional",
    avatar: "👨‍💼",
    rating: 5
  },
  {
    text: "From scattered thoughts to polished presentations in minutes!",
    author: "Emma",
    role: "Content Creator",
    avatar: "👩‍💻",
    rating: 5
  }
];

const features = [
  {
    icon: Brain,
    title: "AI-Powered Magic",
    description: "Smart AI that understands your notes and crafts perfect content.",
    animation: "animate-pulse-gentle"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Polished content in seconds—faster than you can say 'organized'!",
    animation: "animate-float"
  },
  {
    icon: FileText,
    title: "Multiple Formats",
    description: "From essays to presentations—your notes, your way.",
    animation: "animate-scale-in"
  },
  {
    icon: MessageSquare,
    title: "Custom Tones",
    description: "Professional, Creative, or Casual—express your unique voice!",
    animation: "animate-pulse-gentle"
  }
];

export default function Landing() {
  const [email, setEmail] = useState('');
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle email submission
    setShowLeadCapture(false);
  };

  return (
    <div className="min-h-screen bg-gradient-cosmic text-text-primary">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            <span className="font-handwriting text-accent-orange">Turn Chaos</span>
            {" into "}
            <span className="text-gradient">
              Brilliance
            </span>
            {" with "}
            <span className="font-montserrat">MessyNotes.ai!</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-text-secondary mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Say goodbye to disorganized notes—our AI transforms your ideas into polished, 
            professional content in seconds, so you can shine in school, work, or life!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Link 
              to="/new-project" 
              className="epic-button-primary group"
            >
              Start Your Journey Now!
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              <span className="block text-sm opacity-80">Free demo—no sign-up required!</span>
            </Link>
            <a 
              href="#pricing" 
              className="epic-button-secondary"
            >
              View Pricing
            </a>
          </div>

          {/* Interactive Demo */}
          <div className="mt-12 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="epic-card">
              <textarea 
                className="epic-textarea mb-4"
                placeholder="e.g., Meeting notes, ideas, or messy text…"
                rows={4}
              />
              <button className="epic-button-primary w-full">
                <Sparkles className="w-5 h-5" />
                Preview Transformation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="section-spacing bg-gradient-cosmic">
        <div className="cosmic-container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 animate-fade-in">
            <span className="text-gradient">Powerful Features</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className={`epic-card ${feature.animation}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <feature.icon className="w-10 h-10 text-accent-purple mb-4" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-text-secondary">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="section-spacing">
        <div className="cosmic-container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="text-gradient">Choose Your Plan</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="epic-card relative">
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">Get Started Free</h3>
                <p className="text-text-secondary">Perfect for trying out MessyNotes.ai</p>
              </div>
              <div className="mb-8">
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-text-secondary ml-2">/month</span>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-accent-purple" />
                    <span>3 transformations/month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-accent-purple" />
                    <span>Basic templates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-accent-purple" />
                    <span>Standard support</span>
                  </li>
                </ul>
              </div>
              <Link to="/new-project" className="epic-button-secondary w-full justify-center">
                Start Free
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="epic-card relative">
              <div className="absolute -top-4 right-4">
                <span className="px-3 py-1 bg-accent-orange text-white text-sm font-medium rounded-full">
                  Best Value
                </span>
              </div>
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">Premium</h3>
                <p className="text-text-secondary">For power users who need more</p>
              </div>
              <div className="mb-8">
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold">£9.99</span>
                  <span className="text-text-secondary ml-2">/month</span>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-accent-orange" />
                    <span>Unlimited transformations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-accent-orange" />
                    <span>All templates & custom options</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-accent-orange" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-accent-orange" />
                    <span>Custom templates</span>
                  </li>
                </ul>
              </div>
              <button 
                onClick={() => setShowLeadCapture(true)}
                className="epic-button-primary w-full justify-center"
              >
                Start Free 14-Day Trial
                <span className="block text-sm opacity-80">No credit card—cancel anytime</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-spacing">
        <div className="cosmic-container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="text-gradient">What Our Users Say</span>
          </h2>
          <div className="flex overflow-hidden relative">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="epic-card w-full flex-shrink-0 mx-4"
                >
                  <div className="flex items-start mb-4">
                    <span className="text-4xl mr-4">{testimonial.avatar}</span>
                    <div>
                      <div className="flex gap-1 mb-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-accent-orange fill-accent-orange" />
                        ))}
                      </div>
                      <p className="text-lg mb-4">{testimonial.text}</p>
                      <p className="text-text-secondary">
                        {testimonial.author} • <span>{testimonial.role}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 mt-4">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    index === currentTestimonial 
                      ? 'bg-accent-purple' 
                      : 'bg-accent-purple/20'
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Lead Capture Modal */}
      {showLeadCapture && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="epic-card max-w-md mx-4 animate-scale-in">
            <button 
              onClick={() => setShowLeadCapture(false)}
              className="absolute top-4 right-4 text-text-secondary hover:text-text-primary"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold mb-4">Claim 3 Free Transformations!</h3>
            <p className="text-text-secondary mb-6">
              Join thousands of users who are already turning chaos into brilliance!
            </p>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="epic-label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="epic-input"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <button type="submit" className="epic-button-primary w-full">
                Get Started!
              </button>
              <p className="text-sm text-text-secondary text-center">
                No credit card required. Unsubscribe anytime.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
