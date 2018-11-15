let mock = (function () {

    let mockData0 = [
        {
            "Period": "3/17/2018",
            "Total bet": 447,
            "Total win": 6420,
            "Rounds": 1,
            "Jackpot value": 95658,
            "Results": 34,
            "Payout": 21845
        }, {
            "Period": "11/16/2017",
            "Total bet": 933,
            "Total win": 3375,
            "Rounds": 1,
            "Jackpot value": 12899,
            "Results": 38,
            "Payout": 45442
        }, {
            "Period": "9/7/2018",
            "Total bet": 982,
            "Total win": 1141,
            "Rounds": 4,
            "Jackpot value": 25908,
            "Results": 37,
            "Payout": 76303
        }, {
            "Period": "12/16/2017",
            "Total bet": 522,
            "Total win": 8852,
            "Rounds": 4,
            "Jackpot value": 14068,
            "Results": 30,
            "Payout": 25419
        }, {
            "Period": "10/19/2018",
            "Total bet": 291,
            "Total win": 1222,
            "Rounds": 6,
            "Jackpot value": 22266,
            "Results": 28,
            "Payout": 68252
        }, {
            "Period": "9/28/2018",
            "Total bet": 734,
            "Total win": 8296,
            "Rounds": 3,
            "Jackpot value": 51074,
            "Results": 37,
            "Payout": 69139
        }, {
            "Period": "6/3/2018",
            "Total bet": 992,
            "Total win": 4191,
            "Rounds": 8,
            "Jackpot value": 32789,
            "Results": 21,
            "Payout": 75967
        }, {
            "Period": "12/18/2017",
            "Total bet": 825,
            "Total win": 6396,
            "Rounds": 4,
            "Jackpot value": 34240,
            "Results": 44,
            "Payout": 71841
        }, {
            "Period": "10/15/2018",
            "Total bet": 520,
            "Total win": 8840,
            "Rounds": 8,
            "Jackpot value": 19320,
            "Results": 35,
            "Payout": 99890
        }, {
            "Period": "6/25/2018",
            "Total bet": 563,
            "Total win": 9723,
            "Rounds": 2,
            "Jackpot value": 43392,
            "Results": 21,
            "Payout": 41868
        }];

    let mockData1 = [
        {
            "period": "mock",
            "total bet": "mock",
            "total win": "mock",
            "rounds": "mock",
            "jackpot value": "mock",
            "result": "mock",
            "payout": "mock",
            "currency": "mock"
        },
        {
            "period": "mock",
            "total bet": "mock",
            "total win": "mock",
            "rounds": "mock",
            "jackpot value": "mock",
            "result": "mock",
            "payout": "mock",
            "currency": "mock"
        },
        {
            "period": "mock",
            "total bet": "mock",
            "total win": "mock",
            "rounds": "mock",
            "jackpot value": "mock",
            "result": "mock",
            "payout": "mock",
            "currency": "mock"
        },
        {
            "period": "mock",
            "total bet": "mock",
            "total win": "mock",
            "rounds": "mock",
            "jackpot value": "mock",
            "result": "mock",
            "payout": "mock",
            "currency": "mock"
        },
        {
            "period": "mock",
            "total bet": "mock",
            "total win": "mock",
            "rounds": "mock",
            "jackpot value": "mock",
            "result": "mock",
            "payout": "mock",
            "currency": "mock"
        },
        {
            "period": "mock",
            "total bet": "mock",
            "total win": "mock",
            "rounds": "mock",
            "jackpot value": "mock",
            "result": "mock",
            "payout": "mock",
            "currency": "mock"
        },
        {
            "period": "mock",
            "total bet": "mock",
            "total win": "mock",
            "rounds": "mock",
            "jackpot value": "mock",
            "result": "mock",
            "payout": "mock",
            "currency": "mock"
        },
        {
            "period": "mock",
            "total bet": "mock",
            "total win": "mock",
            "rounds": "mock",
            "jackpot value": "mock",
            "result": "mock",
            "payout": "mock",
            "currency": "mock"
        },
        {
            "period": "mock",
            "total bet": "mock",
            "total win": "mock",
            "rounds": "mock",
            "jackpot value": "mock",
            "result": "mock",
            "payout": "mock",
            "currency": "mock"
        },
        {
            "period": "mock",
            "total bet": "mock",
            "total win": "mock",
            "rounds": "mock",
            "jackpot value": "mock",
            "result": "mock",
            "payout": "mock",
            "currency": "mock"
        },
        {
            "period": "mock",
            "total bet": "mock",
            "total win": "mock",
            "rounds": "mock",
            "jackpot value": "mock",
            "result": "mock",
            "payout": "mock",
            "currency": "mock"
        },
        {
            "period": "mock",
            "total bet": "mock",
            "total win": "mock",
            "rounds": "mock",
            "jackpot value": "mock",
            "result": "mock",
            "payout": "mock",
            "currency": "mock"
        },
        {
            "period": "mock",
            "total bet": "mock",
            "total win": "mock",
            "rounds": "mock",
            "jackpot value": "mock",
            "result": "mock",
            "payout": "mock",
            "currency": "mock"
        },
        {
            "period": "mock",
            "total bet": "mock",
            "total win": "mock",
            "rounds": "mock",
            "jackpot value": "mock",
            "result": "mock",
            "payout": "mock",
            "currency": "mock"
        }
    ];

    let mockData2 = [{
        "Period": "3/27/2018",
        "Total bet": 269,
        "Total win": 5019,
        "Rounds": 2,
        "Jackpot value": 50257,
        "Results": 38,
        "Payout": 36013
    }, {
        "Period": "8/10/2018",
        "Total bet": 555,
        "Total win": 866,
        "Rounds": 6,
        "Jackpot value": 80906,
        "Results": 20,
        "Payout": 99019
    }, {
        "Period": "10/1/2018",
        "Total bet": 848,
        "Total win": 8455,
        "Rounds": 3,
        "Jackpot value": 88772,
        "Results": 27,
        "Payout": 28270
    }, {
        "Period": "8/10/2018",
        "Total bet": 710,
        "Total win": 2380,
        "Rounds": 6,
        "Jackpot value": 11830,
        "Results": 29,
        "Payout": 5972
    }, {
        "Period": "8/30/2018",
        "Total bet": 193,
        "Total win": 6916,
        "Rounds": 1,
        "Jackpot value": 88967,
        "Results": 42,
        "Payout": 88113
    }, {
        "Period": "7/27/2018",
        "Total bet": 575,
        "Total win": 6481,
        "Rounds": 6,
        "Jackpot value": 81361,
        "Results": 37,
        "Payout": 31947
    }, {
        "Period": "12/19/2017",
        "Total bet": 645,
        "Total win": 5420,
        "Rounds": 3,
        "Jackpot value": 83152,
        "Results": 33,
        "Payout": 21265
    }, {
        "Period": "12/27/2017",
        "Total bet": 755,
        "Total win": 2607,
        "Rounds": 6,
        "Jackpot value": 16396,
        "Results": 31,
        "Payout": 6129
    }, {
        "Period": "12/17/2017",
        "Total bet": 569,
        "Total win": 7551,
        "Rounds": 1,
        "Jackpot value": 68918,
        "Results": 20,
        "Payout": 38752
    }, {
        "Period": "7/10/2018",
        "Total bet": 712,
        "Total win": 837,
        "Rounds": 1,
        "Jackpot value": 52446,
        "Results": 35,
        "Payout": 30238
    }, {
        "Period": "4/17/2018",
        "Total bet": 75,
        "Total win": 8250,
        "Rounds": 6,
        "Jackpot value": 32521,
        "Results": 40,
        "Payout": 55979
    }, {
        "Period": "11/13/2017",
        "Total bet": 409,
        "Total win": 3166,
        "Rounds": 10,
        "Jackpot value": 35147,
        "Results": 33,
        "Payout": 3393
    }, {
        "Period": "12/20/2017",
        "Total bet": 679,
        "Total win": 7335,
        "Rounds": 3,
        "Jackpot value": 40939,
        "Results": 39,
        "Payout": 24106
    }, {
        "Period": "12/1/2017",
        "Total bet": 670,
        "Total win": 4403,
        "Rounds": 9,
        "Jackpot value": 99523,
        "Results": 37,
        "Payout": 68786
    }, {
        "Period": "9/6/2018",
        "Total bet": 702,
        "Total win": 806,
        "Rounds": 8,
        "Jackpot value": 75548,
        "Results": 33,
        "Payout": 17702
    }, {
        "Period": "5/17/2018",
        "Total bet": 461,
        "Total win": 2018,
        "Rounds": 5,
        "Jackpot value": 42355,
        "Results": 22,
        "Payout": 16056
    }, {
        "Period": "4/3/2018",
        "Total bet": 93,
        "Total win": 4747,
        "Rounds": 5,
        "Jackpot value": 91564,
        "Results": 37,
        "Payout": 85742
    }, {
        "Period": "6/4/2018",
        "Total bet": 522,
        "Total win": 6194,
        "Rounds": 1,
        "Jackpot value": 31137,
        "Results": 33,
        "Payout": 67465
    }, {
        "Period": "1/5/2018",
        "Total bet": 726,
        "Total win": 3291,
        "Rounds": 6,
        "Jackpot value": 47386,
        "Results": 42,
        "Payout": 30312
    }, {
        "Period": "5/15/2018",
        "Total bet": 102,
        "Total win": 4909,
        "Rounds": 4,
        "Jackpot value": 17183,
        "Results": 36,
        "Payout": 28085
    }, {
        "Period": "7/22/2018",
        "Total bet": 756,
        "Total win": 6645,
        "Rounds": 2,
        "Jackpot value": 11668,
        "Results": 42,
        "Payout": 62235
    }, {
        "Period": "7/10/2018",
        "Total bet": 812,
        "Total win": 9766,
        "Rounds": 3,
        "Jackpot value": 86032,
        "Results": 34,
        "Payout": 15564
    }, {
        "Period": "3/15/2018",
        "Total bet": 264,
        "Total win": 9895,
        "Rounds": 5,
        "Jackpot value": 47457,
        "Results": 26,
        "Payout": 69546
    }, {
        "Period": "4/17/2018",
        "Total bet": 966,
        "Total win": 6052,
        "Rounds": 10,
        "Jackpot value": 58294,
        "Results": 36,
        "Payout": 40603
    }, {
        "Period": "7/17/2018",
        "Total bet": 898,
        "Total win": 7940,
        "Rounds": 10,
        "Jackpot value": 38370,
        "Results": 31,
        "Payout": 92955
    }, {
        "Period": "8/17/2018",
        "Total bet": 106,
        "Total win": 973,
        "Rounds": 1,
        "Jackpot value": 70397,
        "Results": 42,
        "Payout": 43880
    }, {
        "Period": "10/22/2018",
        "Total bet": 23,
        "Total win": 6765,
        "Rounds": 1,
        "Jackpot value": 80511,
        "Results": 42,
        "Payout": 49485
    }, {
        "Period": "1/11/2018",
        "Total bet": 581,
        "Total win": 168,
        "Rounds": 10,
        "Jackpot value": 45551,
        "Results": 41,
        "Payout": 17128
    }, {
        "Period": "4/30/2018",
        "Total bet": 59,
        "Total win": 7317,
        "Rounds": 5,
        "Jackpot value": 79588,
        "Results": 25,
        "Payout": 16816
    }, {
        "Period": "7/4/2018",
        "Total bet": 817,
        "Total win": 3468,
        "Rounds": 1,
        "Jackpot value": 24335,
        "Results": 43,
        "Payout": 48019
    }]

    on('mock/data', function (params) {
        let dataForApi = params.data;
        //here we transform data
        let dataFromAPI = {
            activePage: 1,
            lastPage: 2
        };
        let tableSettings = params.tableSettings;
        tableSettings.tableData = mockData0;
        trigger(params.callbackEvent, {tableSettings: tableSettings, data: dataFromAPI});
    });
})();