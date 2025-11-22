'use client'

import Link from 'next/link'
import { Check } from 'lucide-react'

interface Plan {
  id: number
  name: string
  price: number
  credits: number
  quality: string
  validity: number
  features: string[]
  popular?: boolean
}

export default function PricingCard({ plan }: { plan: Plan }) {
  return (
    <div className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/50 p-4 sm:p-6 ${plan.popular ? 'border-2 border-blue-600 dark:border-blue-500' : ''}`}>
      {plan.popular && (
        <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 dark:bg-blue-500 text-white px-3 sm:px-4 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold">
          Popular
        </div>
      )}
      <h3 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900 dark:text-white">{plan.name}</h3>
      <div className="mb-3 sm:mb-4">
        <span className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">₹{plan.price}</span>
      </div>
      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
        {plan.name === 'Free' ? 'Perfect for trying out' : 
         plan.name === 'Spark Plan' ? 'Great for individuals' :
         plan.name === 'Ignite Plan' ? 'Perfect for businesses' : 'For power users'}
      </p>
      <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2">
            <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
      <Link
        href="/signup"
        className={`block w-full text-center py-2.5 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base ${
          plan.popular
            ? 'bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
        }`}
      >
        {plan.name === 'Free' ? 'Get Started' : 'Choose Plan'}
      </Link>
    </div>
  )
}

