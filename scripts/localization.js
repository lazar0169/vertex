let localization = (function () {

    let languages = new Map();
    languages.set('en', 'English');
    languages.set('sr', 'Srpski');
    languages.set('de', 'Deutsch');
    languages.set('fr', 'Française');

    const lsTranslationsKey = 'vertexTranslations';
    const multiLanguageElementSelector = '.element-multilanguage';
    const keyAttributeName = 'data-translation-key';
    const directory = 'languages';
    const file = 'translations.json';
    const messagesFile = 'messages.json';
    const defaultLanguage = 'en';
    let activeLanguage;

    function getFilePath(locale) {
        return directory + '/' + locale + '/' + file;
    }

    function getMessagesFilePath(locale) {
        return directory + '/' + locale + '/' + messagesFile;
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

    function setActiveLanguage(language){
            window.localStorage.setItem('activeLanguage', language);
    }

    function getActiveLanguage(){
        let activeLanguage = window.localStorage.getItem('activeLanguage');
        if( activeLanguage === null){
            window.localStorage.setItem('activeLanguage', defaultLanguage);
            return defaultLanguage;
        }
        return window.localStorage.getItem('activeLanguage');
    }

    function loadTranslations(language) {
        let path = getFilePath(language);
        return loadJSONSync(path);
    }

    function loadMessages(language) {
        let path = getMessagesFilePath(language);
        return loadJSONSync(path);
    }

    function saveMessagesToLocalStorage() {
        let messages = JSON.stringify(loadMessages(getActiveLanguage()));
        window.localStorage.setItem(lsTranslationsKey, messages);
    }

    function translate(key, object) {
        let translation = getProperty(key, object);
        if (translation !== undefined) {
            return translation;
        }
        else {
            console.error('Translation for ' + key + ' was not found in translations file!');
            return key;
        }
    }

    function translateElement(element, translations) {
        //ToDo: This is work in progress and during the development some other property could be changed
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

    function translateMessage(key) {
        let translations = JSON.parse(localStorage.getItem(lsTranslationsKey));
        return translate(key, translations);
    }

    function changeLanguage(multiLanguageClassSelector, langInUse) {
        //load dynamic translations for language into localstorage
        saveMessagesToLocalStorage();
        let translatableElements = $$(multiLanguageClassSelector);
        let translations = loadTranslations(getActiveLanguage());
        if (translations !== null) {
            for (let i = 0, length = translatableElements.length; i < length; i++) {
                translateElement(translatableElements[i], translations);
            }
        }
        //dinamicki
        translatableElements = $$('.element-dynamic-translatable');
        translations = JSON.parse(localStorage.getItem(lsTranslationsKey));
        if (translations !== null) {
            for (let i = 0, length = translatableElements.length; i < length; i++) {
                translateElement(translatableElements[i], translations);
            }
        }
    }

    on('localization/translate/message', function (params) {
        let translationKey = params.translationKey;
    });

    on('localization/language/change', function (params) {
        let language = params.language;
        if (language === undefined) {
            language = getActiveLanguage();
        }
        changeLanguage(multiLanguageElementSelector, language   );
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
        translateMessage: translateMessage
    }

})();
