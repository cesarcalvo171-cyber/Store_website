import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jtwauicxroxtgseqdhpn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0d2F1aWN4cm94dGdzZXFkaHBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5MjU3NjAsImV4cCI6MjEwMDUwMTc2MH0.T6JWMrTpcy5ljfq9ZFKnAV3vaFZcOqoOIsKlADEvczo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
