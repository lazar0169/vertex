let form = (function(){



    function getEvent(formSettings, eventToCheck) {
        let event;

        if (formSettings[eventToCheck] !== undefined) {
            event = formSettings[eventToCheck];
        } else if (formSettings.formContainerElement.dataset[eventToCheck] !== undefined) {
            event = formSettings.formContainerElement.dataset[eventToCheck];
        } else {
            console.error('Event doesn\'t exist!');
        }
        return event;
    }

    function initForm(formSettings) {
        formSettings.formContainerElement = $$(formSettings.formContainerSelector);
        let formContainerElement = formSettings.formContainerElement;
        formContainerElement.tableSettings = formSettings;
        if (formSettings.fillEvent !== null) {
            formSettings.fillEvent = getEvent(formSettings, 'fillEvent');
        }
        if (formSettings.submitEvent !== null) {
            formSettings.submitEvent = getEvent(formSettings, 'submitEvent');
        }
        trigger(formSettings.fillEvent, {formSettings: formSettings});
    }

    function getAllFormInputElements(formSettings){
        return formSettings.formContainerElement.getElementsByTagName('input');
    }


    function updateForm(formSettings) {
        let formInputElements = getAllFormInputElements(formSettings);

    }


    function validate(formSettings) {

    }


    function error(formSettings) {

    }


    function success(formSettings) {

    }


    function fillData(formSettings) {

    }


    function serialize(formSettings) {

    }


    function submit(formSettings) {

    }

    on('form/init', function(params){
        let formSettings = params.formSettings;
        initForm(formSettings);
    });

    on('form/update', function(params){
        let formSettings = params.formSettings;
        updateForm(formSettings);
    });

})();