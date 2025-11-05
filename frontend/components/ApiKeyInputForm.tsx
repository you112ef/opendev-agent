'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { validateApiKey } from '@/lib/api'
import { saveUserApiKey } from '@/lib/supabaseClient'

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
        // Save to Supabase
        await saveUserApiKey(apiKey)
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
    <div className="w-full max-w-md mx-auto p-6 bg-neutral-900 rounded-xl border border-neutral-800">
      <h2 className="text-lg font-medium text-neutral-200 mb-4">API Key</h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative">
          <input
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-or-v1-..."
            disabled={isLoading}
            className="w-full px-4 py-3 bg-black text-white placeholder-neutral-600 border border-neutral-700 rounded-lg focus:outline-none focus:border-neutral-600 transition-colors disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {showKey ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              )}
            </svg>
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-900/20 border border-red-800/30 text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-white text-black font-medium rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'جاري التحقق...' : 'التحقق من المفتاح'}
        </button>
      </form>

      <p className="mt-4 text-xs text-neutral-500 text-center">
        مفتاحك محمي وآمن • لن يتم حفظه
      </p>
    </div>
  )
}
