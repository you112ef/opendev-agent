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
        return 'bg-success/20 border-success/50 text-success'
      case 'error':
        return 'bg-error/20 border-error/50 text-error'
      case 'warning':
        return 'bg-warning/20 border-warning/50 text-warning'
      default:
        return 'bg-highlight/20 border-highlight/50 text-highlight'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✓'
      case 'error':
        return '✕'
      case 'warning':
        return '⚠'
      default:
        return 'ℹ'
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-md">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`p-4 rounded-lg border backdrop-blur-md flex items-start gap-3 animate-slide-in ${getTypeStyles(
            notif.type
          )}`}
        >
          <span className="text-xl flex-shrink-0">{getTypeIcon(notif.type)}</span>
          <div className="flex-1">
            <p className="text-sm font-medium">{notif.message}</p>
            <p className="text-xs opacity-60 mt-1">
              {notif.timestamp.toLocaleTimeString('ar-SA')}
            </p>
          </div>
          <button
            onClick={() => removeNotification(notif.id)}
            className="text-xs opacity-60 hover:opacity-100 transition"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
