/**
 * Utility to export character data to a formatted Markdown file.
 */
export function exportToMarkdown(char, stats) {
    const trainedSkills = char.pericias || [];
    
    let content = `# 📜 Ficha de Personagem: ${char.nome || 'Lenda sem Nome'}\n\n`;
    
    content += `## 👤 Identidade\n`;
    content += `- **Raça:** ${char.raca?.toUpperCase() || '---'}\n`;
    content += `- **Classe:** ${char.classe?.toUpperCase() || '---'}\n`;
    content += `- **Origem:** ${char.origem?.toUpperCase() || '---'}\n`;
    content += `- **Divindade:** ${char.deus?.toUpperCase() || 'Ateu'}\n`;
    content += `- **Nível:** ${char.level || 1}\n\n`;
    
    content += `## ⚔️ Atributos\n`;
    content += `| FOR | DES | CON | INT | SAB | CAR |\n`;
    content += `|:---:|:---:|:---:|:---:|:---:|:---:|\n`;
    content += `| ${stats.attrs.FOR} | ${stats.attrs.DES} | ${stats.attrs.CON} | ${stats.attrs.INT} | ${stats.attrs.SAB} | ${stats.attrs.CAR} |\n\n`;
    
    content += `## 🛡️ Status\n`;
    content += `- **Pontos de Vida (PV):** ${stats.pv}\n`;
    content += `- **Pontos de Mana (PM):** ${stats.pm}\n`;
    content += `- **Defesa:** ${stats.def}\n`;
    content += `- **Ataque:** ${stats.atk >= 0 ? '+' : ''}${stats.atk}\n\n`;
    
    content += `## 🧠 Perícias Treinadas\n`;
    if (trainedSkills.length > 0) {
        trainedSkills.forEach(p => {
            content += `- ${p}\n`;
        });
    } else {
        content += `*Nenhuma perícia treinada selecionada.*\n`;
    }
    content += `\n`;
    
    content += `## ✨ Poderes e Habilidades\n`;
    const allPowers = [
        ...(char.poderesGerais || []),
        ...Object.values(char.poderesProgressao || {}).filter(Boolean)
    ];
    
    if (allPowers.length > 0) {
        allPowers.forEach(p => {
            const name = typeof p === 'string' ? p : p.nome;
            content += `- ${name}\n`;
        });
    } else {
        content += `*Nenhum poder especial adquirido.*\n`;
    }
    content += `\n`;
    
    content += `## 🎒 Equipamento Inicial\n`;
    if (char.equipamento && char.equipamento.length > 0) {
        char.equipamento.forEach(item => {
            content += `- ${item}\n`;
        });
    } else {
        content += `*Inicia sem posses materiais.*\n`;
    }
    
    content += `\n---\n*Gerado por A Lenda do Reino - Tormenta20 Character Creator*`;

    // Download Logic
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${char.nome || 'personagem'}_t20.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
