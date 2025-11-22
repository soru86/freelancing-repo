import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const authStorage = localStorage.getItem('auth-storage')
    if (authStorage) {
      const auth = JSON.parse(authStorage)
      if (auth.state?.accessToken) {
        config.headers.Authorization = `Bearer ${auth.state.accessToken}`
      }
    }
  }
  return config
})

export default api

