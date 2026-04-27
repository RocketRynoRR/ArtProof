export const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const makeUpload = async (file, type = "artwork") => ({
  id: crypto.randomUUID(),
  type,
  name: file.name,
  size: file.size,
  mime: file.type,
  selected: true,
  dataUrl: await fileToDataUrl(file)
});

export const sanitizeFilenamePart = (value, fallback) => {
  const cleaned = String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_-]/g, "");
  return cleaned || fallback;
};

export const proofFilename = ({ clientName, jobNumber, revisionNumber }) =>
  `${sanitizeFilenamePart(clientName, "Client")}_${sanitizeFilenamePart(
    jobNumber,
    "Job"
  )}_${sanitizeFilenamePart(revisionNumber, "Rev")}.pdf`;
