import { useState, useCallback } from 'react';
import { HiOutlineViewGrid, HiX, HiArrowUp, HiArrowDown, HiPlus } from 'react-icons/hi';
import toast from 'react-hot-toast';
import ToolLayout from '../components/ToolLayout';
import FileDropper from '../components/FileDropper';
import { callApi, downloadBlob } from '../utils/api';

export default function OrganizePdf() {
  const [files, setFiles] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [pages, setPages] = useState([]); // [{id, num, label}]
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);

  const handleFilesChange = useCallback(async (newFiles) => {
    setFiles(newFiles);
    setResult(null);
    if (!newFiles.length) { setPages([]); setPageCount(0); return; }
    // Read page count using PDF.js in browser
    try {
      const { getDocument, GlobalWorkerOptions } = await import('pdfjs-dist');
      GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
      const arrayBuf = await newFiles[0].arrayBuffer();
      const pdf = await getDocument({ data: arrayBuf }).promise;
      const count = pdf.numPages;
      setPageCount(count);
      setPages(Array.from({ length: count }, (_, i) => ({ id: i, num: i, label: `Page ${i + 1}` })));
    } catch {
      toast.error('Could not read PDF page count.');
      setPageCount(0);
      setPages([]);
    }
  }, []);

  const deletePage = (id) => setPages(prev => prev.filter(p => p.id !== id));
  const moveUp = (idx) => {
    if (idx === 0) return;
    setPages(prev => { const a = [...prev]; [a[idx - 1], a[idx]] = [a[idx], a[idx - 1]]; return a; });
  };
  const moveDown = (idx) => {
    setPages(prev => {
      if (idx === prev.length - 1) return prev;
      const a = [...prev]; [a[idx], a[idx + 1]] = [a[idx + 1], a[idx]]; return a;
    });
  };
  const restoreAll = () => setPages(Array.from({ length: pageCount }, (_, i) => ({ id: i, num: i, label: `Page ${i + 1}` })));

  const handleProcess = async () => {
    if (!files.length) return toast.error('Please upload a PDF file.');
    if (!pages.length) return toast.error('No pages selected.');
    setProcessing(true);
    setProgress(0);
    try {
      const form = new FormData();
      form.append('file', files[0]);
      form.append('pageOrder', JSON.stringify(pages.map(p => p.num)));
      const res = await callApi('organize', form, setProgress);
      setResult(res.data);
      setProgress(100);
      toast.success('PDF organized successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to organize PDF.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => downloadBlob(result, 'organized.pdf');
  const handleReset = () => { setFiles([]); setResult(null); setProgress(0); setPages([]); setPageCount(0); };

  return (
    <ToolLayout
      title="Organize PDF"
      description="Reorder or delete pages from your PDF document."
      icon={HiOutlineViewGrid}
      color="#4f46e5"
      bg="#eef2ff"
      onProcess={handleProcess}
      processing={processing}
      progress={progress}
      result={result}
      resultName="organized.pdf"
      onDownload={handleDownload}
      onReset={handleReset}
      processLabel={`Apply Changes (${pages.length} pages)`}
      canProcess={files.length > 0 && pages.length > 0}
    >
      <FileDropper files={files} setFiles={handleFilesChange} label="Select a PDF file to organize" />

      {pages.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">
              Pages ({pages.length} of {pageCount})
            </h3>
            <button type="button" onClick={restoreAll}
              className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
              <HiPlus className="w-4 h-4" /> Restore all
            </button>
          </div>
          <p className="text-xs text-gray-400 mb-4">Use arrows to reorder pages. Click ✕ to remove a page.</p>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {pages.map((page, idx) => (
              <div key={page.id}
                className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                <span className="text-xs font-mono text-gray-400 w-6 text-right">{idx + 1}</span>
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-700">{page.label}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    className="p-1.5 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600 disabled:opacity-30 transition-colors">
                    <HiArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => moveDown(idx)}
                    disabled={idx === pages.length - 1}
                    className="p-1.5 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600 disabled:opacity-30 transition-colors">
                    <HiArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => deletePage(page.id)}
                    className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                    <HiX className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
