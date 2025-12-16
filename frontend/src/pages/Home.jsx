import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Upload, FileText, HelpCircle, Layers, ArrowRight, Sparkles, Zap, Star, Rocket, Brain } from 'lucide-react'

export default function Home() {
  const heroRef = useRef(null)
  const featuresRef = useRef(null)

  useEffect(() => {
    // Add intersection observers for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '50px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up')
        }
      })
    }, observerOptions)

    if (heroRef.current) {
      observer.observe(heroRef.current)
    }
    if (featuresRef.current) {
      observer.observe(featuresRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const features = [
    {
      icon: Upload,
      title: 'Smart Upload',
      description: 'Drag & drop your study materials. We support PDFs, PowerPoint, and text files.',
      color: 'from-blue-500 to-cyan-500',
      delay: '100'
    },
    {
      icon: FileText,
      title: 'AI Summaries',
      description: 'Get concise, well-structured summaries highlighting key concepts and main ideas.',
      color: 'from-purple-500 to-pink-500',
      delay: '200'
    },
    {
      icon: HelpCircle,
      title: 'Practice MCQs',
      description: 'Test your knowledge with intelligent multiple-choice questions and detailed explanations.',
      color: 'from-green-500 to-emerald-500',
      delay: '300'
    },
    {
      icon: Layers,
      title: 'Flashcards',
      description: 'Master concepts with interactive flashcards using spaced repetition techniques.',
      color: 'from-orange-500 to-red-500',
      delay: '400'
    }
  ]

  const stats = [
    { number: '10x', label: 'Learning Speed', icon: Zap },
    { number: '95%', label: 'Retention Rate', icon: Brain },
    { number: '50%', label: 'Time Saved', icon: Star },
    { number: '∞', label: 'Possibilities', icon: Rocket }
  ]

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="floating-elements top-1/4 left-1/4 w-64 h-64 bg-blue-200/20 animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="floating-elements top-1/3 right-1/4 w-48 h-48 bg-purple-200/20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="floating-elements bottom-1/4 left-1/3 w-32 h-32 bg-pink-200/20 animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="floating-elements bottom-1/3 right-1/3 w-56 h-56 bg-cyan-200/20 animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          {/* Animated Badge */}
          <div className="inline-flex items-center space-x-2 glass px-6 py-3 rounded-full border border-white/20 animate-bounce-gentle">
            <Sparkles className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-semibold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              AI-Powered Learning Revolution
            </span>
          </div>

          {/* Main Heading */}
          <div className="space-y-6">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight">
              <span className="block text-gray-900">Study Smarter</span>
              <span className="block gradient-text animate-gradient">With DevLearn</span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
              Transform your study materials into interactive{' '}
              <span className="font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                summaries, practice questions, and flashcards
              </span>{' '}
              using cutting-edge artificial intelligence.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link
              to="/upload"
              className="group btn-premium text-lg px-12 py-4 rounded-2xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-500"
            >
              <span className="flex items-center space-x-3">
                <Rocket className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span>Start Learning Free</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            <Link
              to="/summaries"
              className="group glass px-8 py-4 rounded-2xl font-semibold text-gray-700 hover:text-gray-900 border border-white/30 hover:border-white/50 transition-all duration-300 hover:scale-105"
            >
              <span className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                <span>See Examples</span>
              </span>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-16 max-w-4xl mx-auto">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={index}
                  className="premium-card p-6 text-center group hover:scale-105 transition-all duration-500 stagger-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black gradient-text mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three simple steps to transform your study experience from ordinary to extraordinary
            </p>
          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              {
                step: '01',
                title: 'Upload',
                description: 'Upload your PDFs, PowerPoint files, or text documents',
                icon: Upload,
                color: 'from-blue-500 to-cyan-500'
              },
              {
                step: '02',
                title: 'Process',
                description: 'Our AI analyzes and extracts key concepts from your materials',
                icon: Brain,
                color: 'from-purple-500 to-pink-500'
              },
              {
                step: '03',
                title: 'Learn',
                description: 'Access summaries, practice questions, and interactive flashcards',
                icon: Rocket,
                color: 'from-green-500 to-emerald-500'
              }
            ].map((step, index) => (
              <div
                key={index}
                className="premium-card p-8 text-center group hover:scale-105 transition-all duration-500"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className={`bg-gradient-to-r ${step.color} w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-2xl font-black text-white">{step.step}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="premium-card p-6 group cursor-pointer hover:scale-105 transition-all duration-500 neon-glow-hover"
                  style={{ animationDelay: `${feature.delay}ms` }}
                >
                  <div className={`bg-gradient-to-r ${feature.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 group-hover:bg-clip-text transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="premium-card p-12 relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>

            <div className="relative z-10">
              <h2 className="text-4xl sm:text-5xl font-black gradient-text mb-6">
                Ready to Transform Your Study Habits?
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands of students who are already studying smarter and achieving more with DevLearn.
              </p>
              <Link
                to="/upload"
                className="btn-premium text-lg px-12 py-4 rounded-2xl font-bold inline-flex items-center space-x-3 hover:scale-105 transition-transform duration-300"
              >
                <Zap className="h-5 w-5" />
                <span>Get Started Now</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
