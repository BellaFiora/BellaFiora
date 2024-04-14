document.addEventListener('DOMContentLoaded', () => {
    loadTranslation('jpn-JPN'); 
});

let translations = {};

function loadTranslation(languageCode) {
    fetch(`locales/${languageCode}.json`)
        .then(response => response.json())
        .then(data => {
            translations = data;
            updateTranslations();
        })
        .catch(error => console.error('Error loading the translation file:', error));
}

function updateTranslations() {
    document.querySelectorAll('trs').forEach(elem => {
        const key = elem.innerHTML
        elem.innerHTML = tr(key);
    });
}

function tr(key) {
    return translations[key] || "<err>"+key+"</err>"
}