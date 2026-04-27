import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { proofFilename } from "./files";

const A4 = { width: 595.28, height: 841.89 };

const hexToRgb = (hex) => {
  const value = hex.replace("#", "");
  const int = Number.parseInt(value.length === 3 ? value.replace(/(.)/g, "$1$1") : value, 16);
  return rgb(((int >> 16) & 255) / 255, ((int >> 8) & 255) / 255, (int & 255) / 255);
};

const dataUrlBytes = (dataUrl) => {
  const base64 = dataUrl.split(",")[1];
  const binary = atob(base64);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });
};

const wrapText = (text, font, size, maxWidth) => {
  const lines = [];
  String(text || "")
    .split("\n")
    .forEach((paragraph) => {
      let line = "";
      paragraph.split(/\s+/).forEach((word) => {
        const candidate = line ? `${line} ${word}` : word;
        if (font.widthOfTextAtSize(candidate, size) > maxWidth && line) {
          lines.push(line);
          line = word;
        } else {
          line = candidate;
        }
      });
      lines.push(line);
    });
  return lines.filter(Boolean);
};

const drawLabelValue = (page, fonts, label, value, x, y, width, settings) => {
  page.drawText(label.toUpperCase(), {
    x,
    y,
    size: settings.labelSize,
    font: fonts.bold,
    color: rgb(0.44, 0.49, 0.57)
  });
  page.drawText(value || "-", {
    x,
    y: y - 15,
    size: settings.bodySize + 1,
    font: fonts.regular,
    color: rgb(0.1, 0.13, 0.18),
    maxWidth: width
  });
};

const embedImage = async (pdfDoc, item) => {
  const bytes = dataUrlBytes(item.dataUrl);
  if (item.mime?.includes("png") || item.dataUrl.startsWith("data:image/png")) {
    return pdfDoc.embedPng(bytes);
  }
  return pdfDoc.embedJpg(bytes);
};

const drawImageContain = async (pdfDoc, page, item, box) => {
  const image = await embedImage(pdfDoc, item);
  const scale = Math.min(box.width / image.width, box.height / image.height);
  const width = image.width * scale;
  const height = image.height * scale;
  page.drawImage(image, {
    x: box.x + (box.width - width) / 2,
    y: box.y + (box.height - height) / 2,
    width,
    height
  });
};

const drawLogo = async (pdfDoc, page, settings, x, y, maxWidth, maxHeight, fonts) => {
  if (!settings.logo) {
    const tile = 9;
    const colours = [rgb(0.94, 0.24, 0.21), rgb(0.23, 0.41, 0.7), rgb(0, 0.65, 0.65), rgb(0.96, 0.76, 0.26)];
    colours.forEach((colour, index) => {
      page.drawRectangle({
        x: x + (index % 2) * (tile + 1),
        y: y + 12 - Math.floor(index / 2) * (tile + 1),
        width: tile,
        height: tile,
        color: colour
      });
    });
    page.drawText("Jigsaw", { x: x + 26, y: y + 13, size: 15, font: fonts.bold, color: rgb(0.02, 0.03, 0.05) });
    page.drawText("SIGNS N PRINT", { x: x + 28, y: y + 7, size: 4.5, font: fonts.bold, color: rgb(0.38, 0.44, 0.52) });
    return;
  }
  try {
    await drawImageContain(pdfDoc, page, { dataUrl: settings.logo, mime: settings.logo.slice(5, 15) }, { x, y, width: maxWidth, height: maxHeight });
  } catch {
    page.drawText(settings.name, { x, y: y + 15, size: 13, font: fonts.bold, color: hexToRgb(settings.brandColor) });
  }
};

const selectedMedia = (proof) => [
  ...proof.artwork.map((item) => ({ ...item, heading: "Artwork" })),
  ...proof.itemPhotos.map((item) => ({ ...item, heading: "Item Photo" })),
  ...proof.sitePhotos.map((item) => ({ ...item, heading: "Site / Location Photo" }))
].filter((item) => item.selected);

export const generateProofPdf = async (proof, settings) => {
  const pdfDoc = await PDFDocument.create();
  const fonts = {
    regular: await pdfDoc.embedFont(StandardFonts.Helvetica),
    bold: await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  };
  const page = pdfDoc.addPage([A4.width, A4.height]);
  const margin = Number(settings.margin) || 44;
  const brand = hexToRgb(settings.brandColor);
  const media = selectedMedia(proof);
  const contentWidth = A4.width - margin * 2;
  let y = A4.height - margin;

  page.drawText(settings.proofTitle || "Artwork Proof", {
    x: margin,
    y,
    size: settings.titleSize,
    font: fonts.bold,
    color: rgb(0.08, 0.11, 0.16)
  });
  page.drawLine({ start: { x: margin, y: y - 14 }, end: { x: A4.width - margin, y: y - 14 }, thickness: 1.2, color: brand });
  y -= 52;

  drawLabelValue(page, fonts, "Client Name", proof.clientName, margin, y, contentWidth / 2 - 12, settings);
  drawLabelValue(page, fonts, "Job Number", proof.jobNumber, margin + contentWidth / 2 + 18, y, contentWidth / 2 - 18, settings);
  y -= 46;
  drawLabelValue(page, fonts, "Date", formatDate(proof.currentDate), margin, y, contentWidth / 2 - 12, settings);
  drawLabelValue(page, fonts, "Revision", proof.revisionNumber, margin + contentWidth / 2 + 18, y, contentWidth / 2 - 18, settings);
  y -= 44;

  const artworkHeight = settings.includeSignature ? 318 : 395;
  page.drawRectangle({ x: margin, y: y - artworkHeight, width: contentWidth, height: artworkHeight, borderColor: rgb(0.83, 0.86, 0.9), borderWidth: 1, color: rgb(0.98, 0.99, 1) });

  if (media.length) {
    const primary = media[0];
    const thumbRow = media.length > 1 ? 70 : 0;
    await drawImageContain(pdfDoc, page, primary, {
      x: margin + 22,
      y: y - artworkHeight + 22 + thumbRow,
      width: contentWidth - 44,
      height: artworkHeight - 44 - thumbRow
    });
    if (media.length > 1) {
      const gap = 10;
      const thumbs = media.slice(1, 5);
      const thumbWidth = (contentWidth - 44 - gap * (thumbs.length - 1)) / thumbs.length;
      for (const [index, item] of thumbs.entries()) {
        const tx = margin + 22 + index * (thumbWidth + gap);
        page.drawRectangle({ x: tx, y: y - artworkHeight + 18, width: thumbWidth, height: 52, borderColor: rgb(0.86, 0.89, 0.93), borderWidth: 0.8 });
        await drawImageContain(pdfDoc, page, item, { x: tx + 4, y: y - artworkHeight + 24, width: thumbWidth - 8, height: 36 });
        page.drawText(item.heading, { x: tx + 4, y: y - artworkHeight + 10, size: 6, font: fonts.bold, color: rgb(0.5, 0.55, 0.63) });
      }
    }
  } else {
    const placeholder = "Upload artwork to preview";
    page.drawText(placeholder, {
      x: margin + contentWidth / 2 - fonts.bold.widthOfTextAtSize(placeholder, 13) / 2,
      y: y - artworkHeight / 2,
      size: 13,
      font: fonts.bold,
      color: rgb(0.48, 0.54, 0.62)
    });
  }
  y -= artworkHeight + 22;

  if (proof.notes) {
    page.drawText("NOTES", { x: margin, y, size: settings.labelSize, font: fonts.bold, color: rgb(0.44, 0.49, 0.57) });
    y -= 15;
    wrapText(proof.notes, fonts.regular, settings.bodySize, contentWidth).slice(0, 5).forEach((line) => {
      page.drawText(line, { x: margin, y, size: settings.bodySize, font: fonts.regular, color: rgb(0.18, 0.22, 0.28) });
      y -= 14;
    });
    y -= 8;
  }

  if (settings.includeSignature) {
    page.drawLine({ start: { x: margin, y }, end: { x: A4.width - margin, y }, thickness: 0.8, color: rgb(0.82, 0.86, 0.9) });
    y -= 24;
    page.drawText(settings.signatureWording, { x: margin, y, size: 11, font: fonts.bold, color: rgb(0.16, 0.19, 0.25) });
    y -= 62;
    page.drawRectangle({ x: margin, y, width: contentWidth, height: 48, borderColor: rgb(0.07, 0.1, 0.16), borderWidth: 1.5 });
    page.drawText("Please sign here", { x: margin + 10, y: y + 30, size: 7, font: fonts.regular, color: rgb(0.55, 0.63, 0.74) });
    y -= 30;
    page.drawLine({ start: { x: margin, y }, end: { x: margin + 210, y }, thickness: 0.8, color: rgb(0.48, 0.54, 0.62) });
    page.drawLine({ start: { x: margin + 270, y }, end: { x: margin + 430, y }, thickness: 0.8, color: rgb(0.48, 0.54, 0.62) });
    page.drawText(settings.printNameLabel, { x: margin, y: y - 13, size: 8, font: fonts.regular, color: rgb(0.44, 0.49, 0.57) });
    page.drawText(settings.dateLabel, { x: margin + 270, y: y - 13, size: 8, font: fonts.regular, color: rgb(0.44, 0.49, 0.57) });
  }

  const footerY = 30;
  page.drawLine({ start: { x: margin, y: footerY + 48 }, end: { x: A4.width - margin, y: footerY + 48 }, thickness: 0.6, color: rgb(0.82, 0.86, 0.9) });
  await drawLogo(pdfDoc, page, settings, margin, footerY, 120, 34, fonts);
  const contactX = A4.width - margin - 160;
  page.drawText(settings.address || "", { x: contactX, y: footerY + 28, size: 7, font: fonts.regular, color: rgb(0.25, 0.32, 0.42), maxWidth: 160 });
  page.drawText(settings.phone || "", { x: contactX, y: footerY + 17, size: 7, font: fonts.regular, color: rgb(0.25, 0.32, 0.42), maxWidth: 160 });
  page.drawText(settings.email || "", { x: contactX, y: footerY + 6, size: 7, font: fonts.regular, color: rgb(0.25, 0.32, 0.42), maxWidth: 160 });
  page.drawText(settings.website || "", { x: contactX, y: footerY - 5, size: 7, font: fonts.regular, color: rgb(0.25, 0.32, 0.42), maxWidth: 160 });

  if (settings.includeDisclaimer) {
    const disclaimer = pdfDoc.addPage([A4.width, A4.height]);
    let dy = A4.height - margin;
    disclaimer.drawText(settings.disclaimerHeading, { x: margin, y: dy, size: 24, font: fonts.bold, color: rgb(0.08, 0.11, 0.16) });
    dy -= 34;
    disclaimer.drawLine({ start: { x: margin, y: dy }, end: { x: A4.width - margin, y: dy }, thickness: 1.2, color: brand });
    dy -= 40;
    wrapText(settings.disclaimerText, fonts.regular, 12, contentWidth).forEach((line) => {
      disclaimer.drawText(line, { x: margin, y: dy, size: 12, font: fonts.regular, color: rgb(0.16, 0.19, 0.25) });
      dy -= 22;
    });
    disclaimer.drawText(settings.name, { x: margin, y: 48, size: 11, font: fonts.bold, color: brand });
  }

  const bytes = await pdfDoc.save();
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = proofFilename(proof);
  link.click();
  URL.revokeObjectURL(url);
};
