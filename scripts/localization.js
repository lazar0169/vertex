let localization = (function(){

    let languages = {
      'English': '/languages/eng.json',
      'Deutsch': '/languages/deu.json',
      'Francais': '/language/fra.json'
    };

    function replaceText(templateElementSelector, model, callbackEvent) {
        trigger('template/render', {templateElementSelector: templateElementSelector, model: model, callbackEvent: callbackEvent});
    }

    function loadJSON(path, callback) {
        console.log('Load JSON');
        let xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', path, true);
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {
                callback(xobj.responseText);
            }
            console.log('xobj.response text', xobj.responseText);
        };
        xobj.send(null);
    }

    function changeLanguage(multiLanguageElementClass, langInUse) {
        console.log('Lang in use: ', langInUse);

        let stringsToBeTranslated = $$(multiLanguageElementClass);
        console.log('Strings to be translated: ', stringsToBeTranslated);

        let languagePath = languages[langInUse];
        console.log('LanguagePath: ', languagePath);

        let languageModel = loadJSON(languagePath, function(response){
            let languageModel = JSON.parse(response);
            console.log('Language model callback', languageModel);
            return languageModel;
        });

        console.log('Language model', languageModel);

        for (let i = 0; i < stringsToBeTranslated.length; i++) {
            console.log('String to be translated', stringsToBeTranslated[i]);
            replaceText(stringsToBeTranslated[i], languageModel , 'localization/language/change');
        }
    }

    on('localization/language/change', function(params){
        let langInUse = params.langInUse;
        let multiLanguageElementClass = '.element-multilanguage';
        changeLanguage(multiLanguageElementClass, langInUse);
    });

    $$('#lang-selector').addEventListener('change', function(){
        let selectedLanguage = this.options[this.selectedIndex].value;
        console.log('Selected language: ', selectedLanguage);
        trigger('localization/language/change', {langInUse: selectedLanguage});
    });

})();
