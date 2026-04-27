import { useProofStore } from "../store/useProofStore";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });
};

const Detail = ({ label, value }) => (
  <div>
    <div className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#60718b]">{label}</div>
    <div className="mt-2 text-[14px] font-medium text-black">{value || "-"}</div>
  </div>
);

const selectedMedia = (proof) => [
  ...(proof.artwork || []).map((item) => ({ ...item, label: "Artwork" })),
  ...(proof.itemPhotos || []).map((item) => ({ ...item, label: "Item Photo" })),
  ...(proof.sitePhotos || []).map((item) => ({ ...item, label: "Site / Location" }))
].filter((item) => item.selected);

function ProofPage({ proof, settings, item, index, total }) {
  const globalNotes = proof.notes?.trim();
  const itemNotes = item?.notes?.trim();

  return (
    <div className="a4-page proof-shadow flex flex-col bg-white px-[42px] py-[38px] text-slate-900">
      <header className="no-break pt-1">
        <div className="grid grid-cols-[1fr_auto_1fr] items-start">
          <span />
          <h2 className="text-center text-[34px] font-extrabold leading-tight text-black">{settings.proofTitle}</h2>
          {total > 1 && <span className="pt-3 text-right text-[10px] font-bold uppercase tracking-wide text-[#60718b]">Page {index + 1} of {total}</span>}
        </div>
      </header>

      <section className="no-break mt-8 grid grid-cols-2 gap-x-[210px] gap-y-5 px-0">
        <Detail label="Client Name" value={proof.clientName} />
        <Detail label="Job Number" value={proof.jobNumber} />
        <Detail label="Date" value={formatDate(proof.currentDate)} />
        <Detail label="Revision" value={proof.revisionNumber} />
      </section>

      <main className="no-break mt-8 flex min-h-[300px] flex-1 flex-col rounded-lg border border-dashed border-[#b9c9df] bg-slate-50/40 p-6">
        {item ? (
          <div className="flex flex-1 items-center justify-center overflow-hidden">
            <img src={item.dataUrl} alt={item.name} className="max-h-[430px] max-w-full object-contain" />
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center text-[22px] font-medium text-[#8da0bb]">
            Upload artwork to preview
          </div>
        )}
      </main>

      {item?.name && <p className="mt-3 truncate text-[10px] text-[#60718b]">{item.label}: {item.name}</p>}

      {(globalNotes || itemNotes) && (
        <section className="no-break mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Notes</div>
          {globalNotes && <p className="mt-2 whitespace-pre-line text-[13px] leading-5 text-slate-700">{globalNotes}</p>}
          {itemNotes && <p className="mt-2 whitespace-pre-line text-[13px] leading-5 text-slate-700">{itemNotes}</p>}
        </section>
      )}

      {settings.includeSignature && (
        <section className="no-break mt-7 border-t-2 border-slate-200 pt-5">
          <h3 className="text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#60718b]">{settings.signatureWording}</h3>
          <div className="mt-3 flex h-[68px] items-start rounded-lg border-2 border-[#111827] bg-white px-4 py-4 text-[10px] italic text-[#8da0bb]">
            Please sign here
          </div>
          <div className="mt-4 grid grid-cols-2 gap-24 text-[10px] text-[#60718b]">
            <div>{settings.printNameLabel}: ________________________</div>
            <div>{settings.dateLabel}: ________________________</div>
          </div>
        </section>
      )}

      <footer className="no-break mt-auto border-t border-slate-200 pt-8">
        <div className="flex items-end justify-between gap-6">
          <div className="flex h-14 w-40 items-end justify-start">
            {settings.logo ? (
              <img src={settings.logo} alt={settings.name} className="max-h-14 max-w-40 object-contain" />
            ) : (
              <div className="flex items-end gap-2">
                <span className="grid h-10 w-10 grid-cols-2 gap-0.5">
                  <span className="rounded-sm bg-[#ef3e36]" />
                  <span className="rounded-sm bg-[#3b68b2]" />
                  <span className="rounded-sm bg-[#00a6a6]" />
                  <span className="rounded-sm bg-[#f6c143]" />
                </span>
                <span className="leading-none">
                  <strong className="block text-[23px] font-extrabold text-black">Jigsaw</strong>
                  <span className="block text-[7px] font-bold uppercase tracking-wide text-slate-500">Signs N Print</span>
                </span>
              </div>
            )}
          </div>
          <div className="text-right text-[10px] leading-5 text-[#40516b]">
            <div>{settings.address}</div>
            <div>{settings.phone}</div>
            <div>{settings.email}</div>
            {settings.website && <div>{settings.website}</div>}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function A4Proof() {
  const proof = useProofStore((state) => state.proof);
  const settings = useProofStore((state) => state.settings);
  const media = selectedMedia(proof);
  const pages = media.length ? media : [null];

  return (
    <div className="grid gap-8">
      {pages.map((item, index) => (
        <ProofPage
          key={item?.id || "empty-proof"}
          proof={proof}
          settings={settings}
          item={item}
          index={index}
          total={pages.length}
        />
      ))}
    </div>
  );
}
