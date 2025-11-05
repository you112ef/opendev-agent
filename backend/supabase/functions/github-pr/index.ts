// Supabase Edge Function: GitHub PR Handler
// Creates and manages GitHub Pull Requests

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
      // Create GitHub PR
      const body = await req.json()
      const { run_id, repo_url, branch_name, title, description, files } = body

      // Get run details
      const { data: run, error: runError } = await supabaseClient
        .from('runs')
        .select('*')
        .eq('id', run_id)
        .eq('user_id', user.id)
        .single()

      if (runError || !run) {
        throw new Error('Run not found')
      }

      // Get user's GitHub token from auth metadata or provider
      // GitHub OAuth stores token in provider_token
      const { data: { session } } = await supabaseClient.auth.getSession()
      
      // Try to get GitHub token from provider_token or user_metadata
      let githubToken = session?.provider_token || session?.user?.user_metadata?.github_token
      
      // If not found, try to get from GitHub provider
      if (!githubToken) {
        // Get user's auth providers
        const { data: identities } = await supabaseClient.auth.getUserIdentities()
        const githubIdentity = identities?.identities?.find(
          (id: any) => id.provider === 'github'
        )
        githubToken = githubIdentity?.identity_data?.provider_token
      }

      if (!githubToken) {
        return new Response(
          JSON.stringify({ 
            error: 'GitHub token not found. Please connect GitHub account via OAuth.',
            requires_oauth: true,
          }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      // Parse repo URL
      const repoMatch = repo_url.match(/github\.com\/([^\/]+)\/([^\/]+)/)
      if (!repoMatch) {
        throw new Error('Invalid repository URL. Format: https://github.com/owner/repo')
      }
      const [, owner, repo] = repoMatch

      // Get generated code from run
      const generatedCode = run.generated_code || {}
      const codeFiles = Object.entries(generatedCode).map(([path, content]) => ({
        path,
        content: String(content),
      }))

      // Create branch first (if files provided)
      let branchName = branch_name || `ai-generated-${run.id.substring(0, 8)}`
      
      if (codeFiles.length > 0) {
        // Create or update branch with files
        const baseBranch = 'main' // or 'master'
        const createBranchResponse = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${baseBranch}`,
          {
            headers: {
              'Authorization': `Bearer ${githubToken}`,
              'Accept': 'application/vnd.github.v3+json',
            },
          }
        )

        if (createBranchResponse.ok) {
          const baseSha = await createBranchResponse.json().then((data) => data.object?.sha)
          
          // Create new branch
          await fetch(
            `https://api.github.com/repos/${owner}/${repo}/git/refs`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${githubToken}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                ref: `refs/heads/${branchName}`,
                sha: baseSha,
              }),
            }
          )

          // Create files in branch
          for (const file of codeFiles) {
            await fetch(
              `https://api.github.com/repos/${owner}/${repo}/contents/${file.path}`,
              {
                method: 'PUT',
                headers: {
                  'Authorization': `Bearer ${githubToken}`,
                  'Accept': 'application/vnd.github.v3+json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  message: `Add ${file.path} (AI-generated)`,
                  content: btoa(file.content), // Base64 encode
                  branch: branchName,
                }),
              }
            )
          }
        }
      }

      // Create GitHub PR
      const githubResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/pulls`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: title || `AI-generated: ${run.description.substring(0, 50)}`,
            body: description || `This PR was automatically generated by AI.\n\n**Task:** ${run.description}\n**Language:** ${run.language}\n**Framework:** ${run.framework}\n\n---\n\nGenerated by Capy-Inspired AI Engineer Platform`,
            head: branchName,
            base: 'main', // or 'master'
          }),
        }
      )

      if (!githubResponse.ok) {
        const errorText = await githubResponse.text()
        throw new Error(`GitHub API error: ${errorText}`)
      }

      const prData = await githubResponse.json()

      // Update run with PR information
      await supabaseClient
        .from('runs')
        .update({
          github_pr_url: prData.html_url,
          github_pr_number: prData.number,
          updated_at: new Date().toISOString(),
        })
        .eq('id', run_id)

      // Add log
      await supabaseClient.from('run_logs').insert({
        run_id,
        log_level: 'success',
        message: `✅ Pull Request created: ${prData.html_url}`,
      })

      return new Response(
        JSON.stringify({
          success: true,
          pr_url: prData.html_url,
          pr_number: prData.number,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (req.method === 'GET') {
      // Get PR status
      const url = new URL(req.url)
      const runId = url.searchParams.get('run_id')

      if (!runId) {
        return new Response(
          JSON.stringify({ error: 'run_id is required' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      const { data: run } = await supabaseClient
        .from('runs')
        .select('github_pr_url, github_pr_number')
        .eq('id', runId)
        .eq('user_id', user.id)
        .single()

      return new Response(
        JSON.stringify({ pr: run }),
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
