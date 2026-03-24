import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ?? 'https://jyysrmnctnetsverepoz.supabase.co'
const supabaseKey =
  import.meta.env.VITE_SUPABASE_KEY ?? 'sb_publishable_AWnBfdqhYbFlv0GK9LymZQ_tBZ1m8VV'

export const supabase = createClient(supabaseUrl, supabaseKey)