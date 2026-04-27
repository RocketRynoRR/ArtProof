import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { GripVertical, ImagePlus, Trash2 } from "lucide-react";
import { makeUpload } from "../lib/files";
import { useProofStore } from "../store/useProofStore";

export default function UploadSection({ title, storageKey, helper }) {
  const items = useProofStore((state) => state.proof[storageKey] || []);
  const addUploads = useProofStore((state) => state.addUploads);
  const removeUpload = useProofStore((state) => state.removeUpload);
  const toggleUpload = useProofStore((state) => state.toggleUpload);
  const reorderUpload = useProofStore((state) => state.reorderUpload);
  const [dragId, setDragId] = useState(null);

  const onDrop = useCallback(
    async (files) => {
      const uploads = await Promise.all(files.map((file) => makeUpload(file, storageKey)));
      addUploads(storageKey, uploads);
    },
    [addUploads, storageKey]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/png": [".png"], "image/jpeg": [".jpg", ".jpeg"] },
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
        <ImagePlus className="mx-auto h-8 w-8 text-slate-400" />
        <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
          Drag & drop or click to upload
        </p>
        <p className="text-xs font-medium text-slate-500">Supports JPG, PNG • Multiple files allowed</p>
      </div>

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
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-700 dark:bg-slate-900"
            >
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
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
