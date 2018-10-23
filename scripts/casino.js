let casino = (function () {

    let testTable = [
        {
            "period": "4/1/2018",
            "totalBet": 1,
            "totalWin": 2,
            "rounds": 3,
            "jackpotValue": 4,
            "result": 0,
            "payout": 5,
            "currency": "eur"
        },
        {
            "period": "4/2/2018",
            "totalBet": 1,
            "totalWin": 2,
            "rounds": 3,
            "jackpotValue": 4,
            "result": 0,
            "payout": 5,
            "currency": "eur"
        },
        {
            "period": "4/3/2018",
            "totalBet": 1,
            "totalWin": 2,
            "rounds": 3,
            "jackpotValue": 4,
            "result": 0,
            "payout": 5,
            "currency": "eur"
        },
        {
            "period": "4/4/2018",
            "totalBet": 11.6,
            "totalWin": 1.5,
            "rounds": 46,
            "jackpotValue": 4,
            "result": 1018923.124451,
            "payout": 12.93,
            "currency": "eur"
        },
        {
            "period": "4/5/2018",
            "totalBet": 1,
            "totalWin": 2,
            "rounds": 3,
            "jackpotValue": 4,
            "result": 0,
            "payout": 5,
            "currency": "eur"
        },
        {
            "period": "4/6/2018",
            "totalBet": 1,
            "totalWin": 2,
            "rounds": 3,
            "jackpotValue": 4,
            "result": 0,
            "payout": 5,
            "currency": "eur"
        },
        {
            "period": "4/7/2018",
            "totalBet": 1,
            "totalWin": 2,
            "rounds": 3,
            "jackpotValue": 4,
            "result": 0,
            "payout": 5,
            "currency": "eur"
        },
        {
            "period": "4/8/2018",
            "totalBet": 1,
            "totalWin": 2,
            "rounds": 3,
            "jackpotValue": 4,
            "result": 0,
            "payout": 5,
            "currency": "eur"
        },
        {
            "period": "4/9/2018",
            "totalBet": 1,
            "totalWin": 2,
            "rounds": 3,
            "jackpotValue": 4,
            "result": 0,
            "payout": 5,
            "currency": "eur"
        },
        {
            "period": "4/10/2018",
            "totalBet": 1,
            "totalWin": 2,
            "rounds": 3,
            "jackpotValue": 4,
            "result": 0,
            "payout": 5,
            "currency": "eur"
        }
    ];

    on('casino/activated', function () {
        setTimeout(function () {
            trigger('preloader/hide');
        }, 2000);

        let tableVar = table.generate(testTable);
        console.log('casinos', tableVar);

        $$('#page-casinos').appendChild(tableVar);
    });

    on('casino/add', function (e) {
        let model = e.model;
        trigger('template/render', {
            model: model,
            templateElementSelector: "#casino-template",
            callbackEvent: 'casino/load'
        });
    });

    on('casino/load', function (e) {
        let element = e.element;
        //Multiple ways to place HTML element inside HTML document:
        //$$('.casino-list')[0].innerHTML = element.innerHTML;
        $$('.casino-list')[0].appendChild(element);
    });

    on('casino/display-casino-info/', function (e) {

    });

    on('casino/display-casino-info/error', function (e) {
        data = e.data;
        alert('An error occured.');
    });

})();