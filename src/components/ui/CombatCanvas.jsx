import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../../core/store';
import { getEnemySprite } from '../../core/sprites';

export default function CombatCanvas() {
  const canvasRef = useRef(null);
  const combat = useGameStore((s) => s.combat);
  const spriteSizeCombat = useGameStore((s) => s.spriteSizeCombat);
  const [hoverId, setHoverId] = React.useState(null);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    const draw = () => {
      ctx.fillStyle = '#101827'; ctx.fillRect(0,0,canvas.width,canvas.height);
      const es = combat?.enemies || [];
      const alive = es.filter(e => (e.hp ?? e.maxHp ?? 1) > 0);
      const n = Math.max(1, alive.length);
      const gap = canvas.width / (n + 1);
      alive.forEach((e, i) => {
        const cx = gap * (i + 1); const cy = canvas.height * 0.45;
        const targetSize = Math.max(60, spriteSizeCombat || 120);
        const w = targetSize, h = targetSize;
        // sprite image
        const key = (e.sprite || e.name || e.id || 'enemy');
        const img = getEnemySprite(String(key));

        // Draw sprite only if loaded, otherwise draw placeholder
        if (img && img.complete && img.naturalWidth > 0) {
          ctx.drawImage(img, cx - w/2, cy - h/2, w, h);
        } else {
          // Fallback: draw colored circle
          ctx.fillStyle = '#7c3aed';
          ctx.beginPath();
          ctx.arc(cx, cy, w/2, 0, Math.PI * 2);
          ctx.fill();
        }
        // hover ring
        if (hoverId === e.id) {
          ctx.strokeStyle = '#93c5fd'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, (w/2)+2, 0, Math.PI*2); ctx.stroke();
        }
        const cur = e.hp ?? e.maxHp ?? 0; const mx = e.maxHp ?? Math.max(1, e.hp);
        const pct = Math.max(0, Math.min(1, cur / mx));
        ctx.fillStyle = '#27272a'; ctx.fillRect(cx - 40, cy + 52, 80, 8);
        ctx.fillStyle = '#ef4444'; ctx.fillRect(cx - 40, cy + 52, 80 * pct, 8);
        ctx.fillStyle = '#e5e7eb'; ctx.font = '12px monospace'; ctx.textAlign = 'center';
        ctx.fillText(`${e.name || e.id} (${cur}/${mx})`, cx, cy + 72);
        if (combat?.selectedTarget === e.id) {
          ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, (w/2)+4, 0, Math.PI*2); ctx.stroke();
        }
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { if (raf) cancelAnimationFrame(raf); };
  }, [combat?.enemies, combat?.selectedTarget]);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const onClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left; const y = e.clientY - rect.top;
      const es = useGameStore.getState().combat.enemies || [];
      const alive = es.filter(en => (en.hp ?? en.maxHp ?? 1) > 0);
      const n = Math.max(1, alive.length);
      const gap = canvas.width / (n + 1);
      for (let i=0;i<alive.length;i++){
        const cx = gap * (i + 1); const cy = canvas.height * 0.45; const r=(Math.max(60, useGameStore.getState().spriteSizeCombat || 120)/2)+2;
        const dx = x - cx, dy = y - cy;
        if (dx*dx + dy*dy <= r*r){
          useGameStore.setState((s)=>({ combat: { ...s.combat, selectedTarget: alive[i].id } }));
          break;
        }
      }
    };
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left; const y = e.clientY - rect.top;
      const es = useGameStore.getState().combat.enemies || [];
      const alive = es.filter(en => (en.hp ?? en.maxHp ?? 1) > 0);
      const n = Math.max(1, alive.length);
      const gap = canvas.width / (n + 1);
      let h = null;
      for (let i=0;i<alive.length;i++){
        const cx = gap * (i + 1); const cy = canvas.height * 0.45; const r=(Math.max(60, useGameStore.getState().spriteSizeCombat || 120)/2)+2;
        const dx = x - cx, dy = y - cy;
        if (dx*dx + dy*dy <= r*r){ h = alive[i].id; break; }
      }
      setHoverId(h);
      canvas.style.cursor = h ? 'pointer' : 'default';
    };
    canvas.addEventListener('click', onClick);
    canvas.addEventListener('mousemove', onMove);
    const onKey = (ev) => {
      const key = ev.key;
      if (key !== 'ArrowLeft' && key !== 'ArrowRight') return;
      const es = useGameStore.getState().combat.enemies || [];
      const alive = es.filter(en => (en.hp ?? en.maxHp ?? 1) > 0);
      if (!alive.length) return;
      const curId = useGameStore.getState().combat.selectedTarget || alive[0].id;
      const idx = Math.max(0, alive.findIndex(a => a.id === curId));
      const nextIdx = key === 'ArrowLeft' ? (idx - 1 + alive.length) % alive.length : (idx + 1) % alive.length;
      useGameStore.setState((s)=>({ combat: { ...s.combat, selectedTarget: alive[nextIdx].id } }));
      ev.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => { canvas.removeEventListener('click', onClick); canvas.removeEventListener('mousemove', onMove); window.removeEventListener('keydown', onKey); };
  }, []);

  if (!combat?.active) return null;
  return (
    <div className="w-full border border-gray-700 rounded-lg overflow-hidden">
      <canvas ref={canvasRef} width={960} height={240} />
    </div>
  );
}
