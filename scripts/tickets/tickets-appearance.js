const ticketAppearance = (function () {
    // let formSettingsAppearance = {};
    // formSettingsAppearance.formContainerSelector = '#tickets-appearance-tab-info';
    // formSettingsAppearance.getData = communication.events.tickets.ticketAppearance;
    // formSettingsAppearance.submitEvent = communication.events.tickets.saveAppearance;

    on('tickets/tab/appearance', function (params) {
        // formSettingsAppearance.endpointId = params.endpointId;
        // trigger('form/init', { formSettings: formSettingsAppearance });
        // trigger('form/getData', { formSettings: formSettingsAppearance });

        fillInput(params.data.Data, params.additionalData.EndpointId)
    });
    let ticketAppearanceTab = $$('#tickets-appearance-tab-info');
    let ticketAppearanceAdvance = $$('#wrapper-ticket-appearance-advanced').children[0];
    let ticketAppearanceAdvanceShow = $$('#wrapper-ticket-appearance-advanced').children[1];
    //kazino podatak Name
    let inputCasino = $$('#wrapper-tickets-appearance-general-settings').children[1].children[1];
    // adresa podatak Address1 / adresa kazina
    let inputAddress = $$('#wrapper-tickets-appearance-general-settings').children[2].children[1];
    //grad podatak Address2 /grad kazina
    let inputCity = $$('#wrapper-tickets-appearance-general-settings').children[3].children[1];
    //valuta podatak Valute
    let inputCurrency = $$('#wrapper-tickets-appearance-general-settings').children[4].children[1];
    //naziv kesabilnog tiketa podatak CashableTicketTitle
    let inputChasoutTicket = $$('#wrapper-tickets-appearance-cashable').children[1].children[1];
    // vreme isticanja kesabilnog tiketa podatak CashableTicketExpirationDays 
    let inputExpiringCashout = $$('#wrapper-tickets-appearance-cashable').children[2].children[1];
    // vreme isticanja promo tiketa podatak RestrictedTicketExpirationDays 
    let inputExpiringPromo = $$('#wrapper-tickets-appearance-promo').children[2].children[1];
    //validacija podatak Validation
    let inputValidation = $$('#tickets-advanced-settings-validation').children[1];
    //ime tiketa podatak Ticket 
    let inputTicket = $$('#tickets-advanced-settings-ticket').children[1];
    //format datuma podatak DateFormat
    let dateWrapper = $$('#tickets-advanced-settings-date');
    //format vremena podatak TimeFormat
    let timeWrapper = $$('#tickets-advanced-settings-time');
    // tiket istice nakon podatak TicketVoid 
    let inputTicketVoid = $$('#tickets-advanced-settings-void').children[1];
    // vreme trajanja tiketa podatak TicketVoidDays  
    let inputTicketVoidDays = $$('#tickets-advanced-settings-days').children[1];
    //asset podatak Asset
    let inputAsset = $$('#tickets-advanced-settings-asset').children[1];
    //asset vrednost podatak AssetValue
    let inputAssetNumber = $$('#tickets-advanced-settings-asset-number').children[1];
    //naziv promo tiketa podatak RestrictedTicketTitle
    let inputPromoTicket = $$('#wrapper-tickets-appearance-promo').children[1].children[1];

    let chasableTicket = $$('#wrapper-tickets-appearance-cashable').children[0];
    let promoTicket = $$('#wrapper-tickets-appearance-promo').children[0];
    let cancelTicketAppearance = $$('#appearance-buttons-wrapper').children[0];
    let saveTicketAppearance = $$('#appearance-buttons-wrapper').children[1];

    function fillInput(data, endpointId) {
        inputCasino.value = data.Name;
        inputAddress.value = data.Address1;
        inputCity.value = data.Address2;
        inputCurrency.value = data.Valute;
        inputChasoutTicket.value = data.CashableTicketTitle;
        inputExpiringCashout.value = data.CashableTicketExpirationDays;
        inputExpiringPromo.value = data.RestrictedTicketExpirationDays;
        inputValidation.value = data.Validation;
        inputTicket.value = data.Ticket;
        inputTicketVoid.value = data.TicketVoid;
        inputTicketVoidDays.value = data.TicketVoidDays;
        inputAsset.value = data.Asset;
        inputAssetNumber.value = data.AssetValue;
        inputPromoTicket.value = data.RestrictedTicketTitle;
        dateWrapper.children[1].set(data.DateFormat);
        timeWrapper.children[1].set(data.TimeFormat);
        ticketAppearanceTab.dataset.endpointId = endpointId;

        drowImage();
    }

    let dd = '16';
    let MM = '10';
    let yyyy = '2018';
    let hh = '11';
    let HH = '23';
    let min = '43';
    let sec = '03';
    let ticketNumberValue = '1';
    let validationNumber = '00-0000-0000-0000';
    let currencyValue = '138.00';
    let currencyValueText = `one hundred and thirty-eight ${inputCurrency.value} 0/100`;
    let insertSide = 'INSERT THIS SIDE UP';

    dropdown.generate({ values: dateFormatArray, parent: dateWrapper, name: 'DateFormat' });
    dropdown.generate({ values: timeFormatArray, parent: timeWrapper, name: 'TimeFormat' });

    let selectedDateFormat = $$('#tickets-advanced-settings-date').children[1].children[0];
    let selectedTimeFormat = $$('#tickets-advanced-settings-time').children[1].children[0];
    let setDateFormat = $$('#tickets-advanced-settings-date').children[1];
    let setTimeFormat = $$('#tickets-advanced-settings-time').children[1];

    chasableTicket.addEventListener('click', function () {
        promoTicket.classList.remove('tab-active');
        chasableTicket.classList.add('tab-active');
        draw(ticketNameCoordinate, inputChasoutTicket.value);
        if (isNaN(inputExpiringCashout.value)) {
            draw(ticketVoidAfterNumberCoordinate, inputExpiringCashout.value);
            draw(ticketVoidAfterDaysCoordinate, '');
        } else {
            draw(ticketVoidAfterNumberCoordinate, inputExpiringCashout.value);
            draw(ticketVoidAfterDaysCoordinate, inputTicketVoidDays.value);
        }
    });

    promoTicket.addEventListener('click', function () {
        chasableTicket.classList.remove('tab-active');
        promoTicket.classList.add('tab-active');
        draw(ticketNameCoordinate, inputPromoTicket.value);
        if (isNaN(inputExpiringPromo.value)) {
            draw(ticketVoidAfterNumberCoordinate, inputExpiringPromo.value);
            draw(ticketVoidAfterDaysCoordinate, '');
        } else {
            draw(ticketVoidAfterNumberCoordinate, inputExpiringPromo.value);
            draw(ticketVoidAfterDaysCoordinate, inputTicketVoidDays.value);
        }
    });

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
        h: 50
    }
    let validationCoordinate = {
        x: 200,
        y: 167,
        w: 200,
        h: 25
    }

    let validationNumberCoordinate = {
        x: 400,
        y: 167,
        w: 200,
        h: 25
    }

    let dateCoordinate = {
        x: 200,
        y: 191,
        w: 100,
        h: 25
    }
    let timeCoordinate = {
        x: 300,
        y: 191,
        w: 100,
        h: 25
    }
    let ticketCoordinate = {
        x: 400,
        y: 191,
        w: 100,
        h: 25
    }

    let ticketNumberCoordinate = {
        x: 570,
        y: 191,
        w: 10,
        h: 25
    }

    let currencyValueTextCoordinate = {
        x: 200,
        y: 216,
        w: 360,
        h: 25
    }

    let currencyCoordinate = {
        x: 200,
        y: 240,
        w: 200,
        h: 40
    }
    let currencyValueCoordinate = {
        x: 400,
        y: 240,
        w: 100,
        h: 40
    }
    let ticketVoidAfterCoordinate = {
        x: 150,
        y: 290,
        w: 200,
        h: 30
    }
    let ticketVoidAfterNumberCoordinate = {
        x: 350,
        y: 290,
        w: 70,
        h: 30
    }
    let ticketVoidAfterDaysCoordinate = {
        x: 420,
        y: 290,
        w: 70,
        h: 30
    }
    let assetCoordinate = {
        x: 490,
        y: 290,
        w: 130,
        h: 30
    }
    let assetCoordinateNumberCoordinate = {
        x: 620,
        y: 290,
        w: 50,
        h: 30
    }
    let insertSideRightCoordinate = {
        x: 0,
        y: -765,
        w: 325,
        h: 30
    }
    let insertSideLeftCoordinate = {
        x: -325,
        y: 10,
        w: 325,
        h: 30
    }
    let validationNumberRightCoordinate = {
        x: 0,
        y: -735,
        w: 325,
        h: 30
    }

    function drowImage() {
        drawPicture();
        drawStatic(insertSideRightCoordinate, insertSide);
        drawStatic(insertSideLeftCoordinate, insertSide);
        drawStatic(validationNumberRightCoordinate, validationNumber);
        draw(casinoCoorinate, inputCasino.value);
        draw(addressCoordinate, inputAddress.value);
        draw(cityCoordinate, inputCity.value);
        draw(ticketNameCoordinate, inputChasoutTicket.value);
        draw(validationCoordinate, inputValidation.value);
        drawStatic(validationNumberCoordinate, validationNumber);
        draw(dateCoordinate, selectedDateFormat.dataset.value.replace('dd', dd).replace('MM', MM).replace('yyyy', yyyy));
        draw(timeCoordinate, selectedTimeFormat.dataset.value.replace('hh', hh).replace('HH', HH).replace('mm', min).replace('ss', sec));
        draw(ticketCoordinate, `${inputTicket.value} #`);
        drawStatic(ticketNumberCoordinate, ticketNumberValue);
        drawStatic(currencyValueTextCoordinate, currencyValueText);
        draw(currencyCoordinate, inputCurrency.value);
        drawStatic(currencyValueCoordinate, currencyValue);
        draw(ticketVoidAfterCoordinate, inputTicketVoid.value);
        draw(ticketVoidAfterNumberCoordinate, inputExpiringCashout.value);
        if (!isNaN(inputExpiringCashout.value)) {
            draw(ticketVoidAfterDaysCoordinate, inputTicketVoidDays.value);
        } else {
            draw(ticketVoidAfterDaysCoordinate, '');
        }
        draw(assetCoordinate, `${inputAsset.value} #`);
        draw(assetCoordinateNumberCoordinate, inputAssetNumber.value);


    };

    ticketAppearanceAdvance.addEventListener('click', function () {
        trigger('opened-arrow', { div: ticketAppearanceAdvance });
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
            draw(ticketVoidAfterNumberCoordinate, inputExpiringCashout.value);
            isNaN(inputExpiringCashout.value) ? draw(ticketVoidAfterDaysCoordinate, '') : draw(ticketVoidAfterDaysCoordinate, inputTicketVoidDays.value);
        }
    });

    inputPromoTicket.addEventListener('keyup', function (event) {
        if (promoTicket.classList.contains('tab-active')) {
            draw(ticketNameCoordinate, inputPromoTicket.value);
        }
    });

    inputExpiringPromo.addEventListener('keyup', function (event) {
        if (promoTicket.classList.contains('tab-active')) {
            draw(ticketVoidAfterNumberCoordinate, inputExpiringPromo.value);
            isNaN(inputExpiringPromo.value) ? draw(ticketVoidAfterDaysCoordinate, '') : draw(ticketVoidAfterDaysCoordinate, inputTicketVoidDays.value);
        }
    });

    inputValidation.addEventListener('keyup', function (event) {
        draw(validationCoordinate, inputValidation.value);
    });

    setDateFormat.addEventListener('click', function () {
        draw(dateCoordinate, selectedDateFormat.dataset.value.replace('dd', dd).replace('MM', MM).replace('yyyy', yyyy));
    });

    setTimeFormat.addEventListener('click', function () {
        draw(timeCoordinate, selectedTimeFormat.dataset.value.replace('hh', hh).replace('HH', HH).replace('mm', min).replace('ss', sec));
    });

    inputTicket.addEventListener('keyup', function (event) {
        draw(ticketCoordinate, `${inputTicket.value} #`);
    });

    inputCurrency.addEventListener('keyup', function (event) {
        draw(currencyCoordinate, inputCurrency.value);
        currencyValueText = `one hundred and thirty-eight ${inputCurrency.value} 0/100`;
        drawStatic(currencyValueTextCoordinate, currencyValueText);
    });

    inputTicketVoid.addEventListener('keyup', function (event) {
        draw(ticketVoidAfterCoordinate, inputTicketVoid.value);
    });

    inputTicketVoidDays.addEventListener('keyup', function (event) {
        if (chasableTicket.classList.contains('tab-active')) {
            isNaN(inputExpiringCashout.value) ? draw(ticketVoidAfterDaysCoordinate, '') : draw(ticketVoidAfterDaysCoordinate, inputTicketVoidDays.value);
        }
        if (promoTicket.classList.contains('tab-active')) {
            isNaN(inputExpiringPromo.value) ? draw(ticketVoidAfterDaysCoordinate, '') : draw(ticketVoidAfterDaysCoordinate, inputTicketVoidDays.value);
        }
    });

    inputAsset.addEventListener('keyup', function (event) {
        draw(assetCoordinate, `${inputAsset.value} #`);
    });

    inputAssetNumber.addEventListener('keyup', function (event) {
        draw(assetCoordinateNumberCoordinate, inputAssetNumber.value);
    });

    function draw(coordinate, value) {
        let canvas = $$('#wrapper-canvas').children[0];
        let ctx = canvas.getContext("2d");
        ctx.clearRect(coordinate.x, coordinate.y, coordinate.w, coordinate.h);
        let txt = `${value}`;
        ctx.font = `bold ${coordinate.h - 10}px roboto`;
        ctx.globalAlpha = 1;
        ctx.fillText(txt, coordinate.x + coordinate.w / 2 - (ctx.measureText(txt).width / 2), coordinate.y + coordinate.h - 10);
    }

    function drawStatic(coordinate, value) {
        let canvas = $$('#wrapper-canvas').children[0];
        let ctx = canvas.getContext("2d");
        ctx.clearRect(coordinate.x, coordinate.y, coordinate.w, coordinate.h);
        let txt = `${value}`;
        ctx.font = `bold ${coordinate.h - 10}px roboto`;
        ctx.globalAlpha = 0.6;
        ctx.save();
        if (coordinate.x < 0) {
            ctx.rotate(-Math.PI / 2);
            ctx.fillText(txt, coordinate.x + coordinate.w / 2 - (ctx.measureText(txt).width / 2), coordinate.y + coordinate.h - 10);
            ctx.restore();
        } else if (coordinate.y < 0) {
            ctx.rotate(Math.PI / 2);
            ctx.fillText(txt, coordinate.x + coordinate.w / 2 - (ctx.measureText(txt).width / 2), coordinate.y + coordinate.h - 10);
            ctx.restore();
        } else {
            ctx.fillText(txt, coordinate.x + coordinate.w / 2 - (ctx.measureText(txt).width / 2), coordinate.y + coordinate.h - 10);
        }
    }

    function drawPicture() {
        let canvas = $$('#wrapper-canvas').children[0];
        let ctx = canvas.getContext("2d");
        let img = document.getElementById("barcode");
        ctx.globalAlpha = 0.6;
        ctx.drawImage(img, 200, 110, 400, 57);
    }

    cancelTicketAppearance.addEventListener('click', function () {
        trigger(communication.events.tickets.ticketAppearance, { data: { EndpointId: parseInt(ticketAppearanceTab.dataset.endpointId) } });
    });

    saveTicketAppearance.addEventListener('click', function () {
        alert('povezi da posaljes vrednosti iz input polja na server')
    });
})();