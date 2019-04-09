const checkboxChangeState = (function () {

    function checkboxClick(checkbox) {
        let input = checkbox.getElementsByClassName('form-checkbox')[0].children[0];
        checkbox.onclick = function () {
            if (input.checked) {
                checkboxIsChecked(input, false)
            }
            else {
                checkboxIsChecked(input, true)
            }
        }
    }

    function radioClick(radioWrapper) {
        for (let radio of radioWrapper.getElementsByClassName('form-radio')) {
            let input = radio.children[0];
            radio.onclick = function () {
                checkboxIsChecked(input, true)
            }
        }
    }

    function checkboxIsChecked(input, isChecked) {
        if (isChecked) {
            input.checked = true;
        }
        else {
            input.checked = false;
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

    return {
        checkboxClick,
        radioClick,
        checkboxIsChecked,
        getRadioState,
        getCheckboxState
    }
})();