import {createClient} from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabasePubKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabasePubKey) {
    throw new Error("Missing public Supabase URL or Public Key")
}

export const supabase = createClient(supabaseUrl, supabasePubKey)