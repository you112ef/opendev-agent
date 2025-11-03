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
        return 'text-green-400'
      case 'error':
        return 'text-red-400'
      case 'running':
        return 'text-blue-400'
      default:
        return 'text-neutral-500'
    }
  }

  return (
    <div className="w-full p-6 bg-neutral-900 rounded-xl border border-neutral-800">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-neutral-200 mb-1">حالة المهمة</h3>
        <p className="text-neutral-600 text-xs font-mono">#{task.id.substring(0, 8)}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <div className="p-4 bg-black rounded-lg border border-neutral-800">
          <p className="text-neutral-500 text-xs mb-2">اللغة</p>
          <p className="text-neutral-200 font-medium">{taskData.language}</p>
        </div>
        <div className="p-4 bg-black rounded-lg border border-neutral-800">
          <p className="text-neutral-500 text-xs mb-2">الإطار</p>
          <p className="text-neutral-200 font-medium">{taskData.framework}</p>
        </div>
        <div className="p-4 bg-black rounded-lg border border-neutral-800">
          <p className="text-neutral-500 text-xs mb-2">الحالة</p>
          <p className={`font-medium ${getStatusColor(taskData.status)}`}>
            {taskData.status === 'running' && 'جاري'}
            {taskData.status === 'completed' && 'مكتملة'}
            {taskData.status === 'error' && 'خطأ'}
            {taskData.status === 'pending' && 'معلقة'}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-medium text-neutral-300 mb-3">الوكلاء</h4>
        {taskData.agents?.map((agent, idx) => (
          <div key={idx} className="p-4 bg-black rounded-lg border border-neutral-800">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-neutral-200">{agent.name}</span>
              <span className="text-sm text-neutral-500">{agent.progress}%</span>
            </div>
            <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  agent.status === 'completed' ? 'bg-green-500' :
                  agent.status === 'running' ? 'bg-blue-500' :
                  agent.status === 'error' ? 'bg-red-500' :
                  'bg-neutral-700'
                }`}
                style={{ width: `${agent.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-neutral-800">
        <div className="flex items-center justify-between">
          <p className="text-xs text-neutral-500">تم الإنشاء</p>
          <p className="text-xs text-neutral-400">
            {new Date(taskData.createdAt).toLocaleString('ar-SA', {
              dateStyle: 'short',
              timeStyle: 'short'
            })}
          </p>
        </div>
      </div>
    </div>
  )
}
