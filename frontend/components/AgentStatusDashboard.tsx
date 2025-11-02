'use client'

import { useEffect, useState } from 'react'
import { useAppStore, type Task } from '@/lib/store'
import { getTaskStatus } from '@/lib/api'

interface AgentStatusDashboardProps {
  task: Task
}

export default function AgentStatusDashboard({ task }: AgentStatusDashboardProps) {
  const [taskData, setTaskData] = useState(task)
  const [isPolling, setIsPolling] = useState(task.status === 'running')
  const { updateTask } = useAppStore()

  useEffect(() => {
    if (!isPolling) return

    const interval = setInterval(async () => {
      try {
        const updated = await getTaskStatus(task.id)
        setTaskData(updated)
        updateTask(task.id, updated)

        if (updated.status !== 'running') {
          setIsPolling(false)
        }
      } catch (error) {
        console.error('Failed to poll task status:', error)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [isPolling, task.id, updateTask])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-success-400'
      case 'error':
        return 'text-error-400'
      case 'running':
        return 'text-primary-400 animate-pulse'
      default:
        return 'text-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✅'
      case 'error':
        return '❌'
      case 'running':
        return '⚡'
      case 'idle':
        return '💤'
      default:
        return '○'
    }
  }

  return (
    <div className="w-full p-8 glass-strong rounded-2xl shadow-glow border border-white/10 animate-fade-scale">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow animate-pulse-glow">
            <span className="text-2xl">🤖</span>
          </div>
          <div>
            <h3 className="text-xl font-bold gradient-text">حالة المهمة</h3>
            <p className="text-gray-500 text-xs font-mono">#{task.id.substring(0, 8)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-5 glass rounded-xl border border-white/10 hover-lift group">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">💻</span>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">اللغة</p>
          </div>
          <p className="text-primary-300 font-bold text-lg">{taskData.language}</p>
          <div className="absolute inset-0 rounded-xl bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
        </div>
        <div className="p-5 glass rounded-xl border border-white/10 hover-lift group">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🛠️</span>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">الإطار</p>
          </div>
          <p className="text-secondary-300 font-bold text-lg">{taskData.framework}</p>
          <div className="absolute inset-0 rounded-xl bg-gradient-secondary opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
        </div>
        <div className="p-5 glass rounded-xl border border-white/10 hover-lift group">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">⚙️</span>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">الحالة</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-2xl ${getStatusIcon(taskData.status)}`}>{getStatusIcon(taskData.status)}</span>
            <p className={`font-bold text-lg ${getStatusColor(taskData.status)}`}>
              {taskData.status === 'running' && 'جاري'}
              {taskData.status === 'completed' && 'مكتملة'}
              {taskData.status === 'error' && 'خطأ'}
              {taskData.status === 'pending' && 'معلقة'}
            </p>
          </div>
          <div className="absolute inset-0 rounded-xl bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🤖</span>
          <h4 className="text-lg font-bold gradient-text">الوكلاء النشطون</h4>
        </div>
        {taskData.agents?.map((agent, idx) => (
          <div key={idx} className="p-5 glass rounded-xl border border-white/10 hover-lift group animate-slide-in" style={{animationDelay: `${idx * 0.1}s`}}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  agent.status === 'completed' ? 'bg-success-500/20 border border-success-500/30' :
                  agent.status === 'running' ? 'bg-primary-500/20 border border-primary-500/30 animate-pulse' :
                  agent.status === 'error' ? 'bg-error-500/20 border border-error-500/30' :
                  'glass border-white/10'
                }`}>
                  <span className={`text-xl ${getStatusColor(agent.status)}`}>
                    {getStatusIcon(agent.status)}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-white text-lg">{agent.name}</span>
                  <p className="text-xs text-gray-500">
                    {agent.status === 'completed' && '✅ اكتمل'}
                    {agent.status === 'running' && '⏳ يعمل الآن'}
                    {agent.status === 'error' && '❌ فشل'}
                    {agent.status === 'idle' && '💤 في الانتظار'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-2xl font-bold ${getStatusColor(agent.status)}`}>{agent.progress}%</span>
              </div>
            </div>
            <div className="relative w-full h-3 glass rounded-full overflow-hidden border border-white/10">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  agent.status === 'completed' ? 'bg-gradient-to-r from-success-500 to-success-600' :
                  agent.status === 'running' ? 'bg-gradient-primary animate-gradient' :
                  agent.status === 'error' ? 'bg-gradient-to-r from-error-500 to-error-600' :
                  'bg-gray-700'
                }`}
                style={{ width: `${agent.progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-shimmer" />
              </div>
            </div>
            <div className="absolute inset-0 rounded-xl bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
          </div>
        ))}
      </div>

      <div className="mt-8 p-5 glass rounded-xl border border-white/10">
        <div className="flex items-center gap-3">
          <span className="text-xl">🕒</span>
          <div>
            <p className="text-xs text-gray-500 mb-1">تم الإنشاء</p>
            <p className="text-sm font-medium text-primary-300">
              {new Date(taskData.createdAt).toLocaleString('ar-SA', {
                dateStyle: 'medium',
                timeStyle: 'short'
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
