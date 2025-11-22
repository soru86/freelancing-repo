import Link from 'next/link'
import { Play, Check, ArrowRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import VoiceCard from '@/components/VoiceCard'
import PricingCard from '@/components/PricingCard'

const voices = [
  { id: 'adam', name: 'Adam', language: 'English (American)', flag: '🇺🇸', gender: 'male', featured: true },
  { id: 'alice', name: 'Alice', language: 'English (American)', flag: '🇺🇸', gender: 'female', featured: true },
  { id: 'aaditya', name: 'Aaditya', language: 'Hindi (Indian)', flag: '🇮🇳', gender: 'male', featured: true },
  { id: 'ahmed', name: 'Ahmed', language: 'Hindi (Indian)', flag: '🇮🇳', gender: 'male', featured: true },
  { id: 'anika', name: 'Anika', language: 'Hindi (Indian)', flag: '🇮🇳', gender: 'female', featured: true },
  { id: 'anjali', name: 'Anjali', language: 'Hindi (Indian)', flag: '🇮🇳', gender: 'female', featured: true },
  { id: 'ayesha', name: 'Ayesha', language: 'Hindi (Indian)', flag: '🇮🇳', gender: 'female', featured: true },
  { id: 'cherry', name: 'Cherry', language: 'Hindi (Indian)', flag: '🇮🇳', gender: 'female', featured: true },
]

const pricingPlans = [
  {
    id: 1,
    name: 'Free',
    price: 0,
    credits: 250,
    quality: 'Standard',
    validity: 30,
    features: ['250 credits', 'Basic voices', 'Standard quality', '30 days validity'],
  },
  {
    id: 2,
    name: 'Spark Plan',
    price: 100,
    credits: 26000,
    quality: 'High',
    validity: 30,
    features: ['26,000 credits', 'All voices', 'High quality', '30 days validity'],
  },
  {
    id: 3,
    name: 'Ignite Plan',
    price: 499,
    credits: 150000,
    quality: 'Premium',
    validity: 30,
    features: ['150,000 credits', 'All voices', 'Premium quality', '30 days validity'],
  },
  {
    id: 4,
    name: 'Blaze Plan',
    price: 999,
    credits: 400000,
    quality: 'Ultra',
    validity: 30,
    features: ['400,000 credits', 'All voices', 'Ultra quality', '30 days validity'],
    popular: true,
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-4">
                🇮🇳 India&apos;s First Text to Speech AI
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                The most realistic AI Text To Speech online for School Lessons
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8">
                15000+ People can not be wrong. Put AI to work in your marketing
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="flex -space-x-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-gray-800" />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-sm sm:text-base">★</span>
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">5.0 From 15000+ Reviews</p>
                </div>
              </div>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-sm sm:text-base"
              >
                Get Started Right Now!
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </div>
            <div className="relative mt-8 lg:mt-0">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 sm:p-6">
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2">Say Goodbye to Robotic Voiceovers!</p>
                <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <Play className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">EMOTION-BASED AI VOICE GENERATOR</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Voices Section */}
      <section id="voices" className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 px-4">
              Life is too amazing to live it with a Single VOICE...
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 px-4">
              Choose from our diverse collection of AI voices, each with unique personalities and characteristics perfect for your content
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {voices.map((voice) => (
              <VoiceCard key={voice.id} voice={voice} />
            ))}
          </div>
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">Want to explore more voices and languages?</p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300"
            >
              Try All Voices Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 lg:py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Powerful Features</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300">
              Everything you need to create professional-quality voice content
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: '🎯', title: 'Multiple Voices', desc: 'Choose from a variety of natural-sounding voices in different languages and accents.' },
              { icon: '⚡', title: 'Lightning Fast', desc: 'Generate high-quality audio in seconds with our optimized AI processing.' },
              { icon: '🎛️', title: 'Advanced Controls', desc: 'Fine-tune stability, similarity, style, and speed for perfect results.' },
              { icon: '💾', title: 'Multiple Formats', desc: 'Download your audio in various formats with optional subtitle generation.' },
              { icon: '🔒', title: 'Secure & Private', desc: 'Your data is protected with enterprise-grade security and privacy measures.' },
              { icon: '📱', title: 'Mobile Friendly', desc: 'Access from any device with our responsive web application.' },
            ].map((feature, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Simple, Transparent Pricing</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300">
              Choose the plan that fits your needs. All plans include 30 days validity.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {pricingPlans.map((plan) => (
              <PricingCard key={plan.id} plan={plan} />
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-gray-600 dark:text-gray-400 mb-2">Need more? Looking for enterprise solutions?</p>
            <Link href="#contact" className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300">
              Contact us for bulk enterprise pricing →
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">How It Works Simple & Fast</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8">
              Get started in just a few simple steps
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
              <span className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">Paste.</span>
              <span className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">Convert.</span>
              <span className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">Play.</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { step: '1', title: 'PASTE YOUR TEXT', desc: 'Just paste the text you want to be transformed into audio in the app.' },
              { step: '2', title: 'CHOOSE AN AI TEXT-TO-SPEECH VOICE', desc: 'We offer over 140 AI voices in Indian languages for you to choose from. You can preview each voice to hear and find the one that best fits your BRAND.' },
              { step: '3', title: 'DOWNLOAD & USE YOUR VOICE-OVER', desc: 'Once your AI voice-over is generated, you can download it in high-quality audio format and use it for your projects, videos, podcasts, or any content creation.' },
            ].map((item, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">Step {item.step}</div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-blue-600 dark:bg-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              Start Creating Voice-overs Now!
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Ready to Transform Your Text into Voice?</h2>
          <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 opacity-90">
            Join thousands of creators who trust our platform for their audio content needs. Experience the future of AI voice generation today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base"
            >
              Start Free Trial
            </Link>
            <Link
              href="#pricing"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors text-sm sm:text-base"
            >
              View Pricing
            </Link>
          </div>
          <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <div>
              <div className="text-3xl font-bold">10K+</div>
              <div className="text-lg opacity-90">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold">50+</div>
              <div className="text-lg opacity-90">Languages</div>
            </div>
            <div>
              <div className="text-3xl font-bold">99.9%</div>
              <div className="text-lg opacity-90">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

