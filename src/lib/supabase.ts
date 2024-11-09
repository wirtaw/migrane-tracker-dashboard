import { createClient } from '@supabase/supabase-js';

import { env } from '../config/env';

const options = {
  db: {
    schema: 'public',
  },
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: { 'x-app-header': 'migrane-tracker-app' },
  },
};

export const supabase =
  env.SUPBASE_URL && env.SUPBASE_KEY
    ? createClient(env.SUPBASE_URL, env.SUPBASE_KEY, options)
    : null;
