'use client'

import { useState, useEffect } from 'react'
import { getOpenRouterModels } from '@/lib/api'
import { useAppStore } from '@/lib/store'

interface Model {
  id: string
  name: string
  description?: string
  context_length?: number
  architecture?: {
    modality?: string
    tokenizer?: string
  }
}

export default function ModelSelector() {
  const [models, setModels] = useState<Model[]>([])
  const [selectedModel, setSelectedModel] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const { setSelectedModel: setStoreModel } = useAppStore()

  useEffect(() => {
    loadModels()
  }, [])

  const loadModels = async () => {
    setIsLoading(true)
    try {
      const fetchedModels = await getOpenRouterModels()
      setModels(fetchedModels)
      
      // Set default model if available
      if (fetchedModels.length > 0 && !selectedModel) {
        const defaultModel = fetchedModels.find((m: Model) => 
          m.id.includes('gpt-4') || m.id.includes('claude-3.5')
        ) || fetchedModels[0]
        setSelectedModel(defaultModel.id)
        setStoreModel(defaultModel.id)
      }
    } catch (error) {
      console.error('Failed to load models:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId)
    setStoreModel(modelId)
  }

  return (
    <div className="w-full">
      <label className="block mb-3">
        <span className="block text-sm font-medium text-neutral-300 mb-2">
          AI Model
        </span>
        <div className="relative">
          {isLoading ? (
            <div className="w-full px-4 py-3 bg-black border border-neutral-700 rounded-lg text-neutral-500 text-sm">
              Loading models...
            </div>
          ) : (
            <select
              value={selectedModel}
              onChange={(e) => handleModelChange(e.target.value)}
              className="w-full px-4 py-3 bg-black text-white border border-neutral-700 rounded-lg focus:outline-none focus:border-neutral-600 transition-colors cursor-pointer appearance-none"
            >
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name || model.id}
                  {model.context_length && ` (${Math.round(model.context_length / 1000)}k)`}
                </option>
              ))}
            </select>
          )}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </label>
      
      {selectedModel && (
        <div className="mt-2 flex items-center gap-2 text-xs text-neutral-500">
          <img 
            src="https://openrouter.ai/icon.png" 
            alt="OpenRouter" 
            className="w-4 h-4"
          />
          <span>Powered by OpenRouter</span>
        </div>
      )}
    </div>
  )
}
