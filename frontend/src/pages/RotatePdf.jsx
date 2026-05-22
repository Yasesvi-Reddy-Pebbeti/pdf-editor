import { useState } from 'react';
import { HiOutlineRefresh } from 'react-icons/hi';
import toast from 'react-hot-toast';
import ToolLayout from '../components/ToolLayout';
import FileDropper from '../components/FileDropper';
import { callApi, downloadBlob } from '../utils/api';

const ANGLES = [
  { value: '90', label: '90° Clockwise' },
  { value: '-90', label: '90° Counter-clockwise' },
  { value: '180', label: '180°' },
];

export default function RotatePdf() {
  const [files, setFiles] = useState([]);
  const [rotation, setRotation] = useState('90');
  const [pagesMode, setPagesMode] = useState('all');
  const [customPages, setCustomPages] = useState('');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);

  const handleProcess = async () => {
    if (!files.length) return toast.error('Please upload a PDF file.');
    setProcessing(true);
    setProgress(0);
    try {
      const form = new FormData();
      form.append('file', files[0]);
      form.append('rotation', rotation);
      form.append('pages', pagesMode === 'all' ? 'all' : customPages);
      const res = await callApi('rotate', form, setProgress);
      setResult(res.data);
      setProgress(100);
      toast.success('PDF rotated successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to rotate PDF.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => downloadBlob(result, 'rotated.pdf');
  const handleReset = () => { setFiles([]); setResult(null); setProgress(0); };

  return (
    <ToolLayout
      title="Rotate PDF"
      description="Rotate your PDF pages to the correct orientation. Rotate all or individual pages."
      icon={HiOutlineRefresh}
      color="#ca8a04"
      bg="#fefce8"
      onProcess={handleProcess}
      processing={processing}
      progress={progress}
      result={result}
      resultName="rotated.pdf"
      onDownload={handleDownload}
      onReset={handleReset}
      processLabel="Rotate PDF"
      canProcess={files.length > 0}
    >
      <FileDropper files={files} setFiles={setFiles} label="Select a PDF file to rotate" />

      {files.length > 0 && (
        <div className="mt-6 space-y-5">
          {/* Rotation angle */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Rotation angle</h3>
            <div className="flex flex-wrap gap-3">
              {ANGLES.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRotation(value)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                    rotation === value
                      ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <HiOutlineRefresh
                    className="w-4 h-4"
                    style={{ transform: value === '-90' ? 'scaleX(-1)' : '' }}
                  />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Pages selection */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Pages to rotate</h3>
            <div className="flex gap-3 mb-3">
              {[
                { value: 'all', label: 'All pages' },
                { value: 'custom', label: 'Specific pages' },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPagesMode(value)}
                  className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                    pagesMode === value
                      ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {pagesMode === 'custom' && (
              <input
                type="text"
                value={customPages}
                onChange={e => setCustomPages(e.target.value)}
                placeholder="e.g. 1, 3, 5-8"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            )}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
