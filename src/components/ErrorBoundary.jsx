import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-[200] bg-[#020617] flex items-center justify-center p-8">
          <div className="max-w-md w-full bg-gray-900/80 border border-rose-500/20 rounded-[3rem] p-10 text-center backdrop-blur-xl shadow-2xl">
            <div className="text-6xl mb-6">⚠️</div>
            <h2 className="text-2xl font-black text-white mb-3">Algo deu errado</h2>
            <p className="text-sm text-slate-400 mb-8 leading-relaxed">
              Ocorreu um erro inesperado. Seu progresso foi salvo automaticamente — 
              clique abaixo para tentar novamente.
            </p>
            <div className="text-[10px] text-rose-400/50 font-mono mb-8 p-4 bg-black/40 rounded-2xl text-left overflow-auto max-h-24">
              {this.state.error?.message || 'Erro desconhecido'}
            </div>
            <button
              onClick={this.handleReset}
              className="px-10 py-4 bg-amber-500 text-gray-950 font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-amber-900/20 hover:scale-105 active:scale-95 transition-all"
            >
              🔄 Recomeçar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
