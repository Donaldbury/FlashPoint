const https = require('https');
const fs = require('fs');
https.get('https://www.pizzint.watch/_next/static/css/adf5ab6525f96869.css', (res) => {
    let css = '';
    res.on('data', c => css += c);
    res.on('end', () => fs.writeFileSync('pizzint.css', css));
});
