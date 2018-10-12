var langInUse;

let localization = (function(){
    console.log('select', $$('#lang-selector'));
    console.log('select option', $$('#lang-selector option'));

    $$('#lang-selector option').addEventListener('change', function(){
        alert($$('#lang-selector'));
    });

    let translationKey = 'login';

    function changeLanguage(translationKey) {
        let stringsToBeTranslated = document.querySelectorAll('[data-translation-key="stringAttribute"]');
        console.log('strins to be translated', stringsToBeTranslated);
        stringsToBeTranslated.forEach(stringToBeTranslated => {
            let originalTextContent = stringToBeTranslated.textContent;
            console.log('original text contet', originalTextContent);
            let translatedTextContent = translateText(originalTextContent, mLstrings);
            stringToBeTranslated.textContent = translatedTextContent;
        });
    }


    function translateText(originalTextContent, m) {

    }


})();