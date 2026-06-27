import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, GripVertical, ImagePlus, Loader2, Trash2 } from "lucide-react";
import { makeUpload } from "../lib/files";
import { rasterizePdf } from "../lib/pdfRasterize";
import { useProofStore } from "../store/useProofStore";

export default function UploadSection({ title, storageKey, helper, acceptPdf = false }) {
  const items = useProofStore((state) => state.proof[storageKey] || []);
  const addUploads = useProofStore((state) => state.addUploads);
  const removeUpload = useProofStore((state) => state.removeUpload);
  const toggleUpload = useProofStore((state) => state.toggleUpload);
  const updateUpload = useProofStore((state) => state.updateUpload);
  const reorderUpload = useProofStore((state) => state.reorderUpload);
  const [dragId, setDragId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const onDrop = useCallback(
    async (files) => {
      setIsProcessing(true);
      setUploadError("");
      try {
        const groups = await Promise.all(
          files.map((file) =>
            file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
              ? rasterizePdf(file, storageKey)
              : makeUpload(file, storageKey).then((upload) => [upload])
          )
        );
        addUploads(storageKey, groups.flat());
      } catch (error) {
        setUploadError(error.message || "This file could not be processed.");
      } finally {
        setIsProcessing(false);
      }
    },
    [addUploads, storageKey]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      ...(acceptPdf ? { "application/pdf": [".pdf"] } : {})
    },
    multiple: true
  });

  return (
    <section className="space-y-3">
      <div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">{helper}</p>
      </div>
      <div
        {...getRootProps()}
        className={`rounded-lg border border-dashed p-6 text-center transition ${
          isDragActive
            ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10"
            : "border-slate-300 bg-slate-50 hover:border-brand-400 dark:border-slate-700 dark:bg-slate-900/80"
        }`}
      >
        <input {...getInputProps()} />
        {isProcessing ? <Loader2 className="mx-auto h-8 w-8 animate-spin text-slate-400" /> : acceptPdf ? <FileText className="mx-auto h-8 w-8 text-slate-400" /> : <ImagePlus className="mx-auto h-8 w-8 text-slate-400" />}
        <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
          {isProcessing ? "Rasterizing file..." : "Drag & drop or click to upload"}
        </p>
        <p className="text-xs font-medium text-slate-500">Supports JPG, PNG{acceptPdf ? ", PDF" : ""} - Multiple files allowed</p>
      </div>
      {uploadError && <p className="text-xs font-semibold text-rose-600">{uploadError}</p>}

      {items.length > 0 && (
        <div className="grid gap-2">
          {items.map((item) => (
            <article
              key={item.id}
              draggable
              onDragStart={() => setDragId(item.id)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => {
                if (dragId) reorderUpload(storageKey, dragId, item.id);
                setDragId(null);
              }}
              className="grid gap-2 rounded-lg border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="flex items-center gap-3">
                <GripVertical className="h-4 w-4 shrink-0 text-slate-400" />
                <img src={item.dataUrl} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-100">{item.name}</p>
                  <label className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                    <input
                      type="checkbox"
                      checked={item.selected}
                      onChange={() => toggleUpload(storageKey, item.id)}
                      className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                    Include in proof
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => removeUpload(storageKey, item.id)}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10"
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <fieldset className="grid grid-cols-2 gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-950">
                <legend className="px-1 text-[10px] font-bold uppercase text-slate-500">Product size (mm) *</legend>
                <label className="grid gap-1 text-[10px] font-bold uppercase text-slate-500">
                  Width
                  <div className="relative">
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      required
                      value={item.widthMm || ""}
                      onChange={(event) => updateUpload(storageKey, item.id, { widthMm: event.target.value })}
                      className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 pr-9 text-sm font-semibold text-slate-900 outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      placeholder="0"
                    />
                    <span className="pointer-events-none absolute right-2.5 top-2.5 text-xs font-medium normal-case text-slate-400">mm</span>
                  </div>
                </label>
                <label className="grid gap-1 text-[10px] font-bold uppercase text-slate-500">
                  Height
                  <div className="relative">
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      required
                      value={item.heightMm || ""}
                      onChange={(event) => updateUpload(storageKey, item.id, { heightMm: event.target.value })}
                      className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 pr-9 text-sm font-semibold text-slate-900 outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      placeholder="0"
                    />
                    <span className="pointer-events-none absolute right-2.5 top-2.5 text-xs font-medium normal-case text-slate-400">mm</span>
                  </div>
                </label>
              </fieldset>
              <textarea
                value={item.notes || ""}
                onChange={(event) => updateUpload(storageKey, item.id, { notes: event.target.value })}
                rows={2}
                className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                placeholder="Notes for this image..."
              />
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
