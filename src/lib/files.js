export const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const loadImageElement = (file) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Could not read ${file.name}.`));
    };
    image.src = objectUrl;
  });

const drawNormalizedImage = (source, width, height, mime) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { alpha: mime === "image/png" });

  if (mime !== "image/png") {
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
  }
  context.drawImage(source, 0, 0, width, height);
  return canvas.toDataURL(mime, 0.94);
};

export const normalizeImageFile = async (file) => {
  const outputMime = file.type === "image/png" ? "image/png" : "image/jpeg";

  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      const dataUrl = drawNormalizedImage(bitmap, bitmap.width, bitmap.height, outputMime);
      bitmap.close();
      return { dataUrl, mime: outputMime };
    } catch {
      // The image-element path also applies EXIF orientation in modern browsers.
    }
  }

  const image = await loadImageElement(file);
  return {
    dataUrl: drawNormalizedImage(image, image.naturalWidth, image.naturalHeight, outputMime),
    mime: outputMime
  };
};

export const makeUpload = async (file, type = "artwork") => {
  const normalized = await normalizeImageFile(file);
  return {
    id: crypto.randomUUID(),
    type,
    name: file.name,
    size: file.size,
    mime: normalized.mime,
    sourceMime: file.type,
    orientationNormalized: true,
    selected: true,
    notes: "",
    widthMm: "",
    heightMm: "",
    dataUrl: normalized.dataUrl
  };
};

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
