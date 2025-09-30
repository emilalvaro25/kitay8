/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { createClient } from '@supabase/supabase-js';

// Prioritize environment variables for configuration, but use the provided
// values as a fallback if they are not set in the environment.
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY);
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://csewoobligshhknqmvgc.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzZXdvb2JsaWdzaGhrbnFtdmdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2MTI4ODEsImV4cCI6MjA3MzE4ODg4MX0.AJkGs1KK7GgMMoBzoIBzbwQMJNpXeixj1evmlLM1xhFA';


// Ensure the variables are not empty
if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or Key is missing!');
  throw new Error('Supabase URL or Key is missing.');
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);
