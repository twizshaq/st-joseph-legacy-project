// lib/supabaseClient.js
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'

// Note: The `createPagesBrowserClient` is for the Next.js `pages` directory.
// If you are using the `app` directory, you should use `createBrowserClient` from `@supabase/ssr`.
export const supabase = createPagesBrowserClient()