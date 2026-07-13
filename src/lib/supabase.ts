import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.https://bkejrdsacjianwksehpx.supabase.co;
const supabaseAnonKey = import.meta.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrZWpyZHNhY2ppYW53a3NlaHB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5MjQ0OTAsImV4cCI6MjA5OTUwMDQ5MH0.esgxxWr-h7bYY954lx-RklqfOFayt-k4MPkOC7k1Q3M;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase environment variables are missing. Check your .env file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);