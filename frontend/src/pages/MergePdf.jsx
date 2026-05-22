import { useState } from 'react';
import { HiOutlineDocumentDuplicate } from 'react-icons/hi';
import toast from 'react-hot-toast';
import ToolLayout from '../components/ToolLayout';
import FileDropper from '../components/FileDropper';
import { callApi, downloadBlob } from '../utils/api';

export default function MergePdf() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);

  const handleProcess = async () => {
    if (files.length < 2) return toast.error('Please add at least 2 PDF files to merge.');
    setProcessing(true);
    setProgress(0);
    try {
      const form = new FormData();
      files.forEach(f => form.append('files', f));
      const res = await callApi('merge', form, setProgress);
      setResult(res.data);
      setProgress(100);
      toast.success('PDFs merged successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to merge PDFs.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => downloadBlob(result, 'merged.pdf');
  const handleReset = () => { setFiles([]); setResult(null); setProgress(0); };

  return (
    <ToolLayout
      title="Merge PDF"
      description="Combine multiple PDF files into one document in the order you choose."
      icon={HiOutlineDocumentDuplicate}
      color="#e2231a"
      bg="#fff0f0"
      onProcess={handleProcess}
      processing={processing}
      progress={progress}
      result={result}
      resultName="merged.pdf"
      onDownload={handleDownload}
      onReset={handleReset}
      processLabel="Merge PDFs"
      canProcess={files.length >= 2}
    >
      <FileDropper
        files={files}
        setFiles={setFiles}
        multiple
        label="Select PDF files to merge"
        accept={{ 'application/pdf': ['.pdf'] }}
      />
      {files.length > 0 && files.length < 2 && (
        <p className="mt-3 text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-lg">
          Add at least one more PDF file to merge.
        </p>
      )}
      {files.length >= 2 && (
        <p className="mt-3 text-sm text-green-600 bg-green-50 px-4 py-2 rounded-lg">
          {files.length} files ready to merge. You can drag to reorder them above.
        </p>
      )}
    </ToolLayout>
  );
}
