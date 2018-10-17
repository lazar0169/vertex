let localization = (function () {

    //save language
    let selectedLanguage = 'en';

    let languages = new Map();
    languages.set('en', 'English');
    languages.set('sr', 'Srpski');
    languages.set('de', 'Deutsch');
    languages.set('fr', 'Française');

    const lsTranslationsKey = 'vertex-translations';
    const multiLanguageElementSelector = '.element-multilanguage';
    const keyAttributeName = 'data-translation-key';
    const directory = 'languages';
    const file = 'translations.json';

    function getFilePath(locale) {
        return directory + '/' + locale + '/' + file;
    }

    function loadJSONSync(filePath) {
        let request = new XMLHttpRequest();
        request.open('GET', filePath, false);
        if (request.overrideMimeType) {
            request.overrideMimeType('application/json');
        }

        request.send();
        if (request.status === 200) {
            return JSON.parse(request.responseText);
        }
        else {
            console.error('unable to load translations');
            return null;
        }
    }

    function loadTranslations(language) {
        let path = getFilePath(language);
        return loadJSONSync(path);
    }

    function translateElement(element, translations) {
        //ToDo: This is work in progress and during the development some other property could be changed
        let key = element.getAttribute(keyAttributeName);
        let translation = getProperty(key, translations);
        if (translation !== undefined) {
            if (element.placeholder !== undefined) {
                element.placeholder = translation;
            }
            else {
                element.textContent = translation;
            }
        }
        else {
            //ToDo: check if we need this error in console
            console.error('translation for ' + key + 'was not found in translations file');
        }
    }

    function changeLanguage(multiLanguageClassSelector, langInUse) {
        selectedLanguage = langInUse;
        let translatableElements = $$(multiLanguageClassSelector);

        //TODO: load dynamic translations for language into localstorage

        let translations = loadTranslations(selectedLanguage);
        if (translations !== null) {
            for (let i = 0, length = translatableElements.length; i < length; i++) {
                translateElement(translatableElements[i], translations);
            }
        }
    }

    on('localization/translate/message', function (params) {
        let translationKey = params.translationKey;
        let selectedLanguage = params.selectedLanguage;
        let callback = params.callback;
        let translations = JSON.stringify(loadTranslations(selectedLanguage));
        let translatedElement = getProperty(translationKey, translations);
        trigger(callback, {translatedElement: translatedElement});
    });

    on('localization/language/change', function (params) {
        let langInUse = params.langInUse;
        changeLanguage(multiLanguageElementSelector, langInUse);
    });

    let languageElementSelector = $$('#lang-selector');
    if (languageElementSelector !== null) {
        languageElementSelector.addEventListener('change', function () {
            selectedLanguage = this.options[this.selectedIndex].value;
            window.localStorage.setItem('selectedLanguage', selectedLanguage);
            let translations = JSON.stringify(loadTranslations(selectedLanguage));
            window.localStorage.setItem('translations', translations);
            changeLanguage(multiLanguageElementSelector, selectedLanguage);
            console.log('local storage on click', window.localStorage);
        });
    }

    function init() {
        //creating HTML elements for language options
        if (languageElementSelector !== null) {
            languages.forEach(function (value, key) {
                let option = document.createElement('option');
                option.text = value;
                option.value = key;
                languageElementSelector.add(option);
            });
            //select default language
            languageElementSelector.value = selectedLanguage;
        }
        console.log('local storage u initu u localization modulu', window.localStorage);
        if (window.localStorage.selectedLanguage !== null) {
            let translations = JSON.stringify(loadTranslations(window.localStorage.selectedLanguage));
            window.localStorage.setItem('translations', translations);
        }

        changeLanguage(multiLanguageElementSelector, selectedLanguage);
    }

    init();

})();
