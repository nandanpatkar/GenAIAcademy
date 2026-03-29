import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://twcsujjshudwgpihkwyz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3Y3N1ampzaHVkd2dwaWhrd3l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3NjQ4MTcsImV4cCI6MjA5MDM0MDgxN30.mG65e8fpfquKR8r_GjK_IxSDKPnW6ij80nT_Fknyq80';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
