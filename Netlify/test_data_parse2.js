const fs = require('fs');
const code = fs.readFileSync('data.js', 'utf8');
let setupStr = code.substring(0, code.indexOf('window.OUTCOME_MEASURES')).replace(/window\./g, 'global.');
new Function(setupStr)();
const ICF_TEMPLATES = global.ICF_TEMPLATES;

const cats = {};
Object.keys(ICF_TEMPLATES).forEach(t => {
    if (t === 'obj') return;
    const c = ICF_TEMPLATES[t].category;
    cats[c] = (cats[c] || 0) + 1;
});
console.log('Categories counts:', cats);
