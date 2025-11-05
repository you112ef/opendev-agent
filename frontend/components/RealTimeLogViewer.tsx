'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface RealTimeLogViewerProps {
  taskId: string
  isLive?: boolean
}

interface LogEntry {
  id: string
  message: string
  log_level: string
  agent_name?: string
  created_at: string
}

export default function RealTimeLogViewer({ taskId, isLive = true }: RealTimeLogViewerProps) {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isAutoScroll, setIsAutoScroll] = useState(true)
  const logsEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!taskId || !isLive) return

    // Initial fetch
    const fetchLogs = async () => {
      const { data, error } = await supabase
        .from('run_logs')
        .select('*')
        .eq('run_id', taskId)
        .order('created_at', { ascending: true })

      if (!error && data) {
        setLogs(data)
      }
    }

    fetchLogs()

    // Subscribe to realtime updates
    const channel = supabase
      .channel(`run_logs:${taskId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'run_logs',
          filter: `run_id=eq.${taskId}`,
        },
        (payload) => {
          setLogs((prev) => [...prev, payload.new as LogEntry])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [taskId, isLive])

  useEffect(() => {
    if (isAutoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [logs, isAutoScroll])

  return (
    <div className="w-full h-96 bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-neutral-800">
        <h3 className="text-sm font-medium text-neutral-300">السجلات</h3>
        <div className="flex items-center gap-2">
          {isLive && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-neutral-500">مباشر</span>
            </div>
          )}
          <button
            onClick={() => setIsAutoScroll(!isAutoScroll)}
            className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
              isAutoScroll
                ? 'bg-neutral-800 text-neutral-300'
                : 'bg-black text-neutral-500 hover:text-neutral-300'
            }`}
          >
            {isAutoScroll ? 'تمرير تلقائي' : 'إيقاف التمرير'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
        {logs.length === 0 ? (
          <p className="text-neutral-600 text-center mt-20">لا توجد سجلات حتى الآن...</p>
        ) : (
          logs.map((log) => {
            const logColor = 
              log.log_level === 'error' ? 'text-red-400' :
              log.log_level === 'warning' ? 'text-yellow-400' :
              log.log_level === 'success' ? 'text-green-400' :
              'text-neutral-400'
            
            return (
              <div key={log.id} className={`mb-2 ${logColor}`}>
                {log.agent_name && (
                  <span className="text-neutral-600">[{log.agent_name}] </span>
                )}
                <span>{log.message}</span>
              </div>
            )
          })
        )}
        <div ref={logsEndRef} />
      </div>
    </div>
  )
}
