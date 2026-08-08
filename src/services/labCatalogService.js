import { supabase } from "../config/supabaseClient";

const LAB_COLUMNS = "id, title, description, category, html_code, created_by, created_at, updated_at";

export async function listSharedLabs() {
  const { data, error } = await supabase
    .from("shared_labs")
    .select(LAB_COLUMNS)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createSharedLab(userId, values) {
  const { data, error } = await supabase
    .from("shared_labs")
    .insert({ ...values, created_by: userId })
    .select(LAB_COLUMNS)
    .single();
  if (error) throw error;
  return data;
}

export async function updateSharedLab(id, values) {
  const { data, error } = await supabase
    .from("shared_labs")
    .update({ ...values, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select(LAB_COLUMNS)
    .single();
  if (error) throw error;
  return data;
}

export async function deleteSharedLab(id) {
  const { error } = await supabase.from("shared_labs").delete().eq("id", id);
  if (error) throw error;
}
