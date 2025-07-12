
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sxittmcrlxoncqoxtswn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4aXR0bWNybHhvbmNxb3h0c3duIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMDM1MjMsImV4cCI6MjA2NjU3OTUyM30.wO2j_NM_b-QLVgV-JN5PjBs6P0Lkt1QnVY4TJhG9SFA'

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
})
