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
    }];

    let mockData3 = [{
        "Flag": 1544,
        "Period": "1/15/2018",
        "Total bet": 9,
        "Total win": 27,
        "Rounds": 69,
        "Jackpot value": 91,
        "Results": 68,
        "Payout": 85
    }, {
        "Flag": 2,
        "Period": "9/10/2018",
        "Total bet": 55,
        "Total win": 7,
        "Rounds": 29,
        "Jackpot value": 82,
        "Results": 69,
        "Payout": 4
    }, {
        "Flag": 3,
        "Period": "11/1/2018",
        "Total bet": 78,
        "Total win": 66,
        "Rounds": 17,
        "Jackpot value": 90,
        "Results": 12,
        "Payout": 65
    }, {
        "Flag": 4,
        "Period": "3/21/2018",
        "Total bet": 27,
        "Total win": 30,
        "Rounds": 66,
        "Jackpot value": 24,
        "Results": 36,
        "Payout": 13
    }, {
        "Flag": 5,
        "Period": "2/9/2018",
        "Total bet": 48,
        "Total win": 24,
        "Rounds": 54,
        "Jackpot value": 50,
        "Results": 14,
        "Payout": 47
    }, {
        "Flag": 6,
        "Period": "1/1/2018",
        "Total bet": 73,
        "Total win": 23,
        "Rounds": 56,
        "Jackpot value": 1,
        "Results": 21,
        "Payout": 52
    }, {
        "Flag": 7,
        "Period": "9/19/2018",
        "Total bet": 97,
        "Total win": 70,
        "Rounds": 12,
        "Jackpot value": 65,
        "Results": 75,
        "Payout": 98
    }, {
        "Flag": 8,
        "Period": "11/19/2017",
        "Total bet": 67,
        "Total win": 23,
        "Rounds": 66,
        "Jackpot value": 8,
        "Results": 33,
        "Payout": 21
    }, {
        "Flag": 9,
        "Period": "8/10/2018",
        "Total bet": 73,
        "Total win": 83,
        "Rounds": 2,
        "Jackpot value": 41,
        "Results": 71,
        "Payout": 5
    }, {
        "Flag": 10,
        "Period": "12/26/2017",
        "Total bet": 19,
        "Total win": 13,
        "Rounds": 9,
        "Jackpot value": 87,
        "Results": 16,
        "Payout": 11
    }, {
        "Flag": 11,
        "Period": "6/16/2018",
        "Total bet": 21,
        "Total win": 36,
        "Rounds": 88,
        "Jackpot value": 75,
        "Results": 62,
        "Payout": 38
    }, {
        "Flag": 12,
        "Period": "4/30/2018",
        "Total bet": 62,
        "Total win": 15,
        "Rounds": 44,
        "Jackpot value": 82,
        "Results": 93,
        "Payout": 15
    }, {
        "Flag": 13,
        "Period": "11/18/2017",
        "Total bet": 52,
        "Total win": 19,
        "Rounds": 99,
        "Jackpot value": 73,
        "Results": 91,
        "Payout": 11
    }, {
        "Flag": 14,
        "Period": "5/5/2018",
        "Total bet": 2,
        "Total win": 93,
        "Rounds": 81,
        "Jackpot value": 7,
        "Results": 26,
        "Payout": 31
    }, {
        "Flag": 15,
        "Period": "8/16/2018",
        "Total bet": 57,
        "Total win": 44,
        "Rounds": 22,
        "Jackpot value": 87,
        "Results": 54,
        "Payout": 96
    }, {
        "Flag": 16,
        "Period": "1/8/2018",
        "Total bet": 7,
        "Total win": 88,
        "Rounds": 24,
        "Jackpot value": 85,
        "Results": 18,
        "Payout": 83
    }, {
        "Flag": 17,
        "Period": "6/22/2018",
        "Total bet": 37,
        "Total win": 69,
        "Rounds": 68,
        "Jackpot value": 13,
        "Results": 43,
        "Payout": 26
    }, {
        "Flag": 18,
        "Period": "11/30/2017",
        "Total bet": 58,
        "Total win": 60,
        "Rounds": 4,
        "Jackpot value": 4,
        "Results": 82,
        "Payout": 22
    }, {
        "Flag": 19,
        "Period": "2/25/2018",
        "Total bet": 73,
        "Total win": 25,
        "Rounds": 96,
        "Jackpot value": 37,
        "Results": 36,
        "Payout": 78
    }, {
        "Flag": 20,
        "Period": "11/2/2018",
        "Total bet": 51,
        "Total win": 12,
        "Rounds": 2,
        "Jackpot value": 78,
        "Results": 97,
        "Payout": 30
    }];

    let mockData4 = [{
        "Flag": 12584,
        "Period": "12/28/2017",
        "Total bet": 26,
        "Total win": 37,
        "Rounds": 82,
        "Jackpot value": 36,
        "Results": 80,
        "Payout": 37,
        "Another field": 13,
        "Last field": 97
    }, {
        "Flag": 2,
        "Period": "1/25/2018",
        "Total bet": 81,
        "Total win": 94,
        "Rounds": 24,
        "Jackpot value": 62,
        "Results": 38,
        "Payout": 20,
        "Another field": 49,
        "Last field": 46
    }, {
        "Flag": 3,
        "Period": "3/3/2018",
        "Total bet": 52,
        "Total win": 24,
        "Rounds": 9,
        "Jackpot value": 24,
        "Results": 42,
        "Payout": 22,
        "Another field": 14,
        "Last field": 5
    }, {
        "Flag": 4,
        "Period": "1/11/2018",
        "Total bet": 78,
        "Total win": 72,
        "Rounds": 83,
        "Jackpot value": 100,
        "Results": 8,
        "Payout": 9,
        "Another field": 24,
        "Last field": 4
    }, {
        "Flag": 5,
        "Period": "9/24/2018",
        "Total bet": 94,
        "Total win": 93,
        "Rounds": 47,
        "Jackpot value": 48,
        "Results": 78,
        "Payout": 7,
        "Another field": 87,
        "Last field": 5
    }, {
        "Flag": 6,
        "Period": "3/11/2018",
        "Total bet": 64,
        "Total win": 24,
        "Rounds": 93,
        "Jackpot value": 56,
        "Results": 72,
        "Payout": 30,
        "Another field": 59,
        "Last field": 19
    }, {
        "Flag": 7,
        "Period": "4/7/2018",
        "Total bet": 60,
        "Total win": 45,
        "Rounds": 8,
        "Jackpot value": 31,
        "Results": 46,
        "Payout": 35,
        "Another field": 54,
        "Last field": 22
    }, {
        "Flag": 8,
        "Period": "4/29/2018",
        "Total bet": 56,
        "Total win": 81,
        "Rounds": 53,
        "Jackpot value": 99,
        "Results": 12,
        "Payout": 40,
        "Another field": 17,
        "Last field": 89
    }, {
        "Flag": 9,
        "Period": "4/7/2018",
        "Total bet": 27,
        "Total win": 100,
        "Rounds": 61,
        "Jackpot value": 14,
        "Results": 89,
        "Payout": 14,
        "Another field": 99,
        "Last field": 67
    }, {
        "Flag": 10,
        "Period": "12/11/2017",
        "Total bet": 82,
        "Total win": 28,
        "Rounds": 49,
        "Jackpot value": 35,
        "Results": 65,
        "Payout": 82,
        "Another field": 28,
        "Last field": 83
    }, {
        "Flag": 11,
        "Period": "5/29/2018",
        "Total bet": 31,
        "Total win": 49,
        "Rounds": 88,
        "Jackpot value": 93,
        "Results": 16,
        "Payout": 70,
        "Another field": 84,
        "Last field": 7
    }, {
        "Flag": 12,
        "Period": "7/30/2018",
        "Total bet": 30,
        "Total win": 99,
        "Rounds": 55,
        "Jackpot value": 36,
        "Results": 91,
        "Payout": 92,
        "Another field": 29,
        "Last field": 1
    }, {
        "Flag": 13,
        "Period": "1/18/2018",
        "Total bet": 19,
        "Total win": 71,
        "Rounds": 33,
        "Jackpot value": 8,
        "Results": 6,
        "Payout": 79,
        "Another field": 92,
        "Last field": 8
    }, {
        "Flag": 14,
        "Period": "9/13/2018",
        "Total bet": 19,
        "Total win": 37,
        "Rounds": 84,
        "Jackpot value": 6,
        "Results": 88,
        "Payout": 6,
        "Another field": 30,
        "Last field": 3
    }, {
        "Flag": 15,
        "Period": "1/24/2018",
        "Total bet": 11,
        "Total win": 10,
        "Rounds": 79,
        "Jackpot value": 93,
        "Results": 57,
        "Payout": 93,
        "Another field": 33,
        "Last field": 32
    }, {
        "Flag": 16,
        "Period": "8/3/2018",
        "Total bet": 85,
        "Total win": 1,
        "Rounds": 16,
        "Jackpot value": 71,
        "Results": 34,
        "Payout": 37,
        "Another field": 66,
        "Last field": 17
    }, {
        "Flag": 17,
        "Period": "5/1/2018",
        "Total bet": 84,
        "Total win": 4,
        "Rounds": 57,
        "Jackpot value": 45,
        "Results": 66,
        "Payout": 35,
        "Another field": 99,
        "Last field": 70
    }, {
        "Flag": 18,
        "Period": "9/23/2018",
        "Total bet": 51,
        "Total win": 40,
        "Rounds": 2,
        "Jackpot value": 92,
        "Results": 44,
        "Payout": 32,
        "Another field": 91,
        "Last field": 81
    }, {
        "Flag": 19,
        "Period": "11/7/2018",
        "Total bet": 13,
        "Total win": 60,
        "Rounds": 97,
        "Jackpot value": 18,
        "Results": 94,
        "Payout": 29,
        "Another field": 84,
        "Last field": 39
    }, {
        "Flag": 20,
        "Period": "1/24/2018",
        "Total bet": 86,
        "Total win": 95,
        "Rounds": 24,
        "Jackpot value": 46,
        "Results": 32,
        "Payout": 85,
        "Another field": 69,
        "Last field": 30
    }, {
        "Flag": 21,
        "Period": "7/1/2018",
        "Total bet": 28,
        "Total win": 86,
        "Rounds": 88,
        "Jackpot value": 25,
        "Results": 61,
        "Payout": 11,
        "Another field": 69,
        "Last field": 51
    }, {
        "Flag": 22,
        "Period": "11/10/2018",
        "Total bet": 21,
        "Total win": 75,
        "Rounds": 35,
        "Jackpot value": 13,
        "Results": 93,
        "Payout": 13,
        "Another field": 43,
        "Last field": 31
    }, {
        "Flag": 23,
        "Period": "9/13/2018",
        "Total bet": 71,
        "Total win": 78,
        "Rounds": 85,
        "Jackpot value": 96,
        "Results": 74,
        "Payout": 38,
        "Another field": 36,
        "Last field": 3
    }, {
        "Flag": 24,
        "Period": "6/25/2018",
        "Total bet": 45,
        "Total win": 31,
        "Rounds": 21,
        "Jackpot value": 72,
        "Results": 1,
        "Payout": 60,
        "Another field": 13,
        "Last field": 59
    }, {
        "Flag": 25,
        "Period": "6/9/2018",
        "Total bet": 62,
        "Total win": 31,
        "Rounds": 55,
        "Jackpot value": 97,
        "Results": 80,
        "Payout": 47,
        "Another field": 79,
        "Last field": 46
    }, {
        "Flag": 26,
        "Period": "8/11/2018",
        "Total bet": 86,
        "Total win": 92,
        "Rounds": 33,
        "Jackpot value": 24,
        "Results": 46,
        "Payout": 81,
        "Another field": 14,
        "Last field": 17
    }, {
        "Flag": 27,
        "Period": "12/8/2017",
        "Total bet": 66,
        "Total win": 86,
        "Rounds": 17,
        "Jackpot value": 41,
        "Results": 51,
        "Payout": 57,
        "Another field": 38,
        "Last field": 19
    }, {
        "Flag": 28,
        "Period": "12/7/2017",
        "Total bet": 92,
        "Total win": 43,
        "Rounds": 67,
        "Jackpot value": 64,
        "Results": 19,
        "Payout": 33,
        "Another field": 74,
        "Last field": 7
    }, {
        "Flag": 29,
        "Period": "9/26/2018",
        "Total bet": 82,
        "Total win": 77,
        "Rounds": 26,
        "Jackpot value": 58,
        "Results": 78,
        "Payout": 56,
        "Another field": 14,
        "Last field": 46
    }, {
        "Flag": 30,
        "Period": "7/28/2018",
        "Total bet": 67,
        "Total win": 88,
        "Rounds": 37,
        "Jackpot value": 36,
        "Results": 15,
        "Payout": 58,
        "Another field": 1,
        "Last field": 59
    }, {
        "Flag": 31,
        "Period": "10/9/2018",
        "Total bet": 57,
        "Total win": 8,
        "Rounds": 98,
        "Jackpot value": 56,
        "Results": 62,
        "Payout": 99,
        "Another field": 57,
        "Last field": 5
    }, {
        "Flag": 32,
        "Period": "5/28/2018",
        "Total bet": 81,
        "Total win": 82,
        "Rounds": 43,
        "Jackpot value": 50,
        "Results": 54,
        "Payout": 76,
        "Another field": 28,
        "Last field": 67
    }, {
        "Flag": 33,
        "Period": "7/6/2018",
        "Total bet": 16,
        "Total win": 82,
        "Rounds": 82,
        "Jackpot value": 57,
        "Results": 50,
        "Payout": 84,
        "Another field": 19,
        "Last field": 44
    }, {
        "Flag": 34,
        "Period": "12/9/2017",
        "Total bet": 10,
        "Total win": 94,
        "Rounds": 42,
        "Jackpot value": 6,
        "Results": 5,
        "Payout": 35,
        "Another field": 75,
        "Last field": 24
    }, {
        "Flag": 35,
        "Period": "1/27/2018",
        "Total bet": 83,
        "Total win": 53,
        "Rounds": 45,
        "Jackpot value": 86,
        "Results": 40,
        "Payout": 97,
        "Another field": 61,
        "Last field": 25
    }, {
        "Flag": 36,
        "Period": "7/19/2018",
        "Total bet": 56,
        "Total win": 41,
        "Rounds": 54,
        "Jackpot value": 92,
        "Results": 55,
        "Payout": 37,
        "Another field": 52,
        "Last field": 18
    }, {
        "Flag": 37,
        "Period": "6/11/2018",
        "Total bet": 78,
        "Total win": 54,
        "Rounds": 26,
        "Jackpot value": 59,
        "Results": 26,
        "Payout": 52,
        "Another field": 13,
        "Last field": 96
    }, {
        "Flag": 38,
        "Period": "8/20/2018",
        "Total bet": 60,
        "Total win": 37,
        "Rounds": 58,
        "Jackpot value": 48,
        "Results": 96,
        "Payout": 7,
        "Another field": 14,
        "Last field": 39
    }, {
        "Flag": 39,
        "Period": "6/2/2018",
        "Total bet": 27,
        "Total win": 29,
        "Rounds": 64,
        "Jackpot value": 100,
        "Results": 89,
        "Payout": 9,
        "Another field": 17,
        "Last field": 96
    }, {
        "Flag": 40,
        "Period": "10/8/2018",
        "Total bet": 97,
        "Total win": 2,
        "Rounds": 23,
        "Jackpot value": 62,
        "Results": 76,
        "Payout": 73,
        "Another field": 17,
        "Last field": 74
    }];

    on('mock/data', function (params) {
        let dataForApi = params.data;
        //here we transform data
        let dataFromAPI = {
            activePage: 1,
            lastPage: 2
        };
        let tableSettings = params.tableSettings;
        tableSettings.tableData = mockData4;
        trigger(params.callbackEvent, {tableSettings: tableSettings, data: dataFromAPI});
    });
})();