'use client'

import { useState, useEffect, useRef } from 'react'
import Editor from '@monaco-editor/react'
import { supabase } from '@/lib/supabaseClient'
import { callOpenRouter } from '@/lib/api'

interface CodePreviewProps {
  runId: string
  language: string
}

export default function CodePreview({ runId, language }: CodePreviewProps) {
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch code from run logs
    const fetchCode = async () => {
      const { data, error } = await supabase
        .from('run_logs')
        .select('*')
        .eq('run_id', runId)
        .eq('log_level', 'info')
        .order('created_at', { ascending: false })
        .limit(10)

      if (!error && data) {
        // Extract code from logs (simplified - in production, store code separately)
        const codeLogs = data
          .filter(log => log.message.includes('```'))
          .map(log => log.message)
          .join('\n')
        setCode(codeLogs || '// No code generated yet')
      }
      setIsLoading(false)
    }

    fetchCode()
  }, [runId])

  const getLanguageForEditor = (lang: string) => {
    const langMap: Record<string, string> = {
      'Python': 'python',
      'JavaScript': 'javascript',
      'TypeScript': 'typescript',
      'Java': 'java',
      'Go': 'go',
      'Rust': 'rust',
      'C++': 'cpp',
    }
    return langMap[lang] || 'plaintext'
  }

  if (isLoading) {
    return (
      <div className="w-full h-96 bg-neutral-900 rounded-xl border border-neutral-800 flex items-center justify-center">
        <p className="text-neutral-500 text-sm">جاري تحميل الكود...</p>
      </div>
    )
  }

  return (
    <div className="w-full h-96 bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
      <div className="px-4 py-2 border-b border-neutral-800 flex items-center justify-between">
        <h3 className="text-sm font-medium text-neutral-300">معاينة الكود</h3>
        <span className="text-xs text-neutral-500">{language}</span>
      </div>
      <Editor
        height="100%"
        language={getLanguageForEditor(language)}
        value={code}
        theme="vs-dark"
        options={{
          readOnly: true,
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  )
}
