import { Settings, Sparkles } from "lucide-react";
import UploadSection from "./UploadSection";
import { useProofStore } from "../store/useProofStore";
import { generateProofPdf } from "../lib/pdf";

const noteLines = (value) => value.split(/\r?\n/).slice(0, 5).join("\n");

export default function Sidebar({ onOpenSettings }) {
  const proof = useProofStore((state) => state.proof);
  const settings = useProofStore((state) => state.settings);
  const setProofField = useProofStore((state) => state.setProofField);
  const canGenerate = proof.clientName && proof.jobNumber && proof.revisionNumber;

  return (
    <aside className="flex w-full flex-col gap-5 rounded-3xl border border-white/70 bg-white/90 p-5 shadow-panel backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 lg:w-[380px] lg:shrink-0">
      <div className="grid gap-4">
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
            className="input min-h-[116px] resize-none"
            value={proof.notes}
            maxLength={520}
            onChange={(e) => setProofField("notes", noteLines(e.target.value))}
            placeholder="Add any notes or special instructions (max 5 lines)..."
          />
          <span className="text-right text-xs text-slate-400">{proof.notes.length}/520</span>
        </label>
      </div>

      <UploadSection title="Artwork Image Upload *" storageKey="artwork" helper="Primary proof artwork. Drag thumbnails to reorder." />
      <UploadSection title="Item Photos" storageKey="itemPhotos" helper="Optional product or item reference photos." />
      <UploadSection title="Site / Location Photos" storageKey="sitePhotos" helper="Optional installation or location context." />

      <div className="sticky bottom-0 -mx-5 mt-auto grid grid-cols-[auto_1fr] gap-3 border-t border-slate-200 bg-white/95 p-5 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 lg:static lg:m-0 lg:border-0 lg:bg-transparent lg:p-0">
        <button
          type="button"
          onClick={onOpenSettings}
          className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-brand-200 hover:text-brand-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          <Settings className="h-4 w-4" />
        </button>
        <button
          type="button"
          disabled={!canGenerate}
          onClick={() => generateProofPdf(proof, settings)}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
        >
          <Sparkles className="h-4 w-4" />
          Generate PDF
        </button>
      </div>
    </aside>
  );
}
