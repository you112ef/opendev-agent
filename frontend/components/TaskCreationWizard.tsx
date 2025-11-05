'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { submitTask } from '@/lib/api'
import ModelSelector from './ModelSelector'

const languages = ['Python', 'JavaScript', 'TypeScript', 'Java', 'Go', 'Rust', 'C++']
const frameworks = {
  Python: ['Django', 'FastAPI', 'Flask', 'SQLAlchemy'],
  JavaScript: ['React', 'Vue', 'Angular', 'Express'],
  TypeScript: ['Next.js', 'NestJS', 'Express', 'React'],
  Java: ['Spring Boot', 'Maven', 'Gradle', 'JUnit'],
  Go: ['Gin', 'Echo', 'Chi'],
  Rust: ['Actix', 'Rocket', 'Tokio'],
  'C++': ['Qt', 'CMake', 'Boost'],
}

export default function TaskCreationWizard() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    description: '',
    language: 'Python',
    framework: 'FastAPI',
    complexity: 'medium',
  })
  const [isLoading, setIsLoading] = useState(false)
  const { apiKey, selectedModel, addTask, addNotification } = useAppStore()

  const handleNext = () => {
    if (step === 1 && !formData.description.trim()) {
      addNotification('warning', 'يرجى إدخال وصف المهمة')
      return
    }
    setStep(step + 1)
  }

  const handleSubmit = async () => {
    if (!apiKey) {
      addNotification('error', 'يرجى إدخال مفتاح API أولاً')
      return
    }

    setIsLoading(true)
    try {
      const response = await submitTask({
        ...formData,
        model_id: selectedModel || undefined,
      })
      const taskId = response.run?.id || response.task_id || Date.now().toString()
      
      addTask({
        id: taskId,
        ...formData,
        complexity: formData.complexity as 'low' | 'medium' | 'high',
        status: 'running',
        createdAt: new Date(),
        agents: [
          { name: 'Architect', status: 'idle', progress: 0, logs: [] },
          { name: 'Coder', status: 'idle', progress: 0, logs: [] },
          { name: 'Debugger', status: 'idle', progress: 0, logs: [] },
        ],
      })

      addNotification('success', 'تم بدء المهمة بنجاح')
      setStep(1)
      setFormData({
        description: '',
        language: 'Python',
        framework: 'FastAPI',
        complexity: 'medium',
      })
    } catch (error) {
      addNotification('error', 'فشل في بدء المهمة')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-neutral-900 rounded-xl border border-neutral-800">
      <h2 className="text-lg font-medium text-neutral-200 mb-6">إنشاء مهمة جديدة</h2>

      <div className="mb-6 flex gap-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`flex-1 h-1 rounded-full transition-colors ${
              s <= step ? 'bg-white' : 'bg-neutral-700'
            }`}
          />
        ))}
      </div>

      <div className="min-h-64 mb-6">
        {step === 1 && (
          <div className="space-y-4 animate-fade-scale">
            <label className="block group">
              <span className="block text-sm font-semibold text-primary-300 mb-3 flex items-center gap-2">
                <span>📝</span>
                وصف المهمة
              </span>
              <div className="relative">
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="صف المهمة التي تريد تنفيذها..."
                  rows={5}
                  className="w-full px-4 py-3 bg-black text-white placeholder-neutral-600 border border-neutral-700 rounded-lg focus:outline-none focus:border-neutral-600 transition-colors resize-none"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none" />
              </div>
            </label>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-fade-scale">
            <div className="grid grid-cols-2 gap-4">
              <label className="block group">
                <span className="block text-sm font-semibold text-primary-300 mb-3 flex items-center gap-2">
                  <span>💻</span>
                  لغة البرمجة
                </span>
                <div className="relative">
                  <select
                    value={formData.language}
                    onChange={(e) => {
                      const lang = e.target.value
                      setFormData({
                        ...formData,
                        language: lang,
                        framework: frameworks[lang as keyof typeof frameworks][0],
                      })
                    }}
                    className="w-full px-4 py-3 bg-black text-white border border-neutral-700 rounded-lg focus:outline-none focus:border-neutral-600 transition-colors cursor-pointer"
                  >
                    {languages.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>
              </label>

              <label className="block group">
                <span className="block text-sm font-semibold text-primary-300 mb-3 flex items-center gap-2">
                  <span>🛠️</span>
                  إطار العمل
                </span>
                <div className="relative">
                  <select
                    value={formData.framework}
                    onChange={(e) =>
                      setFormData({ ...formData, framework: e.target.value })
                    }
                    className="w-full px-5 py-4 glass text-white border border-white/10 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 transition-all duration-200 appearance-none cursor-pointer"
                  >
                    {frameworks[formData.language as keyof typeof frameworks].map(
                      (fw) => (
                        <option key={fw} value={fw}>
                          {fw}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </label>
            </div>
            
            <div className="mt-4">
              <ModelSelector />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-fade-scale">
            <label className="block">
              <span className="block text-sm font-semibold text-primary-300 mb-3 flex items-center gap-2">
                <span>🎯</span>
                مستوى التعقيد
              </span>
              <div className="flex gap-3">
                {['low', 'medium', 'high'].map((level) => (
                  <button
                    key={level}
                    onClick={() =>
                      setFormData({ ...formData, complexity: level })
                    }
                    className={`flex-1 py-4 rounded-xl font-semibold transition-all duration-200 relative overflow-hidden group ${
                      formData.complexity === level
                        ? 'glass-strong border-primary-500 shadow-glow-sm text-primary-300'
                        : 'glass border-white/10 text-gray-400 hover:border-primary-500/30'
                    }`}
                  >
                    <span className="relative z-10">
                      {level === 'low' && 'منخفض'}
                      {level === 'medium' && 'متوسط'}
                      {level === 'high' && 'عالي'}
                    </span>
                  </button>
                ))}
              </div>
            </label>

            <div className="p-5 glass rounded-xl border border-white/10 animate-slide-in">
              <div className="flex items-center gap-2 mb-3">
                <span>📋</span>
                <p className="text-sm font-semibold text-primary-300">ملخص المهمة</p>
              </div>
              <p className="text-gray-400 text-sm">
                اللغة: <span className="text-highlight">{formData.language}</span>
              </p>
              <p className="text-gray-400 text-sm">
                الإطار: <span className="text-highlight">{formData.framework}</span>
              </p>
              <p className="text-gray-400 text-sm">
                التعقيد:{' '}
                <span className="text-highlight">
                  {formData.complexity === 'low' && 'منخفض'}
                  {formData.complexity === 'medium' && 'متوسط'}
                  {formData.complexity === 'high' && 'عالي'}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex-1 py-3 bg-neutral-800 border border-neutral-700 text-white font-medium rounded-lg hover:bg-neutral-700 transition-colors"
          >
            السابق
          </button>
        )}
        {step < 3 ? (
          <button
            onClick={handleNext}
            className="flex-1 py-3 bg-white text-black font-medium rounded-lg hover:bg-neutral-200 transition-colors"
          >
            التالي
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 py-3 bg-white text-black font-medium rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'جاري الإرسال...' : 'بدء المهمة'}
          </button>
        )}
      </div>
    </div>
  )
}
