/**
 * Exporta a ficha do personagem como PDF imprimível (A4 landscape).
 * Abre uma nova janela com HTML/CSS otimizado para impressão e dispara window.print().
 */
export function exportToPDF(char, stats) {
  const signStr = (n) => (n > 0 ? `+${n}` : String(n));
  const attrKeys = ['FOR', 'DES', 'CON', 'INT', 'SAB', 'CAR'];
  const attrLabels = { FOR: 'Força', DES: 'Destreza', CON: 'Constituição', INT: 'Inteligência', SAB: 'Sabedoria', CAR: 'Carisma' };

  const trainedSkills = (() => {
    const set = new Set();
    const cls = char.classe;
    // from all sources merged in stats
    if (stats?.allTrainedSkills) stats.allTrainedSkills.forEach(s => set.add(s));
    return Array.from(set);
  })();

  const allPowers = [
    ...(char.poderesGerais || []).map(p => typeof p === 'string' ? p : p.nome),
    ...(char.poderes || []).map(p => typeof p === 'string' ? p : p.nome),
    ...Object.values(char.levelChoices || {}).filter(Boolean).map(p => p.nome || p.id),
    ...(char.crencasBeneficios || []).map(p => typeof p === 'string' ? p : p.nome),
  ].filter(Boolean);

  const allSpells = [...(char.classSpells || []), ...(char.racialSpells || [])];
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

  const trainedSet = new Set([
    ...(char.pericias || []),
    ...Object.values(char.periciasObrigEscolha || {}),
    ...(char.periciasClasseEscolha || []),
    ...(char.origemBeneficios || []).filter(b => b && !b.includes(' ')),
  ]);

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<title>Ficha — ${char.nome || 'Personagem'}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @page { size: A4 portrait; margin: 12mm 10mm; }

  body {
    font-family: 'Crimson Text', Georgia, serif;
    background: #fff;
    color: #1a1a1a;
    font-size: 9.5pt;
    line-height: 1.3;
  }

  /* ── Layout ── */
  .sheet { width: 100%; }
  .row { display: flex; gap: 6px; margin-bottom: 6px; }
  .col { flex: 1; }
  .col-2 { flex: 2; }
  .col-3 { flex: 3; }

  /* ── Sections ── */
  .section {
    border: 1.5px solid #8b0000;
    border-radius: 4px;
    overflow: hidden;
    break-inside: avoid;
  }
  .section-title {
    background: #8b0000;
    color: #ffd700;
    font-family: 'Cinzel', serif;
    font-size: 7pt;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    padding: 2px 8px;
  }
  .section-body { padding: 5px 7px; }

  /* ── Header ── */
  .header {
    background: linear-gradient(135deg, #1a0000 0%, #3d0000 50%, #1a0000 100%);
    color: #ffd700;
    padding: 8px 12px;
    margin-bottom: 8px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 2px solid #8b0000;
  }
  .char-name {
    font-family: 'Cinzel', serif;
    font-size: 20pt;
    font-weight: 900;
    letter-spacing: 0.05em;
    line-height: 1;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  }
  .char-subtitle {
    font-size: 8.5pt;
    color: #ffcc80;
    margin-top: 2px;
    font-style: italic;
  }
  .level-badge {
    background: #ffd700;
    color: #1a0000;
    font-family: 'Cinzel', serif;
    font-size: 9pt;
    font-weight: 900;
    padding: 6px 14px;
    border-radius: 4px;
    text-align: center;
    min-width: 60px;
  }
  .level-badge .num { font-size: 22pt; display: block; line-height: 1; }

  /* ── Attributes ── */
  .attrs-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 4px;
  }
  .attr-box {
    border: 1px solid #c0a060;
    border-radius: 3px;
    text-align: center;
    padding: 3px 2px;
    background: #fffbf0;
  }
  .attr-label {
    font-family: 'Cinzel', serif;
    font-size: 6.5pt;
    font-weight: 700;
    color: #8b0000;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .attr-val {
    font-size: 15pt;
    font-weight: 700;
    font-family: 'Cinzel', serif;
    color: #1a0000;
    line-height: 1.1;
  }
  .attr-sub {
    font-size: 6pt;
    color: #888;
  }

  /* ── Stats bar ── */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 4px;
  }
  .stat-box {
    border: 1px solid #c0a060;
    border-radius: 3px;
    text-align: center;
    padding: 3px 2px;
    background: #fffbf0;
  }
  .stat-label { font-size: 6pt; color: #8b0000; font-weight: 700; font-family:'Cinzel',serif; text-transform:uppercase; letter-spacing:0.06em; }
  .stat-val { font-size: 14pt; font-weight: 700; font-family:'Cinzel',serif; color: #1a0000; line-height:1; }
  .stat-desc { font-size: 5.5pt; color: #888; }

  /* ── Skills ── */
  .skills-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1px 8px;
  }
  .skill-row {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 1px 0;
    border-bottom: 0.5px solid #e8dcc0;
    font-size: 8pt;
  }
  .skill-check {
    width: 10px;
    height: 10px;
    border: 1px solid #8b0000;
    border-radius: 50%;
    background: #fff;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 7pt;
    color: #8b0000;
  }
  .skill-trained .skill-check { background: #8b0000; color: #ffd700; }
  .skill-name { flex: 1; }
  .skill-trained .skill-name { font-weight: 600; }
  .skill-bonus { font-weight: 700; color: #8b0000; font-size: 8pt; min-width: 20px; text-align: right; }

  /* ── Powers ── */
  .power-list { column-count: 2; column-gap: 10px; }
  .power-item {
    display: flex;
    align-items: flex-start;
    gap: 3px;
    margin-bottom: 2px;
    break-inside: avoid;
    font-size: 8pt;
  }
  .power-dot { color: #8b0000; flex-shrink: 0; margin-top: 1px; }

  /* ── Weapons ── */
  .weapon-table { width: 100%; border-collapse: collapse; font-size: 8pt; }
  .weapon-table th {
    background: #8b0000;
    color: #ffd700;
    font-family: 'Cinzel', serif;
    font-size: 6.5pt;
    font-weight: 700;
    padding: 2px 4px;
    letter-spacing: 0.05em;
    text-align: left;
  }
  .weapon-table td { padding: 2px 4px; border-bottom: 0.5px solid #e8dcc0; vertical-align: middle; }
  .weapon-table tr:nth-child(even) td { background: #fffbf0; }

  /* ── Spells ── */
  .spell-item { font-size: 8pt; padding: 1px 0; border-bottom: 0.5px solid #e8dcc0; display: flex; gap: 4px; }
  .spell-circle { color: #8b0000; font-weight: 700; font-size: 7pt; flex-shrink: 0; }
  .spell-name { flex: 1; }
  .spell-pm { color: #666; font-size: 7pt; }

  /* ── HP/PM tracker boxes ── */
  .tracker { display: flex; gap: 3px; flex-wrap: wrap; margin-top: 3px; }
  .tracker-box {
    width: 12px;
    height: 12px;
    border: 1px solid #8b0000;
    border-radius: 2px;
    background: #fff;
    flex-shrink: 0;
  }

  /* ── Identity ── */
  .identity-row { display: flex; gap: 8px; margin-bottom: 3px; }
  .identity-field { flex: 1; }
  .field-label { font-size: 6pt; color: #8b0000; font-weight: 700; font-family: 'Cinzel', serif; text-transform: uppercase; letter-spacing: 0.08em; }
  .field-val { font-size: 8.5pt; border-bottom: 0.5px solid #c0a060; min-height: 14px; padding-bottom: 1px; }
  .text-area { border: 0.5px solid #c0a060; border-radius: 2px; min-height: 40px; width: 100%; padding: 3px; font-size: 7.5pt; color: #444; font-style: italic; }

  /* ── Footer ── */
  .footer {
    margin-top: 8px;
    padding-top: 4px;
    border-top: 1px solid #c0a060;
    display: flex;
    justify-content: space-between;
    font-size: 6.5pt;
    color: #888;
    font-style: italic;
  }

  @media print {
    body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    .no-print { display: none !important; }
  }
</style>
</head>
<body>
<div class="sheet">

  <!-- PRINT BUTTON (hidden on print) -->
  <div class="no-print" style="text-align:right;margin-bottom:8px;">
    <button onclick="window.print()" style="background:#8b0000;color:#ffd700;font-family:'Cinzel',serif;font-size:10pt;font-weight:700;padding:8px 20px;border:none;border-radius:4px;cursor:pointer;letter-spacing:0.1em;">
      🖨️ IMPRIMIR FICHA
    </button>
    <button onclick="window.close()" style="background:#333;color:#fff;font-family:'Cinzel',serif;font-size:10pt;font-weight:700;padding:8px 16px;border:none;border-radius:4px;cursor:pointer;margin-left:8px;letter-spacing:0.1em;">
      ✕ FECHAR
    </button>
  </div>

  <!-- HEADER -->
  <div class="header">
    <div>
      <div class="char-name">${char.nome || 'Sem Nome'}</div>
      <div class="char-subtitle">${raceLabel} · ${classeLabel} · ${origemLabel} · ${deusLabel}</div>
      <div class="char-subtitle" style="margin-top:2px;color:#ffaa44;">
        ${char.genero ? char.genero + ' · ' : ''}${char.idade ? 'Idade: ' + char.idade + ' · ' : ''}
        Desl. ${stats?.deslocamento ?? 9}m · Idiomas: ${(stats?.languages || ['Comum']).join(', ')}
      </div>
    </div>
    <div class="level-badge">
      <span class="num">${level}</span>
      NÍVEL
    </div>
  </div>

  <!-- ROW 1: Attributes + Combat Stats -->
  <div class="row">
    <div class="col-2">
      <div class="section">
        <div class="section-title">⚔ Atributos</div>
        <div class="section-body">
          <div class="attrs-grid">
            ${attrKeys.map(k => `
            <div class="attr-box">
              <div class="attr-label">${k}</div>
              <div class="attr-val">${signStr(stats?.attrs?.[k] ?? 0)}</div>
              <div class="attr-sub">base ${signStr(char.atributos?.[k] ?? 0)}</div>
            </div>`).join('')}
          </div>
        </div>
      </div>
    </div>
    <div class="col-3">
      <div class="section">
        <div class="section-title">🛡 Estatísticas de Combate</div>
        <div class="section-body">
          <div class="stats-grid">
            <div class="stat-box"><div class="stat-label">PV Máx</div><div class="stat-val">${stats?.pv ?? '—'}</div><div class="stat-desc">Vida</div></div>
            <div class="stat-box"><div class="stat-label">PM Máx</div><div class="stat-val">${stats?.pm ?? '—'}</div><div class="stat-desc">Mana</div></div>
            <div class="stat-box"><div class="stat-label">Defesa</div><div class="stat-val">${stats?.def ?? '—'}</div><div class="stat-desc">DEF</div></div>
            <div class="stat-box"><div class="stat-label">Ataque</div><div class="stat-val">${signStr(stats?.atk ?? 0)}</div><div class="stat-desc">ATK</div></div>
            <div class="stat-box"><div class="stat-label">Iniciativa</div><div class="stat-val">${signStr(stats?.ini ?? 0)}</div><div class="stat-desc">INI</div></div>
            <div class="stat-box"><div class="stat-label">Fortitude</div><div class="stat-val">${signStr(stats?.fort ?? 0)}</div><div class="stat-desc">FORT</div></div>
            <div class="stat-box"><div class="stat-label">Reflexos</div><div class="stat-val">${signStr(stats?.ref ?? 0)}</div><div class="stat-desc">REF</div></div>
            <div class="stat-box"><div class="stat-label">Vontade</div><div class="stat-val">${signStr(stats?.von ?? 0)}</div><div class="stat-desc">VON</div></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ROW 2: HP/PM trackers -->
  <div class="row">
    <div class="col">
      <div class="section">
        <div class="section-title">❤ Pontos de Vida</div>
        <div class="section-body">
          <div class="tracker">
            ${Array.from({ length: Math.min(stats?.pv ?? 20, 60) }).map(() => '<div class="tracker-box"></div>').join('')}
          </div>
          ${(stats?.pv ?? 20) > 60 ? `<div style="font-size:7pt;color:#888;margin-top:2px;">+${(stats?.pv ?? 20) - 60} caixas adicionais</div>` : ''}
        </div>
      </div>
    </div>
    <div class="col">
      <div class="section">
        <div class="section-title">✨ Pontos de Mana</div>
        <div class="section-body">
          <div class="tracker">
            ${Array.from({ length: Math.min(stats?.pm ?? 10, 40) }).map(() => '<div class="tracker-box"></div>').join('')}
          </div>
          ${(stats?.pm ?? 10) > 40 ? `<div style="font-size:7pt;color:#888;margin-top:2px;">+${(stats?.pm ?? 10) - 40} adicionais</div>` : ''}
        </div>
      </div>
    </div>
  </div>

  <!-- ROW 3: Skills + Powers -->
  <div class="row">
    <div class="col">
      <div class="section">
        <div class="section-title">🎓 Perícias</div>
        <div class="section-body">
          <div class="skills-grid">
            ${ALL_PERICIAS.map(p => {
              const isTrained = trainedSet.has(p);
              const bonus = isTrained ? (Math.floor(level / 2) + (level >= 15 ? 6 : level >= 7 ? 4 : 2)) : Math.floor(level / 2);
              return `<div class="skill-row ${isTrained ? 'skill-trained' : ''}">
                <div class="skill-check">${isTrained ? '✓' : ''}</div>
                <div class="skill-name">${p}</div>
                <div class="skill-bonus">${signStr(bonus)}</div>
              </div>`;
            }).join('')}
          </div>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="section" style="margin-bottom:6px;">
        <div class="section-title">⚡ Poderes & Habilidades</div>
        <div class="section-body">
          ${allPowers.length > 0
            ? `<div class="power-list">${allPowers.map(p => `<div class="power-item"><span class="power-dot">◆</span><span>${p}</span></div>`).join('')}</div>`
            : '<div style="font-size:8pt;color:#888;font-style:italic;">Nenhum poder selecionado.</div>'
          }
        </div>
      </div>

      ${weapons.length > 0 ? `
      <div class="section" style="margin-bottom:6px;">
        <div class="section-title">⚔ Ataques</div>
        <div class="section-body">
          <table class="weapon-table">
            <thead><tr>
              <th>Arma</th><th>Ataque</th><th>Dano</th><th>Crítico</th><th>Alcance</th>
            </tr></thead>
            <tbody>
              ${weapons.map(w => `<tr>
                <td>${w.nome}</td>
                <td>${signStr(w.bonusAtk)}</td>
                <td>${w.dano}</td>
                <td>${w.critico}</td>
                <td>${w.alcance}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>` : ''}

      ${allSpells.length > 0 ? `
      <div class="section">
        <div class="section-title">🔮 Magias Conhecidas</div>
        <div class="section-body">
          ${allSpells.map(s => {
            const name = typeof s === 'string' ? s : (s.nome || s);
            const pm = typeof s === 'object' && s.custo_pm ? s.custo_pm + ' PM' : '';
            const circ = typeof s === 'object' && s.circulo ? s.circulo + 'º' : '';
            return `<div class="spell-item">
              ${circ ? `<span class="spell-circle">${circ}</span>` : ''}
              <span class="spell-name">${name}</span>
              ${pm ? `<span class="spell-pm">${pm}</span>` : ''}
            </div>`;
          }).join('')}
        </div>
      </div>` : ''}
    </div>
  </div>

  <!-- ROW 4: Identity -->
  <div class="row">
    <div class="col">
      <div class="section">
        <div class="section-title">📜 Identidade & História</div>
        <div class="section-body">
          <div class="identity-row">
            <div class="identity-field"><div class="field-label">Nome</div><div class="field-val">${char.nome || ''}</div></div>
            <div class="identity-field"><div class="field-label">Raça</div><div class="field-val">${raceLabel}</div></div>
            <div class="identity-field"><div class="field-label">Classe</div><div class="field-val">${classeLabel}</div></div>
            <div class="identity-field"><div class="field-label">Nível</div><div class="field-val">${level}</div></div>
            <div class="identity-field"><div class="field-label">Origem</div><div class="field-val">${origemLabel}</div></div>
            <div class="identity-field"><div class="field-label">Divindade</div><div class="field-val">${deusLabel}</div></div>
          </div>
          <div class="identity-row">
            <div class="identity-field"><div class="field-label">Idade</div><div class="field-val">${char.idade || ''}</div></div>
            <div class="identity-field"><div class="field-label">Gênero</div><div class="field-val">${char.genero || ''}</div></div>
            <div class="identity-field col-2"><div class="field-label">Aparência</div><div class="field-val">${char.aparencia || ''}</div></div>
          </div>
          <div style="margin-top:4px;">
            <div class="field-label">História</div>
            <div class="text-area">${char.historia || ''}</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="footer">
    <span>⚔ Tormenta20 — A Lenda do Reino</span>
    <span>Ficha gerada em ${new Date().toLocaleDateString('pt-BR')}</span>
    <span>${char.nome || 'Personagem'} · Nível ${level} · ${classeLabel}</span>
  </div>

</div>
</body>
</html>`;

  const win = window.open('', '_blank', 'width=900,height=1200');
  if (!win) {
    alert('Permita pop-ups para gerar a ficha PDF.');
    return;
  }
  win.document.write(html);
  win.document.close();
  win.focus();
}
