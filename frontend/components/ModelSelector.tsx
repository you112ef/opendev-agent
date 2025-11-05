'use client'

import { useState, useEffect, useMemo } from 'react'
import { getOpenRouterModels } from '@/lib/api'
import { useAppStore } from '@/lib/store'

interface Model {
  id: string
  name: string
  description?: string
  context_length?: number
  pricing?: {
    prompt?: string
    completion?: string
  }
  architecture?: {
    modality?: string
    tokenizer?: string
  }
  top_provider?: {
    context_length?: number
  }
}

export default function ModelSelector() {
  const [models, setModels] = useState<Model[]>([])
  const [selectedModel, setSelectedModel] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
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
          m.id.includes('gpt-4') || m.id.includes('claude-3.5') || m.id.includes('claude-3-opus')
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
    setShowDropdown(false)
  }

  // Filter models based on search query
  const filteredModels = useMemo(() => {
    if (!searchQuery) return models
    
    const query = searchQuery.toLowerCase()
    return models.filter((model) => 
      model.name?.toLowerCase().includes(query) ||
      model.id.toLowerCase().includes(query) ||
      model.description?.toLowerCase().includes(query)
    )
  }, [models, searchQuery])

  const selectedModelData = models.find(m => m.id === selectedModel)

  return (
    <div className="w-full">
      <label className="block mb-3">
        <span className="block text-sm font-medium text-neutral-300 mb-2">
          AI Model ({models.length} models available)
        </span>
        
        {/* Search Input */}
        <div className="mb-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            placeholder="Search models..."
            className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-neutral-600"
          />
        </div>

        {/* Model Selector */}
        <div className="relative">
          {isLoading ? (
            <div className="w-full px-4 py-3 bg-black border border-neutral-700 rounded-lg text-neutral-500 text-sm">
              Loading {models.length > 0 ? `${models.length} models` : 'models'}...
            </div>
          ) : (
            <>
              <select
                value={selectedModel}
                onChange={(e) => handleModelChange(e.target.value)}
                className="w-full px-4 py-3 bg-black text-white border border-neutral-700 rounded-lg focus:outline-none focus:border-neutral-600 transition-colors cursor-pointer appearance-none"
                size={showDropdown && filteredModels.length > 0 ? Math.min(filteredModels.length + 1, 10) : 1}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              >
                {filteredModels.length === 0 && searchQuery ? (
                  <option value="">No models found</option>
                ) : (
                  filteredModels.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name || model.id}
                      {model.context_length && ` (${Math.round(model.context_length / 1000)}k)`}
                    </option>
                  ))
                )}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </>
          )}
        </div>
      </label>
      
      {/* Model Info */}
      {selectedModelData && (
        <div className="mt-3 p-3 bg-neutral-900 rounded-lg border border-neutral-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <img 
                src="https://openrouter.ai/icon.png" 
                alt="OpenRouter" 
                className="w-4 h-4"
              />
              <span className="text-xs text-neutral-400">OpenRouter</span>
            </div>
            {selectedModelData.context_length && (
              <span className="text-xs text-neutral-500">
                {Math.round(selectedModelData.context_length / 1000)}k context
              </span>
            )}
          </div>
          {selectedModelData.description && (
            <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
              {selectedModelData.description}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
