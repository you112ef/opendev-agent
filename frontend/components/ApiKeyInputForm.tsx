'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { validateApiKey } from '@/lib/api'

interface ApiKeyInputFormProps {
  onSuccess?: () => void
}

export default function ApiKeyInputForm({ onSuccess }: ApiKeyInputFormProps) {
  const [apiKey, setApiKey] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showKey, setShowKey] = useState(false)
  const { setApiKey: storeApiKey, addNotification } = useAppStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (!apiKey.trim()) {
        setError('يرجى إدخال مفتاح API')
        return
      }

      const isValid = await validateApiKey(apiKey)
      if (isValid) {
        storeApiKey(apiKey)
        addNotification('success', 'تم التحقق من مفتاح API بنجاح')
        setApiKey('')
        onSuccess?.()
      } else {
        setError('مفتاح API غير صحيح أو منتهي الصلاحية')
        addNotification('error', 'فشل التحقق من مفتاح API')
      }
    } catch (err) {
      setError('حدث خطأ أثناء التحقق من المفتاح')
      addNotification('error', 'خطأ في الاتصال بالخادم')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-gradient-to-br from-secondary to-primary rounded-xl shadow-2xl border border-accent/20">
      <h2 className="text-2xl font-bold text-highlight mb-6">OpenRouter API Key</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-or-v1-..."
            disabled={isLoading}
            className="w-full px-4 py-3 bg-primary/50 text-white placeholder-gray-500 border border-accent/50 rounded-lg focus:outline-none focus:border-highlight focus:ring-2 focus:ring-highlight/50 transition"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-3 text-gray-400 hover:text-highlight transition"
          >
            {showKey ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-error/20 border border-error/50 text-error rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-gradient-to-r from-highlight to-error text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-highlight/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'جاري التحقق...' : 'التحقق من المفتاح'}
        </button>
      </form>

      <p className="mt-4 text-xs text-gray-400 text-center">
        مفتاحك محمي وآمن. لن يتم حفظه على الخادم.
      </p>
    </div>
  )
}
