# PDFEditor — Complete Project Documentation

> A full-stack, browser-based PDF tools website inspired by ilovepdf.com.  
> Built with React, Vite, Tailwind CSS, Node.js, Express, and pdf-lib.

---

## Table of Contents

1. [Project Idea](#1-project-idea)
2. [Complete Project Structure](#2-complete-project-structure)
3. [Tools & Technologies Used](#3-tools--technologies-used)
4. [How to Start the Project](#4-how-to-start-the-project)
5. [How the Project Works — In Complete Detail](#5-how-the-project-works--in-complete-detail)
6. [Code Snippets — Key Implementation Details](#6-code-snippets--key-implementation-details)
7. [Future Work](#7-future-work)

---

## 1. Project Idea

### Concept

PDFEditor is a **free, fully-functional, self-hosted PDF tools website** — a complete clone of [ilovepdf.com](https://ilovepdf.com). The idea is to give users a clean, modern web interface where they can perform common PDF operations directly in the browser, without installing any desktop software, without watermarks, and without paying.

### Problem It Solves

Most PDF tools online either:
- Charge a subscription fee for full access
- Add watermarks to free outputs
- Require account registration
- Send files to third-party servers with unknown privacy policies

PDFEditor solves all of this. Because it is self-hosted, **your files never leave your own machine or server**. It is 100% free, requires no sign-up, and produces clean output.

### Scope

The project implements **11 core PDF tools**:

| # | Tool | What It Does |
|---|------|-------------|
| 1 | Merge PDF | Combines multiple PDF files into one document |
| 2 | Split PDF | Splits one PDF into multiple files by pages, intervals, or custom ranges |
| 3 | Compress PDF | Reduces PDF file size using stream optimization and metadata stripping |
| 4 | Rotate PDF | Rotates all or individual pages by 90°, 180°, or 270° |
| 5 | Watermark PDF | Stamps text or image watermarks on every page |
| 6 | Protect PDF | Password-protects a PDF (requires QPDF) |
| 7 | Unlock PDF | Removes password from a PDF given the correct password |
| 8 | Page Numbers | Adds automatic page numbers to every page |
| 9 | Organize PDF | Reorders or deletes pages within a PDF |
| 10 | PDF to Image | Converts each PDF page to PNG or JPG |
| 11 | Image to PDF | Combines one or more images into a single PDF |

---

## 2. Complete Project Structure

```
PdfEditor/
│
├── package.json                  ← Root: runs both backend & frontend concurrently
│
├── backend/                      ← Node.js + Express API server
│   ├── package.json
│   ├── server.js                 ← Entry point, registers all routes
│   │
│   ├── middleware/
│   │   └── upload.js             ← Multer config (file upload handling)
│   │
│   ├── routes/                   ← One route file per tool
│   │   ├── merge.js
│   │   ├── split.js
│   │   ├── compress.js
│   │   ├── rotate.js
│   │   ├── watermark.js
│   │   ├── protect.js
│   │   ├── unlock.js
│   │   ├── pageNumbers.js
│   │   ├── organize.js
│   │   ├── pdfToImage.js
│   │   └── imageToPdf.js
│   │
│   ├── uploads/                  ← Temporary uploaded files (auto-cleaned)
│   └── outputs/                  ← Temporary processed files (auto-cleaned)
│
├── frontend/                     ← React + Vite + Tailwind CSS
│   ├── package.json
│   ├── vite.config.js            ← Vite config + API proxy to backend
│   ├── tailwind.config.js        ← Tailwind theme (primary red color)
│   ├── postcss.config.js
│   ├── index.html                ← Root HTML template
│   │
│   ├── public/
│   │   └── favicon.svg           ← Custom red PDF icon
│   │
│   └── src/
│       ├── main.jsx              ← React entry: mounts App inside BrowserRouter
│       ├── App.jsx               ← Router: maps URL paths to page components
│       ├── index.css             ← Tailwind base + custom component classes
│       │
│       ├── utils/
│       │   └── api.js            ← Axios API caller + downloadBlob helper
│       │
│       ├── components/
│       │   ├── Header.jsx        ← Sticky nav with logo + quick links
│       │   ├── Footer.jsx        ← Dark footer with all tool links
│       │   ├── ToolCard.jsx      ← Card shown on homepage grid
│       │   ├── FileDropper.jsx   ← Drag-and-drop file upload component
│       │   └── ToolLayout.jsx    ← Shared page shell for all tool pages
│       │
│       └── pages/
│           ├── Home.jsx          ← Homepage: hero + 11-tool grid + features
│           ├── MergePdf.jsx
│           ├── SplitPdf.jsx
│           ├── CompressPdf.jsx
│           ├── RotatePdf.jsx
│           ├── WatermarkPdf.jsx
│           ├── ProtectPdf.jsx
│           ├── UnlockPdf.jsx
│           ├── PageNumbers.jsx
│           ├── OrganizePdf.jsx
│           ├── PdfToImage.jsx
│           └── ImageToPdf.jsx
│
└── .claude/
    └── launch.json               ← Preview server config for Claude Code
```

---

## 3. Tools & Technologies Used

### Frontend

| Package | Version | Purpose |
|---------|---------|---------|
| **React** | 18.x | UI component framework |
| **React DOM** | 18.x | Renders React tree into the browser DOM |
| **React Router DOM** | 6.x | Client-side routing (SPA navigation) |
| **Vite** | 5.x | Dev server + bundler (fast HMR) |
| **@vitejs/plugin-react** | 4.x | React JSX transform support in Vite |
| **Tailwind CSS** | 3.x | Utility-first CSS framework |
| **PostCSS + Autoprefixer** | — | CSS processing pipeline |
| **react-dropzone** | 14.x | Drag-and-drop file upload |
| **axios** | 1.x | HTTP client for API calls (supports upload/download progress) |
| **react-hot-toast** | 2.x | Toast notifications (success / error) |
| **react-icons** | 5.x | SVG icon library (Heroicons set used) |
| **pdfjs-dist** | 3.11.174 | PDF rendering in the browser (used on Organize page for page count) |
| **@dnd-kit/core + sortable** | 6.x / 8.x | Drag-and-drop page reordering (installed, available) |

### Backend

| Package | Version | Purpose |
|---------|---------|---------|
| **Express** | 4.x | HTTP server and routing |
| **cors** | 2.x | Cross-Origin Resource Sharing headers |
| **multer** | 1.x | Multipart form-data file upload handling |
| **pdf-lib** | 1.17.1 | Pure JavaScript PDF creation and manipulation |
| **@pdf-lib/fontkit** | 1.x | Font subsetting and embedding support |
| **pdfjs-dist** | 3.11.174 | Renders PDF pages to canvas (for PDF→Image) |
| **@napi-rs/canvas** | 0.1.x | Native canvas implementation (replaces `canvas` package; supports Node 22) |
| **sharp** | 0.33.x | High-performance image processing (used in Image→PDF) |
| **archiver** | 6.x | Creates ZIP archives for multi-file outputs |
| **uuid** | 9.x | Generates unique IDs for temp filenames |
| **nodemon** | 3.x | Auto-restarts backend on file changes (dev only) |
| **concurrently** | 8.x | Runs backend and frontend in parallel (root dev script) |

### External Tools (Optional)

| Tool | Purpose | Required? |
|------|---------|-----------|
| **QPDF** | PDF password protection (Protect PDF feature) | Only for Protect PDF |

---

## 4. How to Start the Project

### Prerequisites

- **Node.js** v18 or higher (v22 recommended)
- **npm** v8 or higher
- **Git** (optional)

### Step 1 — Install Dependencies

Open a terminal in the project root (`PdfEditor/`) and run:

```bash
# Install root dependencies (concurrently)
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

Or as a one-liner from the root:

```bash
npm run install:all
```

### Step 2 — Start the Backend

```bash
cd backend
node server.js
```

You should see:
```
PDF Editor backend running on http://localhost:5000
```

**For development** (auto-restarts on file save):
```bash
cd backend
npx nodemon server.js
```

Verify the backend is healthy:
```bash
curl http://localhost:5000/api/health
# → {"status":"ok"}
```

### Step 3 — Start the Frontend

In a **new terminal window**:

```bash
cd frontend
npm run dev
```

You should see:
```
VITE v5.x  ready in 350ms
➜  Local:   http://localhost:3000/
```

Open your browser at **http://localhost:3000** — the app is live.

### Step 4 — Run Both at Once (Root Script)

From the project root, you can start both simultaneously:

```bash
npm run dev
```

This uses `concurrently` to run backend and frontend in parallel.

### Environment Variables

The backend respects one environment variable:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Port the Express server listens on |

Example: `PORT=8080 node server.js`

### (Optional) Install QPDF for Protect PDF

The Protect PDF feature requires the QPDF command-line tool:

- **Windows**: Download from https://qpdf.sourceforge.io/ and add to PATH
- **macOS**: `brew install qpdf`
- **Ubuntu/Debian**: `sudo apt install qpdf`

After installing, restart the backend. The Protect PDF page will automatically detect it.

---

## 5. How the Project Works — In Complete Detail

### Architecture Overview

```
Browser (React SPA)
      │
      │  HTTP (fetch/XHR via Axios)
      │  All requests to /api/* are proxied by Vite → localhost:5000
      ▼
Express Server (Node.js)
      │
      ├── Multer middleware  → saves uploaded file(s) to backend/uploads/
      ├── Route handler      → processes the PDF using pdf-lib
      └── Response           → streams the result file back as binary
```

### 5.1 Frontend Flow

#### Routing
`App.jsx` uses React Router v6. Each tool has its own URL:

```
/              → Home (tool grid)
/merge-pdf     → Merge tool
/split-pdf     → Split tool
...etc
```

When the user navigates to a tool page, React renders the corresponding page component. No page reload occurs — this is a Single Page Application (SPA).

#### ToolLayout Component
Every tool page (`MergePdf.jsx`, `SplitPdf.jsx`, etc.) is wrapped in `ToolLayout`, a shared shell that provides:

- **Back arrow** → navigates to the homepage
- **Tool icon + title + description** header
- **Slot for children** → where the tool-specific form goes
- **Process button** → calls the parent's `onProcess` handler
- **Loading state** → shows a spinner + progress bar
- **Success state** → shows a download button + "Process another file" button

This pattern means each tool page only has to worry about its own form fields and API call — the surrounding UX is identical and reused.

#### FileDropper Component
`FileDropper.jsx` wraps `react-dropzone`. It:
- Accepts drag-and-drop of files onto a dashed border zone
- Opens a file picker dialog on click
- Shows a list of selected files with name, size, and an X to remove
- Supports `multiple` mode (for Merge, Image-to-PDF) or single-file mode
- Accepts a custom `accept` object (e.g. only PDFs, or only images)

#### API Call Pattern
All tool pages use the same `callApi()` helper from `src/utils/api.js`:

```js
const res = await callApi('merge', formData, setProgress);
```

This function:
1. Posts to `/api/merge` (proxied to `http://localhost:5000/api/merge`)
2. Sets `responseType: 'blob'` so Axios receives the binary file
3. Reports upload progress (0–50%) and download progress (50–100%) via the `onProgress` callback
4. Detects JSON error responses (server errors come back as JSON even though we expected a blob)
5. Throws with the server's error message if something went wrong

After a successful response, `downloadBlob(res.data, 'filename.pdf')` creates a temporary object URL and triggers a browser download.

### 5.2 Backend Flow

#### Server Initialization (`server.js`)
On startup:
1. Creates `uploads/` and `outputs/` directories if they don't exist
2. Registers all 11 route handlers under `/api/*`
3. Registers a health check at `GET /api/health`
4. Starts a 1-hour interval timer that scans `uploads/` and `outputs/` and deletes files older than 1 hour
5. Starts listening on `PORT` (default 5000)

#### Multer Upload Middleware (`middleware/upload.js`)
Every route that accepts file uploads passes through Multer first. The middleware:
- Stores files to `uploads/` using disk storage
- Generates a unique filename: `{uuid}-{originalname}`
- Limits file size to 100 MB
- Filters by MIME type (`pdfUpload` only accepts `application/pdf`; `imageUpload` accepts JPEG/PNG/WebP/GIF/TIFF)
- Exports a `cleanup()` helper that unlinks temp files after processing

#### How Each Route Works

---

**Merge PDF** (`routes/merge.js`)

1. Receives up to 20 PDF files via `multipart/form-data`
2. Creates a new `PDFDocument` with `pdf-lib`
3. Loads each uploaded PDF, copies all its pages, appends them to the new document
4. Saves the merged document with `useObjectStreams: true` (cross-reference stream compression)
5. Sends the result as `application/pdf` binary response
6. Deletes all temp files

---

**Split PDF** (`routes/split.js`)

Supports three modes controlled by the `mode` body parameter:

- `all` — each page becomes its own PDF
- `interval` — split every N pages (e.g. every 2 pages → chunks of 2)
- `ranges` — custom comma-separated page ranges (e.g. `1-3, 4-6, 7`)

The `parseRanges()` helper function tokenises the range string, validates each range against the total page count, and returns an array of `{start, end}` objects.

For each chunk:
1. Creates a new `PDFDocument`
2. Copies the relevant pages from the source PDF
3. Saves to a temp file in `outputs/{uuid}/`

If only one chunk results, returns a single PDF. Otherwise, uses `archiver` to create a ZIP of all PDF chunks and streams it back.

---

**Compress PDF** (`routes/compress.js`)

Uses three mechanisms, scaled by the `level` parameter:

- **Low**: just re-saves with `useObjectStreams: true`
- **Medium**: additionally strips all document metadata (title, author, subject, keywords, producer, creator, dates)
- **High**: same as Medium (image compression within the PDF data stream requires Ghostscript for true effectiveness)

The response includes three custom HTTP headers:
- `X-Original-Size`: file size before compression (bytes)
- `X-Compressed-Size`: file size after compression (bytes)
- `X-Reduction-Percent`: percentage saved

The frontend reads these headers and displays the compression statistics in the success state.

---

**Rotate PDF** (`routes/rotate.js`)

1. Parses the `pages` parameter: `"all"` or a comma-separated list like `"1, 3, 5-8"`
2. Loads the PDF
3. For each target page, reads the existing rotation angle and adds the requested rotation using `page.setRotation(degrees(newAngle))`
4. PDF rotations are stored in 90° increments in the PDF spec; `degrees()` from pdf-lib creates a `Rotation` object
5. Saves and returns the result

---

**Watermark PDF** (`routes/watermark.js`)

Supports `type: "text"` or `type: "image"`:

**Text watermark:**
- Embeds the Helvetica Bold font (a standard PDF font, no external font file needed)
- Parses the hex `color` string into `rgb(r, g, b)` using pdf-lib's `rgb()` helper
- Draws the text on each page using `page.drawText()` with `opacity` and `rotate` parameters
- Positions text based on `position` (center, top-left, top-right, bottom-left, bottom-right)

**Image watermark:**
- Accepts an uploaded PNG or JPG as a second file field (`image`)
- Embeds it with `pdf.embedPng()` or `pdf.embedJpg()`
- Scales it to 50% of its natural size and draws it centered on each page

---

**Protect PDF** (`routes/protect.js`)

Uses `execFile('qpdf', [...])` to call the QPDF command-line tool:

```
qpdf --encrypt <userPwd> <ownerPwd> 128 -- input.pdf output.pdf
```

If QPDF is not found, Express returns HTTP 501 with a JSON body that includes `hint` (install instructions) and `feature: 'protect'`. The frontend detects this and shows a styled info box with the install link instead of a generic error toast.

---

**Unlock PDF** (`routes/unlock.js`)

Uses pdf-lib's built-in decryption support:

```js
const pdf = await PDFDocument.load(bytes, { password: 'userpassword' });
const unlocked = await pdf.save();
```

When pdf-lib loads an encrypted PDF with the correct password, it decrypts all streams in memory. Saving without calling `pdf.encrypt()` again produces a clean, unprotected PDF.

Error handling distinguishes between:
- Wrong password → HTTP 400 "Incorrect password"
- Unsupported/corrupt PDF → HTTP 400 "Could not open PDF"
- Internal error → HTTP 500

---

**Page Numbers** (`routes/pageNumbers.js`)

For each page:
1. Embeds Helvetica (standard font, always available in pdf-lib)
2. Formats the label string based on `format`:
   - `n` → `"3"`
   - `page_n` → `"Page 3"`
   - `n_total` → `"3 / 12"`
   - `page_n_of_total` → `"Page 3 of 12"`
3. Calculates text width using `font.widthOfTextAtSize(label, fontSize)` to right/center align correctly
4. Computes x/y coordinates based on position and margin
5. Draws the text with `page.drawText()`

---

**Organize PDF** (`routes/organize.js`)

The frontend sends a JSON array called `pageOrder` — a 0-indexed array of page numbers in the desired order. For example, `[2, 0, 1]` means "put page 3 first, then page 1, then page 2". Missing indices are deleted.

The backend:
1. Parses the `pageOrder` JSON
2. Validates each index against the total page count
3. Creates a new `PDFDocument` and copies only the requested pages in the requested order

---

**PDF to Image** (`routes/pdfToImage.js`)

This is the most complex route because it requires rendering PDF vector graphics to raster images:

1. **Polyfills** `DOMMatrix` and `Path2D` as global objects — pdfjs-dist needs these browser APIs, which don't exist in Node.js
2. Loads pdfjs-dist's legacy CommonJS build and `@napi-rs/canvas`
3. For each requested page:
   - Opens the PDF with `pdfjsLib.getDocument({ data: uint8array, disableWorker: true })`
   - Gets the page object and creates a viewport at the requested scale (scale 2 = 2× resolution = ~144 DPI)
   - Creates a canvas with `createCanvas(viewport.width, viewport.height)`
   - Calls `page.render({ canvasContext, viewport }).promise` — pdfjs draws the page onto the canvas
   - Exports the canvas as PNG (`canvas.toBuffer('image/png')`) or JPG
4. Single image → returns directly as `image/png` or `image/jpeg`
5. Multiple images → ZIPs them with archiver and returns `application/zip`

---

**Image to PDF** (`routes/imageToPdf.js`)

For each uploaded image file:
1. Reads it with `sharp` to normalize the format (converts anything to PNG or JPEG)
2. Determines page orientation (auto-detects landscape if image width > height, or respects user setting)
3. Adds an A4-sized page to the PDF document (`595.28 × 841.89` points for portrait)
4. Embeds the image with `pdf.embedPng()` or `pdf.embedJpg()`
5. If `fitToPage` is true, scales the image to fill the available area (minus margins) while preserving aspect ratio
6. Draws the image centered on the page

### 5.3 Temporary File Lifecycle

```
User uploads file
     │
     ▼
Multer saves to backend/uploads/{uuid}-{filename}
     │
     ▼
Route processes the file (reads from disk)
     │
     ▼
Result is sent to the client as a binary response
     │
     ▼
cleanup(file) deletes the upload immediately after sending
     │
     (if multi-file output was needed)
     ▼
archiver streams the ZIP from backend/outputs/{uuid}/
     │
     ▼
archive.on('end') deletes the output directory
```

Additionally, the server's 1-hour interval cleanup scans both folders and deletes any files left over from crashes or incomplete requests.

### 5.4 Vite Proxy

The Vite dev server is configured to forward any request starting with `/api` to the backend:

```js
// frontend/vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
    },
  },
},
```

This means the React app calls `/api/merge` (same origin), and Vite forwards it to `http://localhost:5000/api/merge`. No CORS issues, no hardcoded backend URL in the frontend code. In production, a reverse proxy (Nginx, Caddy, etc.) would serve the same purpose.

---

## 6. Code Snippets — Key Implementation Details

### 6.1 File Upload with Progress Tracking

```js
// frontend/src/utils/api.js
export async function callApi(endpoint, formData, onProgress) {
  const res = await axios.post(`/api/${endpoint}`, formData, {
    responseType: 'blob',
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if (onProgress && e.total)
        onProgress(Math.round((e.loaded / e.total) * 50)); // 0–50%
    },
    onDownloadProgress: (e) => {
      if (onProgress && e.total)
        onProgress(50 + Math.round((e.loaded / e.total) * 50)); // 50–100%
    },
  });
  return res;
}
```

Upload progress covers 0–50% (file going to server), download progress covers 50–100% (processed file coming back). This gives the user a realistic sense of both phases.

---

### 6.2 Merging PDFs with pdf-lib

```js
// backend/routes/merge.js
const merged = await PDFDocument.create();

for (const file of files) {
  const bytes = fs.readFileSync(file.path);
  const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const pages = await merged.copyPages(pdf, pdf.getPageIndices());
  pages.forEach(p => merged.addPage(p));
}

const result = await merged.save({ useObjectStreams: true });
```

`ignoreEncryption: true` allows loading password-protected PDFs without a password (to copy pages only). `useObjectStreams` enables cross-reference stream compression (more efficient than the classic cross-reference table format).

---

### 6.3 Drawing a Text Watermark

```js
// backend/routes/watermark.js
page.drawText(text, {
  x: width / 2 - textWidth / 2,  // centered horizontally
  y: height / 2 - textHeight / 2, // centered vertically
  size: fontSize,
  font,
  color: rgb(r, g, b),
  opacity: 0.3,
  rotate: degrees(45),            // diagonal watermark
});
```

The `degrees()` helper converts a number to pdf-lib's `Rotation` type. The origin (0,0) in PDF coordinates is the **bottom-left corner** — so `y` increases upward.

---

### 6.4 Rendering a PDF Page to an Image (Node.js)

```js
// backend/routes/pdfToImage.js
const pdfDoc = await pdfjsLib.getDocument({ data: bytes, disableWorker: true }).promise;
const page = await pdfDoc.getPage(pageNum);
const viewport = page.getViewport({ scale: 2.0 }); // 2× = ~144 DPI

const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
const ctx = canvas.getContext('2d');

await page.render({ canvasContext: ctx, viewport }).promise;

const buffer = canvas.toBuffer('image/png');
```

`disableWorker: true` is required in Node.js because Web Workers are not available outside the browser. pdfjs-dist then runs synchronously in the main thread.

---

### 6.5 Adding Page Numbers

```js
// backend/routes/pageNumbers.js
for (let i = 0; i < totalPages; i++) {
  const page = pdf.getPage(i);
  const { width, height } = page.getSize();
  const pageNum = i + start;

  const label = `Page ${pageNum} of ${totalPages + start - 1}`;
  const textWidth = font.widthOfTextAtSize(label, fSize);

  // Bottom-center position
  const x = width / 2 - textWidth / 2;
  const y = margin;

  page.drawText(label, { x, y, size: fSize, font, color: rgb(0, 0, 0) });
}
```

`font.widthOfTextAtSize()` measures the rendered text width precisely so it can be horizontally aligned correctly regardless of the text content.

---

### 6.6 Splitting into Custom Page Ranges

```js
// backend/routes/split.js
function parseRanges(rangeStr, totalPages) {
  const ranges = [];
  const parts = rangeStr.split(',').map(s => s.trim());

  for (const part of parts) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(n => parseInt(n.trim(), 10));
      if (start >= 1 && end <= totalPages && start <= end) {
        ranges.push({ start: start - 1, end: end - 1 }); // convert to 0-index
      }
    } else {
      const n = parseInt(part, 10);
      if (n >= 1 && n <= totalPages) {
        ranges.push({ start: n - 1, end: n - 1 });
      }
    }
  }
  return ranges;
}
```

User-facing page numbers are 1-indexed. Internally, pdf-lib uses 0-indexed pages. The conversion happens here.

---

### 6.7 Shared ToolLayout Component

```jsx
// frontend/src/components/ToolLayout.jsx (simplified)
export default function ToolLayout({ title, onProcess, processing, progress, result, onDownload, onReset, children }) {
  return result ? (
    // Success state: show download button
    <SuccessPanel onDownload={onDownload} onReset={onReset} />
  ) : (
    <>
      {/* Tool-specific form goes here */}
      {children}

      {processing ? (
        // Progress bar
        <ProgressPanel progress={progress} />
      ) : (
        // Process button
        <button onClick={onProcess}>Process</button>
      )}
    </>
  );
}
```

By moving all state transitions (idle → processing → done) into the layout, each tool page only manages its own form state and the API call.

---

### 6.8 Organizer Page — Reading PDF Page Count in the Browser

```js
// frontend/src/pages/OrganizePdf.jsx
const { getDocument, GlobalWorkerOptions } = await import('pdfjs-dist');

// Use CDN-hosted worker to avoid bundling complexity
GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

const arrayBuf = await file.arrayBuffer();
const pdf = await getDocument({ data: arrayBuf }).promise;
const count = pdf.numPages; // e.g. 12

// Build page list for the UI
setPages(Array.from({ length: count }, (_, i) => ({
  id: i, num: i, label: `Page ${i + 1}`,
})));
```

pdfjs-dist is imported dynamically (`await import(...)`) so it only loads when the user opens the Organize page. This keeps the initial bundle small.

---

## 7. Future Work

The following features and improvements are planned or recommended for future development:

### 7.1 New Tools

| Feature | Description | Key Libraries |
|---------|-------------|--------------|
| **OCR PDF** | Extract text from scanned PDFs using optical character recognition | `tesseract.js` (browser-side OCR) |
| **Edit PDF** | Add annotations, highlight text, draw shapes, insert text boxes | `pdf-lib`, custom canvas overlay |
| **Sign PDF** | Draw, type, or upload a signature and place it on any page | `pdf-lib`, HTML Canvas for signature pad |
| **PDF to Word** | Convert PDF text content to a `.docx` file | LibreOffice CLI or `docx` npm package |
| **Word/Excel/PPT to PDF** | Convert Office documents to PDF | LibreOffice CLI (`soffice --convert-to pdf`) |
| **Compare PDFs** | Highlight differences between two PDF versions | diff algorithms on extracted text |
| **Repair PDF** | Attempt to fix corrupted or malformed PDFs | QPDF `--recover` flag |
| **Crop PDF** | Remove white margins or crop to a specific area | `pdf-lib` page media box manipulation |
| **Flatten PDF** | Flatten form fields and annotations into static content | `pdf-lib` |
| **PDF to PDF/A** | Convert standard PDF to archival PDF/A format | Ghostscript (`-dPDFA`) |

---

### 7.2 Better Compression

The current compress feature uses pdf-lib's object stream format, which saves 5–20%. True compression requires:

- **Ghostscript**: `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook`
- PDF settings: `/screen` (72 DPI), `/ebook` (150 DPI), `/printer` (300 DPI), `/prepress`
- This can reduce file size by 60–90% for image-heavy PDFs

---

### 7.3 Page Thumbnails

On the Organize PDF page, showing actual rendered page thumbnails (instead of "Page 1", "Page 2" labels) would greatly improve usability:

```js
// Render each page to a small canvas for the thumbnail
const page = await pdf.getPage(i);
const viewport = page.getViewport({ scale: 0.3 }); // small thumbnail
const canvas = document.createElement('canvas');
await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
const dataUrl = canvas.toDataURL();
```

---

### 7.4 Drag-and-Drop Page Reordering

The `@dnd-kit/core` and `@dnd-kit/sortable` packages are already installed. The Organize page currently uses up/down arrow buttons. A full drag-and-drop implementation with animated reordering would be a natural upgrade.

---

### 7.5 Native PDF Protection (No QPDF)

Implement PDF RC4-128 or AES-256 encryption in pure JavaScript using Node's built-in `crypto` module, eliminating the QPDF dependency for the Protect PDF feature. The PDF standard security handler specification (ISO 32000) documents the exact algorithm.

---

### 7.6 Production Deployment

For deploying this app to a server or cloud:

1. **Build the frontend**: `cd frontend && npm run build` → creates `frontend/dist/`
2. **Serve static files from Express**:
   ```js
   app.use(express.static(path.join(__dirname, '../frontend/dist')));
   app.get('*', (req, res) =>
     res.sendFile(path.join(__dirname, '../frontend/dist/index.html')));
   ```
3. **Use a process manager**: `pm2 start server.js` (auto-restarts on crash)
4. **Reverse proxy with Nginx**: point port 80/443 → 5000
5. **HTTPS**: use Let's Encrypt / Certbot for SSL

---

### 7.7 Cloud Storage Integration

For large-scale deployment, move file storage from local disk to:
- **AWS S3** or **Cloudflare R2** for temporary file storage
- Pre-signed URLs for secure direct client uploads (bypasses the Node.js server for large files)
- Automatic S3 lifecycle rules to delete files after 1 hour

---

### 7.8 User Accounts and History

- Authentication via JWT or OAuth (Google, GitHub)
- Save processing history: each user can see their past operations
- Re-download processed files within 24 hours
- Stored in PostgreSQL or MongoDB

---

### 7.9 API Access

Expose the processing endpoints as a documented REST API so developers can integrate PDF operations into their own applications:

```
POST /api/v1/merge          → returns merged PDF
POST /api/v1/compress       → returns compressed PDF
POST /api/v1/pdf-to-image   → returns ZIP of images
```

Include API keys, rate limiting (express-rate-limit), and a Swagger/OpenAPI documentation page.

---

### 7.10 Mobile App

Using **React Native** or **Capacitor** (which can wrap the existing React web app), the same PDF tools can be packaged as a mobile app for iOS and Android.

---

*End of Documentation*
