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
        return 'text-success'
      case 'error':
        return 'text-error'
      case 'running':
        return 'text-highlight animate-pulse'
      default:
        return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✓'
      case 'error':
        return '✕'
      case 'running':
        return '⟳'
      default:
        return '○'
    }
  }

  return (
    <div className="w-full p-6 bg-gradient-to-br from-secondary to-primary rounded-xl shadow-2xl border border-accent/20">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-highlight mb-2">حالة المهمة</h3>
        <p className="text-gray-400 text-sm">ID: {task.id}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-primary/50 rounded-lg border border-accent/30">
          <p className="text-gray-400 text-sm mb-1">اللغة</p>
          <p className="text-highlight font-semibold">{taskData.language}</p>
        </div>
        <div className="p-4 bg-primary/50 rounded-lg border border-accent/30">
          <p className="text-gray-400 text-sm mb-1">الإطار</p>
          <p className="text-highlight font-semibold">{taskData.framework}</p>
        </div>
        <div className="p-4 bg-primary/50 rounded-lg border border-accent/30">
          <p className="text-gray-400 text-sm mb-1">الحالة</p>
          <p className={`font-semibold ${getStatusColor(taskData.status)}`}>
            {taskData.status === 'running' && 'جاري المعالجة'}
            {taskData.status === 'completed' && 'مكتملة'}
            {taskData.status === 'error' && 'خطأ'}
            {taskData.status === 'pending' && 'معلقة'}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-highlight">الوكلاء</h4>
        {taskData.agents?.map((agent, idx) => (
          <div key={idx} className="p-4 bg-primary/50 rounded-lg border border-accent/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className={`text-2xl ${getStatusColor(agent.status)}`}>
                  {getStatusIcon(agent.status)}
                </span>
                <span className="font-semibold text-white">{agent.name}</span>
              </div>
              <span className="text-sm text-gray-400">{agent.progress}%</span>
            </div>
            <div className="w-full bg-primary/50 rounded-full h-2 overflow-hidden border border-accent/30">
              <div
                className={`h-full transition-all duration-300 bg-gradient-to-r from-highlight to-error`}
                style={{ width: `${agent.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-primary/30 rounded-lg border border-accent/30">
        <p className="text-sm text-gray-400">
          تم الإنشاء في:{' '}
          <span className="text-highlight">
            {new Date(taskData.createdAt).toLocaleString('ar-SA')}
          </span>
        </p>
      </div>
    </div>
  )
}
