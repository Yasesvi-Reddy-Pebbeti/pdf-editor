import { useState } from 'react';
import { HiOutlinePhotograph } from 'react-icons/hi';
import toast from 'react-hot-toast';
import ToolLayout from '../components/ToolLayout';
import FileDropper from '../components/FileDropper';
import { callApi, downloadBlob } from '../utils/api';

export default function PdfToImage() {
  const [files, setFiles] = useState([]);
  const [format, setFormat] = useState('png');
  const [scale, setScale] = useState('2');
  const [pages, setPages] = useState('all');
  const [customPages, setCustomPages] = useState('');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [resultName, setResultName] = useState('pdf_images.zip');

  const handleProcess = async () => {
    if (!files.length) return toast.error('Please upload a PDF file.');
    setProcessing(true);
    setProgress(0);
    try {
      const form = new FormData();
      form.append('file', files[0]);
      form.append('format', format);
      form.append('scale', scale);
      form.append('pages', pages === 'all' ? 'all' : customPages);
      const res = await callApi('pdf-to-image', form, setProgress);
      setResult(res.data);
      setProgress(100);
      const ct = res.headers['content-type'] || '';
      if (ct.includes('zip')) setResultName('pdf_images.zip');
      else setResultName(`page.${format}`);
      toast.success('PDF converted to images!');
    } catch (err) {
      toast.error(err.message || 'Failed to convert PDF to images.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => downloadBlob(result, resultName);
  const handleReset = () => { setFiles([]); setResult(null); setProgress(0); };

  return (
    <ToolLayout
      title="PDF to Image"
      description="Convert PDF pages to high-quality PNG or JPG images."
      icon={HiOutlinePhotograph}
      color="#ea580c"
      bg="#fff7ed"
      onProcess={handleProcess}
      processing={processing}
      progress={progress}
      result={result}
      resultName={resultName}
      onDownload={handleDownload}
      onReset={handleReset}
      processLabel="Convert to Images"
      canProcess={files.length > 0}
    >
      <FileDropper files={files} setFiles={setFiles} label="Select a PDF file to convert" />

      {files.length > 0 && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image format</label>
            <div className="flex gap-2">
              {['png', 'jpg'].map(f => (
                <button key={f} type="button" onClick={() => setFormat(f)}
                  className={`flex-1 py-2 rounded-lg border-2 text-sm font-semibold uppercase transition-all ${
                    format === f ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Quality/Scale */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resolution <span className="text-gray-400 text-xs">(scale factor)</span>
            </label>
            <select value={scale} onChange={e => setScale(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
              <option value="1">72 DPI (web)</option>
              <option value="1.5">108 DPI</option>
              <option value="2">144 DPI (recommended)</option>
              <option value="3">216 DPI (high quality)</option>
              <option value="4">288 DPI (print quality)</option>
            </select>
          </div>

          {/* Pages */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Pages to convert</label>
            <div className="flex gap-2 mb-3">
              {[
                { value: 'all', label: 'All pages' },
                { value: 'custom', label: 'Specific pages' },
              ].map(({ value, label }) => (
                <button key={value} type="button" onClick={() => setPages(value)}
                  className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                    pages === value ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}>
                  {label}
                </button>
              ))}
            </div>
            {pages === 'custom' && (
              <input type="text" value={customPages} onChange={e => setCustomPages(e.target.value)}
                placeholder="e.g. 1, 3, 5-8"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            )}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
