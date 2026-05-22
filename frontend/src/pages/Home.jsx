import ToolCard from '../components/ToolCard';
import {
  HiOutlineDocumentDuplicate,
  HiOutlineScissors,
  HiOutlineArrowsExpand,
  HiOutlineRefresh,
  HiOutlineAnnotation,
  HiOutlineLockClosed,
  HiOutlineLockOpen,
  HiOutlineHashtag,
  HiOutlineViewGrid,
  HiOutlinePhotograph,
  HiOutlineCollection,
} from 'react-icons/hi';

const TOOLS = [
  {
    name: 'Merge PDF',
    description: 'Combine multiple PDFs into one. Drag, drop and merge in seconds.',
    icon: HiOutlineDocumentDuplicate,
    path: '/merge-pdf',
    color: '#e2231a',
    bg: '#fff0f0',
  },
  {
    name: 'Split PDF',
    description: 'Separate one PDF into multiple files or extract specific pages.',
    icon: HiOutlineScissors,
    path: '/split-pdf',
    color: '#d97706',
    bg: '#fffbeb',
  },
  {
    name: 'Compress PDF',
    description: 'Reduce PDF file size while maintaining good quality.',
    icon: HiOutlineArrowsExpand,
    path: '/compress-pdf',
    color: '#16a34a',
    bg: '#f0fdf4',
  },
  {
    name: 'Rotate PDF',
    description: 'Rotate all pages or individual pages of your PDF.',
    icon: HiOutlineRefresh,
    path: '/rotate-pdf',
    color: '#ca8a04',
    bg: '#fefce8',
  },
  {
    name: 'Watermark PDF',
    description: 'Stamp text or image watermarks on your PDF pages.',
    icon: HiOutlineAnnotation,
    path: '/watermark-pdf',
    color: '#2563eb',
    bg: '#eff6ff',
  },
  {
    name: 'Protect PDF',
    description: 'Add password protection to secure your PDF document.',
    icon: HiOutlineLockClosed,
    path: '/protect-pdf',
    color: '#9333ea',
    bg: '#faf5ff',
  },
  {
    name: 'Unlock PDF',
    description: 'Remove password protection from a PDF you have access to.',
    icon: HiOutlineLockOpen,
    path: '/unlock-pdf',
    color: '#0d9488',
    bg: '#f0fdfa',
  },
  {
    name: 'Page Numbers',
    description: 'Add automatic page numbers to your PDF document.',
    icon: HiOutlineHashtag,
    path: '/page-numbers',
    color: '#db2777',
    bg: '#fdf2f8',
  },
  {
    name: 'Organize PDF',
    description: 'Reorder, delete and rearrange pages in your PDF.',
    icon: HiOutlineViewGrid,
    path: '/organize-pdf',
    color: '#4f46e5',
    bg: '#eef2ff',
  },
  {
    name: 'PDF to Image',
    description: 'Convert PDF pages to JPG or PNG images.',
    icon: HiOutlinePhotograph,
    path: '/pdf-to-image',
    color: '#ea580c',
    bg: '#fff7ed',
  },
  {
    name: 'Image to PDF',
    description: 'Convert JPG, PNG and other images to PDF format.',
    icon: HiOutlineCollection,
    path: '/image-to-pdf',
    color: '#475569',
    bg: '#f8fafc',
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-primary-500 rounded-full" />
            Free Online PDF Tools
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
            Every tool you need to work
            <br />
            <span className="text-primary-500">with PDF files</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
            All tools are free and work directly in your browser. No registration, no watermarks,
            no limits — just professional PDF tools at your fingertips.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              100% Free
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              No registration
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Secure &amp; private
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Files deleted after 1 hour
            </div>
          </div>
        </div>
      </section>

      {/* Tools grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">PDF Tools</h2>
        <p className="text-gray-500 mb-8">Click any tool to get started — no sign-up needed.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {TOOLS.map((tool) => (
            <ToolCard key={tool.path} tool={tool} />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">Why use our PDF tools?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Easy to Use',
                desc: 'Simply drag and drop your PDF, choose your options, and download. No technical knowledge needed.',
                emoji: '⚡',
              },
              {
                title: 'Secure & Private',
                desc: 'Your files are processed securely and automatically deleted after one hour. Your privacy matters.',
                emoji: '🔒',
              },
              {
                title: 'High Quality',
                desc: 'Our tools maintain the highest possible quality for all PDF operations.',
                emoji: '✨',
              },
            ].map(({ title, desc, emoji }) => (
              <div key={title} className="text-center p-6">
                <div className="text-4xl mb-4">{emoji}</div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
