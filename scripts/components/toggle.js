const toggle = (function () {
    //index of single select 

    function generate(settings) {
        if (settings === null) {
            console.error('plugin settings mallformed');
        } else if (settings.element === null) {
            console.error('settings element (container) not provided');
        }

        if (settings.element.childNodes.length <= 0) {
            //ToDo: generate html in js
        }
        //bind handlers if they are not yet initialized
        else if (settings.element.vertexToggle === undefined) {

            let dropdown = {
                element: settings.element,
                check: check,
                uncheck: uncheck,
                getState: isChecked,
                toggleState: toggleState,

            };
            if (settings.onCheck !== 'undefined') {
                dropdown.onCheck = settings.onCheck;
            }
            if (settings.onUncheck !== 'undefined') {
                dropdown.onUncheck = settings.onUncheck;
            }


            //check html of the plugin
            let checkboxEl = dropdown.element.getElementsByTagName('input')[0];
            if (checkboxEl === null) {
                console.error('plugin html is malformed - input checkbox element is missing');
            }
            dropdown.checkboxElement = checkboxEl;
            let statusLabel = settings.element.parentElement.parentElement.getElementsByClassName('element-form-mode')[0];
            if (statusLabel === null) {
                console.error('plugin html is malformed - status label element is missing');
            }
            dropdown.statusLabelElement = statusLabel;
            //prevent event propagation on label
            let label = dropdown.element.getElementsByTagName('label')[0];
            if (label === null) {
                console.error('plugin html is malformed - input label element is missing');
            } else {
                label.addEventListener('click', function (e) {
                    e.preventDefault();
                });
            }
            //bind plugin variables to the html element
            settings.element.vertexToggle = dropdown;
            settings.element.addEventListener('click', dropdown.toggleState);
            //set up checkbox state label to be translatable
            if (isChecked(settings.element)) {
                dropdown.statusLabelElement.innerHTML = localization.translateMessage('switchYesLabel', dropdown.statusLabelElement);
            } else {
                dropdown.statusLabelElement.innerHTML = localization.translateMessage('switchNoLabel', dropdown.statusLabelElement);
            }

        }
    }

    function check(element) {
        if (element === undefined) {
            element = this['element'];
        }
        element.vertexToggle.checkboxElement.checked = true;
        element.vertexToggle.statusLabelElement.innerHTML = localization.translateMessage('switchYesLabel');
        element.vertexToggle.statusLabelElement.dataset.translationKey = 'switchYesLabel';

    }

    function uncheck(element) {
        if (element === undefined) {
            element = this['element'];
        }
        element.vertexToggle.checkboxElement.checked = false;
        element.vertexToggle.statusLabelElement.innerHTML = localization.translateMessage('switchNoLabel');
        element.vertexToggle.statusLabelElement.dataset.translationKey = 'switchNoLabel';
    }

    function isChecked(element) {
        if (element === undefined) {
            element = this['element'];
        }
        return element.vertexToggle.checkboxElement.checked;
    }

    function toggleState(e) {
        e.stopPropagation();
        let target = this;
        let settings =target.vertexToggle;
        console.log(settings);
        if (isChecked(target)) {
            uncheck(target);
            if (settings.onUncheck !== undefined) {
                settings.onUncheck(target);
            }
        } else {
            check(target);
            if (settings.onCheck !== undefined) {
                settings.onCheck(target);
            }
        }
    }

    return {
        generate,
        isChecked,
    }
})();