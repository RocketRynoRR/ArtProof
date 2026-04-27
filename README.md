# Artwork Proof Generator

Modern React artwork proof generator for Jigsaw Signs & Print.

## Features

- A4 live proof preview that closely follows the generated PDF.
- Client, job, revision, date, and notes fields with local draft persistence.
- Artwork, item photo, and site/location photo uploads.
- Drag-and-drop thumbnail ordering, include/exclude ticks, and removal controls.
- Settings modal for company details, logo, proof wording, disclaimer, signature, colours, margins, and zoom defaults.
- Two-page PDF generation with sanitized filenames in the `ClientName_JobNumber_RevNumber.pdf` format.
- Responsive desktop/sidebar and mobile stacked layout.
- Dark mode with restrained neutral colours.

## Run Locally

```bash
npm install
npm run dev
```

The app is intentionally structured with local storage first so it can later grow into online approvals, proof sharing, saved proof history, accounts, cloud storage, and database-backed workflows.
