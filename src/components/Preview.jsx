import { Minus, Plus } from "lucide-react";
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
    <section className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white shadow-panel dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-col gap-4 p-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Preview</h2>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 dark:bg-slate-950">
          <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setZoom((z) => clamp(z - 5))} aria-label="Zoom out">
            <Minus className="h-4 w-4" />
          </button>
          <input
            type="range"
            min="35"
            max="125"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-32 accent-slate-950 dark:accent-slate-100"
          />
          <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setZoom((z) => clamp(z + 5))} aria-label="Zoom in">
            <Plus className="h-4 w-4" />
          </button>
          <span className="w-12 text-right text-sm font-bold text-slate-700 dark:text-slate-200">{zoom}%</span>
        </div>
      </div>
      <div className="h-[calc(100vh-212px)] overflow-auto rounded-b-2xl bg-slate-50 p-8 pb-14 dark:bg-slate-900 lg:h-[calc(100vh-190px)]">
        <div className="mx-auto w-fit origin-top transition-transform" style={{ transform: `scale(${zoom / 100})` }}>
          <A4Proof />
        </div>
      </div>
    </section>
  );
}
