// Injeta o badge "HTML OK" apenas em DEV
if (import.meta?.env?.DEV && typeof document !== 'undefined') {
  try {
    const el = document.createElement('div');
    el.id = 'html-ok';
    el.textContent = 'HTML OK';
    Object.assign(el.style, {
      position: 'fixed',
      top: '10px',
      left: '10px',
      background: 'lime',
      color: 'black',
      padding: '10px 16px',
      borderRadius: '6px',
      fontWeight: 'bold',
      zIndex: 9999,
    });
    document.body.appendChild(el);
  } catch (e) {
    console.warn('Falha ao criar badge DEV:', e);
  }
}

