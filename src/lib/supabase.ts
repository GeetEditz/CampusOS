import { createClient } from '@supabase/supabase-js';

// If running server-side, override DNS server to bypass stale local router caches
if (typeof window === 'undefined') {
  try {
    const dns = require('dns');
    dns.setServers(['1.1.1.1', '8.8.8.8']);
    console.log('[Supabase DNS Override] 🌐 Programmatically configured Node.js server DNS to use Cloudflare and Google Public DNS!');
  } catch (err) {
    console.warn('[Supabase DNS Override] ⚠️ Failed to set server-side DNS override:', err);
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create client only if environment variables exist, otherwise we fallback to local storage emulation
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseConfigured = (): boolean => {
  return !!supabase;
};
