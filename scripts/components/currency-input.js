const currencyInput = (function () {

    function generate(element) {
        bindHandlers(element);
    }

    function bindHandlers(element) {
        element.removeEventListener('keypress', onKeyDown);
        element.removeEventListener('focus', onFocus);
        element.removeEventListener('blur', onBlur);

        element.addEventListener('keypress', onKeyDown);
        element.addEventListener('blur', onBlur);
        element.addEventListener('focus', onFocus);
    }

    function onKeyDown(e) {
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
    }

    function onFocus(e) {
        let target = e.target;
        let value = target.value;
        value = value.replace(',', '');
        target.value = value;
    }

    return {
        generate
    }
})();