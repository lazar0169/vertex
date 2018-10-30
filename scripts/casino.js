let casino = (function () {

    let testDataTableCasinos = [
        {
            "period": "4/1/2018",
            "totalBet": 1,
            "totalWin": 2
        },
        {
            "period": "4/2/2018",
            "totalBet": 1,
            "totalWin": 2
        },
        {
            "period": "4/3/2018",
            "totalBet": 1,
            "totalWin": 2
        },
        {
            "period": "4/4/2018",
            "totalBet": 11.6,
            "totalWin": 1.5
        },
        {
            "period": "4/5/2018",
            "totalBet": 1,
            "totalWin": 2
        },
        {
            "period": "4/6/2018",
            "totalBet": 1,
            "totalWin": 2
        },
        {
            "period": "4/7/2018",
            "totalBet": 1,
            "totalWin": 2
        },
        {
            "period": "4/8/2018",
            "totalBet": 1,
            "totalWin": 2
        },
        {
            "period": "4/8/2018",
            "totalBet": 1,
            "totalWin": 2
        },
        {
            "period": "4/8/2018",
            "totalBet": 1,
            "totalWin": 2
        },
        {
            "period": "4/8/2018",
            "totalBet": 1,
            "totalWin": 2
        },
        {
            "period": "4/8/2018",
            "totalBet": 1,
            "totalWin": 2
        }
    ];

    on('casinos/activated', function () {

        setTimeout(function () {
            trigger('preloader/hide');
        }, 2000);

        let tableSettings = {};
        tableSettings.tableData = testDataTableCasinos;
        tableSettings.forceRemoveHeaders = true;
        tableSettings.tableContainerSelector = '#table-container-casinos';
        tableSettings.stickyRow = true;
        tableSettings.stickyColumn = true;
        tableSettings.id = '';

        table.generateTable(tableSettings);
        
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