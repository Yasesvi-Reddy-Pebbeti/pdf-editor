import axios from 'axios';

// In development: Vite proxies /api → localhost:5000 (no env var needed)
// In production:  set VITE_API_URL=https://your-backend.railway.app in Vercel
const BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

export async function callApi(endpoint, formData, onProgress) {
  const res = await axios.post(`${BASE}/${endpoint}`, formData, {
    responseType: 'blob',
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if (onProgress && e.total) onProgress(Math.round((e.loaded / e.total) * 50));
    },
    onDownloadProgress: (e) => {
      if (onProgress && e.total) onProgress(50 + Math.round((e.loaded / e.total) * 50));
    },
  });

  // Check if server returned JSON error inside a blob
  const contentType = res.headers['content-type'] || '';
  if (contentType.includes('application/json')) {
    const text = await res.data.text();
    const json = JSON.parse(text);
    throw new Error(json.error || 'An error occurred');
  }

  return res;
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
