import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import Sidebar from "./components/Sidebar";
import Preview from "./components/Preview";
import SettingsModal from "./components/SettingsModal";
import { useProofStore } from "./store/useProofStore";

export default function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const darkMode = useProofStore((state) => state.darkMode);
  const setDarkMode = useProofStore((state) => state.setDarkMode);
  const resetDraft = useProofStore((state) => state.resetDraft);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    resetDraft();
  }, [resetDraft]);

  return (
    <div className="app-shell h-screen overflow-hidden bg-slate-50 text-ink transition dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-white px-4 py-3 text-center dark:border-slate-800 dark:bg-slate-950 sm:px-6">
        <div className="mx-auto flex max-w-[1880px] items-center justify-between gap-4">
          <div className="hidden w-24 sm:block" />
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
              Artwork Proof Generator
            </h1>
            <p className="mt-1 hidden text-sm font-medium text-slate-500 dark:text-slate-400 sm:block">
              Create professional PDF proofs with client approval
            </p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="inline-flex w-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 sm:w-24"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span className="hidden sm:inline">{darkMode ? "Light" : "Dark"}</span>
          </button>
        </div>
      </header>

      <main className="mx-auto flex h-[calc(100vh-108px)] max-w-[1880px] flex-col gap-5 overflow-hidden px-4 pb-4 pt-4 sm:px-4 lg:flex-row">
        <Sidebar onOpenSettings={() => setSettingsOpen(true)} />
        <Preview />
      </main>

      <footer className="border-t border-slate-200 bg-white px-4 py-2 text-center text-xs font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
        Jigsaw Signs & Print - Artwork Proof Generator
      </footer>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
