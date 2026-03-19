import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PDFViewer } from './PDFViewer';
import { PDFExtractor } from './PDFExtractor';
import { formatFileSize } from '../../utils/pdfUtils';

export function PDFCompendium({ onBack }) {
  const [pdfFiles, setPdfFiles] = useState([]); // { id, name, file, size, addedAt }
  const [activePDF, setActivePDF] = useState(null); // index into pdfFiles
  const [extractPDF, setExtractPDF] = useState(null); // index
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFiles = useCallback((files) => {
    const pdfs = Array.from(files).filter(f => f.type === 'application/pdf');
    const newEntries = pdfs.map(f => ({
      id: `pdf_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: f.name.replace('.pdf', ''),
      file: f,
      size: f.size,
      addedAt: new Date().toISOString()
    }));
    setPdfFiles(prev => [...prev, ...newEntries]);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleRemove = useCallback((idx) => {
    setPdfFiles(prev => prev.filter((_, i) => i !== idx));
  }, []);

  // If viewing a PDF
  if (activePDF !== null && pdfFiles[activePDF]) {
    return (
      <PDFViewer
        file={pdfFiles[activePDF].file}
        fileName={pdfFiles[activePDF].name}
        onClose={() => setActivePDF(null)}
        onExtract={() => { setActivePDF(null); setExtractPDF(activePDF); }}
      />
    );
  }

  // If extracting from a PDF
  if (extractPDF !== null && pdfFiles[extractPDF]) {
    return (
      <PDFExtractor
        file={pdfFiles[extractPDF].file}
        fileName={pdfFiles[extractPDF].name}
        onClose={() => setExtractPDF(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center p-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-amber-600/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="w-full max-w-5xl z-10 mb-8">
        <button
          onClick={onBack}
          className="mb-8 px-6 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all flex items-center gap-3 active:scale-95 group"
        >
          <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
          <span className="font-black uppercase tracking-widest text-[10px]">Taverna</span>
        </button>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-white tracking-tighter mb-3">
            📖 Compêndio
          </h1>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-purple-500/50" />
            <p className="text-purple-400 text-sm font-black uppercase tracking-[0.4em]">Biblioteca de Regras</p>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-purple-500/50" />
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="w-full max-w-5xl z-10 mb-10">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-[3rem] p-12 text-center cursor-pointer transition-all group ${
            isDragging
              ? 'border-purple-500 bg-purple-500/5 scale-[1.02]'
              : 'border-gray-800 hover:border-purple-500/50 hover:bg-gray-900/20'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            multiple
            onChange={e => { handleFiles(e.target.files); e.target.value = ''; }}
            className="hidden"
          />
          <div className={`text-6xl mb-4 transition-transform ${isDragging ? 'scale-125' : 'group-hover:scale-110'}`}>
            {isDragging ? '📥' : '📄'}
          </div>
          <p className="text-white font-black text-lg mb-2">
            {isDragging ? 'Solte o PDF aqui!' : 'Arraste um PDF ou clique para selecionar'}
          </p>
          <p className="text-slate-500 text-sm">
            Livros de regras, suplementos, aventuras — qualquer PDF do Tormenta 20
          </p>
        </div>
      </div>

      {/* PDF Library */}
      <div className="w-full max-w-5xl z-10">
        {pdfFiles.length === 0 ? (
          <div className="text-center py-16 opacity-40">
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
              Nenhum PDF carregado ainda
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-[10px] uppercase font-black text-slate-500 tracking-[0.4em] ml-2 flex items-center gap-3">
              <span className="w-2 h-2 bg-purple-500 rounded-full" />
              PDFs Carregados ({pdfFiles.length})
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {pdfFiles.map((pdf, idx) => (
                  <motion.div
                    key={pdf.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group bg-gray-900/40 backdrop-blur-md border border-gray-800/60 rounded-[2rem] p-6 flex items-center gap-5 hover:border-purple-500/40 transition-all"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-2xl shrink-0">
                      📕
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-black truncate">{pdf.name}</p>
                      <p className="text-slate-500 text-xs font-bold">{formatFileSize(pdf.size)}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setActivePDF(idx)}
                        className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[10px] font-black uppercase tracking-widest hover:bg-purple-500/20 transition-all"
                      >
                        📖 Ler
                      </button>
                      <button
                        onClick={() => setExtractPDF(idx)}
                        className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-black uppercase tracking-widest hover:bg-amber-500/20 transition-all"
                      >
                        📋 Extrair
                      </button>
                      <button
                        onClick={() => handleRemove(idx)}
                        className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-600 hover:text-rose-500 hover:border-rose-500/30 transition-all"
                      >
                        ✕
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
