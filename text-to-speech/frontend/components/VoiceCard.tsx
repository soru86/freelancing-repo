'use client'

import { Play } from 'lucide-react'

interface Voice {
  id: string
  name: string
  language: string
  flag: string
  gender: string
  featured?: boolean
}

export default function VoiceCard({ voice }: { voice: Voice }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/50 p-4 sm:p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-purple-500 dark:from-blue-500 dark:to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0">
            {voice.name[0].toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-base sm:text-lg capitalize text-gray-900 dark:text-white truncate">{voice.name}</h3>
            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <span>{voice.flag}</span>
              <span className="truncate">{voice.language}</span>
            </div>
          </div>
        </div>
        {voice.featured && (
          <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs font-semibold px-2 py-1 rounded flex-shrink-0 ml-2">
            Featured
          </span>
        )}
      </div>
      <button className="w-full flex items-center justify-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 py-2 sm:py-2.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors text-sm sm:text-base">
        <Play className="w-4 h-4" />
        <span>Play Voice</span>
      </button>
    </div>
  )
}

