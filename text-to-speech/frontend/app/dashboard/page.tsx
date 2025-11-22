'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'
import Navbar from '@/components/Navbar'
import toast from 'react-hot-toast'
import { Play, Download, History } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const { user, accessToken } = useAuthStore()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [voices, setVoices] = useState<any[]>([])
  const [selectedVoice, setSelectedVoice] = useState('')
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversions, setConversions] = useState<any[]>([])

  useEffect(() => {
    if (!user || !accessToken) {
      router.push('/login')
      return
    }

    loadUserProfile()
    loadVoices()
    loadConversions()
  }, [user, accessToken, router])

  const loadUserProfile = async () => {
    try {
      const response = await api.get(`/api/users/${user?.id}`)
      setUserProfile(response.data)
    } catch (error) {
      toast.error('Failed to load user profile')
    }
  }

  const loadVoices = async () => {
    try {
      const response = await api.get('/api/tts/voices')
      setVoices(response.data.voices)
      if (response.data.voices.length > 0) {
        setSelectedVoice(response.data.voices[0].id)
      }
    } catch (error) {
      toast.error('Failed to load voices')
    }
  }

  const loadConversions = async () => {
    try {
      const response = await api.get('/api/tts/conversions')
      setConversions(response.data.conversions || [])
    } catch (error) {
      console.error('Failed to load conversions')
    }
  }

  const handleConvert = async () => {
    if (!text.trim()) {
      toast.error('Please enter some text')
      return
    }

    if (!selectedVoice) {
      toast.error('Please select a voice')
      return
    }

    setLoading(true)

    try {
      const response = await api.post('/api/tts/convert', {
        text,
        voiceId: selectedVoice,
      })

      toast.success('Audio generated successfully!')
      setText('')
      loadUserProfile()
      loadConversions()
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to generate audio')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Welcome back, {user.name}!
          </p>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/50 p-6">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Credits</h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {userProfile?.credits || 0}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/50 p-6">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Plan</h3>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {userProfile?.plan_name || 'Free'}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/50 p-6">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Total Conversions</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{conversions.length}</p>
          </div>
        </div>

        {/* TTS Converter */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/50 p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">Text to Speech Converter</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Voice
              </label>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {voices.map((voice) => (
                  <option key={voice.id} value={voice.id}>
                    {voice.name} - {voice.language}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enter Text ({text.length} / 5000 characters)
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={5000}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Type or paste your text here..."
              />
            </div>

            <button
              onClick={handleConvert}
              disabled={loading || !text.trim()}
              className="w-full bg-blue-600 dark:bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                'Generating...'
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Convert to Speech
                </>
              )}
            </button>
          </div>
        </div>

        {/* Conversion History */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/50 p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
            <History className="w-5 h-5 sm:w-6 sm:h-6" />
            Conversion History
          </h2>
          
          {conversions.length === 0 ? (
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 text-center py-6 sm:py-8">No conversions yet</p>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {conversions.map((conversion) => (
                <div
                  key={conversion.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Voice: {conversion.voice_id} • Credits: {conversion.credits_used}
                      </p>
                      <p className="text-sm sm:text-base text-gray-900 dark:text-gray-100 break-words">{conversion.text.substring(0, 100)}...</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        {new Date(conversion.created_at).toLocaleString()}
                      </p>
                    </div>
                    {conversion.audio_url && (
                      <button className="w-full sm:w-auto bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base">
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

