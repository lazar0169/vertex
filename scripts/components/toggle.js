const toggle  = (function () {
    //index of single select 

    function generate(settings) {
        if (settings === null) {
            console.error('plugin settings mallformed');
        }
        else if (settings.element === null) {
            console.error('settings element (container) not provided');
        }

        if (settings.element.childNodes.length <= 0) {
            //ToDo: generate html in js
        }
        //bind handlers if they are not yet initialized
        else if (settings.element.vertexToggle === undefined) {
            let dropdown = {
                element:settings.element,
                check:check,
                uncheck:uncheck,
                getState: isChecked,
                toggleState:toggleState,
            }
            let checkboxEl = dropdown.element.getElementsByTagName('input')[0];
            if (checkboxEl === null) {
                console.error('plugin html is malformed - input checkbox element is missing');
            }
            let label = dropdown.element.getElementsByTagName('label')[0];
            if (label === null) {
                console.error('plugin html is malformed - input label element is missing');
            }
            else {
                label.addEventListener('click',function(e){
                    e.preventDefault();
                });
            }
            dropdown.checkboxElement = checkboxEl;
            settings.element.vertexToggle = dropdown;
            settings.element.addEventListener('click',dropdown.toggleState);
        }
    }

    function check(element) {
        element.vertexToggle.checkboxElement.checked = true;
    }
    function uncheck(element) {
        element.vertexToggle.checkboxElement.checked = false;
    }
    function isChecked(element) {
        return element.vertexToggle.checkboxElement.checked;
    }
    function toggleState(e) {
        e.stopPropagation();
        console.log('toggled');
        let target = this;
        console.log(isChecked(target));
        console.log(target.vertexToggle.checkboxElement.checked);
        if (isChecked(target)) {
            uncheck(target);
        }
        else {
            check(target);
        }
    }

    return {
        generate,
        isChecked,
    }
})();