let table = (function () {

    let rows = [];

    function checkIfHasTable(pageId, tableContainerId) {
        let hasTable = false;
        let listOfChildren = $$('#' + pageId).childNodes;
        listOfChildren.forEach(function (node) {
            if (node.id === tableContainerId) {
                hasTable = true;
            }
        });
        return hasTable;
    }

    function generateTable(jsonData, tableContainerElement, forceRemoveHeaders, id = '', sticky = false) {

        let colsCount;

        if (forceRemoveHeaders === false) {
            colsCount = Object.keys(jsonData[0]).length;
            let tbody = document.createElement('div');
            tbody.style.gridTemplateColumns = `repeat(${colsCount}, 1fr)`;
            tbody.style.gridTemplateRows = `repeat(${jsonData.length}, 1fr)`;
            tbody.className = 'tbody';

            for (let col = 0; col < colsCount; col++) {
                let head = document.createElement('div');
                head.innerHTML = Object.keys(jsonData[0])[col];
                head.className = 'head cell';
                tbody.appendChild(head);
            }
            for (let row = 0; row < jsonData.length; row++) {
                let rowId = Math.round(Math.random() * Number.MAX_SAFE_INTEGER);
                while (rows.includes(rowId)) {
                    rowId = Math.round(Math.random() * Number.MAX_SAFE_INTEGER);
                }
                rows.push(rowId);
                for (let col = 0; col < colsCount; col++) {
                    let cell = document.createElement('div');
                    cell.innerHTML = jsonData[row][Object.keys(jsonData[row])[col]];
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

            tableContainerElement.className = sticky ? 'table sticky' : 'table';
            return tbody;
        }

        else {
            colsCount = $$('.head').length;
            let tbody = $$('.tbody')[0];

            tbody.style.gridTemplateColumns = `repeat(${colsCount}, 1fr)`;
            tbody.style.gridTemplateRows = `repeat(${jsonData.length}, 1fr)`;

            for (let row = 0; row < jsonData.length; row++) {
                let rowId = Math.round(Math.random() * Number.MAX_SAFE_INTEGER);
                while (rows.includes(rowId)) {
                    rowId = Math.round(Math.random() * Number.MAX_SAFE_INTEGER);
                }
                rows.push(rowId);
                for (let col = 0; col < colsCount; col++) {
                    let cell = document.createElement('div');
                    cell.innerHTML = jsonData[row][Object.keys(jsonData[row])[col]];
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

            tableContainerElement.className = sticky ? 'table sticky' : 'table';
            return tbody;
        }

    }

    /*
        function displayTable(pageId, tableToDisplay) {
            let listOfChildren = $$(pageId);
            if (table.checkIfHasTable(listOfChildren) === true) {
                //update
                console.log('home already has table');
            }
            else {
                let tableHome = table.generateTable(testTable, 'table-home');
                $$('#page-home').appendChild(tableHome);
            }
        }
    */

    return {
        generateTable: generateTable,
        checkIfHasTable: checkIfHasTable
        // displayTable: displayTable
    };

})();