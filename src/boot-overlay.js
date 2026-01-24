// Boot overlay: configura timer, showError e ações básicas sem depender do React

const safeGet = (id) => document.getElementById(id);

// Timer de carregamento (logs resumidos)
try {
  const timerEl = safeGet('timer');
  if (timerEl) {
    let seconds = 0;
    setInterval(() => {
      seconds += 1;
      timerEl.textContent = `${seconds}s`;
    }, 1000);
  }
} catch (e) {
  console.warn('Timer falhou:', e);
}

// Expositor de erro global consumido pelo app
try {
  window.showError = (msg) => {
    try {
      console.error('[Overlay] ERRO:', msg);
      const errorBox = safeGet('error');
      const errorText = safeGet('error-text');
      const loading = safeGet('loading');
      if (errorBox) errorBox.style.display = 'block';
      if (errorText) errorText.textContent = String(msg ?? 'Erro desconhecido');
      if (loading) loading.style.display = 'none';
    } catch (e) {
      console.error('Falha ao exibir erro:', e);
    }
  };
} catch (e) {
  console.warn('showError indisponível:', e);
}

// Botão de recarregar no overlay de erro (sem inline handlers)
try {
  const wire = () => {
    const btn = safeGet('error-reload');
    if (btn && !btn.__wired) {
      btn.addEventListener('click', () => location.reload());
      btn.__wired = true;
    }
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire, { once: true });
  } else {
    wire();
  }
} catch (e) {
  console.warn('Falha ao ativar reload:', e);
}

// Log resumido do ambiente
try {
  if (import.meta?.env?.DEV) {
    console.log('[Overlay] Dev mode ativo');
  }
} catch {}

