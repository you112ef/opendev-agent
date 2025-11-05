import { supabase } from './supabaseClient'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_FUNCTIONS_URL = `${SUPABASE_URL}/functions/v1`

// Helper to get auth headers
async function getAuthHeaders() {
  const { data: { session } } = await supabase.auth.getSession()
  return {
    'Authorization': `Bearer ${session?.access_token || ''}`,
    'Content-Type': 'application/json',
  }
}

export const validateApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${SUPABASE_FUNCTIONS_URL}/validate-api-key`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ api_key: apiKey }),
    })
    const data = await response.json()
    return data.valid === true
  } catch (error) {
    console.error('API key validation failed:', error)
    return false
  }
}

export const getOpenRouterModels = async (): Promise<any[]> => {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${SUPABASE_FUNCTIONS_URL}/openrouter-models`, {
      method: 'GET',
      headers,
    })
    const data = await response.json()
    return data.models || []
  } catch (error) {
    console.error('Failed to fetch models:', error)
    return []
  }
}

export const submitTask = async (
  task: {
    description: string
    language: string
    framework: string
    complexity: string
    model_id?: string
  }
) => {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${SUPABASE_FUNCTIONS_URL}/run-handler`, {
      method: 'POST',
      headers,
      body: JSON.stringify(task),
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Task submission failed:', error)
    throw error
  }
}

export const getTaskStatus = async (taskId: string): Promise<any> => {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(
      `${SUPABASE_FUNCTIONS_URL}/run-handler?run_id=${taskId}`,
      {
        method: 'GET',
        headers,
      }
    )
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to get task status:', error)
    throw error
  }
}

export const getAllRuns = async (): Promise<any[]> => {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${SUPABASE_FUNCTIONS_URL}/run-handler`, {
      method: 'GET',
      headers,
    })
    const data = await response.json()
    return data.runs || []
  } catch (error) {
    console.error('Failed to get runs:', error)
    return []
  }
}

export const callOpenRouter = async (
  model: string,
  messages: any[],
  stream: boolean = false
): Promise<any> => {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${SUPABASE_FUNCTIONS_URL}/openrouter-proxy`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model,
        messages,
        stream,
      }),
    })

    if (stream) {
      // Handle streaming response
      return response.body
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('OpenRouter API call failed:', error)
    throw error
  }
}
