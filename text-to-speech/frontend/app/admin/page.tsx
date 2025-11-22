'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'
import Navbar from '@/components/Navbar'
import toast from 'react-hot-toast'
import { BarChart3, Users, DollarSign, Settings } from 'lucide-react'

export default function AdminPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [stats, setStats] = useState<any>(null)
  const [pricingPlans, setPricingPlans] = useState<any[]>([])
  const [settings, setSettings] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    if (!user || user.email !== 'admin@test.com') {
      router.push('/dashboard')
      return
    }

    loadStats()
    loadPricingPlans()
    loadSettings()
  }, [user, router])

  const loadStats = async () => {
    try {
      const response = await api.get('/api/admin/stats')
      setStats(response.data)
    } catch (error) {
      toast.error('Failed to load stats')
    }
  }

  const loadPricingPlans = async () => {
    try {
      const response = await api.get('/api/admin/pricing-plans')
      setPricingPlans(response.data.plans)
    } catch (error) {
      toast.error('Failed to load pricing plans')
    }
  }

  const loadSettings = async () => {
    try {
      const response = await api.get('/api/admin/settings')
      setSettings(response.data.settings)
    } catch (error) {
      toast.error('Failed to load settings')
    }
  }

  const updatePricingPlan = async (id: number, data: any) => {
    try {
      await api.put(`/api/admin/pricing-plans/${id}`, data)
      toast.success('Pricing plan updated')
      loadPricingPlans()
    } catch (error) {
      toast.error('Failed to update pricing plan')
    }
  }

  const updateSetting = async (key: string, value: string) => {
    try {
      await api.put(`/api/admin/settings/${key}`, { value })
      toast.success('Setting updated')
      loadSettings()
    } catch (error) {
      toast.error('Failed to update setting')
    }
  }

  if (!user || user.email !== 'admin@test.com') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">Admin Dashboard</h1>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 sm:gap-4 mb-4 sm:mb-6 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`pb-2 px-2 sm:px-4 font-semibold text-sm sm:text-base whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'border-b-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`pb-2 px-2 sm:px-4 font-semibold text-sm sm:text-base whitespace-nowrap ${
              activeTab === 'pricing'
                ? 'border-b-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Pricing Plans
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-2 px-2 sm:px-4 font-semibold text-sm sm:text-base whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-b-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Settings
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && stats && (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/50 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/50 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Conversions</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalConversions}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/50 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Credits Used</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalCreditsUsed.toLocaleString()}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/50 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Settings className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Plans</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.activePlans}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/50 p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Conversions Over Time (Last 30 Days)</h2>
              <div className="h-64 flex items-end gap-2">
                {stats.conversionsByDate.map((item: any, i: number) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-blue-600 dark:bg-blue-500 rounded-t"
                      style={{ height: `${(item.count / Math.max(...stats.conversionsByDate.map((c: any) => c.count))) * 100}%` }}
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-400 mt-2">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Pricing Plans Tab */}
        {activeTab === 'pricing' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/50 p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Pricing Plans</h2>
            <div className="space-y-4">
              {pricingPlans.map((plan) => (
                <div key={plan.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="grid md:grid-cols-5 gap-4 items-center">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{plan.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">₹{plan.price}</p>
                    </div>
                    <div>
                      <input
                        type="number"
                        value={plan.credits}
                        onChange={(e) =>
                          updatePricingPlan(plan.id, { credits: parseInt(e.target.value) })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Credits</p>
                    </div>
                    <div>
                      <input
                        type="number"
                        value={plan.price}
                        onChange={(e) =>
                          updatePricingPlan(plan.id, { price: parseFloat(e.target.value) })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Price</p>
                    </div>
                    <div>
                      <select
                        value={plan.quality}
                        onChange={(e) =>
                          updatePricingPlan(plan.id, { quality: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="standard">Standard</option>
                        <option value="high">High</option>
                        <option value="premium">Premium</option>
                        <option value="ultra">Ultra</option>
                      </select>
                    </div>
                    <div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={plan.is_active}
                          onChange={(e) =>
                            updatePricingPlan(plan.id, { is_active: e.target.checked })
                          }
                          className="w-4 h-4 text-blue-600 dark:text-blue-500"
                        />
                        <span className="text-sm text-gray-900 dark:text-white">Active</span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/50 p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Settings</h2>
            <div className="space-y-4">
              {settings.map((setting) => (
                <div key={setting.key} className="flex items-center gap-4">
                  <label className="w-48 font-medium text-gray-900 dark:text-white">{setting.key}</label>
                  <input
                    type="text"
                    value={setting.value}
                    onChange={(e) => updateSetting(setting.key, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

