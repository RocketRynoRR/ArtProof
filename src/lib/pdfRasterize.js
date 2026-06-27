import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

// Keep rasterization compatible with browsers that lack this typed-array API.
if (typeof Uint8Array.prototype.toHex !== "function") {
  Object.defineProperty(Uint8Array.prototype, "toHex", {
    configurable: true,
    value() {
      let hex = "";
      for (const byte of this) hex += byte.toString(16).padStart(2, "0");
      return hex;
    }
  });
}

const canvasToDataUrl = (canvas) => canvas.toDataURL("image/png");

export async function rasterizePdf(file, type = "artwork") {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const pdfDocument = await getDocument({ data: bytes }).promise;
  const uploads = [];

  try {
    for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber += 1) {
      const page = await pdfDocument.getPage(pageNumber);
      const baseViewport = page.getViewport({ scale: 1 });
      const maxDimension = Math.max(baseViewport.width, baseViewport.height);
      const scale = Math.min(2, 2400 / maxDimension);
      const viewport = page.getViewport({ scale });
      const canvas = window.document.createElement("canvas");
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      const context = canvas.getContext("2d", { alpha: false });

      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvasContext: context, viewport }).promise;

      uploads.push({
        id: crypto.randomUUID(),
        type,
        name: `${file.name} - Page ${pageNumber}`,
        size: file.size,
        mime: "image/png",
        sourceMime: "application/pdf",
        orientationNormalized: true,
        selected: true,
        notes: "",
        widthMm: "",
        heightMm: "",
        dataUrl: canvasToDataUrl(canvas)
      });
      page.cleanup();
    }
  } finally {
    await pdfDocument.destroy();
  }

  return uploads;
}
