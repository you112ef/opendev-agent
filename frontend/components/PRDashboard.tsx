'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

interface PR {
  id: string
  run_id: string
  github_pr_url: string
  github_pr_number: number
  title: string
  status: string
  created_at: string
}

export default function PRDashboard() {
  const [prs, setPRs] = useState<PR[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPRs()

    // Subscribe to realtime updates
    const channel = supabase
      .channel('pr_dashboard')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'runs',
          filter: 'github_pr_url=not.is.null',
        },
        () => {
          fetchPRs()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchPRs = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('runs')
      .select('id, github_pr_url, github_pr_number, description, status, created_at')
      .eq('user_id', user.id)
      .not('github_pr_url', 'is', null)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setPRs(
        data.map((run) => ({
          id: run.id,
          run_id: run.id,
          github_pr_url: run.github_pr_url!,
          github_pr_number: run.github_pr_number!,
          title: run.description.substring(0, 50),
          status: run.status,
          created_at: run.created_at,
        }))
      )
    }
    setIsLoading(false)
  }

  if (isLoading) {
    return (
      <div className="p-6 bg-neutral-900 rounded-xl border border-neutral-800">
        <p className="text-neutral-500 text-sm">جاري تحميل Pull Requests...</p>
      </div>
    )
  }

  return (
    <div className="p-6 bg-neutral-900 rounded-xl border border-neutral-800">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-neutral-200">Pull Requests</h3>
        <span className="text-xs text-neutral-500">{prs.length} PRs</span>
      </div>

      {prs.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="w-12 h-12 text-neutral-600 mx-auto mb-4"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          <p className="text-neutral-400 text-sm mb-2">لا توجد Pull Requests حتى الآن</p>
          <p className="text-neutral-600 text-xs">سيتم عرض PRs هنا عند إنشائها</p>
        </div>
      ) : (
        <div className="space-y-3">
          {prs.map((pr) => (
            <Link
              key={pr.id}
              href={pr.github_pr_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-black rounded-lg border border-neutral-800 hover:border-neutral-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-neutral-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span className="font-medium text-neutral-200">PR #{pr.github_pr_number}</span>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    pr.status === 'completed'
                      ? 'bg-green-900/30 text-green-400'
                      : pr.status === 'running'
                      ? 'bg-blue-900/30 text-blue-400'
                      : 'bg-neutral-900/30 text-neutral-400'
                  }`}
                >
                  {pr.status === 'completed' && 'مكتمل'}
                  {pr.status === 'running' && 'جاري'}
                  {pr.status === 'pending' && 'معلق'}
                </span>
              </div>
              <p className="text-sm text-neutral-400 mb-2">{pr.title}...</p>
              <p className="text-xs text-neutral-600">
                {new Date(pr.created_at).toLocaleDateString('ar-SA', {
                  dateStyle: 'medium',
                })}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
