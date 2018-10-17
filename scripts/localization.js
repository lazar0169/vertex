let localization = (function () {

    //save language
    console.log(window);
    let selectedLanguage = 'en';

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
            console.error('unable to load translations');
            return null;
        }
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
        let messages = JSON.stringify(loadMessages(selectedLanguage));
        window.localStorage.setItem(lsTranslationsKey, messages);
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

    function translate(key, object) {
        let translation = getProperty(key, object);
        if (translation !== undefined) {
            return translation;
        }
        else {
            console.error('translation for ' + key + 'was not found in translations file');
            return key;
        }
    }

    function changeLanguage(multiLanguageClassSelector, langInUse) {
        //load dynamic translations for language into localstorage
        saveMessagesToLocalStorage();
        selectedLanguage = langInUse;
        let translatableElements = $$(multiLanguageClassSelector);
        let translations = loadTranslations(selectedLanguage);
        if (translations !== null) {
            for (let i = 0, length = translatableElements.length; i < length; i++) {
                translateElement(translatableElements[i], translations);
            }
        }
    }

    function translateMessage (key) {
        let translations = JSON.parse(localStorage.getItem(lsTranslationsKey));
        return translate(key, translations);
    }

    on('localization/translate/message', function (params) {
        let translationKey = params.translationKey;
    });

    on('localization/language/change', function (params) {
        selectedLanguage = params.langInUse;
        changeLanguage(multiLanguageElementSelector, selectedLanguage);
    });

    let languageElementSelector = $$('#lang-selector');
    if (languageElementSelector !== null) {
        languageElementSelector.addEventListener('change', function () {
            selectedLanguage = this.value;
            changeLanguage(multiLanguageElementSelector, selectedLanguage);

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
        changeLanguage(multiLanguageElementSelector, selectedLanguage);
    }

    init();
    console.log('r');

    //@Jovana ToDo: ovo je kao da smo u klasicnoj klasi napisali public (static) function translateMessage
    return {
        translateMessage: translateMessage
    }

})();
