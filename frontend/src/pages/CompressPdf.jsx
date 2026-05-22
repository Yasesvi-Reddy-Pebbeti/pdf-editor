import { useState } from 'react';
import { HiOutlineArrowsExpand } from 'react-icons/hi';
import toast from 'react-hot-toast';
import ToolLayout from '../components/ToolLayout';
import FileDropper from '../components/FileDropper';
import { callApi, downloadBlob } from '../utils/api';

const LEVELS = [
  { value: 'low', label: 'Low Compression', desc: 'Best quality, moderate size reduction' },
  { value: 'medium', label: 'Medium Compression', desc: 'Balanced quality and size', recommended: true },
  { value: 'high', label: 'High Compression', desc: 'Smaller file, slight quality reduction' },
];

function formatBytes(bytes) {
  if (!bytes) return '';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function CompressPdf() {
  const [files, setFiles] = useState([]);
  const [level, setLevel] = useState('medium');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [stats, setStats] = useState(null);

  const handleProcess = async () => {
    if (!files.length) return toast.error('Please upload a PDF file.');
    setProcessing(true);
    setProgress(0);
    try {
      const form = new FormData();
      form.append('file', files[0]);
      form.append('level', level);
      const res = await callApi('compress', form, setProgress);
      setResult(res.data);
      setProgress(100);
      const orig = parseInt(res.headers['x-original-size'] || '0');
      const comp = parseInt(res.headers['x-compressed-size'] || '0');
      const pct = parseInt(res.headers['x-reduction-percent'] || '0');
      setStats({ orig, comp, pct });
      toast.success('PDF compressed successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to compress PDF.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => downloadBlob(result, 'compressed.pdf');
  const handleReset = () => { setFiles([]); setResult(null); setProgress(0); setStats(null); };

  return (
    <ToolLayout
      title="Compress PDF"
      description="Reduce the file size of your PDF documents while maintaining the best quality."
      icon={HiOutlineArrowsExpand}
      color="#16a34a"
      bg="#f0fdf4"
      onProcess={handleProcess}
      processing={processing}
      progress={progress}
      result={result}
      resultName="compressed.pdf"
      onDownload={handleDownload}
      onReset={handleReset}
      processLabel="Compress PDF"
      canProcess={files.length > 0}
    >
      {result && stats ? (
        <div className="text-center py-4">
          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Original</p>
              <p className="font-bold text-gray-800">{formatBytes(stats.orig)}</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Saved</p>
              <p className="font-bold text-green-600">-{stats.pct}%</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Compressed</p>
              <p className="font-bold text-gray-800">{formatBytes(stats.comp)}</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <FileDropper files={files} setFiles={setFiles} label="Select a PDF file to compress" />
          {files.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="font-semibold text-gray-800">Compression level</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {LEVELS.map(({ value, label, desc, recommended }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setLevel(value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all relative ${
                      level === value ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    {recommended && (
                      <span className="absolute top-2 right-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                        Recommended
                      </span>
                    )}
                    <p className={`font-semibold text-sm ${level === value ? 'text-green-700' : 'text-gray-800'}`}>{label}</p>
                    <p className="text-xs text-gray-400 mt-1">{desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </ToolLayout>
  );
}
