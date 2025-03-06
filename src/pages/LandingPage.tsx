import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Wand2, 
  Brain, 
  Zap,
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
    animation: "animate-pulse"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Polished content in seconds—faster than you can say 'organized'!",
    animation: "animate-bounce-gentle"
  },
  {
    icon: FileText,
    title: "Multiple Formats",
    description: "From essays to presentations—your notes, your way.",
    animation: "animate-scale"
  },
  {
    icon: MessageSquare,
    title: "Custom Tones",
    description: "Professional, Creative, or Casual—express your unique voice!",
    animation: "animate-pulse"
  }
];

function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleTransformClick = () => {
    if (user?.credits === 0) {
      navigate('/pricing');
    } else {
      navigate('/dashboard');
    }
  };

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
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-slide-up">
            <span className="font-handwriting text-accent-orange">Turn Chaos</span>
            {" into "}
            <span className="bg-gradient-to-r from-accent-purple to-accent-orange bg-clip-text text-transparent">
              Brilliance
            </span>
            {" with "}
            <span className="font-display">MessyNotes.ai!</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-text-secondary mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Say goodbye to disorganized notes—our AI transforms your ideas into polished, 
            professional content in seconds, so you can shine in school, work, or life!
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <button
              onClick={handleTransformClick}
              className="epic-button group"
            >
              <Sparkles className="h-5 w-5" />
              <span>{user?.credits === 0 ? "Start Free Trial" : "Transform Your Notes Now!"}</span>
              <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
            <Link to="/pricing" className="text-accent-purple hover:text-accent-orange underline transition-colors">
              View Pricing
            </Link>
          </div>

          <div className="relative w-full max-w-3xl mx-auto rounded-xl overflow-hidden shadow-glow-lg animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="aspect-video bg-background-secondary border border-accent-purple/20 rounded-xl p-8">
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <p className="text-text-secondary mb-4">Paste a sample note here to see the magic!</p>
                  <textarea 
                    className="w-full max-w-lg bg-background border border-accent-purple/20 rounded-lg p-4 
                             text-text-primary placeholder-text-secondary/50 resize-none
                             focus:outline-none focus:border-accent-purple focus:shadow-glow-sm"
                    placeholder="e.g., Meeting notes, ideas, or any messy text..."
                    rows={3}
                  />
                  <button className="epic-button mt-4">
                    <Sparkles className="h-5 w-5" />
                    <span>Preview Transformation</span>
                  </button>
                </div>
              </div>
            </div>
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
              key={feature.title}
              className="epic-card group"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className={`p-4 rounded-full bg-gradient-card inline-block mb-4 ${feature.animation}`}>
                <feature.icon className="h-8 w-8 text-accent-purple" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-text-secondary">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Choose Your Plan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="epic-card">
              <h3 className="text-2xl font-bold mb-4">Get Started for Free</h3>
              <p className="text-text-secondary mb-6">Perfect for trying out MessyNotes.ai</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent-purple" />
                  <span>3 transformations/month</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent-purple" />
                  <span>Basic templates</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent-purple" />
                  <span>Standard support</span>
                </li>
              </ul>
              <Link to="/signup" className="epic-button w-full justify-center">
                Start Free
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="epic-card relative border-accent-purple/40 shadow-glow-md">
              <div className="absolute -top-3 right-4 bg-accent-orange text-white text-sm px-3 py-1 rounded-full">
                Best Value
              </div>
              <h3 className="text-2xl font-bold mb-4">Premium</h3>
              <p className="text-text-secondary mb-6">For power users who want it all</p>
              <div className="text-3xl font-bold mb-6">
                £9.99
                <span className="text-text-secondary text-base font-normal">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent-purple" />
                  <span>Unlimited transformations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent-purple" />
                  <span>All templates & tones</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent-purple" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent-purple" />
                  <span>Custom templates</span>
                </li>
              </ul>
              <Link to="/signup" className="epic-button w-full justify-center bg-gradient-cta">
                Start Your Free 14-Day Trial Now!
              </Link>
              <p className="text-center text-text-secondary text-sm mt-4">
                No credit card needed—cancel anytime
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          What Users Are Saying
        </h2>
        <div className="max-w-3xl mx-auto">
          <div className="epic-card">
            <div className="flex items-start gap-4">
              <div className="text-4xl">{testimonials[currentTestimonial].avatar}</div>
              <div>
                <p className="text-lg mb-4">{testimonials[currentTestimonial].text}</p>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {Array.from({ length: testimonials[currentTestimonial].rating }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-accent-orange fill-current" />
                    ))}
                  </div>
                  <p className="font-medium">
                    {testimonials[currentTestimonial].author}
                  </p>
                  <span className="text-text-secondary">
                    • {testimonials[currentTestimonial].role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Capture Modal */}
      {showLeadCapture && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="epic-card max-w-lg w-full mx-4">
            <h3 className="text-2xl font-bold mb-4">Get 3 Free Transformations Today!</h3>
            <p className="text-text-secondary mb-6">
              Join our community and get productivity tips!
            </p>
            <form onSubmit={handleEmailSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="epic-input mb-4"
              />
              <button type="submit" className="epic-button w-full justify-center">
                <Sparkles className="h-5 w-5" />
                <span>Claim Now!</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;