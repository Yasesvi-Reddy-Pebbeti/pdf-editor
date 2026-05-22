import { useState } from 'react';
import { HiOutlineHashtag } from 'react-icons/hi';
import toast from 'react-hot-toast';
import ToolLayout from '../components/ToolLayout';
import FileDropper from '../components/FileDropper';
import { callApi, downloadBlob } from '../utils/api';

const POSITIONS = [
  { value: 'bottom-center', label: 'Bottom Center' },
  { value: 'bottom-left', label: 'Bottom Left' },
  { value: 'bottom-right', label: 'Bottom Right' },
  { value: 'top-center', label: 'Top Center' },
  { value: 'top-left', label: 'Top Left' },
  { value: 'top-right', label: 'Top Right' },
];

const FORMATS = [
  { value: 'n', label: '1, 2, 3 …' },
  { value: 'page_n', label: 'Page 1, Page 2 …' },
  { value: 'n_total', label: '1 / 10, 2 / 10 …' },
  { value: 'page_n_of_total', label: 'Page 1 of 10 …' },
];

export default function PageNumbers() {
  const [files, setFiles] = useState([]);
  const [position, setPosition] = useState('bottom-center');
  const [format, setFormat] = useState('n');
  const [startNumber, setStartNumber] = useState('1');
  const [fontSize, setFontSize] = useState('12');
  const [margin, setMargin] = useState('30');
  const [color, setColor] = useState('#000000');
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
      form.append('position', position);
      form.append('format', format);
      form.append('startNumber', startNumber);
      form.append('fontSize', fontSize);
      form.append('margin', margin);
      form.append('color', color);
      const res = await callApi('page-numbers', form, setProgress);
      setResult(res.data);
      setProgress(100);
      toast.success('Page numbers added successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to add page numbers.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => downloadBlob(result, 'numbered.pdf');
  const handleReset = () => { setFiles([]); setResult(null); setProgress(0); };

  return (
    <ToolLayout
      title="Page Numbers"
      description="Add automatic page numbers to your PDF. Choose position, format and style."
      icon={HiOutlineHashtag}
      color="#db2777"
      bg="#fdf2f8"
      onProcess={handleProcess}
      processing={processing}
      progress={progress}
      result={result}
      resultName="numbered.pdf"
      onDownload={handleDownload}
      onReset={handleReset}
      processLabel="Add Page Numbers"
      canProcess={files.length > 0}
    >
      <FileDropper files={files} setFiles={setFiles} label="Select a PDF file" />

      {files.length > 0 && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
            <select value={position} onChange={e => setPosition(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400">
              {POSITIONS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
            <select value={format} onChange={e => setFormat(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400">
              {FORMATS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start number</label>
            <input type="number" value={startNumber} onChange={e => setStartNumber(e.target.value)} min="0"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Font size (pt)</label>
            <input type="number" value={fontSize} onChange={e => setFontSize(e.target.value)} min="6" max="72"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Margin (pt)</label>
            <input type="number" value={margin} onChange={e => setMargin(e.target.value)} min="5" max="100"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <div className="flex gap-2 items-center">
              <input type="color" value={color} onChange={e => setColor(e.target.value)}
                className="h-9 w-16 rounded-lg border border-gray-300 cursor-pointer" />
              <span className="text-sm text-gray-500">{color}</span>
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
