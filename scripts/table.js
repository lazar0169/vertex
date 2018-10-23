let table = (function () {

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
        },
        {
            "period": "4/11/2018",
            "totalBet": 1,
            "totalWin": 2,
            "rounds": 3,
            "jackpotValue": 4,
            "result": 0,
            "payout": 5,
            "currency": "eur"
        },
        {
            "period": "4/12/2018",
            "totalBet": 1,
            "totalWin": 2,
            "rounds": 3,
            "jackpotValue": 4,
            "result": 0,
            "payout": 5,
            "currency": "eur"
        },
        {
            "period": "4/13/2018",
            "totalBet": 1,
            "totalWin": 2,
            "rounds": 3,
            "jackpotValue": 4,
            "result": 0,
            "payout": 5,
            "currency": "eur"
        },
        {
            "period": "6/28/2018",
            "totalBet": 1,
            "totalWin": 2,
            "rounds": 3,
            "jackpotValue": 4,
            "result": 0,
            "payout": 5,
            "currency": "eur"
        },
        {
            "period": "6/29/2018",
            "totalBet": 1,
            "totalWin": 2,
            "rounds": 3,
            "jackpotValue": 4,
            "result": 0,
            "payout": 5,
            "currency": "eur"
        },
        {
            "period": "6/30/2018",
            "totalBet": 1,
            "totalWin": 2,
            "rounds": 3,
            "jackpotValue": 4,
            "result": 0,
            "payout": 5,
            "currency": "eur"
        },
        {
            "period": "7/1/2018",
            "totalBet": 1,
            "totalWin": 2,
            "rounds": 3,
            "jackpotValue": 4,
            "result": 0,
            "payout": 5,
            "currency": "eur"
        }
    ];

    let rows = [];

    function generate(json, id = '', sticky = false) {
        console.log('pozvali smo table generate');

        let colsCount = Object.keys(json[0]).length;
        let tbody = document.createElement('div');
        tbody.style.gridTemplateColumns = `repeat(${colsCount}, 1fr)`;
        tbody.style.gridTemplateRows = `repeat(${json.length}, 1fr)`;
        tbody.id = id;
        tbody.className = 'tbody';

        for (let col = 0; col < colsCount; col++) {
            let head = document.createElement('div');
            head.innerHTML = Object.keys(json[0])[col];
            head.className = 'head cell';
            tbody.appendChild(head);
        }
        for (let row = 0; row < json.length; row++) {
            let rowId = Math.round(Math.random() * Number.MAX_SAFE_INTEGER);
            while (rows.includes(rowId)) {
                rowId = Math.round(Math.random() * Number.MAX_SAFE_INTEGER);
            }
            rows.push(rowId);
            for (let col = 0; col < colsCount; col++) {
                let cell = document.createElement('div');
                cell.innerHTML = json[row][Object.keys(json[row])[col]];
                cell.className = col === 0 ? 'first cell' : 'cell';
                cell.classList.add(`row-${rowId}`);
                cell.addEventListener('mouseover', function () {
                    hoverRow(`row-${rowId}`, true);
                }, {passive: false});
                cell.addEventListener('mouseout', function () {
                    hoverRow(`row-${rowId}`, false);
                }, {passive: false});
                tbody.appendChild(cell);
            }
        }

        function hoverRow(elements, highlight = false) {
            for (let element of document.getElementsByClassName(elements)) {
                element.classList[highlight ? "add" : "remove"]('hover');
            }
        }

        let t = document.createElement('div');
        t.className = sticky ? 'table sticky' : 'table';
        t.appendChild(tbody);
        console.log('t', t);
        return t;
    }

    return {
        generate: generate
    };


})();