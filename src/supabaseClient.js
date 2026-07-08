import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://TU_NUEVO_PROYECTO.supabase.co';
const supabaseAnonKey = 'TU_NUEVA_CLAVE_ANON';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
