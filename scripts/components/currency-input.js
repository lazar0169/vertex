const currencyInput = (function () {

    function generate(element) {
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
        let value;

        if (target.value.indexOf(config.decimalSeparator) !== -1) {

            switch (target.value.split(config.decimalSeparator)[1].length) {
                case 0:
                    value = target.value.replace(/,/g, '').replace(/\./g, '') + "00";
                    break;

                case 1:
                    value = target.value.replace(/,/g, '').replace(/\./g, '') + "0";
                    break;

                case 2:
                    value = target.value.replace(/,/g, '').replace(/\./g, '');
                    break;
            }
        } else {
            value = Number(target.value) * 100;
        }
        // let value = target.value.replace(/,/g, '').replace(/\./g, '');
        let parsedValue = formatFloatValue(value);
        target.value = parsedValue;
        target.dataset.value = value;
    }

    function onFocus(e) {
        let target = e.target;
        let value;
        if (config.decimalSeparator === '.') {
            value = target.value.replace(/,/g, '');
        } else {
            value = target.value.replace(/\./g, '');

        }
        let parsedValue = value;
        target.value = parsedValue;
        target.dataset.value = value;
    }

    return {
        generate
    }
})();