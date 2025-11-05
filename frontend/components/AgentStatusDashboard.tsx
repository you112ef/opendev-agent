'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAppStore } from '@/lib/store'

interface AgentStatus {
  id: string
  agent_name: string
  status: 'idle' | 'running' | 'completed' | 'error'
  progress: number
  created_at: string
  updated_at: string
}

interface Task {
  id: string
  description: string
  language: string
  framework: string
  complexity: string
  status: string
  github_pr_url?: string
  github_pr_number?: number
}

interface AgentStatusDashboardProps {
  task: Task
}

export default function AgentStatusDashboard({ task }: AgentStatusDashboardProps) {
  const [agents, setAgents] = useState<AgentStatus[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!task?.id) return

    // Fetch initial agent statuses
    const fetchAgents = async () => {
      const { data, error } = await supabase
        .from('agent_status')
        .select('*')
        .eq('run_id', task.id)
        .order('created_at', { ascending: true })

      if (!error && data) {
        setAgents(data)
      }
      setIsLoading(false)
    }

    fetchAgents()

    // Subscribe to realtime updates
    const channel = supabase
      .channel(`agent_status:${task.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'agent_status',
          filter: `run_id=eq.${task.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            setAgents((prev) => {
              const existing = prev.findIndex((a) => a.id === payload.new.id)
              if (existing >= 0) {
                return prev.map((a) => (a.id === payload.new.id ? payload.new as AgentStatus : a))
              }
              return [...prev, payload.new as AgentStatus]
            })
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [task.id])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-900/30'
      case 'running':
        return 'text-blue-400 bg-blue-900/30'
      case 'error':
        return 'text-red-400 bg-red-900/30'
      default:
        return 'text-neutral-400 bg-neutral-900/30'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'مكتمل'
      case 'running':
        return 'جاري'
      case 'error':
        return 'خطأ'
      default:
        return 'انتظار'
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 bg-neutral-900 rounded-xl border border-neutral-800">
        <p className="text-neutral-500 text-sm">جاري تحميل حالة الوكلاء...</p>
      </div>
    )
  }

  return (
    <div className="p-6 bg-neutral-900 rounded-xl border border-neutral-800">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-neutral-200">حالة الوكلاء</h3>
        {task.github_pr_url && (
          <a
            href={task.github_pr_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            PR #{task.github_pr_number}
          </a>
        )}
      </div>

      <div className="space-y-4">
        {agents.length === 0 ? (
          <p className="text-neutral-500 text-sm text-center py-8">
            لا توجد وكلاء نشطة
          </p>
        ) : (
          agents.map((agent) => (
            <div key={agent.id} className="p-4 bg-black rounded-lg border border-neutral-800">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    agent.status === 'completed' ? 'bg-green-500' :
                    agent.status === 'running' ? 'bg-blue-500 animate-pulse' :
                    agent.status === 'error' ? 'bg-red-500' :
                    'bg-neutral-500'
                  }`} />
                  <span className="font-medium text-neutral-300">{agent.agent_name}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${getStatusColor(agent.status)}`}>
                  {getStatusLabel(agent.status)}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-neutral-800 rounded-full h-2 mb-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    agent.status === 'completed' ? 'bg-green-500' :
                    agent.status === 'running' ? 'bg-blue-500' :
                    agent.status === 'error' ? 'bg-red-500' :
                    'bg-neutral-600'
                  }`}
                  style={{ width: `${agent.progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>{agent.progress}%</span>
                <span>
                  {agent.status === 'completed' && '✅'}
                  {agent.status === 'running' && '⏳'}
                  {agent.status === 'error' && '❌'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
