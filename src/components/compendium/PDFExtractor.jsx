import React, { useState, useCallback } from 'react';
import { extractTextFromPDF } from '../../utils/pdfUtils';

export function PDFExtractor({ file, fileName, onClose }) {
  const [stage, setStage] = useState('idle'); // idle, extracting, done
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [extractedData, setExtractedData] = useState(null);
  const [selectedPage, setSelectedPage] = useState(null);
  const [copyFeedback, setCopyFeedback] = useState(false);

  const handleExtract = useCallback(async () => {
    setStage('extracting');
    try {
      const result = await extractTextFromPDF(file, (current, total) => {
        setProgress({ current, total });
      });
      setExtractedData(result);
      setStage('done');
    } catch (err) {
      console.error('Extraction error:', err);
      setStage('idle');
    }
  }, [file]);

  const handleCopyAll = useCallback(() => {
    if (extractedData?.fullText) {
      navigator.clipboard.writeText(extractedData.fullText).then(() => {
        setCopyFeedback(true);
        setTimeout(() => setCopyFeedback(false), 2000);
      });
    }
  }, [extractedData]);

  const handleCopyPage = useCallback((pageIdx) => {
    if (extractedData?.pages?.[pageIdx]) {
      navigator.clipboard.writeText(extractedData.pages[pageIdx]).then(() => {
        setCopyFeedback(true);
        setTimeout(() => setCopyFeedback(false), 2000);
      });
    }
  }, [extractedData]);

  return (
    <div className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-xl flex flex-col">
      {/* Header */}
      <div className="shrink-0 bg-gray-950/90 border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all"
          >
            ←
          </button>
          <div>
            <h3 className="text-sm font-black text-white">📋 Extrator de Dados</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{fileName}</p>
          </div>
        </div>
        {copyFeedback && (
          <span className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-widest rounded-xl animate-pulse">
            ✓ Copiado!
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 md:p-10" style={{ scrollbarWidth: 'thin' }}>
        <div className="max-w-4xl mx-auto">
          {stage === 'idle' && (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto bg-purple-500/10 border border-purple-500/20 rounded-[2rem] flex items-center justify-center text-5xl mb-8">
                📄
              </div>
              <h2 className="text-2xl font-black text-white mb-3">Extrair Texto do PDF</h2>
              <p className="text-slate-400 text-sm max-w-md mx-auto mb-10 leading-relaxed">
                O sistema vai ler cada página do PDF e extrair todo o texto encontrado.
                O resultado pode ser copiado ou usado como referência.
              </p>
              <button
                onClick={handleExtract}
                className="px-10 py-4 bg-purple-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-purple-900/30 hover:scale-105 active:scale-95 transition-all"
              >
                ⚡ Iniciar Extração
              </button>
            </div>
          )}

          {stage === 'extracting' && (
            <div className="text-center py-20">
              <div className="w-20 h-20 mb-8 mx-auto relative">
                <div className="absolute inset-0 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl">📖</span>
                </div>
              </div>
              <h2 className="text-xl font-black text-white mb-3">Extraindo texto...</h2>
              <p className="text-purple-400 text-sm font-bold mb-6">
                Página {progress.current} de {progress.total}
              </p>
              <div className="max-w-xs mx-auto bg-gray-900 rounded-full h-3 overflow-hidden border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-amber-500 rounded-full transition-all duration-300"
                  style={{ width: progress.total ? `${(progress.current / progress.total) * 100}%` : '0%' }}
                />
              </div>
            </div>
          )}

          {stage === 'done' && extractedData && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="bg-gray-900/60 border border-white/5 rounded-[2rem] p-8 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-white mb-1">Extração Completa</h3>
                  <p className="text-slate-400 text-sm">
                    {extractedData.totalPages} páginas · {extractedData.fullText.length.toLocaleString()} caracteres
                  </p>
                </div>
                <button
                  onClick={handleCopyAll}
                  className="px-6 py-3 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-amber-500/20 transition-all"
                >
                  📋 Copiar Tudo
                </button>
              </div>

              {/* Page List */}
              <div className="space-y-3">
                <p className="text-[10px] uppercase font-black text-slate-500 tracking-[0.4em] ml-2">Páginas</p>
                {extractedData.pages.map((text, idx) => (
                  <div key={idx} className="bg-gray-950/60 border border-white/5 rounded-2xl overflow-hidden group hover:border-purple-500/30 transition-all">
                    <button
                      onClick={() => setSelectedPage(selectedPage === idx ? null : idx)}
                      className="w-full flex items-center justify-between px-6 py-4"
                    >
                      <div className="flex items-center gap-4">
                        <span className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-xs font-black text-purple-400">
                          {idx + 1}
                        </span>
                        <span className="text-sm text-slate-300 text-left truncate max-w-md">
                          {text.slice(0, 120) || <em className="text-slate-600">Sem texto (pode ser uma imagem)</em>}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] text-slate-600 font-bold">{text.length} chars</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleCopyPage(idx); }}
                          className="opacity-0 group-hover:opacity-100 px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] text-slate-400 hover:text-white transition-all"
                        >
                          📋
                        </button>
                        <span className={`text-slate-500 transition-transform ${selectedPage === idx ? 'rotate-180' : ''}`}>▼</span>
                      </div>
                    </button>
                    {selectedPage === idx && (
                      <div className="px-6 pb-6">
                        <pre className="bg-black/40 border border-white/5 rounded-xl p-4 text-xs text-slate-400 whitespace-pre-wrap max-h-80 overflow-auto font-mono leading-relaxed" style={{ scrollbarWidth: 'thin' }}>
                          {text || '(Página sem texto extraível)'}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
