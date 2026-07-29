const fs = require('fs');
const path = require('path');

function walkSync(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      if (!dirFile.includes('node_modules') && !dirFile.includes('dist')) {
        filelist = walkSync(dirFile, filelist);
      }
    } else {
      if (dirFile.endsWith('.js') || dirFile.endsWith('.jsx')) {
        filelist.push(dirFile);
      }
    }
  });
  return filelist;
}

const files = walkSync('src');
let injectedCount = 0;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  if (!content.includes('// Domínio:') && !content.includes('// Domain:') && !content.includes('// Dono ÚNICO')) {
    // Determine domain from path
    let domain = 'app';
    const normalizedFile = file.replace(/\\/g, '/');
    if (normalizedFile.includes('modules/character-creation')) domain = 'character-creation';
    else if (normalizedFile.includes('modules/playsheet')) domain = 'playsheet';
    else if (normalizedFile.includes('modules/vtt')) domain = 'vtt';
    else if (normalizedFile.includes('modules/compendium')) domain = 'compendium';
    else if (normalizedFile.includes('shared')) domain = 'shared';
    else if (normalizedFile.includes('systems')) domain = 'systems';
    
    const basename = path.basename(file);
    const header = `// Domínio: ${domain} | Dono ÚNICO de: ${basename}\n`;
    fs.writeFileSync(file, header + content);
    injectedCount++;
  }
});
console.log('Headers injected: ' + injectedCount);
