import { Minus, Plus, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import A4Proof from "./A4Proof";
import { useProofStore } from "../store/useProofStore";

const clamp = (value) => Math.min(125, Math.max(35, value));

export default function Preview() {
  const defaultZoom = useProofStore((state) => state.settings.defaultZoom);
  const [zoom, setZoom] = useState(clamp(defaultZoom));

  useEffect(() => {
    setZoom(clamp(defaultZoom));
  }, [defaultZoom]);

  return (
    <section className="min-w-0 flex-1 rounded-3xl border border-white/70 bg-white/80 shadow-panel backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="flex flex-col gap-4 border-b border-slate-200 p-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Live A4 Preview</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Preview mirrors the final PDF layout and selected files.</p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-900">
          <button className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setZoom((z) => clamp(z - 5))} aria-label="Zoom out">
            <Minus className="h-4 w-4" />
          </button>
          <input
            type="range"
            min="35"
            max="125"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-28 accent-brand-600"
          />
          <button className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setZoom((z) => clamp(z + 5))} aria-label="Zoom in">
            <Plus className="h-4 w-4" />
          </button>
          <button className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setZoom(defaultZoom)} aria-label="Reset zoom">
            <RotateCcw className="h-4 w-4" />
          </button>
          <span className="w-12 text-right text-sm font-bold text-slate-700 dark:text-slate-200">{zoom}%</span>
        </div>
      </div>
      <div className="h-[calc(100vh-218px)] min-h-[720px] overflow-auto bg-[linear-gradient(45deg,#eef2f7_25%,transparent_25%),linear-gradient(-45deg,#eef2f7_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#eef2f7_75%),linear-gradient(-45deg,transparent_75%,#eef2f7_75%)] bg-[length:28px_28px] bg-[position:0_0,0_14px,14px_-14px,-14px_0px] p-8 dark:bg-slate-900">
        <div className="mx-auto w-fit origin-top transition-transform" style={{ transform: `scale(${zoom / 100})` }}>
          <A4Proof />
        </div>
      </div>
    </section>
  );
}
