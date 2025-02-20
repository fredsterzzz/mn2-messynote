import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import NewProject from './pages/NewProject';
import MyProjects from './pages/MyProjects';
import Project from './pages/Project';
import Settings from './pages/Settings';
import About from './pages/About';
import Pricing from './pages/Pricing';
import Privacy from './pages/Privacy';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Auth from './pages/Auth';
import AuthCallback from './pages/AuthCallback';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import OnboardingSetup from './pages/OnboardingSetup';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />

          {/* Protected routes that require auth but not onboarding */}
          <Route 
            path="/onboarding" 
            element={
              <ProtectedRoute requireAuth={true} requireOnboarding={false}>
                <OnboardingSetup />
              </ProtectedRoute>
            } 
          />

          {/* Protected routes that require both auth and completed onboarding */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute requireAuth={true} requireOnboarding={true}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/new-project" 
            element={
              <ProtectedRoute requireAuth={true} requireOnboarding={true}>
                <NewProject />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-projects" 
            element={
              <ProtectedRoute requireAuth={true} requireOnboarding={true}>
                <MyProjects />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/projects/:projectId" 
            element={
              <ProtectedRoute requireAuth={true} requireOnboarding={true}>
                <Project />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute requireAuth={true} requireOnboarding={true}>
                <Settings />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      <Footer />
      <CookieConsent />
    </div>
  );
}

export default App;