import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';

const NAV_TOOLS = [
  { label: 'Merge PDF', path: '/merge-pdf' },
  { label: 'Split PDF', path: '/split-pdf' },
  { label: 'Compress PDF', path: '/compress-pdf' },
  { label: 'PDF to Image', path: '/pdf-to-image' },
  { label: 'Image to PDF', path: '/image-to-pdf' },
];

export default function Header() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary-500 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                <path d="M14 2v6h6" fill="none" stroke="white" strokeWidth="1.5"/>
                <path d="M9 13h6M9 17h4" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              </svg>
            </div>
            <span className="font-bold text-xl text-gray-900">
              PDF<span className="text-primary-500">Editor</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_TOOLS.map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === path
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {label}
              </Link>
            ))}
            <Link
              to="/"
              className="ml-2 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-semibold hover:bg-primary-600 transition-colors"
            >
              All Tools
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          {NAV_TOOLS.map(({ label, path }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50"
            >
              {label}
            </Link>
          ))}
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-semibold text-primary-600"
          >
            All Tools
          </Link>
        </div>
      )}
    </header>
  );
}
