import { useState } from 'react';
import { HiOutlineAnnotation } from 'react-icons/hi';
import toast from 'react-hot-toast';
import ToolLayout from '../components/ToolLayout';
import FileDropper from '../components/FileDropper';
import { callApi, downloadBlob } from '../utils/api';

const POSITIONS = ['center', 'top-left', 'top-right', 'bottom-left', 'bottom-right'];

export default function WatermarkPdf() {
  const [files, setFiles] = useState([]);
  const [imgFiles, setImgFiles] = useState([]);
  const [type, setType] = useState('text');
  const [text, setText] = useState('CONFIDENTIAL');
  const [fontSize, setFontSize] = useState('48');
  const [color, setColor] = useState('#FF0000');
  const [opacity, setOpacity] = useState('0.3');
  const [rotation, setRotation] = useState('45');
  const [position, setPosition] = useState('center');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);

  const handleProcess = async () => {
    if (!files.length) return toast.error('Please upload a PDF file.');
    if (type === 'text' && !text.trim()) return toast.error('Please enter watermark text.');
    if (type === 'image' && !imgFiles.length) return toast.error('Please upload a watermark image.');
    setProcessing(true);
    setProgress(0);
    try {
      const form = new FormData();
      form.append('file', files[0]);
      form.append('type', type);
      form.append('text', text);
      form.append('fontSize', fontSize);
      form.append('color', color);
      form.append('opacity', opacity);
      form.append('rotation', rotation);
      form.append('position', position);
      if (type === 'image' && imgFiles.length) form.append('image', imgFiles[0]);
      const res = await callApi('watermark', form, setProgress);
      setResult(res.data);
      setProgress(100);
      toast.success('Watermark added successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to add watermark.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => downloadBlob(result, 'watermarked.pdf');
  const handleReset = () => { setFiles([]); setImgFiles([]); setResult(null); setProgress(0); };

  return (
    <ToolLayout
      title="Watermark PDF"
      description="Stamp a text or image watermark on your PDF pages to protect or brand your documents."
      icon={HiOutlineAnnotation}
      color="#2563eb"
      bg="#eff6ff"
      onProcess={handleProcess}
      processing={processing}
      progress={progress}
      result={result}
      resultName="watermarked.pdf"
      onDownload={handleDownload}
      onReset={handleReset}
      processLabel="Add Watermark"
      canProcess={files.length > 0}
    >
      <FileDropper files={files} setFiles={setFiles} label="Select a PDF file" />

      {files.length > 0 && (
        <div className="mt-6 space-y-5">
          {/* Type selector */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Watermark type</h3>
            <div className="flex gap-3">
              {['text', 'image'].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`px-5 py-2.5 rounded-lg border-2 text-sm font-medium capitalize transition-all ${
                    type === t ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {t} Watermark
                </button>
              ))}
            </div>
          </div>

          {type === 'text' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Watermark text</label>
                <input
                  type="text"
                  value={text}
                  onChange={e => setText(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Font size</label>
                <input type="number" value={fontSize} onChange={e => setFontSize(e.target.value)} min="10" max="200"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <div className="flex gap-2 items-center">
                  <input type="color" value={color} onChange={e => setColor(e.target.value)}
                    className="h-9 w-16 rounded-lg border border-gray-300 cursor-pointer" />
                  <span className="text-sm text-gray-500">{color}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Opacity ({Math.round(parseFloat(opacity) * 100)}%)</label>
                <input type="range" min="0.05" max="1" step="0.05" value={opacity} onChange={e => setOpacity(e.target.value)}
                  className="w-full accent-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rotation ({rotation}°)</label>
                <input type="range" min="-180" max="180" step="5" value={rotation} onChange={e => setRotation(e.target.value)}
                  className="w-full accent-blue-500" />
              </div>
            </div>
          ) : (
            <FileDropper
              files={imgFiles}
              setFiles={setImgFiles}
              accept={{ 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] }}
              label="Select watermark image (PNG or JPG)"
            />
          )}

          {/* Position */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
            <div className="flex flex-wrap gap-2">
              {POSITIONS.map(p => (
                <button key={p} type="button" onClick={() => setPosition(p)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all capitalize ${
                    position === p ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}>
                  {p.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
