const ticketAppearance = (function () {
    let ticketAppearanceAdvance = $$('#wrapper-ticket-appearance-advanced').children[0];
    let ticketAppearanceAdvanceShow = $$('#wrapper-ticket-appearance-advanced').children[1];
    let inputCasino = $$('#wrapper-tickets-appearance-general-settings').children[1].children[1];
    let inputAddress = $$('#wrapper-tickets-appearance-general-settings').children[2].children[1];
    let inputCity = $$('#wrapper-tickets-appearance-general-settings').children[3].children[1];
    let inputCurrency = $$('#wrapper-tickets-appearance-general-settings').children[4].children[1];
    let inputChasoutTicket = $$('#wrapper-tickets-appearance-cashable').children[1].children[1];
    let inputValidation = $$('#tickets-advanced-settings-validation').children[1];
    let inputTicket = $$('#tickets-advanced-settings-ticket').children[1];
    let inputDate = $$('#tickets-advanced-settings-date').children[1];
    let inputTime = $$('#tickets-advanced-settings-time').children[1];
    let inputTicketVoid = $$('#tickets-advanced-settings-void').children[1];
    let inputTicketVoidDays = $$('#tickets-advanced-settings-days').children[1];
    let inputAsset = $$('#tickets-advanced-settings-asset').children[1];
    let inputAssetDays = $$('#tickets-advanced-settings-asset-number').children[1];



    window.addEventListener('load', function () {

        drawBarcode();
    });




    ticketAppearanceAdvance.addEventListener('click', function () {
        ticketAppearanceAdvanceShow.classList.toggle('hidden');
    });

    inputCasino.addEventListener('keyup', function (event) {
        drawCasino(inputCasino.value);
    });
    inputAddress.addEventListener('keyup', function (event) {
        drawAddress(inputAddress.value);
    });
    inputCity.addEventListener('keyup', function (event) {
        drawCity(inputCity.value);
    });
    inputChasoutTicket.addEventListener('keyup', function (event) {
        drawCashoutTicket(inputChasoutTicket.value);
    });
    drawBarcode();
    inputValidation.addEventListener('keyup', function (event) {
        drawValidaiton(inputValidation.value);
    });
    inputDate.addEventListener('keyup', function (event) {
        drawDate(inputDate.value);
    });
    inputTime.addEventListener('keyup', function (event) {
        drawTime(inputTime.value);
    });
    inputTicket.addEventListener('keyup', function (event) {
        drawTicket(inputTicket.value);
    });

    inputCurrency.addEventListener('keyup', function (event) {
        drawCurrency(inputCurrency.value);
    });
    inputTicketVoid.addEventListener('keyup', function (event) {
        drawTicketVoidAfter(inputTicketVoid.value);
    });
    inputTicketVoidDays.addEventListener('keyup', function (event) {
        drawTicketVoidDays(inputTicketVoidDays.value);
    });
    inputAsset.addEventListener('keyup', function (event) {
        drawAsset(inputAsset.value);
    });
    inputAssetDays.addEventListener('keyup', function (event) {
        drawAssetDays(inputAssetDays.value);
    });



    function drawCasino(value) {
        let canvas = $$('#wrapper-canvas').children[0];
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, 50);
        let txt = `${value}`;
        ctx.font = "30px Arial";
        ctx.fillText(txt, 400 - (ctx.measureText(txt).width / 2), 40);
    }
    function drawAddress(value) {
        let canvas = $$('#wrapper-canvas').children[0];
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 50, canvas.width / 2, 50);
        let txt = `${value.toUpperCase()}`;
        ctx.font = "20px Arial";
        ctx.fillText(txt, 200 - (ctx.measureText(txt).width / 2), 80);
    }

    function drawCity(value) {
        let canvas = $$('#wrapper-canvas').children[0];
        let ctx = canvas.getContext("2d");
        ctx.clearRect(canvas.width / 2, 50, canvas.width / 2, 50);
        let txt = `${value.toUpperCase()}`;
        ctx.font = "20px Arial";
        ctx.fillText(txt, 600 - (ctx.measureText(txt).width / 2), 80);
    }
    function drawCashoutTicket(value) {
        let canvas = $$('#wrapper-canvas').children[0];
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 100, canvas.width, 70);
        let txt = `${value.toUpperCase()}`;
        ctx.font = "50px Arial";
        ctx.fillText(txt, 400 - (ctx.measureText(txt).width / 2), 150);
    }
    function drawBarcode() {
        let canvas = $$('#wrapper-canvas').children[0];
        let ctx = canvas.getContext("2d");
        let img = document.getElementById("barcode");
        ctx.drawImage(img, 100, 170, 600, 100);

    }
    function drawValidaiton(value) {
        let canvas = $$('#wrapper-canvas').children[0];
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 272, canvas.width, 25);
        let txt = `${value}`;
        ctx.font = "15px Arial";
        ctx.fillText(txt, 400 - (ctx.measureText(txt).width / 2), 290);
    }
    function drawDate(value) {
        let canvas = $$('#wrapper-canvas').children[0];
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 295, canvas.width / 4, 25);
        let txt = `${value}`;
        ctx.font = "15px Arial";
        ctx.fillText(txt, 100 - (ctx.measureText(txt).width / 2), 315);
    }
    function drawTime(value) {
        let canvas = $$('#wrapper-canvas').children[0];
        let ctx = canvas.getContext("2d");
        ctx.clearRect(canvas.width / 4, 295, canvas.width / 4, 25);
        let txt = `${value}`;
        ctx.font = "15px Arial";
        ctx.fillText(txt, 300 - (ctx.measureText(txt).width / 2), 315);
    }

    function drawTicket(value) {
        let canvas = $$('#wrapper-canvas').children[0];
        let ctx = canvas.getContext("2d");
        ctx.clearRect(400, 295, canvas.width / 2, 25);
        let txt = `${value}`;
        ctx.font = "15px Arial";
        ctx.fillText(txt, 600 - (ctx.measureText(txt).width / 2), 315);
    }
    function drawCurrency(value) {
        let canvas = $$('#wrapper-canvas').children[0];
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 340, canvas.width, 70);
        let txt = `${value.toUpperCase()}`;
        ctx.font = "50px Arial";
        ctx.fillText(txt, canvas.width / 2 - (ctx.measureText(txt).width / 2), 410);
    }

    function drawTicketVoidAfter(value) {
        let canvas = $$('#wrapper-canvas').children[0];
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 420, canvas.width / 4, 30);
        let txt = `${value}`;
        ctx.font = "20px Arial";
        ctx.fillText(txt, 100 - (ctx.measureText(txt).width / 2), 440);
    }
    function drawTicketVoidDays(value) {
        let canvas = $$('#wrapper-canvas').children[0];
        let ctx = canvas.getContext("2d");
        ctx.clearRect(canvas.width / 4, 420, canvas.width / 4, 30);
        let txt = `${value}`;
        ctx.font = "20px Arial";
        ctx.fillText(txt, 300 - (ctx.measureText(txt).width / 2), 440);
    }

    function drawAsset(value) {
        let canvas = $$('#wrapper-canvas').children[0];
        let ctx = canvas.getContext("2d");
        ctx.clearRect(canvas.width - canvas.width / 2, 420, canvas.width / 4, 30);
        let txt = `${value}`;
        ctx.font = "20px Arial";
        ctx.fillText(txt, 500 - (ctx.measureText(txt).width / 2), 440);
    }
    function drawAssetDays(value) {
        let canvas = $$('#wrapper-canvas').children[0];
        let ctx = canvas.getContext("2d");
        ctx.clearRect(canvas.width - canvas.width / 4, 420, canvas.width / 4, 30);
        let txt = `${value}`;
        ctx.font = "20px Arial";
        ctx.fillText(txt, 700 - (ctx.measureText(txt).width / 2), 440);
    }






})();