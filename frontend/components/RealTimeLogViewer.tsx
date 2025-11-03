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
    <div className="w-full h-96 bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-neutral-800">
        <h3 className="text-sm font-medium text-neutral-300">السجلات</h3>
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

      <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
        {logs.length === 0 ? (
          <p className="text-neutral-600 text-center mt-20">لا توجد سجلات حتى الآن...</p>
        ) : (
          logs.map((log, idx) => (
            <div key={idx} className="mb-2 text-neutral-400">
              <span className="text-neutral-600">[{idx + 1}]</span> {log}
            </div>
          ))
        )}
        <div ref={logsEndRef} />
      </div>
    </div>
  )
}
