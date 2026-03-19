import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export function PDFViewer({ file, fileName, onClose, onExtract }) {
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const containerRef = useRef(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const goToPage = useCallback((page) => {
    setCurrentPage(Math.max(1, Math.min(page, numPages || 1)));
  }, [numPages]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        goToPage(currentPage + 1);
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        goToPage(currentPage - 1);
      }
      if (e.key === 'Escape') onClose();
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        setSearchOpen(s => !s);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentPage, goToPage, onClose]);

  return (
    <div className="fixed inset-0 z-[100] bg-[#020617] flex flex-col">
      {/* Top Bar */}
      <div className="shrink-0 bg-gray-950/90 border-b border-white/5 px-6 py-3 flex items-center justify-between backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            ←
          </button>
          <div>
            <h3 className="text-sm font-black text-white truncate max-w-[200px] md:max-w-md">{fileName}</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              Página {currentPage} de {numPages || '...'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Search toggle */}
          <button
            onClick={() => setSearchOpen(s => !s)}
            className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
              searchOpen ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            🔍
          </button>

          {/* Zoom controls */}
          <button
            onClick={() => setScale(s => Math.max(0.5, s - 0.25))}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all text-lg font-bold"
          >
            −
          </button>
          <span className="text-xs font-black text-slate-400 w-12 text-center">{Math.round(scale * 100)}%</span>
          <button
            onClick={() => setScale(s => Math.min(3, s + 0.25))}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all text-lg font-bold"
          >
            +
          </button>

          {/* Extract button */}
          {onExtract && (
            <button
              onClick={() => onExtract(file)}
              className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[10px] font-black uppercase tracking-widest hover:bg-purple-500/20 transition-all"
            >
              📋 Extrair
            </button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      {searchOpen && (
        <div className="shrink-0 bg-gray-900/80 border-b border-white/5 px-6 py-3 flex items-center gap-4 backdrop-blur-md">
          <span className="text-slate-500 text-sm">🔍</span>
          <input
            autoFocus
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar no documento..."
            className="flex-1 bg-transparent text-white text-sm font-medium focus:outline-none placeholder:text-slate-600"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-slate-500 hover:text-white text-xs">✕</button>
          )}
        </div>
      )}

      {/* PDF Content */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto flex justify-center py-8 px-4"
        style={{ scrollbarWidth: 'thin' }}
      >
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mb-4" />
              <p className="text-amber-500/60 text-xs font-black uppercase tracking-widest animate-pulse">Carregando PDF...</p>
            </div>
          }
          error={
            <div className="text-center py-20">
              <div className="text-5xl mb-4">⚠️</div>
              <p className="text-rose-400 font-black">Erro ao carregar o PDF</p>
              <p className="text-slate-500 text-sm mt-2">Verifique se o arquivo é um PDF válido.</p>
            </div>
          }
        >
          <Page
            pageNumber={currentPage}
            scale={scale}
            className="shadow-2xl rounded-lg overflow-hidden"
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
        </Document>
      </div>

      {/* Bottom Page Navigation */}
      <div className="shrink-0 bg-gray-950/90 border-t border-white/5 px-6 py-3 flex items-center justify-center gap-4 backdrop-blur-xl">
        <button
          onClick={() => goToPage(1)}
          disabled={currentPage <= 1}
          className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 transition-all text-xs font-bold"
        >
          ⏮
        </button>
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 transition-all font-bold"
        >
          ← Anterior
        </button>

        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            max={numPages || 1}
            value={currentPage}
            onChange={e => goToPage(parseInt(e.target.value) || 1)}
            className="w-16 text-center bg-gray-900 border border-white/10 rounded-xl py-2 text-white text-sm font-black focus:outline-none focus:border-amber-500/30"
          />
          <span className="text-slate-500 text-xs font-black">/ {numPages || '...'}</span>
        </div>

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= numPages}
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 transition-all font-bold"
        >
          Próxima →
        </button>
        <button
          onClick={() => goToPage(numPages)}
          disabled={currentPage >= numPages}
          className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 transition-all text-xs font-bold"
        >
          ⏭
        </button>
      </div>
    </div>
  );
}
