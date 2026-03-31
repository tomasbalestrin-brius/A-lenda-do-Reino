export function exportToPDF(char, stats) {
  const signStr = (n) => (n >= 0 ? `+${n}` : String(n));
  const attrKeys = ['FOR', 'DES', 'CON', 'INT', 'SAB', 'CAR'];

  // All spells including enhancements
  const progressionSpells = Object.values(char.levelChoices || {})
    .filter(c => c?.spells?.length > 0)
    .flatMap(c => c.spells.filter(Boolean));
  const allSpells = [...(char.classSpells || []), ...(char.racialSpells || []), ...progressionSpells];

  const weapons = stats?.detailedAttacks || [];
  const level = char.level || 1;

  const raceLabel = char.raca ? char.raca.charAt(0).toUpperCase() + char.raca.slice(1) : '—';
  const classeLabel = char.classe ? char.classe.charAt(0).toUpperCase() + char.classe.slice(1) : '—';
  const origemLabel = char.origem ? char.origem.charAt(0).toUpperCase() + char.origem.slice(1) : '—';
  const deusLabel = char.deus ? char.deus.charAt(0).toUpperCase() + char.deus.slice(1) : 'Ateu';

  const ALL_PERICIAS = [
    'Acrobacia','Adestramento','Atletismo','Atuação','Cavalgar','Conhecimento',
    'Cura','Diplomacia','Enganação','Fortitude','Furtividade','Guerra',
    'Iniciativa','Intimidação','Intuição','Investigação','Jogatina','Ladinagem',
    'Luta','Misticismo','Nobreza','Ofício','Percepção','Pilotagem',
    'Pontaria','Reflexos','Religião','Sobrevivência','Vontade',
  ];

  const allPowers = [
    ...(char.poderesGerais || []).map(p => typeof p === 'string' ? p : p.nome),
    ...(char.poderes || []).map(p => typeof p === 'string' ? p : p.nome),
    ...Object.values(char.levelChoices || {}).filter(c => c?.nome).map(p => p.nome),
    ...(char.crencasBeneficios || []).map(p => typeof p === 'string' ? p : p.nome),
  ].filter(Boolean);

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<title>Ficha Lendária — ${char.nome || 'Personagem'}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=UnifrakturMaguntia&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  @page { size: A4 portrait; margin: 8mm 8mm; }

  body {
    font-family: 'Crimson Text', Georgia, serif;
    background: #fdf5e6;
    background-image: radial-gradient(#fff9f0 1px, transparent 0);
    background-size: 24px 24px;
    color: #2a1b0a;
    font-size: 9pt;
    line-height: 1.25;
  }

  /* ── Parchment Texture Effect ── */
  body::before {
    content: ""; position: fixed; inset: 0; z-index: -1;
    background: linear-gradient(to bottom right, #fdf5e6, #f3e5ab);
    opacity: 0.8;
  }

  .sheet { width: 100%; position: relative; }

  /* ── Typography & Decoration ── */
  .ornament { font-family: 'Cinzel', serif; color: #8b0000; text-align: center; font-size: 14pt; margin: 4px 0; }
  
  .row { display: flex; gap: 8px; margin-bottom: 8px; }
  .col { flex: 1; }
  .col-2 { flex: 2; }
  .col-3 { flex: 3; }

  /* ── Sections ── */
  .section {
    background: rgba(255, 255, 255, 0.4);
    border: 2px solid #5d4037;
    border-radius: 2px;
    position: relative;
    box-shadow: 2px 2px 5px rgba(0,0,0,0.05);
    margin-bottom: 8px;
    break-inside: avoid;
  }
  .section::before {
    content: ""; position: absolute; inset: 1px; border: 1px solid rgba(93, 64, 55, 0.2); pointer-events: none;
  }
  .section-title {
    background: #5d4037;
    color: #ede7f6;
    font-family: 'Cinzel', serif;
    font-size: 7.5pt;
    font-weight: 900;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 3px 10px;
    border-bottom: 2px solid #3e2723;
    display: flex; justify-content: space-between;
  }
  .section-body { padding: 6px 8px; }

  /* ── Header ── */
  .header {
    border-bottom: 4px double #8b0000;
    margin-bottom: 12px;
    padding-bottom: 8px;
    display: flex; align-items: flex-end; justify-content: space-between;
  }
  .char-identity { flex: 1; }
  .char-name {
    font-family: 'UnifrakturMaguntia', cursive;
    font-size: 32pt;
    color: #5d4037;
    line-height: 1;
    margin-bottom: -4px;
    filter: drop-shadow(1px 1px 0px #fff);
  }
  .char-stats-summary {
    font-family: 'Cinzel', serif;
    font-size: 9pt;
    font-weight: 700;
    color: #8b0000;
    border-top: 1px solid #8b0000;
    padding-top: 2px;
  }
  .level-badge {
    text-align: center; border-left: 2px solid #8b0000; padding-left: 15px;
  }
  .level-badge .label { font-size: 7pt; font-family: 'Cinzel', serif; font-weight: 900; display: block; color: #8b0000; }
  .level-badge .value { font-size: 28pt; font-weight: 900; line-height: 1; font-family: 'Cinzel', serif; color: #5d4037; }

  /* ── Attributes ── */
  .attrs-box { display: flex; gap: 4px; justify-content: space-between; }
  .attr-item {
    border: 1.5px solid #5d4037;
    background: #fff;
    width: 48px; height: 55px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    position: relative;
  }
  .attr-val { font-size: 16pt; font-weight: 900; color: #8b0000; font-family: 'Cinzel', serif; line-height: 1; }
  .attr-lbl { font-size: 6.5pt; font-weight: 900; font-family: 'Cinzel', serif; text-transform: uppercase; color: #5d4037; }

  /* ── Combat Grid ── */
  .combat-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; margin-top: 8px; }
  .combat-item { border: 1px solid #5d4037; padding: 4px; text-align: center; background: white; }
  .combat-lbl { font-size: 6pt; font-weight: 900; font-family: 'Cinzel', serif; color: #8b0000; display: block; }
  .combat-val { font-size: 14pt; font-weight: 900; font-family: 'Cinzel', serif; line-height: 1; }

  /* ── Skills ── */
  .skills-rows { column-count: 2; column-gap: 15px; }
  .skill-row {
    display: flex; justify-content: space-between; border-bottom: 0.5px solid #5d403744;
    padding: 1.5px 0; font-size: 8pt;
  }
  .skill-row.trained { font-weight: 700; color: #8b0000; }
  .skill-bonus { min-width: 25px; text-align: right; font-family: 'Cinzel', serif; }

  /* ── Weapons Table ── */
  .weapon-table { width: 100%; border-collapse: collapse; font-size: 8pt; }
  .weapon-table th { font-family: 'Cinzel', serif; background: #5d4037; color: white; padding: 2px 4px; font-size: 7pt; text-align: left; }
  .weapon-table td { padding: 3px 4px; border-bottom: 1px solid #5d403722; }
  .weapon-type { font-size: 6.5pt; color: #666; font-style: italic; }

  /* ── Trackers ── */
  .tracker-group { display: flex; gap: 2px; flex-wrap: wrap; margin-top: 4px; }
  .t-box { width: 10px; height: 10px; border: 1px solid #5d4037; }

  .identity-text { font-size: 8pt; color: #4e342e; text-align: justify; line-height: 1.4; border-top: 1px dashed #5d403744; padding-top: 5px; margin-top: 5px; }

  /* ── Special Traits ── */
  .traits-list { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 5px; }
  .trait-pill { padding: 2px 6px; background: #fffde7; border: 1px solid #f9a825; border-radius: 10px; font-size: 7.5pt; font-weight: 700; color: #c62828; }

  @media print {
    .no-print { display: none !important; }
    body { background-image: none; print-color-adjust: exact; }
  }
</style>
</head>
<body>

<div class="sheet">
  <div class="no-print" style="margin-bottom:15px; text-align:right;">
     <button onclick="window.print()" style="padding:10px 25px; font-family:'Cinzel'; font-weight:900; background:#8b0000; color:white; border:none; cursor:pointer;">IMPRIMIR PDF</button>
  </div>

  <header class="header">
    <div class="char-identity">
      <h1 class="char-name">${char.nome || 'Lenda Sem Nome'}</h1>
      <div class="char-stats-summary">
        ${raceLabel} · ${classeLabel} · ${origemLabel} · Devoto de ${deusLabel}
      </div>
      <div style="font-size:7.5pt; color:#5d4037; margin-top:2px;">
         ${char.genero ? char.genero + ' · ' : ''}${char.idade ? char.idade + ' anos · ' : ''}
         Deslocamento ${stats?.deslocamento || 9}m · Idiomas: ${(stats?.languages || ['Comum']).join(', ')}
      </div>
    </div>
    <div class="level-badge">
       <span class="label">Nível</span>
       <span class="value">${level}</span>
    </div>
  </header>

  <div class="row">
    <div class="col-2">
      <div class="section">
        <div class="section-title">Atributos Primordiais</div>
        <div class="section-body">
          <div class="attrs-box">
             ${attrKeys.map(k => `
               <div class="attr-item">
                 <span class="attr-lbl">${k}</span>
                 <span class="attr-val">${signStr(stats?.attrs?.[k] || 0)}</span>
                 <span style="font-size:6pt; color:#888;">base ${char.atributos?.[k] || 0}</span>
               </div>
             `).join('')}
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Estatísticas Vitais</div>
        <div class="section-body">
          <div class="combat-stats">
            <div class="combat-item"><span class="combat-lbl">Vida (PV)</span><span class="combat-val">${stats?.pv}</span></div>
            <div class="combat-item"><span class="combat-lbl">Mana (PM)</span><span class="combat-val">${stats?.pm}</span></div>
            <div class="combat-item"><span class="combat-lbl">Defesa</span><span class="combat-val">${stats?.def}</span></div>
            <div class="combat-item"><span class="combat-lbl">Ataque</span><span class="combat-val">${signStr(stats?.atk)}</span></div>
            <div class="combat-item"><span class="combat-lbl">Iniciativa</span><span class="combat-val">${signStr(stats?.ini)}</span></div>
            <div class="combat-item"><span class="combat-lbl">Fortitude</span><span class="combat-val">${signStr(stats?.fort)}</span></div>
            <div class="combat-item"><span class="combat-lbl">Reflexos</span><span class="combat-val">${signStr(stats?.ref)}</span></div>
            <div class="combat-item"><span class="combat-lbl">Vontade</span><span class="combat-val">${signStr(stats?.von)}</span></div>
          </div>

          <div style="margin-top:8px;">
            <span class="combat-lbl">Rastreador de Vitalidade</span>
            <div class="tracker-group">${Array.from({length: Math.min(stats?.pv || 0, 80)}).map(()=>'<div class="t-box"></div>').join('')}</div>
            <span class="combat-lbl" style="margin-top:5px;">Rastreador de Energia (PM)</span>
            <div class="tracker-group">${Array.from({length: Math.min(stats?.pm || 0, 50)}).map(()=>'<div class="t-box"></div>').join('')}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Perícias & Conhecimento</div>
        <div class="section-body">
          <div class="skills-rows">
            ${ALL_PERICIAS.map(p => {
               const s = stats?.skills?.[p] || { total: Math.floor(level/2), isTrained: false };
               return `
                 <div class="skill-row ${s.isTrained ? 'trained' : ''}">
                   <span>${s.isTrained ? '✦ ' : ''}${p}</span>
                   <span class="skill-bonus">${signStr(s.total)}</span>
                 </div>
               `;
            }).join('')}
          </div>
        </div>
      </div>
    </div>

    <div class="col">
      <div class="traits-list">
         ${(stats?.traits || []).map(t => `<span class="trait-pill">${t}</span>`).join('')}
         <span class="trait-pill" style="background:#e3f2fd; border-color:#2196f3; color:#0d47a1;">Carga: ${stats?.totalWeight?.toFixed(1) || 0}/${stats?.maxLoad || 10}kg</span>
      </div>

      <div class="section">
        <div class="section-title">Arsenal de Combate</div>
        <div class="section-body">
          <table class="weapon-table">
            <thead>
              <tr><th>Arma</th><th>Ataque</th><th>Dano</th><th>Tipo</th><th>Crítico</th></tr>
            </thead>
            <tbody>
              ${weapons.map(w => `
                <tr>
                  <td><strong>${w.nome}</strong></td>
                  <td style="color:#8b0000; font-weight:700;">${signStr(w.bonusAtk)}</td>
                  <td>${w.dano}</td>
                  <td class="weapon-type">${w.tipoDano || '—'}</td>
                  <td>${w.critico}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Poderes & Talentos</div>
        <div class="section-body">
           <ul style="list-style:none; font-size:8pt; column-count:1;">
             ${allPowers.map(p => `<li style="margin-bottom:2px; border-bottom:0.5px solid #eee;">📜 ${p}</li>`).join('')}
           </ul>
        </div>
      </div>

      ${allSpells.length > 0 ? `
      <div class="section">
        <div class="section-title">Arcanismo & Magia</div>
        <div class="section-body">
          <div style="font-size:7pt; color:#8b0000; margin-bottom:5px; font-weight:700; border-bottom:1px solid #8b0000;">CD de Resistência: ${stats?.spellDC}</div>
          ${allSpells.map(spell => {
            const s = typeof spell === 'string' ? { nome: spell } : spell;
            const spellId = s.nome.toLowerCase().replace(/\\s+/g, '_');
            const enh = char.spellEnhancements?.[spellId];
            return `
              <div style="border-bottom:1px solid #5d403722; padding:3px 0;">
                <div style="display:flex; justify-content:space-between;">
                   <strong>${s.nome}</strong>
                   <span style="font-size:7.5pt; color:#5d4037;">${s.circulo ? s.circulo + 'º' : '—'} Círc.</span>
                </div>
                ${enh?.desc ? `<div style="font-size:7pt; color:#666; font-style:italic;">Nota: ${enh.desc} (+${enh.pm} PM)</div>` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
      ` : ''}
    </div>
  </div>

  <div class="section">
    <div class="section-title">Identidade & Crônicas</div>
    <div class="section-body">
      <div class="row">
        <div class="col" style="font-size:8pt;">
           <strong>Aparência:</strong> ${char.aparencia || 'Sem descrição.'}
        </div>
      </div>
      <div class="identity-text">
        ${char.historia || 'Sua lenda ainda está sendo escrita nas Terras de Arton...'}
      </div>
    </div>
  </div>

  <footer style="margin-top:10px; text-align:center; font-size:7pt; font-family:'Cinzel'; color:#8b0000; border-top:1px solid #8b0000; padding-top:5px;">
    ⚔ TORMENTA 20 — A LENDA DO REINO · GERADO EM ${new Date().toLocaleDateString('pt-BR')} ⚔
  </footer>
</div>

</body>
</html>`;

  const win = window.open('', '_blank', 'width=900,height=1200');
  if (!win) {
    alert('Permita pop-ups para gerar a ficha lendária.');
    return;
  }
  win.document.write(html);
  win.document.close();
  win.focus();
}
