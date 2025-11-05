// Supabase Edge Function: Task Executor
// Executes AI tasks end-to-end: Architect -> Coder -> Debugger -> Sandbox -> PR

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1'
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    if (req.method === 'POST') {
      const body = await req.json()
      const { run_id } = body

      if (!run_id) {
        throw new Error('run_id is required')
      }

      // Get run details
      const { data: run, error: runError } = await supabaseAdmin
        .from('runs')
        .select('*')
        .eq('id', run_id)
        .single()

      if (runError || !run) {
        throw new Error('Run not found')
      }

      // Get user's API key
      const { data: settings } = await supabaseAdmin
        .from('user_settings')
        .select('openrouter_api_key, selected_model')
        .eq('user_id', run.user_id)
        .single()

      if (!settings?.openrouter_api_key) {
        throw new Error('OpenRouter API key not configured')
      }

      const model = settings.selected_model || run.model_id || 'openai/gpt-4o'

      // Update status to running
      await supabaseAdmin
        .from('runs')
        .update({ status: 'running', updated_at: new Date().toISOString() })
        .eq('id', run_id)

      // Execute task workflow
      await executeTaskWorkflow(
        supabaseAdmin,
        run_id,
        run,
        settings.openrouter_api_key,
        model
      )

      return new Response(
        JSON.stringify({ success: true, message: 'Task execution started' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

async function executeTaskWorkflow(
  supabase: any,
  runId: string,
  run: any,
  apiKey: string,
  model: string
) {
  try {
    // Phase 1: Architect
    await updateAgentStatus(supabase, runId, 'Architect', 'running', 0)
    await addLog(supabase, runId, 'info', 'Architect', 'Starting architecture planning...')

    const architecturePrompt = `You are an expert software architect. Create a detailed architecture plan for:

Task: ${run.description}
Language: ${run.language}
Framework: ${run.framework}
Complexity: ${run.complexity}

Provide:
1. System architecture overview
2. Key components and their responsibilities
3. Data flow description
4. Technology stack decisions
5. Implementation steps

Format your response in clear sections.`

    const architecture = await callOpenRouter(apiKey, model, architecturePrompt)
    await updateAgentStatus(supabase, runId, 'Architect', 'completed', 100)
    await addLog(supabase, runId, 'success', 'Architect', 'Architecture plan completed')

    // Phase 2: Coder
    await updateAgentStatus(supabase, runId, 'Coder', 'running', 0)
    await addLog(supabase, runId, 'info', 'Coder', 'Generating code...')

    const codePrompt = `You are an expert code generator. Generate production-ready code based on:

Task: ${run.description}
Language: ${run.language}
Framework: ${run.framework}
Architecture Plan:
${architecture.substring(0, 2000)}

Generate complete, working code including:
1. Main application files
2. Configuration files
3. Dependencies/packages
4. Entry point
5. Error handling

Format code blocks with language tags. Be thorough and ensure code is production-ready.`

    const codeResponse = await callOpenRouter(apiKey, model, codePrompt)
    
    // Extract code from response
    const codeBlocks = extractCodeBlocks(codeResponse)
    
    // Store generated code
    if (codeBlocks.length > 0) {
      await supabase
        .from('run_logs')
        .insert({
          run_id: runId,
          agent_name: 'Coder',
          log_level: 'info',
          message: `Generated ${codeBlocks.length} code files`,
          metadata: { code_blocks: codeBlocks },
        })
    }

    await updateAgentStatus(supabase, runId, 'Coder', 'completed', 100)
    await addLog(supabase, runId, 'success', 'Coder', 'Code generation completed')

    // Phase 3: Debugger
    await updateAgentStatus(supabase, runId, 'Debugger', 'running', 0)
    await addLog(supabase, runId, 'info', 'Debugger', 'Reviewing and debugging code...')

    const debugPrompt = `You are an expert code reviewer and debugger. Review this code:

${codeResponse.substring(0, 4000)}

Provide:
1. Code quality assessment (1-10)
2. Identified issues and bugs
3. Security concerns
4. Performance recommendations
5. Testing suggestions
6. Improvements needed

Be thorough and constructive.`

    const review = await callOpenRouter(apiKey, model, debugPrompt)
    await updateAgentStatus(supabase, runId, 'Debugger', 'completed', 100)
    await addLog(supabase, runId, 'success', 'Debugger', 'Code review completed')

    // Update run with generated code
    await supabase
      .from('runs')
      .update({
        status: 'completed',
        generated_code: codeBlocks.reduce((acc, block) => {
          const filename = block.filename || `main.${block.language === 'python' ? 'py' : 'js'}`
          acc[filename] = block.code
          return acc
        }, {} as Record<string, string>),
        updated_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
      })
      .eq('id', runId)

    await addLog(
      supabase,
      runId,
      'success',
      'System',
      '✅ Task completed successfully! Code is ready for review.'
    )

  } catch (error) {
    await supabase
      .from('runs')
      .update({
        status: 'error',
        error_message: error.message,
        updated_at: new Date().toISOString(),
      })
      .eq('id', runId)

    await addLog(supabase, runId, 'error', 'System', `Task failed: ${error.message}`)
    throw error
  }
}

async function callOpenRouter(apiKey: string, model: string, prompt: string): Promise<string> {
  const response = await fetch(`${OPENROUTER_API_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://capy-clone-like.vercel.app',
      'X-Title': 'Capy-Inspired AI Engineer Platform',
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content || ''
}

function extractCodeBlocks(text: string): Array<{ language: string; code: string; filename?: string }> {
  const codeBlocks: Array<{ language: string; code: string; filename?: string }> = []
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
  let match

  while ((match = codeBlockRegex.exec(text)) !== null) {
    const language = match[1] || 'text'
    const code = match[2].trim()
    
    // Try to extract filename from comments
    const filenameMatch = code.match(/^#\s*(?:file|filename):\s*(.+)$/mi)
    const filename = filenameMatch ? filenameMatch[1].trim() : undefined

    codeBlocks.push({ language, code, filename })
  }

  return codeBlocks
}

async function updateAgentStatus(
  supabase: any,
  runId: string,
  agentName: string,
  status: string,
  progress: number
) {
  await supabase
    .from('agent_status')
    .upsert({
      run_id: runId,
      agent_name: agentName,
      status,
      progress,
      updated_at: new Date().toISOString(),
    })
}

async function addLog(
  supabase: any,
  runId: string,
  level: string,
  agentName: string | null,
  message: string
) {
  await supabase
    .from('run_logs')
    .insert({
      run_id: runId,
      agent_name: agentName,
      log_level: level,
      message,
      created_at: new Date().toISOString(),
    })
}
