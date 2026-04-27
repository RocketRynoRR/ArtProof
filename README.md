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

## GitHub Pages

This repository is configured for GitHub Pages deployment through `.github/workflows/deploy.yml`.
In GitHub, set **Settings > Pages > Build and deployment > Source** to **GitHub Actions**.

## Supabase Settings

Create the table and policies in `supabase/schema.sql`, then add these variables locally or in GitHub Pages environment/secrets:

```bash
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-or-anon-key
```

The app still saves settings locally first. Supabase sync is available from the Settings modal when those variables are configured.

The app is intentionally structured with local storage first so it can later grow into online approvals, proof sharing, saved proof history, accounts, cloud storage, and database-backed workflows.
