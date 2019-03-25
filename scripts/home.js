let home = (function () {

    let token = JSON.parse(sessionStorage.token);
    trigger('communicate/token/refresh', {token: token});

    // let testDataTableHome = [{
    //     "Flag": 1,
    //     "Period": "11/28/2017",
    //     "Total bet": 73,
    //     "Total win": 27,
    //     "Rounds": 86,
    //     "Jackpot value": 11,
    //     "Results": 96,
    //     "Payout": 34
    // }, {
    //     "Flag": 2,
    //     "Period": "7/7/2018",
    //     "Total bet": 48,
    //     "Total win": 36,
    //     "Rounds": 80,
    //     "Jackpot value": 19,
    //     "Results": 64,
    //     "Payout": 72
    // }, {
    //     "Flag": 3,
    //     "Period": "5/17/2018",
    //     "Total bet": 49,
    //     "Total win": 46,
    //     "Rounds": 77,
    //     "Jackpot value": 17,
    //     "Results": 5,
    //     "Payout": 8
    // }, {
    //     "Flag": 4,
    //     "Period": "4/18/2018",
    //     "Total bet": 91,
    //     "Total win": 56,
    //     "Rounds": 27,
    //     "Jackpot value": 46,
    //     "Results": 10,
    //     "Payout": 90
    // }, {
    //     "Flag": 5,
    //     "Period": "9/22/2018",
    //     "Total bet": 70,
    //     "Total win": 83,
    //     "Rounds": 36,
    //     "Jackpot value": 95,
    //     "Results": 1,
    //     "Payout": 35
    // }, {
    //     "Flag": 6,
    //     "Period": "7/12/2018",
    //     "Total bet": 72,
    //     "Total win": 9,
    //     "Rounds": 16,
    //     "Jackpot value": 15,
    //     "Results": 51,
    //     "Payout": 13
    // }, {
    //     "Flag": 7,
    //     "Period": "1/8/2018",
    //     "Total bet": 66,
    //     "Total win": 31,
    //     "Rounds": 22,
    //     "Jackpot value": 75,
    //     "Results": 58,
    //     "Payout": 76
    // }, {
    //     "Flag": 8,
    //     "Period": "12/14/2017",
    //     "Total bet": 35,
    //     "Total win": 42,
    //     "Rounds": 47,
    //     "Jackpot value": 37,
    //     "Results": 68,
    //     "Payout": 84
    // }, {
    //     "Flag": 9,
    //     "Period": "4/8/2018",
    //     "Total bet": 53,
    //     "Total win": 33,
    //     "Rounds": 59,
    //     "Jackpot value": 82,
    //     "Results": 65,
    //     "Payout": 98
    // }, {
    //     "Flag": 10,
    //     "Period": "4/4/2018",
    //     "Total bet": 53,
    //     "Total win": 48,
    //     "Rounds": 13,
    //     "Jackpot value": 20,
    //     "Results": 51,
    //     "Payout": 51
    // }, {
    //     "Flag": 11,
    //     "Period": "1/24/2018",
    //     "Total bet": 6,
    //     "Total win": 45,
    //     "Rounds": 4,
    //     "Jackpot value": 26,
    //     "Results": 18,
    //     "Payout": 45
    // }, {
    //     "Flag": 12,
    //     "Period": "11/21/2017",
    //     "Total bet": 41,
    //     "Total win": 27,
    //     "Rounds": 48,
    //     "Jackpot value": 87,
    //     "Results": 69,
    //     "Payout": 53
    // }, {
    //     "Flag": 13,
    //     "Period": "11/4/2018",
    //     "Total bet": 62,
    //     "Total win": 9,
    //     "Rounds": 76,
    //     "Jackpot value": 28,
    //     "Results": 18,
    //     "Payout": 52
    // }, {
    //     "Flag": 14,
    //     "Period": "8/16/2018",
    //     "Total bet": 11,
    //     "Total win": 34,
    //     "Rounds": 53,
    //     "Jackpot value": 6,
    //     "Results": 45,
    //     "Payout": 25
    // }, {
    //     "Flag": 15,
    //     "Period": "1/18/2018",
    //     "Total bet": 69,
    //     "Total win": 100,
    //     "Rounds": 91,
    //     "Jackpot value": 89,
    //     "Results": 2,
    //     "Payout": 69
    // }, {
    //     "Flag": 16,
    //     "Period": "5/28/2018",
    //     "Total bet": 72,
    //     "Total win": 55,
    //     "Rounds": 93,
    //     "Jackpot value": 96,
    //     "Results": 100,
    //     "Payout": 17
    // }, {
    //     "Flag": 17,
    //     "Period": "9/25/2018",
    //     "Total bet": 52,
    //     "Total win": 57,
    //     "Rounds": 4,
    //     "Jackpot value": 36,
    //     "Results": 47,
    //     "Payout": 51
    // }, {
    //     "Flag": 18,
    //     "Period": "9/3/2018",
    //     "Total bet": 69,
    //     "Total win": 10,
    //     "Rounds": 37,
    //     "Jackpot value": 38,
    //     "Results": 20,
    //     "Payout": 85
    // }, {
    //     "Flag": 19,
    //     "Period": "6/30/2018",
    //     "Total bet": 28,
    //     "Total win": 26,
    //     "Rounds": 98,
    //     "Jackpot value": 23,
    //     "Results": 65,
    //     "Payout": 67
    // }, {
    //     "Flag": 20,
    //     "Period": "5/4/2018",
    //     "Total bet": 94,
    //     "Total win": 52,
    //     "Rounds": 78,
    //     "Jackpot value": 18,
    //     "Results": 53,
    //     "Payout": 4
    // }, {
    //     "Flag": 21,
    //     "Period": "2/20/2018",
    //     "Total bet": 90,
    //     "Total win": 78,
    //     "Rounds": 59,
    //     "Jackpot value": 8,
    //     "Results": 2,
    //     "Payout": 40
    // }, {
    //     "Flag": 22,
    //     "Period": "12/5/2017",
    //     "Total bet": 43,
    //     "Total win": 84,
    //     "Rounds": 58,
    //     "Jackpot value": 85,
    //     "Results": 1,
    //     "Payout": 87
    // }, {
    //     "Flag": 23,
    //     "Period": "7/27/2018",
    //     "Total bet": 90,
    //     "Total win": 7,
    //     "Rounds": 54,
    //     "Jackpot value": 91,
    //     "Results": 17,
    //     "Payout": 86
    // }, {
    //     "Flag": 24,
    //     "Period": "2/24/2018",
    //     "Total bet": 44,
    //     "Total win": 11,
    //     "Rounds": 10,
    //     "Jackpot value": 38,
    //     "Results": 12,
    //     "Payout": 59
    // }, {
    //     "Flag": 25,
    //     "Period": "6/19/2018",
    //     "Total bet": 22,
    //     "Total win": 91,
    //     "Rounds": 1,
    //     "Jackpot value": 19,
    //     "Results": 37,
    //     "Payout": 33
    // }, {
    //     "Flag": 26,
    //     "Period": "2/12/2018",
    //     "Total bet": 71,
    //     "Total win": 75,
    //     "Rounds": 23,
    //     "Jackpot value": 38,
    //     "Results": 44,
    //     "Payout": 27
    // }, {
    //     "Flag": 27,
    //     "Period": "10/22/2018",
    //     "Total bet": 36,
    //     "Total win": 62,
    //     "Rounds": 31,
    //     "Jackpot value": 21,
    //     "Results": 75,
    //     "Payout": 96
    // }, {
    //     "Flag": 28,
    //     "Period": "3/30/2018",
    //     "Total bet": 89,
    //     "Total win": 63,
    //     "Rounds": 90,
    //     "Jackpot value": 5,
    //     "Results": 83,
    //     "Payout": 48
    // }, {
    //     "Flag": 29,
    //     "Period": "8/14/2018",
    //     "Total bet": 71,
    //     "Total win": 2,
    //     "Rounds": 32,
    //     "Jackpot value": 52,
    //     "Results": 5,
    //     "Payout": 8
    // }, {
    //     "Flag": 30,
    //     "Period": "6/7/2018",
    //     "Total bet": 34,
    //     "Total win": 19,
    //     "Rounds": 3,
    //     "Jackpot value": 26,
    //     "Results": 6,
    //     "Payout": 13
    // }];

    // let newTestData = [
    //     {
    //         "period1": "home",
    //         "period2": "home",
    //         "period3": "home",
    //         "period4": "home",
    //         "period5": "home",
    //         "period6": "home",
    //         "period7": "home",
    //         "period8": "home"
    //     },
    //     {
    //         "period1": "home",
    //         "period2": "home",
    //         "period3": "home",
    //         "period4": "home",
    //         "period5": "home",
    //         "period6": "home",
    //         "period7": "home",
    //         "period8": "home"
    //     },
    //     {
    //         "period1": "home",
    //         "period2": "home",
    //         "period3": "home",
    //         "period4": "home",
    //         "period5": "home",
    //         "period6": "home",
    //         "period7": "home",
    //         "period8": "home"
    //     },
    //     {
    //         "period1": "home",
    //         "period2": "home",
    //         "period3": "home",
    //         "period4": "home",
    //         "period5": "home",
    //         "period6": "home",
    //         "period7": "home",
    //         "period8": "home"
    //     },
    //     {
    //         "period1": "home",
    //         "period2": "home",
    //         "period3": "home",
    //         "period4": "home",
    //         "period5": "home",
    //         "period6": "home",
    //         "period7": "home",
    //         "period8": "home"
    //     },
    //     {
    //         "period1": "home",
    //         "period2": "home",
    //         "period3": "home",
    //         "period4": "home",
    //         "period5": "home",
    //         "period6": "home",
    //         "period7": "home",
    //         "period8": "home"
    //     },
    //     {
    //         "period1": "home",
    //         "period2": "home",
    //         "period3": "home",
    //         "period4": "home",
    //         "period5": "home",
    //         "period6": "home",
    //         "period7": "home",
    //         "period8": "home"
    //     },
    //     {
    //         "period1": "home",
    //         "period2": "home",
    //         "period3": "home",
    //         "period4": "home",
    //         "period5": "home",
    //         "period6": "home",
    //         "period7": "home",
    //         "period8": "home"
    //     },
    //     {
    //         "period1": "home",
    //         "period2": "home",
    //         "period3": "home",
    //         "period4": "home",
    //         "period5": "home",
    //         "period6": "home",
    //         "period7": "home",
    //         "period8": "home"
    //     },
    //     {
    //         "period1": "home",
    //         "period2": "home",
    //         "period3": "home",
    //         "period4": "home",
    //         "period5": "home",
    //         "period6": "home",
    //         "period7": "home",
    //         "period8": "home"
    //     },
    //     {
    //         "period1": "home",
    //         "period2": "home",
    //         "period3": "home",
    //         "period4": "home",
    //         "period5": "home",
    //         "period6": "home",
    //         "period7": "home",
    //         "period8": "home"
    //     },
    //     {
    //         "period1": "home",
    //         "period2": "home",
    //         "period3": "home",
    //         "period4": "home",
    //         "period5": "home",
    //         "period6": "home",
    //         "period7": "home",
    //         "period8": "home"
    //     },
    //     {
    //         "period1": "home",
    //         "period2": "home",
    //         "period3": "home",
    //         "period4": "home",
    //         "period5": "home",
    //         "period6": "home",
    //         "period7": "home",
    //         "period8": "home"
    //     },
    //     {
    //         "period1": "home",
    //         "period2": "home",
    //         "period3": "home",
    //         "period4": "home",
    //         "period5": "home",
    //         "period6": "home",
    //         "period7": "home",
    //         "period8": "home"
    //     }
    // ];

    // let newTestData2 = [
    //     {
    //         "period1": "home",
    //         "period2": "home",
    //         "period3": "home",
    //         "period4": "home",
    //         "period5": "home"
    //     },
    //     {
    //         "period1": "home",
    //         "period2": "home",
    //         "period3": "home",
    //         "period4": "home",
    //         "period5": "home"
    //     },
    //     {
    //         "period1": "home",
    //         "period2": "home",
    //         "period3": "home",
    //         "period4": "home",
    //         "period5": "home"
    //     }
    // ];

    // let newTestData3 = [
    //     {
    //         "period1 period": "home",
    //         "period2 period": "home",
    //         "period3 period": "home",
    //         "period4 period": "home",
    //         "period5 period": "home"
    //     },
    //     {
    //         "period1 period": "home",
    //         "period2 period": "home",
    //         "period3 period": "home",
    //         "period4 period": "home",
    //         "period5 period": "home"
    //     },
    //     {
    //         "period1 period": "home",
    //         "period2 period": "home",
    //         "period3 period": "home",
    //         "period4 period": "home",
    //         "period5 period": "home"
    //     }
    // ];

    on('home/activated', function () {

       

    });

})();