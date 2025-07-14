import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Menu, 
  X, 
  Play, 
  Users, 
  Award, 
  Monitor, 
  Clock, 
  MessageSquare, 
  BarChart3,
  Shield,
  Smartphone,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Header Component
  const Header = () => (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold text-gray-900">Learnify</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-purple-600 transition-colors">Features</a>
            <a href="#about" className="text-gray-700 hover:text-purple-600 transition-colors">About</a>
            <a href="#contact" className="text-gray-700 hover:text-purple-600 transition-colors">Contact</a>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => navigate('/login')}
              className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#features" className="block px-3 py-2 text-gray-700 hover:text-purple-600 transition-colors">Features</a>
              <a href="#about" className="block px-3 py-2 text-gray-700 hover:text-purple-600 transition-colors">About</a>
              <a href="#contact" className="block px-3 py-2 text-gray-700 hover:text-purple-600 transition-colors">Contact</a>
              <div className="pt-4 pb-3 border-t border-gray-200">
                <button
                  onClick={() => navigate('/login')}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-purple-600 transition-colors font-medium"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="block w-full text-left px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium mt-2"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );

  // Hero Component
  const Hero = () => (
    <section className="bg-gradient-to-br from-purple-50 to-indigo-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Transform Your
                <span className="text-purple-600"> Learning</span>
                <br />
                Journey Today
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl">
                Join thousands of learners worldwide on Learnify. Access premium courses, 
                interactive lessons, and achieve your goals with our comprehensive learning platform.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">50K+</div>
                <div className="text-sm text-gray-600">Active Students</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <BookOpen className="h-8 w-8 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600">Expert Courses</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Award className="h-8 w-8 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">98%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <img
                src="https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Students learning online"
                className="w-full h-80 object-cover rounded-lg"
              />
            </div>
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-yellow-400 rounded-full p-4 shadow-lg animate-bounce">
              <Award className="h-8 w-8 text-white" />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-green-500 rounded-full p-4 shadow-lg animate-pulse">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // Features Component
  const Features = () => {
    const features = [
      {
        icon: Monitor,
        title: 'Interactive Learning',
        description: 'Engage with interactive content, quizzes, and hands-on projects designed to enhance your learning experience.'
      },
      {
        icon: Users,
        title: 'Expert Instructors',
        description: 'Learn from industry professionals and certified educators with years of real-world experience.'
      },
      {
        icon: Clock,
        title: 'Flexible Schedule',
        description: 'Study at your own pace with 24/7 access to courses that fit your busy lifestyle.'
      },
      {
        icon: Award,
        title: 'Certificates',
        description: 'Earn recognized certificates upon completion to boost your career prospects.'
      },
      {
        icon: MessageSquare,
        title: 'Community Support',
        description: 'Connect with fellow learners, join discussions, and get support from our vibrant community.'
      },
      {
        icon: BarChart3,
        title: 'Progress Tracking',
        description: 'Monitor your learning journey with detailed analytics and progress reports.'
      },
      {
        icon: Shield,
        title: 'Secure Learning',
        description: 'Your data and progress are protected with enterprise-grade security measures.'
      },
      {
        icon: Smartphone,
        title: 'Mobile Friendly',
        description: 'Access your courses anywhere, anytime with our responsive mobile platform.'
      }
    ];

    return (
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Learnify?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the features that make Learnify the perfect platform for your learning journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group p-6 rounded-xl bg-gray-50 hover:bg-purple-50 transition-all duration-300 hover:shadow-lg hover:-translate-y-2"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg group-hover:bg-purple-600 transition-colors duration-300 mb-4">
                  <feature.icon className="h-6 w-6 text-purple-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Footer Component
  const Footer = () => (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-purple-400" />
              <span className="text-2xl font-bold">Learnify</span>
            </div>
            <p className="text-gray-400">
              Empowering learners worldwide with quality education and innovative learning experiences.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-6 w-6 text-gray-400 hover:text-purple-400 cursor-pointer transition-colors" />
              <Twitter className="h-6 w-6 text-gray-400 hover:text-purple-400 cursor-pointer transition-colors" />
              <Instagram className="h-6 w-6 text-gray-400 hover:text-purple-400 cursor-pointer transition-colors" />
              <Linkedin className="h-6 w-6 text-gray-400 hover:text-purple-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Instructors</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Web Development</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Data Science</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Digital Marketing</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Design</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Business</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div id="contact">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-purple-400" />
                <span className="text-gray-400">support@learnify.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-purple-400" />
                <span className="text-gray-400">+91 XXXXXXXXXX</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-purple-400" />
                <span className="text-gray-400">Dwarka</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Learnify. All rights reserved. | 
            <a href="#" className="hover:text-white transition-colors ml-1">Privacy Policy</a> | 
            <a href="#" className="hover:text-white transition-colors ml-1">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
}