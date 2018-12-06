let form = (function(){

    let currentEndpointId;

    function setEndpointId(formSettings, enpointId){
        formSettings.endpointId = enpointId;
        currentEndpointId = enpointId;
        console.log('current endpoint id', currentEndpointId);
    }

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
        let formContainerElement =  $$(formSettings.formContainerSelector);
        formSettings.formContainerElement = formContainerElement;
        formContainerElement.formSettings = formSettings;
        if (formSettings.fillEvent !== null) {
            formSettings.fillEvent = getEvent(formSettings, 'fillEvent');
        }
        if (formSettings.submitEvent !== null) {
            formSettings.submitEvent = getEvent(formSettings, 'submitEvent');
        }
        // trigger(formSettings.fillEvent, {formSettings: formSettings});
        trigger('form/update', {formSettings: formSettings});
    }

    function getAllFormInputElements(formSettings){
        let formElement = formSettings.formContainerElement.getElementsByClassName('element-async-form')[0];
        let inputElements = formElement.getElementsByTagName('input');
        return inputElements;
    }


    function updateForm(formSettings) {
        let formInputElements = getAllFormInputElements(formSettings);
        let formInputElementsArray = Array.prototype.slice.call(formInputElements);
        console.log('form input elements array', formInputElementsArray);
        formInputElementsArray.forEach(function(inputElement){
            if(inputElement.dataset.name === 'endpointId') {
                setEndpointId(formSettings, inputElement.dataset.value);
            }
        });

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
        alert('form/init');
        let formSettings = params.formSettings;
        initForm(formSettings);
    });

    on('form/update', function(params){
        alert('form/update');
        let formSettings = params.formSettings;
        updateForm(formSettings);
    });












})();