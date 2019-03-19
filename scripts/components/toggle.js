const toggle = (function () {
    //----------uzeto iz forme-----------------------//

    window.addEventListener('load', function () {
        let slideCheckbox = $$('.vertex-form-checkbox');
        for (let check of slideCheckbox) {
            toggle.generate({
                element: check,
                onUncheck: toggleSection,
                onCheck: toggleSection
            })
        }
    });

    function toggleSection(e) {
        if (e === undefined) {
            e = this['element'];
        }
        let targetSelector = e.dataset.target;
        let checked = e.vertexToggle.getState(e);
        if (targetSelector !== undefined) {
            let targetElement = $$(targetSelector);
            if (targetElement !== undefined && targetElement !== null) {
                if (checked === false) {
                    collapseElement(targetElement);
                } else {
                    expandElement(targetElement);
                }
            }
        }
    }
    //------------------------------------------------------//

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
            //prevent validation as this element cannot be skipped
            checkboxEl.setAttribute('novalidate', 'true');
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
        if (element.vertexToggle.onCheck !== undefined) {
            element.vertexToggle.onCheck(element);
        }
    }

    function uncheck(element) {
        if (element === undefined) {
            element = this['element'];
        }
        element.vertexToggle.checkboxElement.checked = false;
        element.vertexToggle.statusLabelElement.innerHTML = localization.translateMessage('switchNoLabel');
        element.vertexToggle.statusLabelElement.dataset.translationKey = 'switchNoLabel';

        if (element.vertexToggle.onUncheck !== undefined) {
            element.vertexToggle.onUncheck(element);
        }
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
        let settings = target.vertexToggle;
        if (isChecked(target)) {
            uncheck(target);
        } else {
            check(target);

        }
    }

    return {
        generate,
        isChecked,
    }
})();