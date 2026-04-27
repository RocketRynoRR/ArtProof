import { create } from "zustand";
import { persist } from "zustand/middleware";
import { defaultProof, defaultSettings, todayIso } from "../lib/defaults";
import { isSupabaseConfigured } from "../lib/supabase";
import { loadCloudSettings, saveCloudSettings } from "../lib/settingsCloud";

const mergeProof = (proof = {}) => ({
  ...defaultProof,
  ...proof,
  currentDate: proof.currentDate || todayIso(),
  artwork: Array.isArray(proof.artwork) ? proof.artwork : [],
  itemPhotos: Array.isArray(proof.itemPhotos) ? proof.itemPhotos : [],
  sitePhotos: Array.isArray(proof.sitePhotos) ? proof.sitePhotos : []
});

const mergeSettings = (settings = {}) => ({ ...defaultSettings, ...settings });

const reorder = (items, fromId, toId) => {
  const from = items.findIndex((item) => item.id === fromId);
  const to = items.findIndex((item) => item.id === toId);
  if (from < 0 || to < 0 || from === to) return items;
  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
};

export const useProofStore = create(
  persist(
    (set) => ({
      proof: mergeProof(),
      settings: mergeSettings(),
      darkMode: false,
      settingsSyncStatus: isSupabaseConfigured ? "ready" : "not-configured",
      settingsSyncError: "",
      setProofField: (field, value) =>
        set((state) => ({ proof: { ...state.proof, [field]: value } })),
      setSettings: (patch) =>
        set((state) => ({ settings: { ...state.settings, ...patch } })),
      setDarkMode: (darkMode) => set({ darkMode }),
      loadSettingsFromCloud: async () => {
        set({ settingsSyncStatus: "loading", settingsSyncError: "" });
        try {
          const result = await loadCloudSettings();
          if (result.skipped) {
            set({ settingsSyncStatus: "not-configured" });
            return;
          }
          set((state) => ({
            settings: result.settings ? mergeSettings(result.settings) : state.settings,
            settingsSyncStatus: result.settings ? "loaded" : "empty"
          }));
        } catch (error) {
          set({ settingsSyncStatus: "error", settingsSyncError: error.message });
        }
      },
      saveSettingsToCloud: async () => {
        set({ settingsSyncStatus: "saving", settingsSyncError: "" });
        try {
          const settings = useProofStore.getState().settings;
          const result = await saveCloudSettings(settings);
          set({ settingsSyncStatus: result.skipped ? "not-configured" : "saved" });
        } catch (error) {
          set({ settingsSyncStatus: "error", settingsSyncError: error.message });
        }
      },
      addUploads: (key, uploads) =>
        set((state) => ({
          proof: { ...mergeProof(state.proof), [key]: [...(state.proof[key] || []), ...uploads] }
        })),
      removeUpload: (key, id) =>
        set((state) => ({
          proof: {
            ...state.proof,
            [key]: (state.proof[key] || []).filter((item) => item.id !== id)
          }
        })),
      toggleUpload: (key, id) =>
        set((state) => ({
          proof: {
            ...state.proof,
            [key]: (state.proof[key] || []).map((item) =>
              item.id === id ? { ...item, selected: !item.selected } : item
            )
          }
        })),
      reorderUpload: (key, fromId, toId) =>
        set((state) => ({
          proof: { ...mergeProof(state.proof), [key]: reorder(state.proof[key] || [], fromId, toId) }
        })),
      resetDraft: () => set({ proof: { ...defaultProof, currentDate: todayIso() } })
    }),
    {
      name: "jigsaw-artwork-proof-draft",
      version: 2,
      merge: (persisted, current) => ({
        ...current,
        ...(persisted || {}),
        settings: mergeSettings(persisted?.settings),
        proof: mergeProof(persisted?.proof)
      }),
      migrate: (persisted) => ({
        ...persisted,
        settings: mergeSettings(persisted?.settings),
        proof: mergeProof(persisted?.proof)
      })
    }
  )
);
