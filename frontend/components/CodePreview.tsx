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
    // Fetch code from run's generated_code field
    const fetchCode = async () => {
      const { data, error } = await supabase
        .from('runs')
        .select('generated_code')
        .eq('id', runId)
        .single()

      if (!error && data?.generated_code) {
        // Convert generated_code object to formatted code string
        const codeObj = data.generated_code as Record<string, string>
        const codeFiles = Object.entries(codeObj)
          .map(([filename, code]) => `// ${filename}\n${code}`)
          .join('\n\n')
        setCode(codeFiles || '// No code generated yet')
      } else {
        // Fallback: try to get from logs
        const { data: logData } = await supabase
          .from('run_logs')
          .select('metadata')
          .eq('run_id', runId)
          .eq('agent_name', 'Coder')
          .not('metadata', 'is', null)
          .order('created_at', { ascending: false })
          .limit(1)

        if (logData && logData[0]?.metadata?.code_blocks) {
          const blocks = logData[0].metadata.code_blocks as Array<{language: string; code: string}>
          const codeStr = blocks
            .map((block) => `\`\`\`${block.language}\n${block.code}\n\`\`\``)
            .join('\n\n')
          setCode(codeStr)
        } else {
          setCode('// Code generation in progress...')
        }
      }
      setIsLoading(false)
    }

    fetchCode()

    // Subscribe to updates
    const channel = supabase
      .channel(`run_code:${runId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'runs',
          filter: `id=eq.${runId}`,
        },
        (payload) => {
          if (payload.new.generated_code) {
            const codeObj = payload.new.generated_code as Record<string, string>
            const codeFiles = Object.entries(codeObj)
              .map(([filename, code]) => `// ${filename}\n${code}`)
              .join('\n\n')
            setCode(codeFiles)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
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
