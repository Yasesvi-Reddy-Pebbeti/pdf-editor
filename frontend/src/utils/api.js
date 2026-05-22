import axios from 'axios';

// Normalise whatever the user typed as VITE_API_URL:
//   https://xxx.railway.app        → https://xxx.railway.app/api
//   https://xxx.railway.app/       → https://xxx.railway.app/api
//   https://xxx.railway.app/api    → https://xxx.railway.app/api  (already correct)
//   https://xxx.railway.app/api/   → https://xxx.railway.app/api
const rawUrl = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
const BASE = rawUrl
  ? rawUrl.endsWith('/api') ? rawUrl : `${rawUrl}/api`
  : '/api';

// Open browser console (F12) to confirm the URL is correct
console.log('[PDFEditor] API base:', BASE);

export async function callApi(endpoint, formData, onProgress) {
  const url = `${BASE}/${endpoint}`;
  try {
    const res = await axios.post(url, formData, {
      responseType: 'blob',
      // ✅ Do NOT set Content-Type manually — axios sets it automatically
      // with the correct multipart boundary when given a FormData object.
      // Setting it manually strips the boundary and breaks file uploads.
      onUploadProgress: (e) => {
        if (onProgress && e.total) onProgress(Math.round((e.loaded / e.total) * 50));
      },
      onDownloadProgress: (e) => {
        if (onProgress && e.total) onProgress(50 + Math.round((e.loaded / e.total) * 50));
      },
    });

    // Check if server returned a JSON error wrapped in a blob
    const contentType = res.headers['content-type'] || '';
    if (contentType.includes('application/json')) {
      const text = await res.data.text();
      const json = JSON.parse(text);
      throw new Error(json.error || 'An error occurred');
    }

    return res;
  } catch (err) {
    // Network-level failure (backend unreachable)
    if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
      throw new Error('Cannot reach the backend. Check VITE_API_URL in Vercel environment variables.');
    }

    // Server responded with a non-2xx status — try to read the error body
    if (err.response?.data instanceof Blob) {
      try {
        const text = await err.response.data.text();
        const json = JSON.parse(text);
        throw new Error(json.error || `Server error ${err.response.status}`);
      } catch (inner) {
        // If inner is our own error, re-throw it
        if (inner.message !== `Server error ${err.response?.status}` && !inner.message.includes('JSON')) {
          throw inner;
        }
      }
    }

    throw err;
  }
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
