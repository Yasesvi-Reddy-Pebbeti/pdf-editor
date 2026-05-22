import { useDropzone } from 'react-dropzone';
import { HiOutlineUpload, HiX, HiDocumentText } from 'react-icons/hi';

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function FileDropper({ files, setFiles, accept, multiple = false, label }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (accepted) => {
      setFiles(multiple ? [...files, ...accepted] : accepted.slice(0, 1));
    },
    accept: accept || { 'application/pdf': ['.pdf'] },
    multiple,
  });

  const removeFile = (e, idx) => {
    e.stopPropagation();
    setFiles(files.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? 'border-primary-500 bg-primary-50 dropzone-active'
            : files.length
            ? 'border-green-400 bg-green-50'
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50 bg-white'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isDragActive ? 'bg-primary-100' : 'bg-gray-100'}`}>
            <HiOutlineUpload className={`w-8 h-8 ${isDragActive ? 'text-primary-500' : 'text-gray-400'}`} />
          </div>
          <div>
            <p className="font-semibold text-gray-700">
              {isDragActive ? 'Drop files here' : label || 'Click to upload or drag & drop'}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {multiple ? 'Select multiple files' : 'Select a file'} (max 100 MB each)
            </p>
          </div>
          <button
            type="button"
            className="mt-1 px-6 py-2 bg-primary-500 text-white rounded-lg text-sm font-semibold hover:bg-primary-600 transition-colors"
          >
            Select {multiple ? 'Files' : 'File'}
          </button>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-3">
              <HiDocumentText className="w-5 h-5 text-primary-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{f.name}</p>
                <p className="text-xs text-gray-400">{formatBytes(f.size)}</p>
              </div>
              <button
                type="button"
                onClick={(e) => removeFile(e, i)}
                className="p-1 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
              >
                <HiX className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
