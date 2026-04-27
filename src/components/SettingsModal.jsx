import { X } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { fileToDataUrl } from "../lib/files";
import { defaultSettings } from "../lib/defaults";
import { useProofStore } from "../store/useProofStore";
import { isSupabaseConfigured } from "../lib/supabase";

const Field = ({ label, children }) => (
  <label className="grid gap-1.5">
    <span className="field-label">{label}</span>
    {children}
  </label>
);

export default function SettingsModal({ open, onClose }) {
  const settings = useProofStore((state) => state.settings);
  const setSettings = useProofStore((state) => state.setSettings);
  const syncStatus = useProofStore((state) => state.settingsSyncStatus);
  const syncError = useProofStore((state) => state.settingsSyncError);
  const loadSettingsFromCloud = useProofStore((state) => state.loadSettingsFromCloud);
  const saveSettingsToCloud = useProofStore((state) => state.saveSettingsToCloud);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/png": [".png"], "image/jpeg": [".jpg", ".jpeg"] },
    multiple: false,
    onDrop: async ([file]) => {
      if (file) setSettings({ logo: await fileToDataUrl(file) });
    }
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="mx-auto flex max-h-[92vh] max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-premium dark:bg-slate-950">
        <header className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">PDF Settings</h2>
            <p className="text-sm text-slate-500">Saved locally and used for both preview and PDF output.</p>
          </div>
          <button className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900" onClick={onClose} aria-label="Close settings">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="grid gap-6 overflow-auto p-5 lg:grid-cols-2">
          <section className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">Supabase Settings Sync</h3>
                <p className="mt-1 text-sm text-slate-500">
                  {isSupabaseConfigured
                    ? "Cloud settings are available for this project."
                    : "Add Supabase environment variables to enable cloud settings."}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={!isSupabaseConfigured || syncStatus === "loading"}
                  onClick={loadSettingsFromCloud}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                >
                  Load
                </button>
                <button
                  type="button"
                  disabled={!isSupabaseConfigured || syncStatus === "saving"}
                  onClick={saveSettingsToCloud}
                  className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-950"
                >
                  Save
                </button>
              </div>
            </div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Status: {syncStatus}
            </p>
            {syncError && <p className="text-sm text-rose-600">{syncError}</p>}
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">Company</h3>
            <div {...getRootProps()} className="cursor-pointer rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-900">
              <input {...getInputProps()} />
              {settings.logo ? <img src={settings.logo} alt="" className="mx-auto max-h-20 object-contain" /> : <p className="text-sm font-semibold text-slate-500">Upload company logo</p>}
            </div>
            <Field label="Company Name"><input className="input" value={settings.name} onChange={(e) => setSettings({ name: e.target.value })} /></Field>
            <Field label="Address"><input className="input" value={settings.address} onChange={(e) => setSettings({ address: e.target.value })} /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Phone"><input className="input" value={settings.phone} onChange={(e) => setSettings({ phone: e.target.value })} /></Field>
              <Field label="Email"><input className="input" value={settings.email} onChange={(e) => setSettings({ email: e.target.value })} /></Field>
            </div>
            <Field label="Website"><input className="input" value={settings.website} onChange={(e) => setSettings({ website: e.target.value })} /></Field>
            <Field label="Footer Layout">
              <select className="input" value={settings.footerLayout} onChange={(e) => setSettings({ footerLayout: e.target.value })}>
                <option value="balanced">Balanced</option>
                <option value="compact">Compact</option>
                <option value="logo-left">Logo left</option>
              </select>
            </Field>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">Proof Content</h3>
            <Field label="Proof Title"><input className="input" value={settings.proofTitle} onChange={(e) => setSettings({ proofTitle: e.target.value })} /></Field>
            <Field label="Disclaimer Heading"><input className="input" value={settings.disclaimerHeading} onChange={(e) => setSettings({ disclaimerHeading: e.target.value })} /></Field>
            <Field label="Disclaimer Text"><textarea className="input min-h-[150px]" value={settings.disclaimerText} onChange={(e) => setSettings({ disclaimerText: e.target.value })} /></Field>
            <Field label="Signature Wording"><input className="input" value={settings.signatureWording} onChange={(e) => setSettings({ signatureWording: e.target.value })} /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Print Name Label"><input className="input" value={settings.printNameLabel} onChange={(e) => setSettings({ printNameLabel: e.target.value })} /></Field>
              <Field label="Date Label"><input className="input" value={settings.dateLabel} onChange={(e) => setSettings({ dateLabel: e.target.value })} /></Field>
            </div>
            <div className="grid gap-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <label className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                <input type="checkbox" checked={settings.includeDisclaimer} onChange={(e) => setSettings({ includeDisclaimer: e.target.checked })} />
                Include disclaimer page
              </label>
              <label className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                <input type="checkbox" checked={settings.includeSignature} onChange={(e) => setSettings({ includeSignature: e.target.checked })} />
                Include signature section
              </label>
            </div>
          </section>

          <section className="space-y-4 lg:col-span-2">
            <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">Layout</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Default Margins"><input type="number" className="input" min="28" max="72" value={settings.margin} onChange={(e) => setSettings({ margin: Number(e.target.value) })} /></Field>
              <Field label="Title Font Size"><input type="number" className="input" min="18" max="38" value={settings.titleSize} onChange={(e) => setSettings({ titleSize: Number(e.target.value) })} /></Field>
              <Field label="Body Font Size"><input type="number" className="input" min="9" max="15" value={settings.bodySize} onChange={(e) => setSettings({ bodySize: Number(e.target.value) })} /></Field>
              <Field label="Label Font Size"><input type="number" className="input" min="6" max="10" value={settings.labelSize} onChange={(e) => setSettings({ labelSize: Number(e.target.value) })} /></Field>
              <Field label="Default Zoom"><input type="number" className="input" min="35" max="125" value={settings.defaultZoom} onChange={(e) => setSettings({ defaultZoom: Number(e.target.value) })} /></Field>
              <Field label="Brand Colour"><input type="color" className="input h-12 p-1" value={settings.brandColor} onChange={(e) => setSettings({ brandColor: e.target.value })} /></Field>
              <Field label="Accent Colour"><input type="color" className="input h-12 p-1" value={settings.accentColor} onChange={(e) => setSettings({ accentColor: e.target.value })} /></Field>
            </div>
          </section>
        </div>

        <footer className="flex justify-between border-t border-slate-200 p-5 dark:border-slate-800">
          <button className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 dark:border-slate-700" onClick={() => setSettings(defaultSettings)}>Reset defaults</button>
          <button className="rounded-2xl bg-brand-600 px-5 py-2 text-sm font-bold text-white" onClick={onClose}>Done</button>
        </footer>
      </div>
    </div>
  );
}
