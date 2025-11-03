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
        return 'bg-green-900/20 border-green-800/30 text-green-400'
      case 'error':
        return 'bg-red-900/20 border-red-800/30 text-red-400'
      case 'warning':
        return 'bg-yellow-900/20 border-yellow-800/30 text-yellow-400'
      default:
        return 'bg-blue-900/20 border-blue-800/30 text-blue-400'
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`p-4 rounded-lg border backdrop-blur-md flex items-start gap-3 ${getTypeStyles(
            notif.type
          )}`}
        >
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
