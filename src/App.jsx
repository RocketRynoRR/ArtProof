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

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className="app-shell min-h-screen bg-slate-50 text-ink transition dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-white px-4 pb-9 pt-8 text-center dark:border-slate-800 dark:bg-slate-950 sm:px-6">
        <div className="mx-auto mb-2 flex max-w-[1880px] justify-end">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {darkMode ? "Light" : "Dark"}
          </button>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-[42px]">
          Artwork Proof Generator
        </h1>
        <p className="mt-3 text-base font-medium text-slate-500 dark:text-slate-400">
          Create professional PDF proofs with client approval
        </p>
      </header>

      <main className="mx-auto flex max-w-[1880px] flex-col gap-8 px-4 py-2 pb-8 sm:px-4 lg:flex-row">
        <Sidebar onOpenSettings={() => setSettingsOpen(true)} />
        <Preview />
      </main>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
