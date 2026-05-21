import { getSupabase } from './supabase';

// Helper functions for storing data in Supabase

/**
 * Stores or updates user data in Supabase
 */
export async function storeUserData(userId: string, data: any) {
  const supabase = getSupabase();
  const { data: result, error } = await supabase
    .from('users')
    .upsert({ 
      id: userId, 
      ...data,
      updated_at: new Date().toISOString()
    });
    
  if (error) throw error;
  return result;
}

/**
 * Stores a general entry / document
 */
export async function storeEntry(userId: string, title: string, content: string, type: string = 'note') {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('entries')
    .insert([
      { user_id: userId, title, content, type }
    ]);
    
  if (error) throw error;
  return data;
}

/**
 * Registers a new custom table definition
 */
export async function storeCustomTable(userId: string, tableName: string, schemaDefinition: any) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('user_tables')
    .insert([
      { user_id: userId, name: tableName, schema: schemaDefinition }
    ]);
    
  if (error) throw error;
  return data;
}

/**
 * Stores a record into a custom table structure
 */
export async function storeTableRecord(tableId: string, recordData: any) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('table_records')
    .insert([
      { table_id: tableId, data: recordData }
    ]);
    
  if (error) throw error;
  return data;
}

/**
 * Retrieves all user entries
 */
export async function getUserEntries(userId: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
}
