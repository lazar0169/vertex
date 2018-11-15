let localization = (function () {

    let languages = new Map();
    languages.set('en', 'English');
    languages.set('sr', 'Srpski');
    languages.set('de', 'Deutsch');
    languages.set('fr', 'Française');

    const lsLanguageKey=  'vertexLanguage';
    const lsMessagesKey = 'vertexTranslations';
    const multiLanguageElementSelector = '.element-multilanguage';
    const keyAttributeName = 'data-translation-key';
    const directory = 'languages';
    const file = 'translations.json';

    const defaultLanguage = 'en';

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
            console.error('Unable to load translations!');
            return null;
        }
    }

    function setActiveLanguage(language) {
        localStorage.setItem('activeLanguage', language);
    }

    function getActiveLanguage() {
        let activeLanguage = localStorage.getItem('activeLanguage');
        if (activeLanguage === null) {
            localStorage.setItem('activeLanguage', defaultLanguage);
            return defaultLanguage;
        }
        return window.localStorage.getItem('activeLanguage');
    }

    function loadTranslations(language) {
        let path = getFilePath(language);
        return loadJSONSync(path);
    }

    function saveMessagesToLocalStorage(messages) {
        window.localStorage.setItem(lsMessagesKey, JSON.stringify(messages));
    }

    function translate(key, object) {
        let translation = getProperty(key, object);

        if (translation !== undefined && translation !== '') {
            return translation;
        }
        else {
            console.error('Translation for ' + key + ' was not found in translations file!');
            return key;
        }
    }

    function translateElement(element, translations) {
        //ToDo: This is work in progress and during the development some other element property could be changed
        let key = element.getAttribute(keyAttributeName);
        let translation = translate(key, translations);
        if (translation !== null) {
            if (element.placeholder !== undefined) {
                element.placeholder = translation;
            }
            else {
                element.textContent = translation;
            }
        }
    }

    function translateMessage(key, element) {
        let translations = JSON.parse(localStorage.getItem(lsMessagesKey));
        //if translating html element that is added dynamically, add required properties
        if(element !== undefined) {
            element.classList.add('element-dynamic-translatable');
            element.setAttribute('data-translation-key', key);
        }
        return translate(key, translations);
    }

    function changeLanguage(multiLanguageClassSelector) {
        //load dynamic translations for language into localstorage
        let translatableElements = $$(multiLanguageClassSelector);
        let translations = loadTranslations(getActiveLanguage());
        saveMessagesToLocalStorage(translations.messages);
        if (translations !== null) {
            for (let i = 0, length = translatableElements.length; i < length; i++) {
                translateElement(translatableElements[i], translations.labels);
            }
        }
        //dynamically
        translatableElements = $$('.element-dynamic-translatable');
        translations = translations.messages;
        if (translations !== null) {
            for (let i = 0, length = translatableElements.length; i < length; i++) {
                translateElement(translatableElements[i], translations);
            }
        }
    }


    on('localization/language/change', function (params) {
        let language = params.language;
        if (language !== undefined) {
            setActiveLanguage(language);
        }
        changeLanguage(multiLanguageElementSelector);
    });

    let languageElementSelector = $$('#lang-selector');
    if (languageElementSelector !== null) {
        languageElementSelector.addEventListener('change', function () {
            setActiveLanguage(this.value);
            changeLanguage(multiLanguageElementSelector, getActiveLanguage());
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
            languageElementSelector.value = getActiveLanguage();
        }
        changeLanguage(multiLanguageElementSelector, getActiveLanguage());
    }

    init();

    return {
        translateMessage: translateMessage,
        getLanguage: getActiveLanguage
    }

})();
