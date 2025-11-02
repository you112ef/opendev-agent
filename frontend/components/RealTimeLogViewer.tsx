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
    <div className="w-full h-96 glass-strong rounded-2xl shadow-glow border border-white/10 overflow-hidden flex flex-col animate-fade-scale">
      <div className="flex items-center justify-between p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <span className="text-xl">📜</span>
          </div>
          <h3 className="text-lg font-bold gradient-text">السجلات المباشرة</h3>
        </div>
        <button
          onClick={() => setIsAutoScroll(!isAutoScroll)}
          className={`text-sm px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
            isAutoScroll
              ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30 shadow-glow-sm'
              : 'glass text-gray-400 hover:text-primary-300 border border-white/10 hover:border-primary-500/30'
          }`}
        >
          <span>{isAutoScroll ? '▼' : '⏸️'}</span>
          {isAutoScroll ? 'تمرير تلقائي' : 'إيقاف التمرير'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 font-mono text-sm text-gray-300 custom-scrollbar">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full animate-pulse">
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow mb-4 opacity-30">
              <span className="text-3xl">📝</span>
            </div>
            <p className="text-gray-500 text-center">لا توجد سجلات حتى الآن...</p>
            <p className="text-gray-600 text-xs mt-2">انتظر بدء المهمة</p>
          </div>
        ) : (
          logs.map((log, idx) => (
            <div key={idx} className="mb-2 p-3 glass rounded-lg border border-white/5 hover:border-primary-500/20 transition-colors duration-200 animate-slide-in" style={{animationDelay: `${idx * 0.02}s`}}>
              <div className="flex items-start gap-3">
                <span className="text-primary-400/60 font-bold min-w-[2.5rem] text-right">[{idx + 1}]</span>
                <span className="text-gray-300 flex-1">{log}</span>
              </div>
            </div>
          ))
        )}
        <div ref={logsEndRef} />
      </div>
    </div>
  )
}
