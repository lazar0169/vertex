const checkboxChangeState = (function () {

    function generateCheckbox(data) {
        checkboxClick(data.checkbox);
        checkboxIsChecked(data.checkbox.getElementsByClassName('form-checkbox')[0].children[0], data.isChecked)
    }

    function checkboxClick(checkbox) {
        let input;
        if (checkbox.getElementsByClassName('form-checkbox')[0]) {
            input = checkbox.getElementsByClassName('form-checkbox')[0].children[0];
        } else {
            input = checkbox.getElementsByClassName('form-switch')[0].children[0];
        }
        checkbox.onclick = function () {
            if (input.checked) {
                checkboxIsChecked(input, false);
            }
            else {
                checkboxIsChecked(input, true);

            }
        }
    }

    function radioClick(radioWrapper) {
        for (let radio of radioWrapper.getElementsByClassName('form-radio')) {
            let input = radio.children[0];
            radio.onclick = function () {
                if (input.checked) {
                    checkboxIsChecked(input, false)
                }
                else {
                    checkboxIsChecked(input, true)
                }
            }
        }
    }

    function checkboxIsChecked(input, isChecked) {
        if (isChecked) {
            input.checked = true;
            if (input.parentNode.parentNode.dataset && input.parentNode.parentNode.dataset.target) {
                $$(`${input.parentNode.parentNode.dataset.target}`).classList.remove('hidden');
                input.parentNode.parentNode.getElementsByClassName('checkbox-name')[0].classList.add('color-white');
            }
        }
        else {
            input.checked = false;
            if (input.parentNode.parentNode.dataset && input.parentNode.parentNode.dataset.target) {
                $$(`${input.parentNode.parentNode.dataset.target}`).classList.add('hidden');
                input.parentNode.parentNode.getElementsByClassName('checkbox-name')[0].classList.remove('color-white');
            }
        }
    }

    function getCheckboxState(checkbox) {
        return checkbox.getElementsByClassName('form-checkbox')[0].children[0].checked;
    }

    function getRadioState(radioWrapper) {
        for (let radio of radioWrapper.getElementsByClassName('form-radio')) {
            let input = radio.children[0];
            if (input.checked) {
                return radio.dataset.value;
            }
        }
    }

    function getSwitchState(element) {
        return element.getElementsByClassName('form-switch')[0].children[0].checked
    }

    return {
        generateCheckbox,
        checkboxClick,
        radioClick,
        checkboxIsChecked,
        getRadioState,
        getCheckboxState,
        getSwitchState
    }
})();