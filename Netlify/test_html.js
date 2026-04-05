const fs = require('fs');
const code = fs.readFileSync('data.js', 'utf8');
let setupStr = code.substring(0, code.indexOf('window.OUTCOME_MEASURES')).replace(/window\./g, 'global.');
new Function(setupStr)();
const ICF_TEMPLATES = global.ICF_TEMPLATES;

let currentTemplateCategory = 'Semua';
let currentTemplateRegion = 'Semua';
let templateSearchQuery = '';

const templates = Object.keys(ICF_TEMPLATES).filter(t => t !== 'obj' && ICF_TEMPLATES[t] && ICF_TEMPLATES[t].category);

let html = templates.map(t => {
    return `<button onclick="selectTemplateAndGo('${t.replace(/"/g, '&quot;').replace(/'/g, '\\\'')}')">${t}</button>`;
}).join('\n');

fs.writeFileSync('output2.html', html);
console.log('Done generating output2.html. Length:', html.length);
