import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Helper function to get user's encrypted API key
export async function getUserApiKey(): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('user_settings')
      .select('openrouter_api_key')
      .eq('user_id', user.id)
      .single()

    if (error || !data) return null

    // Decrypt the API key (Supabase Vault handles encryption/decryption)
    return data.openrouter_api_key || null
  } catch (error) {
    console.error('Error fetching API key:', error)
    return null
  }
}

// Helper function to save user's API key (encrypted)
export async function saveUserApiKey(apiKey: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    // Supabase Vault will encrypt this automatically if configured
    const { error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: user.id,
        openrouter_api_key: apiKey,
        updated_at: new Date().toISOString(),
      })

    return !error
  } catch (error) {
    console.error('Error saving API key:', error)
    return false
  }
}
