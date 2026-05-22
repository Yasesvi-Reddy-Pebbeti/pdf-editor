import { useState } from 'react';
import { HiOutlineLockClosed, HiInformationCircle } from 'react-icons/hi';
import toast from 'react-hot-toast';
import ToolLayout from '../components/ToolLayout';
import FileDropper from '../components/FileDropper';
import { callApi, downloadBlob } from '../utils/api';

export default function ProtectPdf() {
  const [files, setFiles] = useState([]);
  const [userPwd, setUserPwd] = useState('');
  const [ownerPwd, setOwnerPwd] = useState('');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [qpdfError, setQpdfError] = useState(false);

  const handleProcess = async () => {
    if (!files.length) return toast.error('Please upload a PDF file.');
    if (!userPwd && !ownerPwd) return toast.error('Please enter at least one password.');
    setProcessing(true);
    setQpdfError(false);
    setProgress(0);
    try {
      const form = new FormData();
      form.append('file', files[0]);
      form.append('userPassword', userPwd);
      form.append('ownerPassword', ownerPwd);
      const res = await callApi('protect', form, setProgress);
      setResult(res.data);
      setProgress(100);
      toast.success('PDF protected successfully!');
    } catch (err) {
      if (err.message?.includes('QPDF') || err.message?.includes('qpdf')) {
        setQpdfError(true);
      } else {
        toast.error(err.message || 'Failed to protect PDF.');
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => downloadBlob(result, 'protected.pdf');
  const handleReset = () => { setFiles([]); setResult(null); setProgress(0); setQpdfError(false); };

  return (
    <ToolLayout
      title="Protect PDF"
      description="Add a password to your PDF file to restrict opening or editing."
      icon={HiOutlineLockClosed}
      color="#9333ea"
      bg="#faf5ff"
      onProcess={handleProcess}
      processing={processing}
      progress={progress}
      result={result}
      resultName="protected.pdf"
      onDownload={handleDownload}
      onReset={handleReset}
      processLabel="Protect PDF"
      canProcess={files.length > 0 && (!!userPwd || !!ownerPwd)}
    >
      {qpdfError && (
        <div className="mb-5 flex gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <HiInformationCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">QPDF Required</p>
            <p className="text-sm text-amber-700 mt-1">
              PDF password protection requires <strong>QPDF</strong> to be installed on the server.
              Please install it from{' '}
              <a href="https://qpdf.sourceforge.io/" target="_blank" rel="noopener noreferrer" className="underline">
                qpdf.sourceforge.io
              </a>{' '}
              and add it to your system PATH, then restart the backend.
            </p>
          </div>
        </div>
      )}
      <FileDropper files={files} setFiles={setFiles} label="Select a PDF file to protect" />

      {files.length > 0 && (
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User password <span className="text-gray-400 text-xs">(required to open)</span>
            </label>
            <input
              type="password"
              value={userPwd}
              onChange={e => setUserPwd(e.target.value)}
              placeholder="Enter user password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Owner password <span className="text-gray-400 text-xs">(required to edit/print)</span>
            </label>
            <input
              type="password"
              value={ownerPwd}
              onChange={e => setOwnerPwd(e.target.value)}
              placeholder="Enter owner password (optional)"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <p className="text-xs text-gray-400">
            Tip: Leave owner password empty to use the same as user password.
          </p>
        </div>
      )}
    </ToolLayout>
  );
}
