import React from 'react';
import { Link } from 'react-router-dom';
import { useDarkMode } from '../contexts/DarkModeContext';
import { Button } from '../components/ui/button';
import { 
  ChartBar, 
  Target, 
  TrendingDown, 
  Zap, 
  Shield, 
  ArrowRight,
  CheckCircle,
  DollarSign,
  Cpu,
  BarChart3,
  Moon,
  Sun
} from 'lucide-react';

const LandingPage = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const features = [
    {
      icon: TrendingDown,
      title: "Cost Optimization",
      description: "Reduce AI model costs by up to 70% through intelligent model selection and workload analysis."
    },
    {
      icon: ChartBar,
      title: "Real-time Analytics",
      description: "Get detailed insights into your AI spending patterns with comprehensive dashboards and reports."
    },
    {
      icon: Target,
      title: "Performance Monitoring",
      description: "Track latency, throughput, and quality metrics to ensure optimal AI model performance."
    },
    {
      icon: Shield,
      title: "Risk Management",
      description: "Identify potential cost overruns and performance bottlenecks before they impact your business."
    },
    {
      icon: Zap,
      title: "Smart Recommendations",
      description: "AI-powered suggestions for model selection, scaling strategies, and cost optimization."
    },
    {
      icon: Cpu,
      title: "Multi-Provider Support",
      description: "Compare costs and performance across OpenAI, Anthropic, Google, AWS, and other AI providers."
    }
  ];

  const testimonials = [
    {
      quote: "CostWise helped us reduce our AI infrastructure costs by 60% while maintaining the same performance levels.",
      author: "Sarah Chen",
      role: "CTO, TechStartup Inc.",
      company: "TechStartup Inc."
    },
    {
      quote: "The analytics dashboard gives us unprecedented visibility into our AI spending patterns.",
      author: "Marcus Rodriguez",
      role: "Head of Engineering",
      company: "DataFlow Systems"
    },
    {
      quote: "We saved over $50,000 in the first quarter alone. The ROI calculator was spot-on.",
      author: "Emily Watson",
      role: "VP of Operations",
      company: "AI Solutions Corp"
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      description: "Perfect for small teams getting started with AI cost optimization",
      features: [
        "Up to 5 AI projects",
        "Basic cost analytics",
        "Monthly reports",
        "Email support",
        "Single provider integration"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "$99",
      period: "/month",
      description: "Advanced features for growing teams and organizations",
      features: [
        "Unlimited AI projects",
        "Advanced analytics & forecasting",
        "Real-time monitoring",
        "Priority support",
        "Multi-provider integration",
        "Custom alerts & notifications",
        "API access"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "Tailored solutions for large-scale AI operations",
      features: [
        "Everything in Professional",
        "Custom integrations",
        "Dedicated account manager",
        "On-premise deployment",
        "Advanced security features",
        "Custom reporting",
        "SLA guarantees"
      ],
      popular: false
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-black text-white' : 'bg-cloud-white text-charcoal-black'}`}>
      {/* Header */}
      <header className={`${isDarkMode ? 'bg-black/95 border-gray-800' : 'bg-white/95 border-sky-gray'} backdrop-blur-sm border-b sticky top-0 z-50 transition-colors duration-300`}>
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-muted-indigo rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <h1 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>
                CostWise AI Optimizer
              </h1>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-slate-gray hover:text-soft-navy'} transition-colors duration-200`}>
                Features
              </a>
              <a href="#pricing" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-slate-gray hover:text-soft-navy'} transition-colors duration-200`}>
                Pricing
              </a>
              <a href="#testimonials" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-slate-gray hover:text-soft-navy'} transition-colors duration-200`}>
                Testimonials
              </a>
              
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 transition-colors duration-200 rounded-lg ${
                  isDarkMode 
                    ? 'text-yellow-400 hover:text-yellow-300 hover:bg-gray-900' 
                    : 'text-slate-gray hover:text-charcoal-black hover:bg-fog-gray'
                }`}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-slate-gray hover:text-soft-navy'} transition-colors duration-200`}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-muted-indigo hover:bg-muted-indigo/90 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>
            Optimize Your{' '}
            <span className="bg-gradient-to-r from-muted-indigo to-mist-teal bg-clip-text text-transparent">
              AI Costs
            </span>{' '}
            Intelligently
          </h1>
          <p className={`text-xl mb-8 leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-slate-gray'}`}>
            Reduce AI infrastructure costs by up to 70% while maintaining performance. 
            Get real-time insights, smart recommendations, and automated optimization 
            for your AI workloads across all major providers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              to="/signup"
              className="bg-muted-indigo hover:bg-muted-indigo/90 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <span>Start Free Trial</span>
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/login"
              className={`border-2 px-8 py-4 rounded-lg font-semibold transition-all duration-200 ${
                isDarkMode 
                  ? 'border-gray-600 text-white hover:bg-gray-900' 
                  : 'border-muted-indigo text-muted-indigo hover:bg-muted-indigo/5'
              }`}
            >
              View Demo
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>70%</div>
              <div className={`${isDarkMode ? 'text-gray-300' : 'text-slate-gray'}`}>Average Cost Reduction</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>500+</div>
              <div className={`${isDarkMode ? 'text-gray-300' : 'text-slate-gray'}`}>Companies Trust Us</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>$2M+</div>
              <div className={`${isDarkMode ? 'text-gray-300' : 'text-slate-gray'}`}>Saved This Quarter</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`py-20 ${isDarkMode ? 'bg-gray-950' : 'bg-fog-gray/30'}`}>
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>
              Powerful Features for AI Cost Management
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-slate-gray'}`}>
              Everything you need to monitor, analyze, and optimize your AI infrastructure costs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`p-8 rounded-2xl transition-all duration-200 hover:shadow-xl ${
                  isDarkMode 
                    ? 'bg-black border border-gray-800 hover:border-gray-600' 
                    : 'bg-white hover:shadow-mist border border-sky-gray'
                }`}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-muted-indigo to-mist-teal rounded-lg flex items-center justify-center mb-6">
                  <feature.icon size={24} className="text-white" />
                </div>
                <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>
                  {feature.title}
                </h3>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-slate-gray'} leading-relaxed`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>
              Trusted by Leading Companies
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-slate-gray'}`}>
              See how organizations are saving costs and improving efficiency with CostWise
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`p-8 rounded-2xl ${
                  isDarkMode 
                    ? 'bg-gray-950 border border-gray-800' 
                    : 'bg-white shadow-mist border border-sky-gray'
                }`}
              >
                <blockquote className={`text-lg mb-6 italic ${isDarkMode ? 'text-gray-300' : 'text-slate-gray'}`}>
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-muted-indigo to-mist-teal rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>
                      {testimonial.author}
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-gray'}`}>
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className={`py-20 ${isDarkMode ? 'bg-gray-950' : 'bg-fog-gray/30'}`}>
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>
              Choose Your Plan
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-slate-gray'}`}>
              Start free, scale as you grow. All plans include core optimization features.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative p-8 rounded-2xl transition-all duration-200 ${
                  plan.popular 
                    ? `ring-2 ring-muted-indigo ${isDarkMode ? 'bg-black' : 'bg-white shadow-xl'}` 
                    : `${isDarkMode ? 'bg-black border border-gray-800' : 'bg-white shadow-mist border border-sky-gray'}`
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-muted-indigo text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>
                    {plan.name}
                  </h3>
                  <div className={`${isDarkMode ? 'text-gray-300' : 'text-slate-gray'} mb-4`}>
                    {plan.description}
                  </div>
                  <div className="flex items-baseline justify-center">
                    <span className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className={`ml-1 ${isDarkMode ? 'text-gray-400' : 'text-slate-gray'}`}>
                        {plan.period}
                      </span>
                    )}
                  </div>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle size={16} className="text-muted-indigo flex-shrink-0" />
                      <span className={`${isDarkMode ? 'text-gray-300' : 'text-slate-gray'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-muted-indigo hover:bg-muted-indigo/90 text-white' 
                      : `${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-fog-gray hover:bg-sky-gray text-soft-navy'}`
                  }`}
                >
                  {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
          <h2 className={`text-4xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>
            Ready to Optimize Your AI Costs?
          </h2>
          <p className={`text-xl mb-8 ${isDarkMode ? 'text-gray-300' : 'text-slate-gray'}`}>
            Join hundreds of companies already saving millions on AI infrastructure costs.
            Start your free trial today and see the difference in just minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="bg-muted-indigo hover:bg-muted-indigo/90 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <span>Start Free Trial</span>
              <ArrowRight size={20} />
            </Link>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-gray'}`}>
              No credit card required • 14-day free trial
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t py-12 ${isDarkMode ? 'border-gray-800 bg-gray-950' : 'border-sky-gray bg-fog-gray/30'}`}>
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-muted-indigo rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>
                CostWise AI Optimizer
              </span>
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-gray'}`}>
              © 2024 CostWise AI Optimizer. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 