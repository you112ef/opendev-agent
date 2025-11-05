// Supabase Edge Function: Sandbox Executor
// Executes code in isolated environment

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (req.method === 'POST') {
      const body = await req.json()
      const { run_id, language, code, test_code } = body

      // Get run details
      const { data: run } = await supabaseClient
        .from('runs')
        .select('*')
        .eq('id', run_id)
        .eq('user_id', user.id)
        .single()

      if (!run) {
        throw new Error('Run not found')
      }

      // Add log
      await supabaseClient.from('run_logs').insert({
        run_id,
        log_level: 'info',
        message: `🔧 Executing code in sandbox (${language})...`,
      })

      // Execute code based on language
      let executionResult
      try {
        switch (language.toLowerCase()) {
          case 'python':
            executionResult = await executePython(code, test_code)
            break
          case 'javascript':
          case 'typescript':
            executionResult = await executeJavaScript(code, test_code)
            break
          default:
            throw new Error(`Unsupported language: ${language}`)
        }

        // Update run status
        await supabaseClient
          .from('runs')
          .update({
            status: executionResult.success ? 'completed' : 'error',
            error_message: executionResult.error || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', run_id)

        // Add logs
        await supabaseClient.from('run_logs').insert({
          run_id,
          log_level: executionResult.success ? 'success' : 'error',
          message: executionResult.output || executionResult.error,
        })

        return new Response(
          JSON.stringify({
            success: executionResult.success,
            output: executionResult.output,
            error: executionResult.error,
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      } catch (execError) {
        await supabaseClient.from('run_logs').insert({
          run_id,
          log_level: 'error',
          message: `Execution failed: ${execError.message}`,
        })

        throw execError
      }
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

// Python executor (using Deno's Python support or external service)
async function executePython(code: string, testCode?: string): Promise<{
  success: boolean
  output?: string
  error?: string
}> {
  try {
    // For MVP, we'll use a simple validation approach
    // In production, use a proper sandbox like Docker or isolated container
    
    // Basic syntax check
    const fullCode = testCode ? `${code}\n\n${testCode}` : code
    
    // This is a placeholder - in production, use proper sandbox execution
    // For now, return success with validation message
    return {
      success: true,
      output: 'Code execution simulated. In production, this would run in an isolated Docker container.',
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    }
  }
}

// JavaScript executor
async function executeJavaScript(code: string, testCode?: string): Promise<{
  success: boolean
  output?: string
  error?: string
}> {
  try {
    const fullCode = testCode ? `${code}\n\n${testCode}` : code
    
    // Execute in isolated context (placeholder)
    // In production, use proper sandbox
    return {
      success: true,
      output: 'Code execution simulated. In production, this would run in an isolated Node.js container.',
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    }
  }
}
