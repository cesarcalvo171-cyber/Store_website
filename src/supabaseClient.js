import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fldcsbnxgrsihyltljhh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsZGNzYm54Z3JzaWh5bHRsamhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxNTU2NjUsImV4cCI6MjA5NzczMTY2NX0.Dmm0VdP5TnqOqR-U7DOyGm1lmWDJ8JSYsfCorzhoOZQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
