import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Wand2, Sparkles, Brain, Zap, FileText, Star, 
  ChevronRight, ArrowRight, MessageSquare, Users
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [demoText, setDemoText] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  const testimonials = [
    {
      text: "Saved hours on my work reports—best tool ever!",
      author: "Mark",
      role: "Professional",
      avatar: "/avatars/mark.jpg",
      rating: 5
    },
    {
      text: "Turned my messy lecture notes into an A+ essay!",
      author: "Sarah",
      role: "Student",
      avatar: "/avatars/sarah.jpg",
      rating: 5
    },
    {
      text: "Game-changer for my team's documentation!",
      author: "Alex",
      role: "Tech Lead",
      avatar: "/avatars/alex.jpg",
      rating: 5
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prev) => 
        prev === testimonials.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Brain,
      title: "Genius AI",
      description: "Our AI understands and perfects your notes with incredible accuracy",
      animation: "animate-pulse"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get polished content in seconds, not hours!",
      animation: "animate-bounce-gentle"
    },
    {
      icon: FileText,
      title: "Dynamic Blueprints",
      description: "Tailored templates based on your industry and needs",
      animation: "animate-float"
    },
    {
      icon: MessageSquare,
      title: "Custom Tones",
      description: "Choose your perfect voice—Professional, Creative, or more!",
      animation: "animate-wave"
    }
  ];

  const handleStartTransformation = () => {
    navigate('/new-project');
  };

  const handleDemoPreview = () => {
    if (!demoText) return;
    setShowPreview(true);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement email capture
    setIsEmailModalOpen(false);
  };

  return (
    <div className="min-h-screen cosmic-gradient text-text-primary">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 cosmic-video-bg opacity-10" />
        <div className="container mx-auto px-4 pt-20 pb-32 relative">
          <h1 className="text-center mb-6 text-5xl md:text-7xl font-bold">
            <span className="font-handwriting text-text-secondary animate-scribble">
              Turn Your Chaos
            </span>
            {" "}into{" "}
            <span className="bg-gradient-text animate-glow">
              Brilliance
            </span>
            {" "}with MessyNotes.ai!
          </h1>
          
          <p className="text-center text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-text-secondary">
            Wave goodbye to disorganized notes—our AI turns your ideas into stunning, 
            professional content instantly, empowering you to excel in school, work, or life!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button 
              onClick={handleStartTransformation}
              className="epic-button bg-gradient-cta group animate-pulse-gentle"
            >
              <Wand2 className="h-5 w-5 group-hover:rotate-12 transition-transform" />
              <span>Start Your Transformation Now!</span>
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button 
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              className="epic-button-secondary group"
            >
              <Star className="h-5 w-5" />
              <span>View Pricing</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Demo Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            See the Magic Live!
          </h2>
          <p className="text-text-secondary text-lg">
            Paste a sample note to preview your transformation
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="epic-card p-8">
            <textarea
              value={demoText}
              onChange={(e) => setDemoText(e.target.value)}
              placeholder="e.g., Meeting notes, ideas, or any messy text..."
              className="epic-input min-h-[150px] font-handwriting mb-4"
            />
            
            <button
              onClick={handleDemoPreview}
              disabled={!demoText}
              className="epic-button w-full bg-gradient-secondary group"
            >
              <Sparkles className="h-5 w-5" />
              <span>Preview Transformation</span>
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>

            {showPreview && (
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-8">
                  <div className="flex-1 p-4 bg-background/50 rounded-lg border border-accent-purple/20">
                    <h4 className="font-bold mb-2">Original Notes</h4>
                    <p className="font-handwriting">{demoText}</p>
                  </div>
                  <Wand2 className="h-8 w-8 text-accent-purple animate-pulse" />
                  <div className="flex-1 p-4 bg-background/50 rounded-lg border border-accent-purple/20">
                    <h4 className="font-bold mb-2">Transformed Content</h4>
                    <p className="font-body">
                      {/* Simulated transformation */}
                      {demoText.split('\n').map((line, i) => (
                        <span key={i} className="block mb-2">
                          {line.charAt(0).toUpperCase() + line.slice(1)}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Powerful Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="epic-card p-6 hover:scale-105 transition-transform cursor-pointer group"
            >
              {React.createElement(feature.icon, {
                className: `h-12 w-12 mb-4 text-accent-purple ${feature.animation}`
              })}
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-text-secondary">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Choose Your Plan
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="epic-card p-8">
            <h3 className="text-2xl font-bold mb-4">Free Plan</h3>
            <p className="text-text-secondary mb-6">Perfect for getting started</p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-2">
                <Star className="h-5 w-5 text-accent-purple" />
                <span>3 transformations/month</span>
              </li>
              <li className="flex items-center gap-2">
                <Star className="h-5 w-5 text-accent-purple" />
                <span>Basic templates</span>
              </li>
              <li className="flex items-center gap-2">
                <Star className="h-5 w-5 text-accent-purple" />
                <span>Standard support</span>
              </li>
            </ul>
            <button
              onClick={handleStartTransformation}
              className="epic-button w-full bg-gradient-secondary group"
            >
              <span>Get Started Free</span>
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Premium Plan */}
          <div className="epic-card p-8 border-accent-purple relative">
            <div className="absolute -top-4 right-4 bg-accent-purple text-white px-4 py-1 rounded-full text-sm">
              Best Value
            </div>
            <h3 className="text-2xl font-bold mb-4">Premium Plan</h3>
            <p className="text-text-secondary mb-2">Everything you need</p>
            <p className="text-3xl font-bold mb-6">£9.99<span className="text-lg">/mo</span></p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-2">
                <Star className="h-5 w-5 text-accent-purple" />
                <span>Unlimited transformations</span>
              </li>
              <li className="flex items-center gap-2">
                <Star className="h-5 w-5 text-accent-purple" />
                <span>All templates & advanced tones</span>
              </li>
              <li className="flex items-center gap-2">
                <Star className="h-5 w-5 text-accent-purple" />
                <span>Priority email support</span>
              </li>
              <li className="flex items-center gap-2">
                <Star className="h-5 w-5 text-accent-purple" />
                <span>Team collaboration</span>
              </li>
              <li className="flex items-center gap-2">
                <Star className="h-5 w-5 text-accent-purple" />
                <span>Advanced analytics</span>
              </li>
            </ul>
            <button
              onClick={handleStartTransformation}
              className="epic-button w-full bg-gradient-cta group"
            >
              <span>Start 14-Day Free Trial</span>
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-center text-sm text-text-secondary mt-4">
              No credit card needed—cancel anytime
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-lg text-text-secondary">
            Join 10,000+ happy users transforming their notes daily!
          </p>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          What Users Are Saying
        </h2>

        <div className="max-w-3xl mx-auto">
          <div className="epic-card p-8">
            <div className="text-center">
              <p className="text-xl mb-6">
                "{testimonials[currentTestimonialIndex].text}"
              </p>
              <div className="flex items-center justify-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i}
                    className="h-5 w-5 text-yellow-500 fill-current"
                  />
                ))}
              </div>
              <div className="flex items-center justify-center gap-4">
                <img
                  src={testimonials[currentTestimonialIndex].avatar}
                  alt={testimonials[currentTestimonialIndex].author}
                  className="w-12 h-12 rounded-full"
                  onError={(e) => {
                    e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + 
                      testimonials[currentTestimonialIndex].author;
                  }}
                />
                <div>
                  <p className="font-bold">
                    {testimonials[currentTestimonialIndex].author}
                  </p>
                  <p className="text-text-secondary">
                    {testimonials[currentTestimonialIndex].role}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Capture Modal */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="epic-card p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">
              Get 3 Free Transformations Now!
            </h3>
            <form onSubmit={handleEmailSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="epic-input mb-4"
              />
              <button type="submit" className="epic-button w-full bg-gradient-cta">
                <span>Claim Your Free Trial!</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            </form>
            <p className="text-center text-sm text-text-secondary mt-4">
              Join our community for productivity tips and updates!
            </p>
            <button
              onClick={() => setIsEmailModalOpen(false)}
              className="absolute top-4 right-4 text-text-secondary hover:text-text-primary"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;