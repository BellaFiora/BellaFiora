const fs = require('fs');
const path = require('path');

const svgFolder = './'; // Mettez le chemin de votre dossier SVG ici
const outputCSS = 'output.css'; // Nom du fichier CSS de sortie

fs.readdir(svgFolder, (err, files) => {
    if (err) {
        console.error('Erreur lors de la lecture du dossier :', err);
        return;
    }

    const cssClasses = [];

    files.forEach(file => {
        if (path.extname(file).toLowerCase() === '.svg') {
            const className = path.basename(file, '.svg').replace(/[^a-zA-Z0-9]/g, '-');
            const cssRule = `.${className} {\n\tbackground-image: url('./icons/${file}');\n}\n`;
            cssClasses.push(cssRule);
        }
    });

    const cssContent = cssClasses.join('\n');
    console.log(cssContent);
    fs.writeFile(outputCSS, cssContent, (err) => {
        if (err) {
            console.error('Erreur lors de l écriture du fichier CSS de sortie :', err);
        } else {
            console.log('Le fichier CSS de sortie a été créé avec succès :', outputCSS);
        }
    });
});