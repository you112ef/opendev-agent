'use client'

import { useEffect, useRef, useState } from 'react'
import { getTaskLogs } from '@/lib/api'

interface RealTimeLogViewerProps {
  taskId: string
  isLive?: boolean
}

export default function RealTimeLogViewer({ taskId, isLive = true }: RealTimeLogViewerProps) {
  const [logs, setLogs] = useState<string[]>([])
  const [isAutoScroll, setIsAutoScroll] = useState(true)
  const logsEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isLive) return

    const pollInterval = setInterval(async () => {
      try {
        const newLogs = await getTaskLogs(taskId)
        setLogs(newLogs)
      } catch (error) {
        console.error('Failed to fetch logs:', error)
      }
    }, 1000)

    return () => clearInterval(pollInterval)
  }, [taskId, isLive])

  useEffect(() => {
    if (isAutoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [logs, isAutoScroll])

  return (
    <div className="w-full h-96 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-2xl border border-accent/20 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-accent/30">
        <h3 className="text-lg font-semibold text-highlight">السجلات</h3>
        <button
          onClick={() => setIsAutoScroll(!isAutoScroll)}
          className={`text-sm px-3 py-1 rounded transition ${
            isAutoScroll
              ? 'bg-highlight text-primary'
              : 'bg-primary/50 text-gray-400 hover:text-highlight'
          }`}
        >
          {isAutoScroll ? 'التمرير التلقائي' : 'إيقاف التمرير'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 font-mono text-sm text-gray-300">
        {logs.length === 0 ? (
          <p className="text-gray-500 text-center mt-20">لا توجد سجلات حتى الآن...</p>
        ) : (
          logs.map((log, idx) => (
            <div key={idx} className="mb-1 text-gray-400">
              <span className="text-accent/50">[{idx + 1}]</span> {log}
            </div>
          ))
        )}
        <div ref={logsEndRef} />
      </div>
    </div>
  )
}
