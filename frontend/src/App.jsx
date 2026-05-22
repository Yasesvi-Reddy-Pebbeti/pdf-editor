import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import MergePdf from './pages/MergePdf';
import SplitPdf from './pages/SplitPdf';
import CompressPdf from './pages/CompressPdf';
import RotatePdf from './pages/RotatePdf';
import WatermarkPdf from './pages/WatermarkPdf';
import ProtectPdf from './pages/ProtectPdf';
import UnlockPdf from './pages/UnlockPdf';
import PageNumbers from './pages/PageNumbers';
import OrganizePdf from './pages/OrganizePdf';
import PdfToImage from './pages/PdfToImage';
import ImageToPdf from './pages/ImageToPdf';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/merge-pdf" element={<MergePdf />} />
          <Route path="/split-pdf" element={<SplitPdf />} />
          <Route path="/compress-pdf" element={<CompressPdf />} />
          <Route path="/rotate-pdf" element={<RotatePdf />} />
          <Route path="/watermark-pdf" element={<WatermarkPdf />} />
          <Route path="/protect-pdf" element={<ProtectPdf />} />
          <Route path="/unlock-pdf" element={<UnlockPdf />} />
          <Route path="/page-numbers" element={<PageNumbers />} />
          <Route path="/organize-pdf" element={<OrganizePdf />} />
          <Route path="/pdf-to-image" element={<PdfToImage />} />
          <Route path="/image-to-pdf" element={<ImageToPdf />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
