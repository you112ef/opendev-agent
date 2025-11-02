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
    <div className="w-full max-w-md mx-auto p-8 glass-strong rounded-2xl shadow-glow border border-white/10 animate-fade-scale hover-lift">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
          <span className="text-2xl">🔑</span>
        </div>
        <div>
          <h2 className="text-xl font-bold gradient-text">OpenRouter API Key</h2>
          <p className="text-xs text-gray-500">مفتاحك للذكاء الاصطناعي</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative group">
          <input
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-or-v1-..."
            disabled={isLoading}
            className="w-full px-5 py-4 glass text-white placeholder-gray-500 border border-white/10 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 transition-all duration-200 disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-400 transition-colors duration-200 text-xl"
          >
            {showKey ? '👁️' : '👁️‍🗨️'}
          </button>
          <div className="absolute inset-0 rounded-xl bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none" />
        </div>

        {error && (
          <div className="p-4 glass border border-error-500/30 text-error-400 rounded-xl text-sm flex items-start gap-3 animate-slide-in">
            <span className="text-lg">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-gradient-primary text-white font-semibold rounded-xl hover:shadow-glow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                جاري التحقق...
              </>
            ) : (
              <>
                <span>✨</span>
                التحقق من المفتاح
              </>
            )}
          </span>
          <div className="absolute inset-0 bg-gradient-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      </form>

      <div className="mt-6 flex items-center justify-center gap-2 text-xs">
        <div className="flex items-center gap-1">
          <span className="text-success-500">🔒</span>
          <span className="text-gray-400">مشفر SSL</span>
        </div>
        <span className="text-gray-600">•</span>
        <div className="flex items-center gap-1">
          <span className="text-success-500">🚫</span>
          <span className="text-gray-400">لا يتم الحفظ</span>
        </div>
        <span className="text-gray-600">•</span>
        <div className="flex items-center gap-1">
          <span className="text-success-500">✓</span>
          <span className="text-gray-400">آمن 100%</span>
        </div>
      </div>
    </div>
  )
}
