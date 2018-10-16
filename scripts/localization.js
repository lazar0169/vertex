let localization = (function(){

    let languages = {
      'English': '/languages/eng.json',
      'Deutsch': '/languages/deu.json',
      'Francais': '/language/fra.json'
    };

    function replaceText(templateElementSelector, model, callbackEvent) {
        trigger('template/render', {templateElementSelector: templateElementSelector, model: model, callbackEvent: callbackEvent});
    }

    function changeLanguage(multiLanguageElementClass, langInUse) {
        console.log('Lang in use: ', langInUse);

        let stringsToBeTranslated = $$(multiLanguageElementClass);
        console.log('Strings to be translated: ', stringsToBeTranslated);

        let model = ''; //ovaj model cemo izvuci iz .json-a

        let languagePath = languages[langInUse];
        console.log('LanguagePath: ', languagePath);

        for (let i = 0; i < stringsToBeTranslated.length; i++) {
            console.log('String to be translated', stringsToBeTranslated[i]);
            replaceText(stringsToBeTranslated[i], model , 'localization/language/change');
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
