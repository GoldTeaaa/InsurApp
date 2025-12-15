import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabasePubKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabasePubKey) {
    throw new Error("Missing public Supabase URL or Public Key")
}

export const supabase = createBrowserClient(supabaseUrl, supabasePubKey)

export const getSession = async () => {
    const {
        data: { session },
    } = await supabase.auth.getSession()
    return session
}