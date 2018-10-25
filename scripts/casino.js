let casino = (function () {

    let testDataTableCasinos = [
        {
            "period": "4/1/2018",
            "totalBet": 1,
            "totalWin": 2,
            "rounds": 3,
            "jackpotValue": 4,
            "result": 0
        },
        {
            "period": "4/2/2018",
            "totalBet": 1,
            "totalWin": 2,
            "rounds": 3,
            "jackpotValue": 4,
            "result": 0,
            "payout": 5
        },
        {
            "period": "4/3/2018",
            "totalBet": 1,
            "totalWin": 2,
            "rounds": 3,
            "jackpotValue": 4,
            "result": 0,
            "payout": 5
        },
        {
            "period": "4/4/2018",
            "totalBet": 11.6,
            "totalWin": 1.5,
            "rounds": 46,
            "jackpotValue": 4,
            "result": 1018923.124451
        },
        {
            "period": "4/5/2018",
            "totalBet": 1,
            "totalWin": 2,
            "rounds": 3,
            "jackpotValue": 4,
            "result": 0
        },
        {
            "period": "4/6/2018",
            "totalBet": 1,
            "totalWin": 2,
            "rounds": 3
        },
        {
            "period": "4/7/2018",
            "totalBet": 1,
            "totalWin": 2,
            "rounds": 3,
            "jackpotValue": 4,
            "result": 0
        },
        {
            "period": "4/8/2018",
            "totalBet": 1,
            "totalWin": 2,
            "rounds": 3,
            "jackpotValue": 4,
            "result": 0
        }
    ];

    on('casinos/activated', function () {

        setTimeout(function () {
            trigger('preloader/hide');
        }, 2000);

        let pageId = 'page-casinos';
        let tableContainerId = 'table-container-casinos';
        let tableContainerClassSelector = '.table-container-casinos';
        let tableContainerClassElement = $$(tableContainerClassSelector)[0];

        let jsObject = new Object();
        jsObject.tableContainerId = tableContainerId;

        if (table.checkIfHasTable(pageId, tableContainerId) === true) {
            //update
        }
        else {
            tableContainerClassElement.setAttribute('id', tableContainerId);
            let tableContainerIdElement = $$('#' + tableContainerId);
            tableContainerIdElement.tableObject = jsObject;
            let tableCasinos = table.generateTable(testDataTableCasinos, tableContainerClassElement);
            $$('#' + tableContainerId).appendChild(tableCasinos);
        }
        
    });

    on('casinos/add', function (e) {
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