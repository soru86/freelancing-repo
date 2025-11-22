'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'
import toast from 'react-hot-toast'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setAuth } = useAuthStore()

  useEffect(() => {
    const token = searchParams.get('token')
    const refresh = searchParams.get('refresh')

    if (token && refresh) {
      // Verify token and get user info
      api
        .get('/api/auth/verify', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const user = response.data.user
          setAuth(user, token, refresh)
          toast.success('Login successful!')
          router.push('/dashboard')
        })
        .catch(() => {
          toast.error('Authentication failed')
          router.push('/login')
        })
    } else {
      router.push('/login')
    }
  }, [searchParams, router, setAuth])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Completing authentication...</p>
      </div>
    </div>
  )
}

