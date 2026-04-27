import { useProofStore } from "../store/useProofStore";

const Detail = ({ label, value }) => (
  <div>
    <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">{label}</div>
    <div className="mt-1 text-[15px] font-semibold text-slate-900">{value || "-"}</div>
  </div>
);

const selectedMedia = (proof) => [
  ...proof.artwork.map((item) => ({ ...item, label: "Artwork" })),
  ...proof.itemPhotos.map((item) => ({ ...item, label: "Item Photo" })),
  ...proof.sitePhotos.map((item) => ({ ...item, label: "Site / Location" }))
].filter((item) => item.selected);

export default function A4Proof() {
  const proof = useProofStore((state) => state.proof);
  const settings = useProofStore((state) => state.settings);
  const media = selectedMedia(proof);
  const primary = media[0];

  return (
    <div className="a4-page proof-shadow flex flex-col p-12 text-slate-900" style={{ "--proof-brand": settings.brandColor }}>
      <header className="no-break">
        <h2 className="text-center text-[34px] font-extrabold" style={{ color: "#111827" }}>
          {settings.proofTitle}
        </h2>
        <div className="mx-auto mt-4 h-1 w-28 rounded-full" style={{ background: settings.brandColor }} />
      </header>

      <section className="no-break mt-10 grid grid-cols-2 gap-x-12 gap-y-7 rounded-2xl border border-slate-200 bg-slate-50/70 p-6">
        <Detail label="Client Name" value={proof.clientName} />
        <Detail label="Job Number" value={proof.jobNumber} />
        <Detail label="Date" value={proof.currentDate} />
        <Detail label="Revision" value={proof.revisionNumber} />
      </section>

      <main className="no-break mt-8 flex min-h-[390px] flex-1 flex-col rounded-3xl border border-slate-200 bg-white p-7">
        {primary ? (
          <>
            <div className="flex flex-1 items-center justify-center overflow-hidden">
              <img src={primary.dataUrl} alt={primary.name} className="max-h-[470px] max-w-full object-contain" />
            </div>
            {media.length > 1 && (
              <div className="mt-5 grid grid-cols-4 gap-3">
                {media.slice(1, 5).map((item) => (
                  <div key={item.id} className="rounded-xl border border-slate-200 p-2">
                    <img src={item.dataUrl} alt={item.name} className="h-20 w-full rounded-lg object-contain" />
                    <p className="mt-1 truncate text-[9px] font-semibold uppercase tracking-wide text-slate-400">{item.label}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-[18px] font-bold text-slate-400">
            Upload artwork to preview
          </div>
        )}
      </main>

      {proof.notes && (
        <section className="no-break mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Notes</div>
          <p className="mt-2 whitespace-pre-line text-[14px] leading-6 text-slate-700">{proof.notes}</p>
        </section>
      )}

      {settings.includeSignature && (
        <section className="no-break mt-7 border-t border-slate-200 pt-6">
          <h3 className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-slate-800">{settings.signatureWording}</h3>
          <div className="mt-4 h-20 rounded-xl border border-slate-300 bg-white" />
          <div className="mt-7 grid grid-cols-2 gap-10">
            <div className="border-t border-slate-500 pt-2 text-[11px] text-slate-500">{settings.printNameLabel}</div>
            <div className="border-t border-slate-500 pt-2 text-[11px] text-slate-500">{settings.dateLabel}</div>
          </div>
        </section>
      )}

      <footer className="no-break mt-8 border-t border-slate-200 pt-5">
        <div className="flex items-center gap-6">
          <div className="flex h-12 w-36 items-center justify-start">
            {settings.logo ? <img src={settings.logo} alt={settings.name} className="max-h-12 max-w-36 object-contain" /> : <strong style={{ color: settings.brandColor }}>{settings.name}</strong>}
          </div>
          <div className="text-[11px] leading-5 text-slate-500">
            <div>{settings.address}</div>
            <div>{settings.phone} | {settings.email} | {settings.website}</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
