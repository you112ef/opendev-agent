// Supabase Edge Function: OpenRouter Models Discovery
// Deploy this function via Supabase Dashboard

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get authenticated user (optional - can work without auth for public models)
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization') || '' },
        },
      }
    )

    // Try to get user, but don't fail if not authenticated
    let user = null
    try {
      const { data: { user: authUser } } = await supabaseClient.auth.getUser()
      user = authUser
    } catch {
      // Allow public access to models list
    }

    // Fetch ALL models from OpenRouter API
    const response = await fetch(`${OPENROUTER_API_URL}/models`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`)
    }

    const data = await response.json()
    const allModels = data.data || []

    // Sort models by name
    const sortedModels = allModels.sort((a: any, b: any) => {
      const nameA = (a.name || a.id || '').toLowerCase()
      const nameB = (b.name || b.id || '').toLowerCase()
      return nameA.localeCompare(nameB)
    })

    return new Response(
      JSON.stringify({
        models: sortedModels,
        count: sortedModels.length,
        total: sortedModels.length,
        message: `Found ${sortedModels.length} models from OpenRouter`,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: error.message,
        models: [],
        count: 0,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
