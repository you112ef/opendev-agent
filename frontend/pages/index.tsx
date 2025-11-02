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

      <main className="min-h-screen">
        {/* Header */}
        <header className="border-b border-accent/20 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-highlight to-error bg-clip-text text-transparent">
                OpenDevAgent
              </h1>
              <p className="text-gray-400 text-sm">منصة هندسة البرمجيات الذكية</p>
            </div>
            {apiKey && (
              <div className="flex items-center gap-2 px-4 py-2 bg-success/10 border border-success/30 rounded-lg">
                <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span className="text-success text-sm">متصل</span>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {!apiKey ? (
            // API Key Input
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-highlight mb-4">
                  ابدأ مع OpenRouter API
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  أدخل مفتاح API الخاص بك للوصول إلى نظام الوكلاء الذكية المتقدمة
                </p>
              </div>
              <ApiKeyInputForm />
            </div>
          ) : (
            // Main Dashboard
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Task Creation */}
              <div className="lg:col-span-1">
                <TaskCreationWizard />
              </div>

              {/* Right Column - Task Display */}
              <div className="lg:col-span-2 space-y-6">
                {selectedTask ? (
                  <>
                    <AgentStatusDashboard task={selectedTask} />
                    <RealTimeLogViewer taskId={selectedTask.id} />
                  </>
                ) : (
                  <div className="p-8 bg-gradient-to-br from-secondary to-primary rounded-xl shadow-2xl border border-accent/20 text-center">
                    <p className="text-gray-400 text-lg mb-4">
                      {tasks.length === 0
                        ? 'لم تقم بإنشاء أي مهام بعد'
                        : 'اختر مهمة لعرض التفاصيل'}
                    </p>
                  </div>
                )}

                {/* Tasks List */}
                {tasks.length > 0 && (
                  <div className="p-6 bg-gradient-to-br from-secondary to-primary rounded-xl shadow-2xl border border-accent/20">
                    <h3 className="text-lg font-semibold text-highlight mb-4">
                      المهام ({tasks.length})
                    </h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {tasks.map((task) => (
                        <button
                          key={task.id}
                          onClick={() => setSelectedTaskId(task.id)}
                          className={`w-full text-right p-3 rounded-lg border transition ${
                            selectedTask?.id === task.id
                              ? 'bg-highlight/20 border-highlight text-highlight'
                              : 'bg-primary/50 border-accent/30 text-gray-300 hover:border-highlight'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-sm">
                              {task.language} - {task.framework}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                task.status === 'completed'
                                  ? 'bg-success/20 text-success'
                                  : task.status === 'error'
                                  ? 'bg-error/20 text-error'
                                  : 'bg-highlight/20 text-highlight'
                              }`}
                            >
                              {task.status === 'running' && 'جاري'}
                              {task.status === 'completed' && 'مكتملة'}
                              {task.status === 'error' && 'خطأ'}
                              {task.status === 'pending' && 'معلقة'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 truncate">
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
