const ticketAppearance = (function () {
    let ticketAppearanceAdvance = $$('#wrapper-ticket-appearance-advanced').children[0];
    let ticketAppearanceAdvanceShow = $$('#wrapper-ticket-appearance-advanced').children[1];
    let inputCasino = $$('#wrapper-tickets-appearance-general-settings').children[1].children[1];
    let inputAddress = $$('#wrapper-tickets-appearance-general-settings').children[2].children[1];
    let inputCity = $$('#wrapper-tickets-appearance-general-settings').children[3].children[1];
    let inputCurrency = $$('#wrapper-tickets-appearance-general-settings').children[4].children[1];
    let inputChasoutTicket = $$('#wrapper-tickets-appearance-cashable').children[1].children[1];
    let inputExpiringCashout = $$('#wrapper-tickets-appearance-cashable').children[2].children[1];
    let inputExpiringPromo = $$('#wrapper-tickets-appearance-promo').children[2].children[1];
    let inputValidation = $$('#tickets-advanced-settings-validation').children[1];
    let inputTicket = $$('#tickets-advanced-settings-ticket').children[1];
    let dateWrapper = $$('#tickets-advanced-settings-date');
    let timeWrapper = $$('#tickets-advanced-settings-time');
    let inputTicketVoid = $$('#tickets-advanced-settings-void').children[1];
    let inputTicketVoidDays = $$('#tickets-advanced-settings-days').children[1];
    let inputAsset = $$('#tickets-advanced-settings-asset').children[1];
    let inputAssetNumber = $$('#tickets-advanced-settings-asset-number').children[1];
    let chasableTicket = $$('#wrapper-tickets-appearance-cashable').children[0];
    let promoTicket = $$('#wrapper-tickets-appearance-promo').children[0];
    let inputPromoTicket = $$('#wrapper-tickets-appearance-promo').children[1].children[1];
    let codeNumber = '# 00000000';
    let codeTicket = '# 1';
    let codeValueTxt = 'ONE HUNDRED RSD 0/100';
    let codeCurrencyNumber = '100.00';
    let codeDate;
    let codeTime;

    let dateFormatArray = ['dd.MM.yyyy', 'dd/MM/yyyy', 'yyyy-MM-dd', 'dd-MM-yyyy', 'MM/dd/yyyy'];
    let timeFormatArray = ['hh:mm', 'hh:mm:ss', 'HH:mm', 'HH:mm:ss'];
    dateWrapper.appendChild(dropdown.generate(dateFormatArray));
    timeWrapper.appendChild(dropdown.generate(timeFormatArray));
    let selectedDateFormat = $$('#tickets-advanced-settings-date').children[1].children[0];
    let selectedTimeFormat = $$('#tickets-advanced-settings-time').children[1].children[0];
    let setDateFormat = $$('#tickets-advanced-settings-date').children[1];
    let setTimeFormat = $$('#tickets-advanced-settings-time').children[1];

    chasableTicket.addEventListener('click', function () {
        promoTicket.classList.remove('tab-active');
        chasableTicket.classList.add('tab-active');
        draw(ticketNameCoordinate, inputChasoutTicket.value);
        if (isNaN(inputExpiringCashout.value)) {
            draw(ticketVoidAfterNumber, inputExpiringCashout.value);
            draw(ticketVoidAfterDays, '');
        }
        else {
            draw(ticketVoidAfterNumber, inputExpiringCashout.value);
            draw(ticketVoidAfterDays, inputTicketVoidDays.value);
        }
    });

    promoTicket.addEventListener('click', function () {
        chasableTicket.classList.remove('tab-active');
        promoTicket.classList.add('tab-active');
        draw(ticketNameCoordinate, inputPromoTicket.value);
        if (isNaN(inputExpiringPromo.value)) {
            draw(ticketVoidAfterNumber, inputExpiringPromo.value);
            draw(ticketVoidAfterDays, '');
        }
        else {
            draw(ticketVoidAfterNumber, inputExpiringPromo.value);
            draw(ticketVoidAfterDays, inputTicketVoidDays.value);
        }
    });

    function formatDate(format) {
        switch (JSON.parse(format)) {

            case dateFormatArray[1]:
                codeDate = '16/10/2018';
                break;

            case dateFormatArray[2]:
                codeDate = '2018-10-16';
                break;

            case dateFormatArray[3]:
                codeDate = '16-10-2018'
                break;

            case dateFormatArray[4]:
                codeDate = '10/16/2018';
                break;

            default:
                codeDate = '16.10.2018';
        }
    }

    function formatTime(format) {
        switch (JSON.parse(format)) {

            case timeFormatArray[1]:
                codeTime = '11:02:23';
                break;

            case timeFormatArray[2]:
                codeTime = '23:02';
                break;

            case timeFormatArray[3]:
                codeTime = '23:02:23'
                break;

            default:
                codeTime = '11:02';
        }
    }

    let casinoCoorinate = {
        x: 200,
        y: 0,
        w: 400,
        h: 35
    }
    let addressCoordinate = {
        x: 200,
        y: 35,
        w: 200,
        h: 25
    }
    let cityCoordinate = {
        x: 400,
        y: 35,
        w: 200,
        h: 25
    }
    let ticketNameCoordinate = {
        x: 200,
        y: 60,
        w: 400,
        h: 60
    }
    let validationCoordinate = {
        x: 200,
        y: 200,
        w: 200,
        h: 20
    }
    let validationNumberCoordinate = {
        x: 400,
        y: 200,
        w: 200,
        h: 20
    }
    let dateCoordinate = {
        x: 200,
        y: 220,
        w: 100,
        h: 20
    }
    let timeCoordinate = {
        x: 300,
        y: 220,
        w: 100,
        h: 20
    }
    let ticketCoordinate = {
        x: 400,
        y: 220,
        w: 100,
        h: 20
    }
    let ticketNumberCoordinate = {
        x: 500,
        y: 220,
        w: 100,
        h: 20
    }
    let valueTxtCoordinate = {
        x: 200,
        y: 240,
        w: 400,
        h: 20
    }
    let currencyCoordinate = {
        x: 200,
        y: 260,
        w: 200,
        h: 40
    }
    let currencyNumberCoordinate = {
        x: 400,
        y: 260,
        w: 200,
        h: 40
    }
    let ticketVoidAfterCoordinate = {
        x: 200,
        y: 300,
        w: 150,
        h: 20
    }
    let ticketVoidAfterNumber = {
        x: 350,
        y: 300,
        w: 50,
        h: 20
    }
    let ticketVoidAfterDays = {
        x: 400,
        y: 300,
        w: 70,
        h: 20
    }
    let assetCoordinate = {
        x: 470,
        y: 300,
        w: 80,
        h: 20
    }
    let assetCoordinateNumber = {
        x: 550,
        y: 300,
        w: 50,
        h: 20
    }

    window.addEventListener('load', function () {
        drawBarcode();
        formatDate(selectedDateFormat.dataset.items);
        formatTime(selectedTimeFormat.dataset.items);
        draw(casinoCoorinate, inputCasino.value);
        draw(addressCoordinate, inputAddress.value);
        draw(cityCoordinate, inputCity.value);
        draw(ticketNameCoordinate, inputChasoutTicket.value);
        draw(validationCoordinate, inputValidation.value);
        draw(validationNumberCoordinate, codeNumber);
        draw(dateCoordinate, codeDate);
        draw(timeCoordinate, codeTime);
        draw(ticketCoordinate, inputTicket.value)
        draw(ticketNumberCoordinate, codeTicket);
        draw(valueTxtCoordinate, codeValueTxt);
        draw(currencyCoordinate, inputCurrency.value);
        draw(currencyNumberCoordinate, codeCurrencyNumber);
        draw(ticketVoidAfterCoordinate, inputTicketVoid.value);
        draw(ticketVoidAfterNumber, inputExpiringCashout.value);
        if (!isNaN(inputExpiringCashout.value)) {
            draw(ticketVoidAfterDays, inputCurrency.value);
        }
        else {
            draw(ticketVoidAfterDays, '');
        }
        draw(assetCoordinate, inputAsset.value);
        draw(assetCoordinateNumber, `# ${inputAssetNumber.value}`);
        drawProba();
    });

    ticketAppearanceAdvance.addEventListener('click', function () {
        ticketAppearanceAdvanceShow.classList.toggle('hidden');
    });

    inputCasino.addEventListener('keyup', function (event) {
        draw(casinoCoorinate, inputCasino.value);
    });

    inputAddress.addEventListener('keyup', function (event) {
        draw(addressCoordinate, inputAddress.value);
    });

    inputCity.addEventListener('keyup', function (event) {
        draw(cityCoordinate, inputCity.value);
    });

    inputChasoutTicket.addEventListener('keyup', function (event) {
        if (chasableTicket.classList.contains('tab-active')) {
            draw(ticketNameCoordinate, inputChasoutTicket.value);
        }
    });

    inputExpiringCashout.addEventListener('keyup', function (event) {
        if (chasableTicket.classList.contains('tab-active')) {
            draw(ticketVoidAfterNumber, inputExpiringCashout.value);
            isNaN(inputExpiringCashout.value) ? draw(ticketVoidAfterDays, '') : draw(ticketVoidAfterDays, inputExpiringCashout.value);
        }
    });

    inputPromoTicket.addEventListener('keyup', function (event) {
        if (promoTicket.classList.contains('tab-active')) {
            draw(ticketNameCoordinate, inputPromoTicket.value);
        }
    });

    inputExpiringPromo.addEventListener('keyup', function (event) {
        if (promoTicket.classList.contains('tab-active')) {
            draw(ticketVoidAfterNumber, inputExpiringPromo.value);
            isNaN(inputExpiringPromo.value) ? draw(ticketVoidAfterDays, '') : draw(ticketVoidAfterDays, inputTicketVoidDays.value);
        }
    });

    inputValidation.addEventListener('keyup', function (event) {
        draw(validationCoordinate, inputValidation.value);
    });

    setDateFormat.addEventListener('click', function () {
        formatDate(selectedDateFormat.dataset.items);
        draw(dateCoordinate, codeDate);
    });

    setTimeFormat.addEventListener('click', function () {
        formatTime(selectedTimeFormat.dataset.items);
        draw(timeCoordinate, codeTime);
    });

    inputTicket.addEventListener('keyup', function (event) {
        draw(ticketCoordinate, inputTicket.value)
    });

    inputCurrency.addEventListener('keyup', function (event) {
        draw(currencyCoordinate, inputCurrency.value);
    });

    inputTicketVoid.addEventListener('keyup', function (event) {
        draw(ticketVoidAfterCoordinate, inputTicketVoid.value);
    });

    inputTicketVoidDays.addEventListener('keyup', function (event) {
        if (chasableTicket.classList.contains('tab-active')) {
            isNaN(inputExpiringCashout.value) ? draw(ticketVoidAfterDays, '') : draw(ticketVoidAfterDays, inputTicketVoidDays.value);
        }
        if (promoTicket.classList.contains('tab-active')) {
            isNaN(inputExpiringPromo.value) ? draw(ticketVoidAfterDays, '') : draw(ticketVoidAfterDays, inputTicketVoidDays.value);
        }
    });

    inputAsset.addEventListener('keyup', function (event) {
        draw(assetCoordinate, inputAsset.value);
    });

    inputAssetNumber.addEventListener('keyup', function (event) {
        draw(assetCoordinateNumber, `# ${inputAssetNumber.value}`);
    });

    function draw(coordinate, value) {
        let canvas = $$('#wrapper-canvas').children[0];
        let ctx = canvas.getContext("2d");
        ctx.clearRect(coordinate.x, coordinate.y, coordinate.w, coordinate.h);
        let txt = `${value}`;
        ctx.font = `${coordinate.h - 10}px Arial`;
        ctx.fillText(txt, coordinate.x + coordinate.w / 2 - (ctx.measureText(txt).width / 2), coordinate.y + coordinate.h - 10);
    }
    function drawBarcode() {
        let canvas = $$('#wrapper-canvas').children[0];
        let ctx = canvas.getContext("2d");
        let img = document.getElementById("barcode");
        ctx.drawImage(img, 200, 120, 400, 80);
    }

    function drawProba() {
        let canvas = $$('#wrapper-canvas').children[0];
        let ctx = canvas.getContext("2d");
        ctx.clearRect(20, 20, 100, 200);
        let txt = 'proba';
        ctx.fillText(txt, 20, 20, 100, 200);
    }
})();