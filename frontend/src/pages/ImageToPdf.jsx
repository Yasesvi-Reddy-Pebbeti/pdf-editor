import { useState } from 'react';
import { HiOutlineCollection } from 'react-icons/hi';
import toast from 'react-hot-toast';
import ToolLayout from '../components/ToolLayout';
import FileDropper from '../components/FileDropper';
import { callApi, downloadBlob } from '../utils/api';

export default function ImageToPdf() {
  const [files, setFiles] = useState([]);
  const [orientation, setOrientation] = useState('auto');
  const [margin, setMargin] = useState('0');
  const [fitToPage, setFitToPage] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);

  const handleProcess = async () => {
    if (!files.length) return toast.error('Please upload at least one image.');
    setProcessing(true);
    setProgress(0);
    try {
      const form = new FormData();
      files.forEach(f => form.append('files', f));
      form.append('orientation', orientation);
      form.append('margin', margin);
      form.append('fitToPage', String(fitToPage));
      const res = await callApi('image-to-pdf', form, setProgress);
      setResult(res.data);
      setProgress(100);
      toast.success('Images converted to PDF!');
    } catch (err) {
      toast.error(err.message || 'Failed to convert images to PDF.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => downloadBlob(result, 'images.pdf');
  const handleReset = () => { setFiles([]); setResult(null); setProgress(0); };

  return (
    <ToolLayout
      title="Image to PDF"
      description="Convert JPG, PNG, and other images into a single PDF document."
      icon={HiOutlineCollection}
      color="#475569"
      bg="#f8fafc"
      onProcess={handleProcess}
      processing={processing}
      progress={progress}
      result={result}
      resultName="images.pdf"
      onDownload={handleDownload}
      onReset={handleReset}
      processLabel={`Convert ${files.length || ''} Image${files.length !== 1 ? 's' : ''} to PDF`}
      canProcess={files.length > 0}
    >
      <FileDropper
        files={files}
        setFiles={setFiles}
        multiple
        accept={{ 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'], 'image/webp': ['.webp'], 'image/gif': ['.gif'] }}
        label="Select images to convert"
      />

      {files.length > 0 && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Orientation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Page orientation</label>
            <select value={orientation} onChange={e => setOrientation(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400">
              <option value="auto">Auto detect</option>
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>

          {/* Margin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Margin <span className="text-gray-400 text-xs">(points)</span>
            </label>
            <input type="number" value={margin} onChange={e => setMargin(e.target.value)} min="0" max="100"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400" />
          </div>

          {/* Fit to page */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fit image to page</label>
            <button type="button" onClick={() => setFitToPage(!fitToPage)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                fitToPage ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-600'
              }`}>
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${fitToPage ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                {fitToPage && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>}
              </div>
              {fitToPage ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
