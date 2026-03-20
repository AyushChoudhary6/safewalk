import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

// Ensure the environment variables are named exactly as you put them in your .env
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://gyjoxyguvnnvirmxdneb.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5am94eWd1dm5udmlybXhkbmViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NzE2NzksImV4cCI6MjA4OTU0NzY3OX0.dLevJBOuRlBWKjCUxAbp1h5p0n5VlyeUaF99FEhRdLw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
