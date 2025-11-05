import { create } from 'zustand'

export interface AgentStatus {
  name: string
  status: 'idle' | 'running' | 'completed' | 'error'
  progress: number
  logs: string[]
}

export interface Task {
  id: string
  description: string
  language: string
  framework: string
  complexity: 'low' | 'medium' | 'high'
  status: 'pending' | 'running' | 'completed' | 'error'
  createdAt: Date
  agents: AgentStatus[]
  github_pr_url?: string
  github_pr_number?: number
  generated_code?: Record<string, string>
}

interface AppStore {
  apiKey: string | null
  setApiKey: (key: string) => void
  clearApiKey: () => void
  
  selectedModel: string | null
  setSelectedModel: (model: string) => void
  
  currentTask: Task | null
  setCurrentTask: (task: Task) => void
  clearCurrentTask: () => void
  
  tasks: Task[]
  addTask: (task: Task) => void
  updateTask: (id: string, task: Partial<Task>) => void
  
  notifications: Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    message: string
    timestamp: Date
  }>
  addNotification: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void
  removeNotification: (id: string) => void
}

export const useAppStore = create<AppStore>((set) => ({
  apiKey: null,
  setApiKey: (key) => set({ apiKey: key }),
  clearApiKey: () => set({ apiKey: null }),
  
  selectedModel: null,
  setSelectedModel: (model) => set({ selectedModel: model }),
  
  currentTask: null,
  setCurrentTask: (task) => set({ currentTask: task }),
  clearCurrentTask: () => set({ currentTask: null }),
  
  tasks: [],
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (id, updatedTask) => set((state) => ({
    tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updatedTask } : t)),
  })),
  
  notifications: [],
  addNotification: (type, message) => set((state) => ({
    notifications: [
      ...state.notifications,
      {
        id: Date.now().toString(),
        type,
        message,
        timestamp: new Date(),
      },
    ],
  })),
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter((n) => n.id !== id),
  })),
}))
