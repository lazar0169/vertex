let validation = (function () {

    const errorMessageAttributeSuffix = '-error-message';
    const inputTypes = {
        singleSelect: 'single-select',
        integer: 'int',
        float: 'float',
        email: 'email',
        string: 'string',
        pattern: 'pattern',
        array: 'array'
    };

    const constraintAttributes = {
        required: 'required',
        minimum: 'min',
        maximum: 'max',
        equals: 'equals',
        email: 'email'
    };

    const constraintsOperators = {
        required: 'required',
        greaterThan: '>',
        lesserThan: '<',
        equals: '=',
        email: 'email'
    };

    const defaultErrorMessages = {};
    defaultErrorMessages[inputTypes.integer] = 'IntegerValidationErrorMessage';
    defaultErrorMessages[inputTypes.string] = 'StringValidationErrorMessage';
    defaultErrorMessages[inputTypes.float] = 'FloatValidationErrorMessage';
    defaultErrorMessages[inputTypes.email] = 'EmailFormatValidationErrorMessage';
    defaultErrorMessages[constraintAttributes.email] = 'EmailFormatValidationErrorMessage';
    defaultErrorMessages[constraintAttributes.required] = 'RequiredValidationErrorMessage';
    defaultErrorMessages[constraintAttributes.minimum] = 'LesserThanValidationErrorMessage';
    defaultErrorMessages[constraintAttributes.maximum] = 'GreaterThanValidationErrorMessage';
    defaultErrorMessages[constraintAttributes.equals] = 'EqualsValidationErrorMessage';

    let operatorFunctions = {};
    // a - input value
    // b - compared value
    operatorFunctions[constraintsOperators.greaterThan] = function (a, b) {
        a = parseFloat(a.replace(/,/g, ''));
        return a > b;
    };
    operatorFunctions[constraintsOperators.lesserThan] = function (a, b) {
        a = parseFloat(a.replace(',', ''));
        return a < b
    };
    operatorFunctions[constraintsOperators.equals] = function (a, b) {
        //unsafe comparison here as html attributes are always parsed as strings
        return a == b;
    };
    operatorFunctions[constraintsOperators.required] = function (a) {
        return a !== undefined && a !== null && a !== '';
    };
    operatorFunctions[constraintsOperators.email] = function(a) {
        return a.match(new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ));
    }
    //endregion


    return {
        init: init
    };

    //region event listeners
    function onKeyPress(e) {
        e = e || window.event;
        let target = e.target;

        let val = target.value;

        let charCode = (e.which === undefined) ? e.keyCode : e.which;
        let charStr = String.fromCharCode(charCode);
        //get start position in string where character is inserted
        let start = target.selectionStart;
        let end = target.selectionEnd;

        let newValue = val.slice(0, start) + charStr + val.slice(end);

        target.vertexValidation.errors = [];
        if (!validateRules(target.vertexValidation, newValue)) {
            e.preventDefault();
            return false;
        }
    }

    function onPaste(e) {
        e = e || window.event;
        let target = e.target;

        let clipboardData = e.clipboardData || window.clipboardData;
        let pastedData = clipboardData.getData('Text');

        target.vertexValidation.errors = [];
        if (!validateRules(target.vertexValidation, pastedData)) {
            e.preventDefault();
            return false;
        }
    }


    //endregion

    //region private helper functions

    function init(element, settings) {
        if (element.vertexValidation !== undefined) {
            delete element.vertexValidation;
        }
        element.vertexValidation = createDefaultSettings(element, settings);
        bindHandlers(element);
    }

    function bindHandlers(element) {
        element.removeEventListener('keypress', onKeyPress);
        element.removeEventListener('paste', onPaste);

        element.addEventListener('keypress', onKeyPress);
        element.addEventListener('paste', onPaste);

    }

    function validate(validationSettings) {
        if (validationSettings === undefined) {
            validationSettings = this;
        }
        if (validationSettings.input.getAttribute('novalidate') === 'true') {
            return true;
        }
        validationSettings.errors = [];
        validationSettings.input.classList.remove(validationSettings.errorClass);

        validationSettings.hideErrors(validationSettings);
        let value = validationSettings.input.value;
        let valid = true;
        valid = validateRules(validationSettings, value) && valid;
        valid = validateConstraints(validationSettings, value) && valid;
        if (!valid) {
            validationSettings.input.classList.add(validationSettings.errorClass);
            if (validationSettings.showErrorMessages) {
                validationSettings.showErrors(validationSettings);
            }
        }
        return valid;
    }

    function showRepeaterFieldError(validationSettings) {
        let input = validationSettings.input;
        for (let i = 0; i < validationSettings.errors.length; i++) {
            let errorMessage = validationSettings.errors[i];
            let errorElement = document.createElement(validationSettings.errorElement);
            errorElement.classList.add('vertex-error-container');
            errorElement.innerHTML = localization.translateMessage(errorMessage, errorElement);
            validationSettings.input.parentNode.append(errorElement);
            validationSettings.errorElements.push(errorElement);
        }
    }

    function showErrors(validationSettings) {
        for (let i = 0; i < validationSettings.errors.length; i++) {
            let errorMessage = validationSettings.errors[i];
            let errorElement = document.createElement(validationSettings.errorElement);
            errorElement.classList.add('vertex-error-container');
            errorElement.innerHTML = localization.translateMessage(errorMessage, errorElement);
            validationSettings.input.after(errorElement);
            validationSettings.errorElements.push(errorElement);
        }
    }

    function hideErrors(validationSettings) {
        while (validationSettings.errorElements.length > 0) {
            let element = validationSettings.errorElements.pop();
            element.parentNode.removeChild(element);
        }
    }


    function createDefaultSettings(element, settings) {
        settings.input = element;
        //bind functions
        settings.validate = validate;
        settings.hideErrors = hideErrors;

        settings.errors = [];
        settings.errorElements = [];

        if (isEmpty(settings.showErrors)) {
            if (element.dataset.type !== undefined && element.dataset.type=== inputTypes.array) {
                settings.showErrors = showRepeaterFieldError;
            }
            else {
                settings.showErrors = showErrors;
            }
        }

        if (isEmpty(settings.shouldValidate)) {
            settings.shouldValidate = true;
        }
        if (isEmpty(settings.showErrorMessages)) {
            settings.showErrorMessages = true;
        }
        //set rules from
        if (isEmpty(settings.rules)) {
            settings.rules = new Map();
            //ToDo: part 2 - check if there are multiple rules
            if (!isEmpty(element) && !isEmpty(element.dataset.type)) {
                let type = element.dataset.type;
                let rule = {
                    type: type,
                    regex: new RegExp('')
                };
                if (!isEmpty(element.getAttribute('pattern'))) {
                    rule.regex = new RegExp(element.getAttribute('pattern'));
                } else {
                    switch (type) {
                        case inputTypes.integer:
                            rule.regex = new RegExp('^\\d+$');
                            break;
                        case inputTypes.float:
                            rule.regex = new RegExp(/^[0-9.]*$/);
                            break;
                        case inputTypes.string:
                            rule.regex = new RegExp('');
                            break;
                        //special case, requires pattern attribute
                        default:
                            rule.regex = new RegExp('');
                            break;
                    }
                    settings.rules.set(type, rule);
                }
            }
        }
        if (isEmpty(settings.constraints)) {
            settings.constraints = new Map();

            let min = element.getAttribute(constraintAttributes.minimum);
            let max = element.getAttribute(constraintAttributes.maximum);
            let equals = element.getAttribute(constraintAttributes.equals);
            let required = element.getAttribute(constraintAttributes.required);
            let email = element.getAttribute(constraintAttributes.email);
            //email constraint

            if(!isEmpty(email)) {
                settings.constraints.set(constraintAttributes.email, {
                        name: constraintAttributes.email,
                        operator: constraintsOperators.email,
                        value: true
                    }
                )
            }

            if (!isEmpty(min)) {
                settings.constraints.set(constraintAttributes.minimum, {
                        name: constraintAttributes.minimum,
                        operator: constraintsOperators.greaterThan,
                        value: parseFloat(min)
                    }
                )
            }
            if (!isEmpty(max)) {
                settings.constraints.set(constraintAttributes.maximum, {
                        name: constraintAttributes.maximum,
                        operator: constraintsOperators.lesserThan,
                        value: parseFloat(max)
                    }
                )
            }
            if (!isEmpty(equals)) {
                settings.constraints.set(constraintAttributes.equals, {
                        name: constraintAttributes.equals,
                        operator: constraintsOperators.equals,
                        value: equals
                    }
                )
            }
            if (!isEmpty(required)) {
                settings.constraints.set(constraintAttributes.required, {
                        name: constraintAttributes.required,
                        operator: constraintsOperators.required,
                        value: true
                    }
                )
            }
        }
        if (isEmpty(settings.errorMessages)) {
            settings.errorMessages = new Map();
            //for (let i = 0; i < settings.rules.length; i++) {
            settings.rules.forEach(function (rule) {
                let errorMessageAttributeName = rule.type + errorMessageAttributeSuffix;
                if (!isEmpty(element.getAttribute(errorMessageAttributeName))) {
                    settings.errorMessages.set(rule.type, element.getAttribute(errorMessageAttributeName));
                } else {
                    settings.errorMessages.set(rule.type, defaultErrorMessages[rule.type]);
                }
            });
//            for (let i = 0; i < settings.constraints.length; i++) {
            settings.constraints.forEach(function (constraint) {
                let errorMessageAttributeName = constraint.type + errorMessageAttributeSuffix;
                if (!isEmpty(element.getAttribute(errorMessageAttributeName))) {
                    settings.errorMessages.set(constraint.name, element.getAttribute(errorMessageAttributeName));
                } else {
                    settings.errorMessages.set(constraint.name, defaultErrorMessages[constraint.name]);
                }
            });
        }
        if (isEmpty(settings.errorElement)) {
            settings.errorElement = 'div';
        }
        if (isEmpty(settings.errorClass)) {
            settings.errorClass = 'vertex-validation-error';
        }
        return settings;
    }

    function validateRules(settings, value) {
        let rules = settings.rules;
        let keys = Array.from(rules.keys());
        let valid = true;
        for (let i = 0; i < keys.length; i++) {
            let rule = rules.get(keys[i]);
            value = parseValue(rule,value);
            if (value.match(rule.regex) === null) {
                valid = false;
                settings.errors.push(settings.errorMessages.get(rule.type));
            }
        }
        return valid;
    }

    function validateConstraints(settings, value) {
        let constraints = settings.constraints;
        let keys = Array.from(constraints.keys());
        let valid = true;
        for (let i = 0; i < keys.length; i++) {
            let constraint = constraints.get(keys[i]);
            if (!operatorFunctions[constraint.operator](value, constraint.value)) {
                valid = false;
                settings.errors.push(settings.errorMessages.get(constraint.name));
            }
        }
        return valid;
    }

    function parseValue(rule,value) {
        if (rule.type === inputTypes.float) {
            return value.replace(/,/g,'');
        }
        return value;
    }
})
();