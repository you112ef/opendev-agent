'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { submitTask } from '@/lib/api'

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
  const { apiKey, addTask, addNotification } = useAppStore()

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
      const response = await submitTask(apiKey, formData)
      const taskId = response.task_id || Date.now().toString()
      
      addTask({
        id: taskId,
        ...formData,
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
    <div className="w-full max-w-2xl mx-auto p-6 bg-gradient-to-br from-secondary to-primary rounded-xl shadow-2xl border border-accent/20">
      <h2 className="text-2xl font-bold text-highlight mb-6">إنشاء مهمة جديدة</h2>

      <div className="mb-6 flex justify-between">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`flex-1 h-2 mx-1 rounded-full transition ${
              s <= step ? 'bg-highlight' : 'bg-primary/50'
            }`}
          />
        ))}
      </div>

      <div className="min-h-64 mb-6">
        {step === 1 && (
          <div className="space-y-4 animate-fade-scale">
            <label className="block">
              <span className="block text-sm font-semibold text-highlight mb-2">
                وصف المهمة
              </span>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="صف المهمة التي تريد تنفيذها..."
                rows={5}
                className="w-full px-4 py-3 bg-primary/50 text-white placeholder-gray-500 border border-accent/50 rounded-lg focus:outline-none focus:border-highlight focus:ring-2 focus:ring-highlight/50 transition"
              />
            </label>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-fade-scale">
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="block text-sm font-semibold text-highlight mb-2">
                  لغة البرمجة
                </span>
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
                  className="w-full px-4 py-3 bg-primary/50 text-white border border-accent/50 rounded-lg focus:outline-none focus:border-highlight"
                >
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="block text-sm font-semibold text-highlight mb-2">
                  إطار العمل
                </span>
                <select
                  value={formData.framework}
                  onChange={(e) =>
                    setFormData({ ...formData, framework: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-primary/50 text-white border border-accent/50 rounded-lg focus:outline-none focus:border-highlight"
                >
                  {frameworks[formData.language as keyof typeof frameworks].map(
                    (fw) => (
                      <option key={fw} value={fw}>
                        {fw}
                      </option>
                    )
                  )}
                </select>
              </label>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-fade-scale">
            <label className="block">
              <span className="block text-sm font-semibold text-highlight mb-2">
                مستوى التعقيد
              </span>
              <div className="flex gap-3">
                {['low', 'medium', 'high'].map((level) => (
                  <button
                    key={level}
                    onClick={() =>
                      setFormData({ ...formData, complexity: level })
                    }
                    className={`flex-1 py-3 rounded-lg font-semibold transition ${
                      formData.complexity === level
                        ? 'bg-highlight text-primary'
                        : 'bg-primary/50 text-gray-400 hover:border-highlight border border-transparent'
                    }`}
                  >
                    {level === 'low' && 'منخفض'}
                    {level === 'medium' && 'متوسط'}
                    {level === 'high' && 'عالي'}
                  </button>
                ))}
              </div>
            </label>

            <div className="p-4 bg-primary/30 rounded-lg border border-accent/30">
              <p className="text-sm text-gray-300 mb-2">
                <strong>الملخص:</strong>
              </p>
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
            className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition"
          >
            السابق
          </button>
        )}
        {step < 3 ? (
          <button
            onClick={handleNext}
            className="flex-1 py-3 bg-gradient-to-r from-highlight to-error text-white font-semibold rounded-lg hover:shadow-lg transition"
          >
            التالي
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 py-3 bg-gradient-to-r from-success to-highlight text-primary font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50"
          >
            {isLoading ? 'جاري الإرسال...' : 'بدء المهمة'}
          </button>
        )}
      </div>
    </div>
  )
}
