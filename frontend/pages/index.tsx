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

      <main className="min-h-screen relative">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-500/5 rounded-full blur-3xl animate-pulse" />
        </div>

        {/* Header */}
        <header className="glass border-b border-white/10 sticky top-0 z-40 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                  <span className="text-2xl">🤖</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold gradient-text">
                    OpenDevAgent
                  </h1>
                  <p className="text-gray-400 text-xs">منصة هندسة البرمجيات الذكية</p>
                </div>
              </div>
              {apiKey && (
                <div className="flex items-center gap-3 px-4 py-2 glass rounded-xl border border-success-500/30 shadow-glow-sm">
                  <div className="relative">
                    <span className="w-2 h-2 bg-success-500 rounded-full inline-block animate-pulse" />
                    <span className="absolute inset-0 w-2 h-2 bg-success-500 rounded-full animate-ping" />
                  </div>
                  <span className="text-success-400 text-sm font-medium">متصل</span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {!apiKey ? (
            // API Key Input
            <div className="space-y-8 relative z-10">
              <div className="text-center mb-12 animate-fade-scale">
                <div className="inline-block mb-6">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow-lg animate-float">
                    <span className="text-5xl">🚀</span>
                  </div>
                </div>
                <h2 className="text-5xl font-bold gradient-text mb-4">
                  ابدأ مع OpenRouter API
                </h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                  أدخل مفتاح API الخاص بك للوصول إلى نظام الوكلاء الذكية المتقدمة
                </p>
                <div className="flex items-center justify-center gap-2 mt-6">
                  <div className="px-4 py-2 glass rounded-full border border-primary-500/30 text-sm text-primary-300">
                    ⚡ 3 وكلاء متخصصين
                  </div>
                  <div className="px-4 py-2 glass rounded-full border border-secondary-500/30 text-sm text-secondary-300">
                    🔒 آمن ومشفر
                  </div>
                  <div className="px-4 py-2 glass rounded-full border border-accent-500/30 text-sm text-accent-300">
                    🚀 نتائج فورية
                  </div>
                </div>
              </div>
              <ApiKeyInputForm />
            </div>
          ) : (
            // Main Dashboard
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
              {/* Left Column - Task Creation */}
              <div className="lg:col-span-1">
                <TaskCreationWizard />
              </div>

              {/* Right Column - Task Display */}
              <div className="lg:col-span-2 space-y-6">
                {selectedTask ? (
                  <div className="space-y-6">
                    <AgentStatusDashboard task={selectedTask} />
                    <RealTimeLogViewer taskId={selectedTask.id} />
                  </div>
                ) : (
                  <div className="p-12 glass-strong rounded-2xl shadow-glow border border-white/10 text-center animate-fade-scale">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow opacity-50">
                      <span className="text-6xl">✨</span>
                    </div>
                    <p className="text-gray-300 text-xl mb-2 font-medium">
                      {tasks.length === 0
                        ? 'جاهز للبدء!'
                        : 'اختر مهمة لعرض التفاصيل'}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {tasks.length === 0
                        ? 'أنشئ مهمتك الأولى من القائمة اليمنى'
                        : 'انقر على أي مهمة من القائمة أدناه'}
                    </p>
                  </div>
                )}

                {/* Tasks List */}
                {tasks.length > 0 && (
                  <div className="p-6 glass-strong rounded-2xl shadow-glow border border-white/10 animate-slide-in">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold gradient-text">
                        المهام
                      </h3>
                      <span className="px-3 py-1 bg-primary-500/20 rounded-full text-primary-300 text-sm font-medium">
                        {tasks.length}
                      </span>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {tasks.map((task) => (
                        <button
                          key={task.id}
                          onClick={() => setSelectedTaskId(task.id)}
                          className={`w-full text-right p-4 rounded-xl border transition-all duration-200 hover-lift ${
                            selectedTask?.id === task.id
                              ? 'glass-strong border-primary-500/50 shadow-glow-sm'
                              : 'glass border-white/10 hover:border-primary-500/30'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-sm text-gray-200">
                              {task.language} • {task.framework}
                            </span>
                            <span
                              className={`text-xs px-3 py-1 rounded-full font-medium ${
                                task.status === 'completed'
                                  ? 'bg-success-500/20 text-success-400 border border-success-500/30'
                                  : task.status === 'error'
                                  ? 'bg-error-500/20 text-error-400 border border-error-500/30'
                                  : 'bg-primary-500/20 text-primary-400 border border-primary-500/30 animate-pulse'
                              }`}
                            >
                              {task.status === 'running' && 'جاري'}
                              {task.status === 'completed' && 'مكتملة'}
                              {task.status === 'error' && 'خطأ'}
                              {task.status === 'pending' && 'معلقة'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 truncate mt-2">
                            {task.description.substring(0, 60)}...
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
