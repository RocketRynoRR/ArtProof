import { Download, RotateCcw, Settings } from "lucide-react";
import UploadSection from "./UploadSection";
import { useProofStore } from "../store/useProofStore";
import { generateProofPdf } from "../lib/pdf";

const noteLines = (value) => value.split(/\r?\n/).slice(0, 5).join("\n");

export default function Sidebar({ onOpenSettings }) {
  const proof = useProofStore((state) => state.proof);
  const settings = useProofStore((state) => state.settings);
  const setProofField = useProofStore((state) => state.setProofField);
  const resetDraft = useProofStore((state) => state.resetDraft);
  const canGenerate = proof.clientName && proof.jobNumber && proof.revisionNumber;

  return (
    <aside className="flex w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-panel dark:border-slate-800 dark:bg-slate-950 lg:w-[430px] lg:shrink-0">
      <div className="grid flex-1 gap-4 overflow-y-auto p-5">
        <label className="grid gap-1.5">
          <span className="field-label">Client Name *</span>
          <input className="input" value={proof.clientName} onChange={(e) => setProofField("clientName", e.target.value)} placeholder="Enter client name" />
        </label>
        <label className="grid gap-1.5">
          <span className="field-label">Job Number *</span>
          <input className="input" value={proof.jobNumber} onChange={(e) => setProofField("jobNumber", e.target.value)} placeholder="Enter job number" />
        </label>
        <label className="grid gap-1.5">
          <span className="field-label">Current Date</span>
          <input type="date" className="input" value={proof.currentDate} onChange={(e) => setProofField("currentDate", e.target.value)} />
        </label>
        <label className="grid gap-1.5">
          <span className="field-label">Revision Number *</span>
          <input className="input" value={proof.revisionNumber} onChange={(e) => setProofField("revisionNumber", e.target.value)} placeholder="e.g. v1.0, Rev 2" />
        </label>
        <label className="grid gap-1.5">
          <span className="field-label">Notes</span>
          <textarea
            className="input min-h-[98px] resize-none"
            value={proof.notes}
            maxLength={520}
            onChange={(e) => setProofField("notes", noteLines(e.target.value))}
            placeholder="Add any notes or special instructions (max 5 lines)..."
          />
          <span className="text-right text-xs text-slate-500">{proof.notes.length}/520 - Max 5 lines</span>
        </label>

        <UploadSection title="Artwork Images (JPEG/PNG) *" storageKey="artwork" helper="Each selected image will generate its own PDF page." />
        <UploadSection title="Site / Location Photos" storageKey="sitePhotos" helper="Optional install/location context. Selected photos also get their own pages." />
      </div>

      <div className="grid grid-cols-[auto_auto_1fr] gap-3 border-t border-slate-200 bg-white/95 p-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Clear all proof details and uploaded images?")) {
              resetDraft();
            }
          }}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          aria-label="Clear proof"
          title="Clear proof"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onOpenSettings}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">Settings</span>
        </button>
        <button
          type="button"
          disabled={!canGenerate}
          onClick={() => generateProofPdf(proof, settings)}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#e7b45e] bg-[#f8c983] px-5 py-3 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-[#f3be70] disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
        >
          <Download className="h-4 w-4" />
          Generate PDF
        </button>
      </div>
    </aside>
  );
}
