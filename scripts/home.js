let home = (function () {

    let testDataTableHome = [
        {
            "period": "4/1/2018",
            "total bet": 1,
            "total win": 2,
            "rounds": 3,
            "jackpot value": 4,
            "result": 0,
            "payout": 5,
            "currency": "eur"
        },
        {
            "period": "4/2/2018",
            "total bet": 1,
            "total win": 2,
            "rounds": 3,
            "jackpot value": 4,
            "result": 0,
            "payout": 5,
            "currency": "eur"
        },
        {
            "period": "4/3/2018",
            "total bet": 1,
            "total win": 2,
            "rounds": 3,
            "jackpot value": 4,
            "result": 0,
            "payout": 5,
            "currency": "eur"
        },
        {
            "period": "4/4/2018",
            "total bet": 11.6,
            "total win": 1.5,
            "rounds": 46,
            "jackpot value": 4,
            "result": 1018923.124451,
            "payout": 12.93,
            "currency": "eur"
        },
        {
            "period": "4/5/2018",
            "total bet": 1,
            "total win": 2,
            "rounds": 3,
            "jackpot value": 4,
            "result": 0,
            "payout": 5,
            "currency": "eur"
        },
        {
            "period": "4/6/2018",
            "total bet": 1,
            "total win": 2,
            "rounds": 3,
            "jackpot value": 4,
            "result": 0,
            "payout": 5,
            "currency": "eur"
        },
        {
            "period": "4/7/2018",
            "total bet": 1,
            "total win": 2,
            "rounds": 3,
            "jackpot value": 4,
            "result": 0,
            "payout": 5,
            "currency": "eur"
        },
        {
            "period": "4/8/2018",
            "total bet": 1,
            "total win": 2,
            "rounds": 3,
            "jackpot value": 4,
            "result": 0,
            "payout": 5,
            "currency": "eur"
        },
        {
            "period": "4/9/2018",
            "total bet": 1,
            "total win": 2,
            "rounds": 3,
            "jackpot value": 4,
            "result": 0,
            "payout": 5,
            "currency": "eur"
        },
        {
            "period": "4/10/2018",
            "total bet": 1,
            "total win": 2,
            "rounds": 3,
            "jackpot value": 4,
            "result": 0,
            "payout": 5,
            "currency": "eur"
        },
        {
            "period": "4/11/2018",
            "total bet": 1,
            "total win": 2,
            "rounds": 3,
            "jackpot value": 4,
            "result": 0,
            "payout": 5,
            "currency": "eur"
        },
        {
            "period": "4/12/2018",
            "total bet": 1,
            "total win": 2,
            "rounds": 3,
            "jackpot value": 4,
            "result": 0,
            "payout": 5,
            "currency": "eur"
        },
        {
            "period": "4/12/2018",
            "total bet": 1,
            "total win": 2,
            "rounds": 3,
            "jackpot value": 4,
            "result": 0,
            "payout": 5,
            "currency": "eur"
        },
        {
            "period": "4/12/2018",
            "total bet": 1,
            "total win": 2,
            "rounds": 3,
            "jackpot value": 4,
            "result": 0,
            "payout": 5,
            "currency": "eur"
        },
        {
            "period": "4/12/2018",
            "total bet": 1,
            "total win": 2,
            "rounds": 3,
            "jackpot value": 4,
            "result": 0,
            "payout": 5,
            "currency": "eur"
        },
        {
            "period": "4/12/2018",
            "total bet": 1,
            "total win": 2,
            "rounds": 3,
            "jackpot value": 4,
            "result": 0,
            "payout": 5,
            "currency": "eur"
        },
        {
            "period": "4/12/2018",
            "total bet": 1,
            "total win": 2,
            "rounds": 3,
            "jackpot value": 4,
            "result": 0,
            "payout": 5,
            "currency": "eur"
        }
    ];

    let newTestData = [
        {
            "period1": "home",
            "period2": "home",
            "period3": "home",
            "period4": "home",
            "period5": "home",
            "period6": "home",
            "period7": "home",
            "period8": "home"
        },
        {
            "period1": "home",
            "period2": "home",
            "period3": "home",
            "period4": "home",
            "period5": "home",
            "period6": "home",
            "period7": "home",
            "period8": "home"
        },
        {
            "period1": "home",
            "period2": "home",
            "period3": "home",
            "period4": "home",
            "period5": "home",
            "period6": "home",
            "period7": "home",
            "period8": "home"
        },
        {
            "period1": "home",
            "period2": "home",
            "period3": "home",
            "period4": "home",
            "period5": "home",
            "period6": "home",
            "period7": "home",
            "period8": "home"
        },
        {
            "period1": "home",
            "period2": "home",
            "period3": "home",
            "period4": "home",
            "period5": "home",
            "period6": "home",
            "period7": "home",
            "period8": "home"
        },
        {
            "period1": "home",
            "period2": "home",
            "period3": "home",
            "period4": "home",
            "period5": "home",
            "period6": "home",
            "period7": "home",
            "period8": "home"
        },
        {
            "period1": "home",
            "period2": "home",
            "period3": "home",
            "period4": "home",
            "period5": "home",
            "period6": "home",
            "period7": "home",
            "period8": "home"
        },
        {
            "period1": "home",
            "period2": "home",
            "period3": "home",
            "period4": "home",
            "period5": "home",
            "period6": "home",
            "period7": "home",
            "period8": "home"
        },
        {
            "period1": "home",
            "period2": "home",
            "period3": "home",
            "period4": "home",
            "period5": "home",
            "period6": "home",
            "period7": "home",
            "period8": "home"
        },
        {
            "period1": "home",
            "period2": "home",
            "period3": "home",
            "period4": "home",
            "period5": "home",
            "period6": "home",
            "period7": "home",
            "period8": "home"
        },
        {
            "period1": "home",
            "period2": "home",
            "period3": "home",
            "period4": "home",
            "period5": "home",
            "period6": "home",
            "period7": "home",
            "period8": "home"
        },
        {
            "period1": "home",
            "period2": "home",
            "period3": "home",
            "period4": "home",
            "period5": "home",
            "period6": "home",
            "period7": "home",
            "period8": "home"
        },
        {
            "period1": "home",
            "period2": "home",
            "period3": "home",
            "period4": "home",
            "period5": "home",
            "period6": "home",
            "period7": "home",
            "period8": "home"
        },
        {
            "period1": "home",
            "period2": "home",
            "period3": "home",
            "period4": "home",
            "period5": "home",
            "period6": "home",
            "period7": "home",
            "period8": "home"
        }
    ];

    let newTestData2 = [
        {
            "period1": "home",
            "period2": "home",
            "period3": "home",
            "period4": "home",
            "period5": "home"
        },
        {
            "period1": "home",
            "period2": "home",
            "period3": "home",
            "period4": "home",
            "period5": "home"
        },
        {
            "period1": "home",
            "period2": "home",
            "period3": "home",
            "period4": "home",
            "period5": "home"
        }
    ];

    let newTestData3 = [
        {
            "period1 period": "home",
            "period2 period": "home",
            "period3 period": "home",
            "period4 period": "home",
            "period5 period": "home"
        },
        {
            "period1 period": "home",
            "period2 period": "home",
            "period3 period": "home",
            "period4 period": "home",
            "period5 period": "home"
        },
        {
            "period1 period": "home",
            "period2 period": "home",
            "period3 period": "home",
            "period4 period": "home",
            "period5 period": "home"
        }
    ];

    on('home/activated', function () {

        setTimeout(function () {
            trigger('preloader/hide');
        }, 2000);

        let tableSettings = {};
        tableSettings.tableData = testDataTableHome;
        tableSettings.forceRemoveHeaders = true;
        tableSettings.tableContainerSelector = '#table-container-home';
        tableSettings.sticky = true;
        tableSettings.id = '';

        table.generateTable(tableSettings);

        // trigger('table/generate/new-data', {tableSettings: tableSettings, newTableData: newTestData});
        // trigger('table/generate/new-data', {tableSettings: tableSettings, newTableData: newTestData2});
        // trigger('table/generate/new-data', {tableSettings: tableSettings, newTableData: newTestData3});
    });

})();