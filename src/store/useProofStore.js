import { create } from "zustand";
import { persist } from "zustand/middleware";
import { defaultProof, defaultSettings, todayIso } from "../lib/defaults";

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
      proof: { ...defaultProof, currentDate: todayIso() },
      settings: defaultSettings,
      darkMode: false,
      setProofField: (field, value) =>
        set((state) => ({ proof: { ...state.proof, [field]: value } })),
      setSettings: (patch) =>
        set((state) => ({ settings: { ...state.settings, ...patch } })),
      setDarkMode: (darkMode) => set({ darkMode }),
      addUploads: (key, uploads) =>
        set((state) => ({
          proof: { ...state.proof, [key]: [...state.proof[key], ...uploads] }
        })),
      removeUpload: (key, id) =>
        set((state) => ({
          proof: {
            ...state.proof,
            [key]: state.proof[key].filter((item) => item.id !== id)
          }
        })),
      toggleUpload: (key, id) =>
        set((state) => ({
          proof: {
            ...state.proof,
            [key]: state.proof[key].map((item) =>
              item.id === id ? { ...item, selected: !item.selected } : item
            )
          }
        })),
      reorderUpload: (key, fromId, toId) =>
        set((state) => ({
          proof: { ...state.proof, [key]: reorder(state.proof[key], fromId, toId) }
        })),
      resetDraft: () => set({ proof: { ...defaultProof, currentDate: todayIso() } })
    }),
    {
      name: "jigsaw-artwork-proof-draft",
      version: 2,
      migrate: (persisted) => ({
        ...persisted,
        settings: { ...defaultSettings, ...persisted?.settings },
        proof: {
          ...defaultProof,
          currentDate: persisted?.proof?.currentDate || todayIso(),
          ...persisted?.proof
        }
      })
    }
  )
);
