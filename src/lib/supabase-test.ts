import { supabase } from './supabase';

export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('_prisma_migrations').select('*').limit(1);
    
    if (error) {
      console.error('Error al conectar con Supabase:', error.message);
      return false;
    }

    console.log('Conexión exitosa con Supabase');
    return true;
  } catch (error) {
    console.error('Error al conectar con Supabase:', error);
    return false;
  }
} 