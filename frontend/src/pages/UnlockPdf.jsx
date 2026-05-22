import { useState } from 'react';
import { HiOutlineLockOpen } from 'react-icons/hi';
import toast from 'react-hot-toast';
import ToolLayout from '../components/ToolLayout';
import FileDropper from '../components/FileDropper';
import { callApi, downloadBlob } from '../utils/api';

export default function UnlockPdf() {
  const [files, setFiles] = useState([]);
  const [password, setPassword] = useState('');
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
      form.append('password', password);
      const res = await callApi('unlock', form, setProgress);
      setResult(res.data);
      setProgress(100);
      toast.success('PDF unlocked successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to unlock PDF. Check the password and try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => downloadBlob(result, 'unlocked.pdf');
  const handleReset = () => { setFiles([]); setResult(null); setProgress(0); setPassword(''); };

  return (
    <ToolLayout
      title="Unlock PDF"
      description="Remove password protection from your PDF. You must know the current password."
      icon={HiOutlineLockOpen}
      color="#0d9488"
      bg="#f0fdfa"
      onProcess={handleProcess}
      processing={processing}
      progress={progress}
      result={result}
      resultName="unlocked.pdf"
      onDownload={handleDownload}
      onReset={handleReset}
      processLabel="Unlock PDF"
      canProcess={files.length > 0}
    >
      <FileDropper files={files} setFiles={setFiles} label="Select a protected PDF file" />

      {files.length > 0 && (
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            PDF password <span className="text-gray-400 text-xs">(leave empty if not password-protected)</span>
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter the PDF password"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>
      )}
    </ToolLayout>
  );
}
