const fs = require('fs');
const pdfjs = require('pdfjs-dist/legacy/build/pdf.js');

async function extract() {
  const pdfPath = './docs/T20 - Livro Básico.pdf';
  console.log(`Lendo o arquivo: ${pdfPath}`);
  
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const doc = await pdfjs.getDocument({ data }).promise;
  const pages = [];
  
  for(let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const textContent = await page.getTextContent();
    const text = textContent.items.map(s => s.str).join(' ');
    pages.push(text);
    if (i % 50 === 0) console.log(`Extraindo página ${i} de ${doc.numPages}...`);
  }
  
  fs.writeFileSync('./docs/T20_text.txt', pages.join('\n\n'));
  console.log(`Sucesso: docs/T20_text.txt salvo! Extraídas ${doc.numPages} páginas.`);
}

extract().catch(console.error);
