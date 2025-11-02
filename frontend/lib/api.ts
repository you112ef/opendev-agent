import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
})

export const validateApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    const response = await apiClient.post('/api/validate-key', {
      api_key: apiKey,
    })
    return response.status === 200
  } catch (error) {
    console.error('API key validation failed:', error)
    return false
  }
}

export const submitTask = async (
  apiKey: string,
  task: {
    description: string
    language: string
    framework: string
    complexity: string
  }
) => {
  try {
    const response = await apiClient.post('/api/submit-task', {
      api_key: apiKey,
      ...task,
    })
    return response.data
  } catch (error) {
    console.error('Task submission failed:', error)
    throw error
  }
}

export const getTaskStatus = async (taskId: string): Promise<any> => {
  try {
    const response = await apiClient.get(`/api/task_status/${taskId}`)
    return response.data
  } catch (error) {
    console.error('Failed to get task status:', error)
    throw error
  }
}

export const getTaskLogs = async (taskId: string): Promise<string[]> => {
  try {
    const response = await apiClient.get(`/api/task_logs/${taskId}`)
    return response.data.logs || []
  } catch (error) {
    console.error('Failed to get task logs:', error)
    return []
  }
}
