import React from 'react'
import { Brain, Github, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="glass-effect border-t border-white/20 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Brand */}
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="bg-primary-500 p-2 rounded-lg">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">DevLearn</h3>
              <p className="text-sm text-gray-600">AI-Powered Study Assistant</p>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center space-x-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <Github className="h-4 w-4" />
              <span className="text-sm">GitHub</span>
            </a>
            <a
              href="mailto:support@devlearn.com"
              className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <Mail className="h-4 w-4" />
              <span className="text-sm">Contact</span>
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 mt-6 pt-6 text-center">
          <p className="text-sm text-gray-600">
            © 2024 DevLearn. Making studying smarter with AI.
          </p>
        </div>
      </div>
    </footer>
  )
}
