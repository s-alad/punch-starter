import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

console.log("SUPABASE URL", supabaseUrl)
console.log("SUPABASE ANON KEY", supabaseAnonKey)

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function createclient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}
export default supabase;
