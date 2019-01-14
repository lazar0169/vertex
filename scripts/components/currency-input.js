const currencyInput = (function () {

    function generate(element) {
        bindHandlers(element);
    }

    function bindHandlers(element) {
        element.removeEventListener('keypress', onKeyDown);
        element.removeEventListener('blur', onBlur);

        element.addEventListener('keypress', onKeyDown);
        element.addEventListener('blur', onBlur);
    }

    function onKeyDown(e) {
        e = e || window.event;
        var charCode = (typeof e.which == "undefined") ? e.keyCode : e.which;
        var charStr = String.fromCharCode(charCode);
        console.log(charStr);
        console.log(config.thousandSeparator === charStr);
        if (config.thousandSeparator === charStr) {
            return false;
        }
    }

    function onBlur(e) {
        let target = e.target;
        let value = target.value;
        value = value.replace(',', '');
        let parsedValue = formatFloatValue(value);
        console.log(parsedValue);
        target.value = parsedValue;
    }


    return {
        generate
    }
})();