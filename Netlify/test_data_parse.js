const fs = require('fs');

try {
    const code = fs.readFileSync('data.js', 'utf8');
    let setupStr = code.substring(0, code.indexOf('window.OUTCOME_MEASURES')).replace(/window\./g, 'global.');
    new Function(setupStr)();

    const ICF_TEMPLATES = global.ICF_TEMPLATES;
    console.log('Loaded templates:', Object.keys(ICF_TEMPLATES).length);

    let currentTemplateCategory = 'Semua';
    let currentTemplateRegion = 'Semua';
    let templateSearchQuery = '';

    const templates = Object.keys(ICF_TEMPLATES).filter(t => {
        if (t === 'obj') return false;
        const item = ICF_TEMPLATES[t];
        if (!item || !item.category) return false;
        return true;
    });

    console.log('Filtered templates count:', templates.length);

    let html = templates.map(t => {
        return `<button onclick="selectTemplateAndGo('${t.replace(/"/g, '&quot;').replace(/'/g, '\\\'')}')"></button>`;
    }).join('');

    console.log('HTML Generation successful, length:', html.length);

} catch (e) {
    console.log('Error during test:', e);
}
