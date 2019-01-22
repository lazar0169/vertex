let validation = (function () {

    const errorMessageAttributeSuffix = '-error-message';

    const inputTypes = {
        singleSelect: 'single-select',
        integer: 'int',
        float: 'float',
        string: 'string',
        email: 'email',
        pattern: 'pattern',
        array: 'array'
    }

    const constraintAttributes = {
        required: 'required',
        minimum: 'min',
        maximum: 'max',
        equals: 'equals'
    }

    const constraintsOperators = {
        required: 'required',
        greaterThan: '>',
        lesserThan: '<',
        equals: '='
    };

    const defaultErrorMessages = {};
    defaultErrorMessages[inputTypes.integer] = 'IntegerValidationErrorMessage';
    defaultErrorMessages[inputTypes.string] = 'StringValidationErrorMessage';
    defaultErrorMessages[inputTypes.float] = 'FloatValidationErrorMessage';
    defaultErrorMessages[constraintsOperators.required] = 'RequiredValidationErrorMessage';
    defaultErrorMessages[constraintsOperators.greaterThan] = 'GreaterThanValidationErrorMessage';
    defaultErrorMessages[constraintsOperators.lesserThan] = 'LesserThanValidationErrorMessage';
    defaultErrorMessages[constraintsOperators.equals] = 'EqualsValidationErrorMessage';

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

        let rules = target.vertexValidation.rules;
        if (!validateRules(rules, newValue)) {
            e.preventDefault();
            return false;
        }
    }

    function onPaste(e) {
        e = e || window.event;
        let target = e.target;

        let clipboardData = e.clipboardData || window.clipboardData;
        let pastedData = clipboardData.getData('Text');

        let rules = target.vertexValidation.rules;
        if (!validateRules(rules, pastedData)) {
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

    function validate(target) {
        console.log('this', this);
        console.log('this', target);
    }

    function showErrors() {

    }

    function hideErrors() {

    }


    function createDefaultSettings(element, settings) {
        settings.input = element;
        //bind functions
        settings.validate = validate;
        settings.showErrors = showErrors;
        settings.hideErrors = hideErrors;

        if (isEmpty(settings.shouldValidate)) {
            settings.shouldValidate = true;
        }
        if (isEmpty(settings.showErrorMessages)) {
            settings.shouldValidate = true;
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
                            rule.regex = new RegExp(/^-?\d*\.?\d*$/);
                            break;
                        case inputTypes.string:
                            rule.regex = new RegExp('/[A-Z]/g');
                            break;
                        //special case, requires pattern attribute
                        default:
                            break;
                    }
                    settings.rules.set(type, rule);
                }
            }
        }
        if (isEmpty(settings.constraints)) {
            settings.constraints = new Map();

            let min = element.getAttribute(constraintAttributes.minimum) !== null;
            let max = element.getAttribute(constraintAttributes.maximum) !== null;
            let equals = element.getAttribute(constraintAttributes.equals) !== null;
            let required = element.getAttribute(constraintAttributes.required) !== null;

            if (min !== undefined) {
                settings.constraints.set(constraintAttributes.minimum, {
                        name: constraintAttributes.minimum,
                        operator: constraintsOperators.greaterThan,
                        value: min
                    }
                )
            }
            if (max !== undefined) {
                settings.constraints.set(constraintAttributes.maximum, {
                        name: constraintAttributes.maximum,
                        operator: constraintsOperators.lesserThan,
                        value: max
                    }
                )
            }
            if (equals !== undefined) {
                settings.constraints.set(constraintAttributes.equals, {
                        name: constraintAttributes.equals,
                        operator: constraintsOperators.equals,
                        value: equals
                    }
                )
            }
            if (required !== undefined) {
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
            for (let i = 0; i < settings.rules.length; i++) {
                let errorMessageAttributeName = settings.rules[i].type + errorMessageAttributeSuffix;
                if (element.getAttribute(errorMessageAttributeName) !== undefined) {
                    settings.errorMessages.set(settings.rules[i].type, element.getAttribute(errorMessageAttributeName));
                } else {
                    settings.errorMessages.set(settings.rules[i].type, defaultErrorMessages[settings.rules[i].type]);

                }
            }
            for (let i = 0; i < settings.rules.length; i++) {
                let errorMessageAttributeName = settings.constraints[i].type + errorMessageAttributeSuffix;
                if (element.getAttribute(errorMessageAttributeName) !== undefined) {
                    settings.errorMessages.set(settings.constraints[i].name, element.getAttribute(errorMessageAttributeName));
                } else {
                    settings.errorMessages.set(settings.constraints[i].name, defaultErrorMessages[settings.rules[i].type]);
                }
            }
        }
        if (isEmpty(settings.errorElement)) {
            settings.errorElement = 'div';
        }
        if (isEmpty(settings.errorClass)) {
            settings.errorClass = 'vertex-validation-error';
        }
        return settings;
    }

    function validateRules(rules, value) {
        let keys = Array.from(rules.keys());
        let valid = true;
        for (let i = 0; i < keys.length; i++) {
            let rule = rules.get(keys[i]);
            if (value.match(rule.regex) === null) {
                valid = false;
                break;
            }
        }
        return valid;
    }

    let operatorFunctions = {};
    operatorFunctions[constraintsOperators.greaterThan] = function (a, b) {
        return a > b
    };
    operatorFunctions[constraintsOperators.lesserThan] = function (a, b) {
        return a < b
    };
    operatorFunctions[constraintsOperators.equals] = function (a, b) {
        return a === b;
    };
    operatorFunctions[constraintsOperators.required] = function (a) {
        return a === undefined && a === null && a === '';
    };
    //endregion
})
();