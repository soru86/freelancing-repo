import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-black text-white py-8 sm:py-12 border-t border-gray-800 dark:border-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base">
                TTS
              </div>
              <span className="text-lg sm:text-xl font-bold">Text-to-Speech</span>
            </div>
            <p className="text-sm sm:text-base text-gray-400 dark:text-gray-500 mb-4">
              Transform your text into natural-sounding speech with our advanced AI technology. Perfect for content creators, businesses, and developers worldwide.
            </p>
            <div className="flex items-center gap-2 text-sm sm:text-base text-gray-400 dark:text-gray-500">
              <span>📧</span>
              <span className="break-all">support@ttsplatform.com</span>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#features" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition-colors">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link href="#voices" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition-colors">
                  Voice Samples
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#contact" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 dark:border-gray-900 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs sm:text-sm text-center md:text-left text-gray-400 dark:text-gray-500">
            © 2025 Text-to-Speech Platform. All rights reserved. Made with ❤️ for creators worldwide.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <span className="text-green-400 dark:text-green-500">●</span>
              <span className="text-xs sm:text-sm text-gray-400 dark:text-gray-500">All systems operational</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600 dark:text-gray-700 hidden sm:inline">•</span>
              <span className="text-xs sm:text-sm text-gray-400 dark:text-gray-500">Version 1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

