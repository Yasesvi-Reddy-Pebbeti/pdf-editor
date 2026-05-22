import { useState } from 'react';
import { HiOutlineScissors } from 'react-icons/hi';
import toast from 'react-hot-toast';
import ToolLayout from '../components/ToolLayout';
import FileDropper from '../components/FileDropper';
import { callApi, downloadBlob } from '../utils/api';

const MODES = [
  { value: 'all', label: 'Extract all pages', desc: 'Each page becomes its own PDF' },
  { value: 'interval', label: 'Split every N pages', desc: 'Split into equal-sized chunks' },
  { value: 'ranges', label: 'Custom ranges', desc: 'Specify page ranges like 1-3, 4-6' },
];

export default function SplitPdf() {
  const [files, setFiles] = useState([]);
  const [mode, setMode] = useState('all');
  const [interval, setInterval] = useState('1');
  const [ranges, setRanges] = useState('');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [resultName, setResultName] = useState('split.zip');

  const handleProcess = async () => {
    if (!files.length) return toast.error('Please upload a PDF file.');
    if (mode === 'ranges' && !ranges.trim()) return toast.error('Please enter page ranges.');
    setProcessing(true);
    setProgress(0);
    try {
      const form = new FormData();
      form.append('file', files[0]);
      form.append('mode', mode);
      form.append('interval', interval);
      form.append('ranges', ranges);
      const res = await callApi('split', form, setProgress);
      setResult(res.data);
      setProgress(100);
      const ct = res.headers['content-type'] || '';
      setResultName(ct.includes('zip') ? 'split_pages.zip' : 'split.pdf');
      toast.success('PDF split successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to split PDF.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => downloadBlob(result, resultName);
  const handleReset = () => { setFiles([]); setResult(null); setProgress(0); };

  return (
    <ToolLayout
      title="Split PDF"
      description="Separate one page or a whole set for easy conversion into independent PDF files."
      icon={HiOutlineScissors}
      color="#d97706"
      bg="#fffbeb"
      onProcess={handleProcess}
      processing={processing}
      progress={progress}
      result={result}
      resultName={resultName}
      onDownload={handleDownload}
      onReset={handleReset}
      processLabel="Split PDF"
      canProcess={files.length > 0}
    >
      <FileDropper files={files} setFiles={setFiles} label="Select a PDF file to split" />

      {files.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="font-semibold text-gray-800">Split mode</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {MODES.map(({ value, label, desc }) => (
              <button
                key={value}
                type="button"
                onClick={() => setMode(value)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  mode === value
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <p className={`font-semibold text-sm ${mode === value ? 'text-primary-700' : 'text-gray-800'}`}>{label}</p>
                <p className="text-xs text-gray-400 mt-1">{desc}</p>
              </button>
            ))}
          </div>

          {mode === 'interval' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pages per chunk</label>
              <input
                type="number"
                min="1"
                value={interval}
                onChange={e => setInterval(e.target.value)}
                className="w-32 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>
          )}

          {mode === 'ranges' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Page ranges <span className="text-gray-400 font-normal">(e.g. 1-3, 4, 5-7)</span>
              </label>
              <input
                type="text"
                value={ranges}
                onChange={e => setRanges(e.target.value)}
                placeholder="1-3, 4-6, 7"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>
          )}
        </div>
      )}
    </ToolLayout>
  );
}
