// Supabase Edge Function: OpenRouter Proxy
// Handles chat completions through OpenRouter

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

    // Get user's API key from settings
    const { data: settings } = await supabaseClient
      .from('user_settings')
      .select('openrouter_api_key')
      .eq('user_id', user.id)
      .single()

    if (!settings?.openrouter_api_key) {
      return new Response(
        JSON.stringify({ error: 'OpenRouter API key not configured' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const body = await req.json()
    const { model, messages, stream = false, ...otherParams } = body

    // Proxy request to OpenRouter
    const openrouterResponse = await fetch(
      `${OPENROUTER_API_URL}/chat/completions`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${settings.openrouter_api_key}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': req.headers.get('referer') || 'https://capy-clone-like.vercel.app',
          'X-Title': 'Capy-Inspired AI Engineer Platform',
        },
        body: JSON.stringify({
          model,
          messages,
          stream,
          ...otherParams,
        }),
      }
    )

    if (!openrouterResponse.ok) {
      const errorText = await openrouterResponse.text()
      return new Response(
        JSON.stringify({ 
          error: 'OpenRouter API error',
          details: errorText,
        }),
        {
          status: openrouterResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Handle streaming response
    if (stream) {
      return new Response(openrouterResponse.body, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      })
    }

    const data = await openrouterResponse.json()
    return new Response(
      JSON.stringify(data),
      {
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
