import { defaultSettings } from "./defaults";
import { isSupabaseConfigured, supabase } from "./supabase";

const SETTINGS_ID = "default";
const TABLE = "proof_app_settings";

export async function loadCloudSettings() {
  if (!isSupabaseConfigured) {
    return { settings: null, skipped: true };
  }

  const { data, error } = await supabase
    .from(TABLE)
    .select("settings")
    .eq("id", SETTINGS_ID)
    .maybeSingle();

  if (error) throw error;

  return {
    settings: data?.settings ? { ...defaultSettings, ...data.settings } : null,
    skipped: false
  };
}

export async function saveCloudSettings(settings) {
  if (!isSupabaseConfigured) {
    return { skipped: true };
  }

  const { error } = await supabase.from(TABLE).upsert({
    id: SETTINGS_ID,
    settings,
    updated_at: new Date().toISOString()
  });

  if (error) throw error;
  return { skipped: false };
}
