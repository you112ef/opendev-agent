'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/lib/store'

export default function NotificationSystem() {
  const { notifications, removeNotification } = useAppStore()

  useEffect(() => {
    notifications.forEach((notif) => {
      const timer = setTimeout(() => {
        removeNotification(notif.id)
      }, 5000)

      return () => clearTimeout(timer)
    })
  }, [notifications, removeNotification])

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'glass-strong border-success-500/30 text-success-300 shadow-glow-sm'
      case 'error':
        return 'glass-strong border-error-500/30 text-error-300 shadow-glow-sm'
      case 'warning':
        return 'glass-strong border-warning-500/30 text-warning-300 shadow-glow-sm'
      default:
        return 'glass-strong border-primary-500/30 text-primary-300 shadow-glow-sm'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      case 'warning':
        return '⚠️'
      default:
        return '💡'
    }
  }

  const getTypeBgGradient = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-success-500/10'
      case 'error':
        return 'bg-error-500/10'
      case 'warning':
        return 'bg-warning-500/10'
      default:
        return 'bg-primary-500/10'
    }
  }

  return (
    <div className="fixed top-6 right-6 z-50 space-y-3 max-w-md">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`p-5 rounded-2xl border backdrop-blur-xl flex items-start gap-4 animate-slide-in hover-lift ${getTypeStyles(
            notif.type
          )} relative overflow-hidden`}
        >
          {/* Background gradient */}
          <div className={`absolute inset-0 ${getTypeBgGradient(notif.type)} opacity-50`} />
          
          {/* Icon */}
          <div className="relative z-10">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center glass border border-white/20">
              <span className="text-2xl">{getTypeIcon(notif.type)}</span>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 relative z-10">
            <p className="text-sm font-semibold mb-1">{notif.message}</p>
            <div className="flex items-center gap-2 text-xs opacity-70">
              <span>🕒</span>
              <span>{notif.timestamp.toLocaleTimeString('ar-SA')}</span>
            </div>
          </div>
          
          {/* Close button */}
          <button
            onClick={() => removeNotification(notif.id)}
            className="relative z-10 w-7 h-7 rounded-lg glass border border-white/10 flex items-center justify-center opacity-60 hover:opacity-100 hover:border-white/30 transition-all duration-200"
          >
            <span className="text-sm">✕</span>
          </button>
          
          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 overflow-hidden">
            <div className="h-full bg-white/30 animate-shrink" style={{animation: 'shrink 5s linear'}} />
          </div>
        </div>
      ))}
    </div>
  )
}
