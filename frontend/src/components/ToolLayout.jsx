import { Link } from 'react-router-dom';
import { HiArrowLeft, HiCheckCircle, HiDownload } from 'react-icons/hi';

export default function ToolLayout({
  title,
  description,
  icon: Icon,
  color,
  bg,
  children,
  onProcess,
  processing,
  progress,
  result,
  resultName,
  onDownload,
  onReset,
  processLabel = 'Process',
  canProcess = true,
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tool hero */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
            <HiArrowLeft className="w-4 h-4" />
            All Tools
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: bg }}>
              <Icon className="w-8 h-8" style={{ color }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              <p className="text-gray-500 mt-1">{description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {result ? (
          /* Success state */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <HiCheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Done!</h2>
            <p className="text-gray-500 mb-8">Your file has been processed successfully.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={onDownload}
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors"
              >
                <HiDownload className="w-5 h-5" />
                Download {resultName || 'File'}
              </button>
              <button
                onClick={onReset}
                className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Process Another File
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Main card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              {children}
            </div>

            {/* Process button */}
            {processing ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-4">
                  <svg className="animate-spin w-7 h-7 text-primary-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
                <p className="font-semibold text-gray-800 mb-3">Processing your file…</p>
                <div className="w-full max-w-sm mx-auto bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress || 0}%` }}
                  />
                </div>
                <p className="text-sm text-gray-400 mt-2">{progress || 0}%</p>
              </div>
            ) : (
              <button
                onClick={onProcess}
                disabled={!canProcess}
                className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white text-lg font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {processLabel}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
