import * as pdfjsLib from 'pdfjs-dist';

// Configure the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

const PDF_STORAGE_KEY = 'lenda_pdfs';

/**
 * Extract all text from a PDF file, page by page.
 * @param {File|ArrayBuffer} source - PDF file or ArrayBuffer
 * @returns {Promise<{ pages: string[], fullText: string }>}
 */
export async function extractTextFromPDF(source, onProgress) {
  const arrayBuffer = source instanceof File ? await source.arrayBuffer() : source;
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map(item => item.str).join(' ');
    pages.push(text);
    onProgress?.(i, pdf.numPages);
  }

  return { pages, fullText: pages.join('\n\n'), totalPages: pdf.numPages };
}

/**
 * Search for a query within a PDF's text content.
 * @returns {Promise<{ page: number, snippet: string }[]>}
 */
export async function searchInPDF(source, query) {
  const { pages } = await extractTextFromPDF(source);
  const results = [];
  const lowerQuery = query.toLowerCase();

  pages.forEach((text, idx) => {
    const lowerText = text.toLowerCase();
    let pos = lowerText.indexOf(lowerQuery);
    while (pos !== -1) {
      const start = Math.max(0, pos - 60);
      const end = Math.min(text.length, pos + query.length + 60);
      results.push({
        page: idx + 1,
        snippet: (start > 0 ? '...' : '') + text.slice(start, end) + (end < text.length ? '...' : ''),
        position: pos
      });
      pos = lowerText.indexOf(lowerQuery, pos + 1);
    }
  });

  return results;
}

/**
 * Save a PDF reference to localStorage (metadata only, not the file itself).
 */
export function savePDFMeta(name, fileSize, pageCount) {
  const list = listSavedPDFs();
  const id = `pdf_${Date.now()}`;
  list.push({ id, name, fileSize, pageCount, addedAt: new Date().toISOString() });
  localStorage.setItem(PDF_STORAGE_KEY, JSON.stringify(list));
  return id;
}

/**
 * List all saved PDF metadata from localStorage.
 */
export function listSavedPDFs() {
  try {
    return JSON.parse(localStorage.getItem(PDF_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

/**
 * Remove a PDF reference from localStorage.
 */
export function removePDFMeta(id) {
  const list = listSavedPDFs().filter(p => p.id !== id);
  localStorage.setItem(PDF_STORAGE_KEY, JSON.stringify(list));
}

/**
 * Format file size for display.
 */
export function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}
