import { History, Plus, Save, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { defaultProof, todayIso } from "../lib/defaults";
import { deleteProofHistory, listProofHistory, saveProofHistory } from "../lib/proofHistory";
import { useProofStore } from "../store/useProofStore";

const formatSavedAt = (value) =>
  new Date(value).toLocaleString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });

const getProofThumbnail = (proof) =>
  [...(proof.artwork || []), ...(proof.sitePhotos || [])].find((item) => item.selected)?.dataUrl || "";

export default function HistorySidebar({ open, onClose }) {
  const proof = useProofStore((state) => state.proof);
  const loadProof = useProofStore((state) => state.loadProof);
  const [entries, setEntries] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setStatus("loading");
    setError("");
    try {
      setEntries(await listProofHistory());
      setStatus("idle");
    } catch (historyError) {
      setError(historyError.message || "History could not be loaded.");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    if (open) refresh();
  }, [open, refresh]);

  if (!open) return null;

  const saveCurrent = async () => {
    if (!proof.clientName || !proof.jobNumber) return;
    setStatus("saving");
    try {
      const entry = await saveProofHistory(proof);
      loadProof(entry.proof);
      await refresh();
    } catch (historyError) {
      setError(historyError.message || "Proof could not be saved.");
      setStatus("error");
    }
  };

  const startSubProof = (entry) => {
    loadProof({
      ...defaultProof,
      currentDate: todayIso(),
      clientName: entry.proof.clientName,
      jobNumber: entry.proof.jobNumber,
      historyGroupId: entry.groupId || entry.id,
      historyParentId: entry.id
    });
    onClose();
  };

  const removeEntry = async (entry) => {
    if (!window.confirm(`Delete proof ${entry.jobNumber} ${entry.revisionNumber || ""}?`)) return;
    await deleteProofHistory(entry.id);
    await refresh();
  };

  return (
    <div className="fixed inset-0 z-40 bg-slate-950/35" onMouseDown={onClose}>
      <aside
        className="ml-auto flex h-full w-full max-w-sm flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-800">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-extrabold text-slate-950 dark:text-white">
              <History className="h-5 w-5" /> Proof History
            </h2>
            <p className="mt-1 text-xs text-slate-500">Saved in this browser.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900" aria-label="Close history">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="border-b border-slate-200 p-4 dark:border-slate-800">
          <button
            type="button"
            disabled={!proof.clientName || !proof.jobNumber || status === "saving"}
            onClick={saveCurrent}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-slate-950"
          >
            <Save className="h-4 w-4" /> {status === "saving" ? "Saving..." : "Save current proof"}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {error && <p className="mb-3 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
          {status === "loading" && <p className="text-sm text-slate-500">Loading history...</p>}
          {status !== "loading" && entries.length === 0 && (
            <p className="rounded-lg border border-dashed border-slate-300 p-5 text-center text-sm text-slate-500 dark:border-slate-700">Generated and manually saved proofs will appear here.</p>
          )}
          <div className="grid gap-3">
            {entries.map((entry) => (
              <article key={entry.id} className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                <div className="flex items-start gap-3">
                  <div className="artwork-checkerboard flex h-16 w-14 shrink-0 items-center justify-center overflow-hidden rounded border border-slate-300 dark:border-slate-700">
                    {getProofThumbnail(entry.proof) ? (
                      <img src={getProofThumbnail(entry.proof)} alt="" className="h-full w-full object-contain" />
                    ) : (
                      <span className="px-1 text-center text-[9px] font-bold uppercase text-slate-400">No image</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold text-slate-900 dark:text-white">{entry.clientName}</p>
                    <p className="mt-0.5 text-xs font-semibold text-slate-600 dark:text-slate-300">Job {entry.jobNumber} {entry.revisionNumber ? `- ${entry.revisionNumber}` : ""}</p>
                    <p className="mt-1 text-[11px] text-slate-400">{formatSavedAt(entry.updatedAt)}</p>
                  </div>
                  {entry.parentId && <span className="ml-auto rounded bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase text-slate-500 dark:bg-slate-900">Sub-proof</span>}
                </div>
                <div className="mt-3 grid grid-cols-[1fr_1fr_auto] gap-2">
                  <button type="button" onClick={() => { loadProof(entry.proof); onClose(); }} className="rounded-lg border border-slate-200 px-2 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900">Open</button>
                  <button type="button" onClick={() => startSubProof(entry)} className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 px-2 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"><Plus className="h-3.5 w-3.5" /> New sub-proof</button>
                  <button type="button" onClick={() => removeEntry(entry)} className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10" aria-label="Delete proof"><Trash2 className="h-4 w-4" /></button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
