import { useState } from 'react'
import Head from 'next/head'
import { useAppStore } from '@/lib/store'
import ApiKeyInputForm from '@/components/ApiKeyInputForm'
import TaskCreationWizard from '@/components/TaskCreationWizard'
import AgentStatusDashboard from '@/components/AgentStatusDashboard'
import RealTimeLogViewer from '@/components/RealTimeLogViewer'

export default function Home() {
  const { apiKey, currentTask, tasks } = useAppStore()
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)

  const selectedTask = tasks.find((t) => t.id === selectedTaskId) || currentTask

  return (
    <>
      <Head>
        <title>OpenDevAgent - منصة الذكاء الاصطناعي</title>
        <meta name="description" content="منصة متقدمة لهندسة البرمجيات بالذكاء الاصطناعي" />
      </Head>

      <main className="min-h-screen relative bg-black">

        {/* Header - Minimal Dark */}
        <header className="bg-black border-b border-neutral-800 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-neutral-900 rounded-lg transition-colors">
                  <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <h1 className="text-base font-normal text-neutral-200">
                  OpenDevAgent
                </h1>
              </div>
              <div className="flex items-center gap-2">
                {apiKey && (
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                )}
                <button className="p-2 hover:bg-neutral-900 rounded-lg transition-colors">
                  <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {!apiKey ? (
            // API Key Input - Minimal
            <div className="max-w-2xl mx-auto space-y-8 px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-normal text-neutral-200 mb-3">
                  ابدأ مع OpenDevAgent
                </h2>
                <p className="text-neutral-500 text-base">
                  أدخل مفتاح OpenRouter API للبدء
                </p>
              </div>
              <ApiKeyInputForm />
            </div>
          ) : (
            // Main Dashboard - Minimal
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 px-4 max-w-7xl mx-auto">
              {/* Left Column - Task Creation */}
              <div className="lg:col-span-1">
                <TaskCreationWizard />
              </div>

              {/* Right Column - Task Display */}
              <div className="lg:col-span-2 space-y-6">
                {selectedTask ? (
                  <div className="space-y-4">
                    <AgentStatusDashboard task={selectedTask} />
                    <RealTimeLogViewer taskId={selectedTask.id} />
                  </div>
                ) : (
                  <div className="p-8 bg-neutral-900 rounded-xl border border-neutral-800 text-center">
                    <p className="text-neutral-400 text-base mb-2">
                      {tasks.length === 0
                        ? 'لم تقم بإنشاء أي مهام بعد'
                        : 'اختر مهمة لعرض التفاصيل'}
                    </p>
                    <p className="text-neutral-600 text-sm">
                      {tasks.length === 0
                        ? 'أنشئ مهمتك الأولى من القائمة'
                        : 'انقر على أي مهمة'}
                    </p>
                  </div>
                )}

                {/* Tasks List */}
                {tasks.length > 0 && (
                  <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-neutral-300">
                        المهام
                      </h3>
                      <span className="text-xs text-neutral-500">
                        {tasks.length}
                      </span>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {tasks.map((task) => (
                        <button
                          key={task.id}
                          onClick={() => setSelectedTaskId(task.id)}
                          className={`w-full text-right p-3 rounded-lg border transition-colors ${
                            selectedTask?.id === task.id
                              ? 'bg-neutral-800 border-neutral-700'
                              : 'bg-black border-neutral-800 hover:border-neutral-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm text-neutral-300">
                              {task.language} • {task.framework}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                task.status === 'completed'
                                  ? 'bg-green-900/30 text-green-400'
                                  : task.status === 'error'
                                  ? 'bg-red-900/30 text-red-400'
                                  : 'bg-blue-900/30 text-blue-400'
                              }`}
                            >
                              {task.status === 'running' && 'جاري'}
                              {task.status === 'completed' && 'مكتملة'}
                              {task.status === 'error' && 'خطأ'}
                              {task.status === 'pending' && 'معلقة'}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-600 truncate mt-1">
                            {task.description.substring(0, 50)}...
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
