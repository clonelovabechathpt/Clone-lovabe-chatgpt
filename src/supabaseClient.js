import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wkmmnsooycwefsibqofy.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrbW1uc29veWN3ZWZzaWJxb2Z5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwNDEyODEsImV4cCI6MjEwNTYxNzI4MX0.FInMO8ddEiOh1CqNCtUh23O_-3eeFTkmUO6-8XwxYKs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
