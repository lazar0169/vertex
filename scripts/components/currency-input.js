const currencyInput = (function () {

    function generate(element) {
        // validation.init(element, {});
        bindHandlers(element);
    }

    function bindHandlers(element) {
        element.removeEventListener('keypress', onKeyPress);
        element.removeEventListener('focus', onFocus);
        element.removeEventListener('blur', onBlur);

        element.addEventListener('keypress', onKeyPress);
        element.addEventListener('blur', onBlur);
        element.addEventListener('focus', onFocus);
    }

    function onKeyPress(e) {
        e = e || window.event;
        let charCode = (e.which === undefined) ? e.keyCode : e.which;
        let charStr = String.fromCharCode(charCode);

        if (config.thousandSeparator === charStr) {
            e.preventDefault();
            return false;
        }
        else if (config.decimalSeparator === charStr && e.target.value.indexOf(config.decimalSeparator) >= 0) {
            e.preventDefault();
            return false;
        }
    }

    function onBlur(e) {
        let target = e.target;
        let value = target.value;
        let parsedValue = formatFloatValue(value);
        target.value = parsedValue;
        target.dataset.value = parsedValue.replace(/,/g, '').replace('.', '');
    }

    function onFocus(e) {
        let target = e.target;
        let value = target.value;
        value = value.replace(/,/g, '');
        target.value = value;
        target.dataset.value = value.replace('.', '');
    }

    return {
        generate
    }
})();