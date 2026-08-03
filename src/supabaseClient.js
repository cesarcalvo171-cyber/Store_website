import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zpnezcgsfmxrvqereeiy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwbmV6Y2dzZm14cnZxZXJlZWl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3NzQyNDEsImV4cCI6MjEwMTM1MDI0MX0.kJdEy3ZJCQdPHclKG6Fs-PI3RVjqOBAh3Y-8Td0jlvg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
