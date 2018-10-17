let localization = (function () {

    //ovde indexi treba da budu locale short kodovi za jezike
    //https://stackoverflow.com/questions/3191664/list-of-all-locales-and-their-short-codes
    //kompletna lista je ovde ali necemo da koristimo dijalekte nego samo za jezike

    //save language
    let selectedLanguage = "fr";

    let languages = new Map();
    languages.set('de', 'Deutch');
    languages.set('fr', 'Française');

    //Ovo pisemo kao konstantnu
    //ToDo: Preimenovati u multiLanguageElementClass ako string sadrzi '.' jer onda nije ime klase nego selektor po kome
    //trazis element
    const multiLanguageElementClass = '.element-multilanguage';
    const keyAttributeName = 'data-translation-key';
    const directory = "languages";
    const file = "translations.json";

    function getFilePath(locale) {
        return directory + "/" + locale + "/" + file;
    }

    function replaceText(templateElementSelector, model, callbackEvent) {
        //trigger('template/render', {templateElementSelector: templateElementSelector, model: model, callbackEvent: callbackEvent});
    }

    //ova funkcija ucitava asinhrono a nama treba sinhrono - izbaciti
    function loadJSON(path, callback) {
        let xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', path, true);
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {
                callback(xobj.responseText);
            }
            };
        xobj.send(null);
    }

    function LoadJSONSync(filePath) {
        let request = new XMLHttpRequest();
        request.open("GET", filePath, false);
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
        return LoadJSONSync(path);
    }

    function translateElement(element, translations) {
        //Depending on element type we will change innerHtml or placeholder
        //ToDo: This is work in progress and during the development some other property could be changed
        let key = element.getAttribute(keyAttributeName);
        let translation = getProperty(key,translations);
        if (translation !== undefined) {
            if (element.placeholder !== undefined) {
                element.placeholder = translation;
            }
            else {
                element.textContent = translation;
            }
        }
        else {
            //ToDo: proveriti sa Fazijem da li želimo ovo obaveštenje u konzoli
            console.error('translation for ' + key + 'was not found in translations file');
        }
    }

    function changeLanguage(multiLanguageElementClass, langInUse) {
        selectedLanguage = langInUse;

        let translatableElements = $$(multiLanguageElementClass);

        //ucitati dinamicke prevode za taj jezik u localstorage

        let translations = loadTranslations(selectedLanguage);
        if (translations !== null) {
            for (let i=0,length = translatableElements.length;i<length;i++) {
                translateElement(translatableElements[i], translations);
            }
        }

        //ostavio sam strai kod ali ovo treba da se obrise
        /*
         let stringsToBeTranslated = $$(multiLanguageElementClass);
         console.log('Strings to be translated: ', stringsToBeTranslated);

         let languagePath = languages[langInUse];
         console.log('LanguagePath: ', languagePath);

         let languageModel = loadJSON(languagePath, function (response) {
             let languageModel = JSON.parse(response);
             console.log('Language model callback', languageModel);
             return languageModel;
         });*/
    }

    on('localization/translate/message',function(params){
        //u params moras da imas kljuc i jezik i callback
       //uzmes promenljivu iz localstorage
        //na osnovu kljuca uzmes prevod
        //vratis ga kroz callback
    });

    on('localization/language/change', function (params) {
        let langInUse = params.langInUse;
        changeLanguage(multiLanguageElementClass, langInUse);
    });

    let languageSelectorElement =  $$('#lang-selector');
    if (languageSelectorElement !== null) {
        languageSelectorElement.addEventListener('change', function () {
            let selectedLanguage = this.options[this.selectedIndex].value;
            //ToDo: @Jovana kada si u modulu ciju funkciju pozivas nema potrebe da trigerujes event vec da pozoves funkciju
            //trigger('localization/language/change', {langInUse: selectedLanguage});
            changeLanguage(multiLanguageElementClass, selectedLanguage);
        });
    }

    function init() {
        //inicijalizujemo jezike iz jsa
        let selector = $$('#lang-selector');
        if (selector !== null) {
            languages.forEach(function (value, key) {
                let option = document.createElement('option');
                option.text = value;
                option.value = key;
                selector.add(option);
            });
            //select default language
            selector.value = selectedLanguage;
        }
        //prvo provera da li postoji u localstorage
        //ucitavanje fajla u localstorage na osnovu jeziku


        changeLanguage(multiLanguageElementClass, selectedLanguage);
    }

    init();

})();
