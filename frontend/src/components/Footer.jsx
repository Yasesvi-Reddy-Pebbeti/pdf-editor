import { Link } from 'react-router-dom';

const TOOLS = [
  { label: 'Merge PDF', path: '/merge-pdf' },
  { label: 'Split PDF', path: '/split-pdf' },
  { label: 'Compress PDF', path: '/compress-pdf' },
  { label: 'Rotate PDF', path: '/rotate-pdf' },
  { label: 'Watermark PDF', path: '/watermark-pdf' },
  { label: 'Protect PDF', path: '/protect-pdf' },
  { label: 'Unlock PDF', path: '/unlock-pdf' },
  { label: 'Page Numbers', path: '/page-numbers' },
  { label: 'Organize PDF', path: '/organize-pdf' },
  { label: 'PDF to Image', path: '/pdf-to-image' },
  { label: 'Image to PDF', path: '/image-to-pdf' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                </svg>
              </div>
              <span className="font-bold text-white text-lg">
                PDF<span className="text-primary-400">Editor</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Free online PDF tools to work with your documents. Merge, split, compress,
              convert, rotate, watermark, and more — all in your browser.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h3 className="font-semibold text-white mb-4">PDF Tools</h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              {TOOLS.map(({ label, path }) => (
                <li key={path}>
                  <Link to={path} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-semibold text-white mb-4">About</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>All files are processed securely</li>
              <li>Files are deleted after 1 hour</li>
              <li>No registration required</li>
              <li>100% free to use</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} PDFEditor. Built with React & pdf-lib.
        </div>
      </div>
    </footer>
  );
}
