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

export const createGitHubPR = async (
  runId: string,
  repoUrl: string,
  branchName: string,
  title: string,
  description: string,
  files?: Record<string, string>
) => {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${SUPABASE_FUNCTIONS_URL}/github-pr`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        run_id: runId,
        repo_url: repoUrl,
        branch_name: branchName,
        title,
        description,
        files,
      }),
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to create GitHub PR:', error)
    throw error
  }
}

export const executeSandbox = async (
  runId: string,
  language: string,
  code: string,
  testCode?: string
) => {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${SUPABASE_FUNCTIONS_URL}/sandbox-execute`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        run_id: runId,
        language,
        code,
        test_code: testCode,
      }),
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Sandbox execution failed:', error)
    throw error
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
    const data = await response.json()
    return data
  } catch (error) {
    console.error('OpenRouter call failed:', error)
    throw error
  }
}
