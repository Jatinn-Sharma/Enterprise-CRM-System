import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ghazgszpzmpryxhveove.supabase.co';
const supabaseKey = 'sb_publishable_foEz1uNtMRIGvt_Rnh0LyA_lYxF8fZW';
export const supabase = createClient(supabaseUrl, supabaseKey);
