// Supabase Edge Function: Run Handler
// Creates and manages task runs

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
      // Create new run
      const body = await req.json()
      const { description, language, framework, complexity, model_id } = body

      // Insert run
      const { data: run, error: runError } = await supabaseClient
        .from('runs')
        .insert({
          user_id: user.id,
          description,
          language,
          framework,
          complexity,
          model_id,
          status: 'pending',
        })
        .select()
        .single()

      if (runError) throw runError

      // Initialize agent statuses
      const agents = ['Architect', 'Coder', 'Debugger']
      const agentStatuses = agents.map((agent_name) => ({
        run_id: run.id,
        agent_name,
        status: 'idle',
        progress: 0,
      }))

      await supabaseClient.from('agent_status').insert(agentStatuses)

      // Add initial log
      await supabaseClient.from('run_logs').insert({
        run_id: run.id,
        log_level: 'info',
        message: `🚀 Task started: ${description.substring(0, 100)}...`,
      })

      // Trigger background job (this would be handled by Supabase cron or pg_cron)
      // For now, we'll return the run and let the client poll or use realtime

      return new Response(
        JSON.stringify({ run }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (req.method === 'GET') {
      // Get run status
      const url = new URL(req.url)
      const runId = url.searchParams.get('run_id')

      if (!runId) {
        // List all runs for user
        const { data: runs, error } = await supabaseClient
          .from('runs')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error

        return new Response(
          JSON.stringify({ runs }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      // Get specific run with logs and agent status
      const { data: run, error: runError } = await supabaseClient
        .from('runs')
        .select('*')
        .eq('id', runId)
        .eq('user_id', user.id)
        .single()

      if (runError) throw runError

      const { data: logs } = await supabaseClient
        .from('run_logs')
        .select('*')
        .eq('run_id', runId)
        .order('created_at', { ascending: true })

      const { data: agentStatuses } = await supabaseClient
        .from('agent_status')
        .select('*')
        .eq('run_id', runId)

      return new Response(
        JSON.stringify({
          run,
          logs: logs || [],
          agents: agentStatuses || [],
        }),
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
