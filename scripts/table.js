let table = (function () {

    let rows = [];

    function getColsCount(tableSettings) {
        let colsCount;
        let tbody = getTableBodyElement(tableSettings);
        if (tbody === undefined || tbody === null || tableSettings.forceRemoveHeaders === true) {
            colsCount = Object.keys(tableSettings.tableData[0]).length;
        }
        else {
            let headElements = tbody.getElementsByClassName('head');
            colsCount = headElements.length;
        }
        return colsCount;
    }

    function generateHeaders(tableSettings, colsCount, stickyRow) {
        let tbody = getTableBodyElement(tableSettings);
        if (tbody !== null && tbody !== undefined) {
            tbody.parentNode.removeChild(tbody);
        }
        tbody = document.createElement('div');
        tbody.className = 'tbody';
        for (let col = 0; col < colsCount; col++) {
            let head = document.createElement('div');
            head.innerHTML = Object.keys(tableSettings.tableData[0])[col];
            head.className = 'head cell';
            if (stickyRow === true) {
                head.classList.add('sticky-head-row');
            }
            tbody.appendChild(head);
        }
        tableSettings.tableContainerElement.appendChild(tbody);
    }

    function getTableBodyElement(tableSettings) {
        let tbody = tableSettings.tableContainerElement.getElementsByClassName('tbody')[0];
        return tbody;
    }

    function styleColsRows(tableSettingsData, colsCount, tbody) {
        tbody.style.gridTemplateColumns = `repeat(${colsCount}, 1fr)`;
        tbody.style.gridTemplateRows = `repeat(${tableSettingsData.length}, 1fr)`;
    }

    function hoverRow(elements, highlight = false) {
        for (let element of document.getElementsByClassName(elements)) {
            element.classList[highlight ? "add" : "remove"]('hover');
        }
    }

    function generateCellClassName(tableData, colNumber) {
        let cellClassName = 'cell-' + Object.keys(tableData[0])[colNumber];
        cellClassName = cellClassName.toLowerCase();
        cellClassName = cellClassName.replace(' ', '-');
        return cellClassName;
    }

    function generateRows(tableData, colsCount, tbody, stickyColumn) {
        for (let row = 0; row < tableData.length; row++) {
            let rowId = Math.round(Math.random() * Number.MAX_SAFE_INTEGER);
            while (rows.includes(rowId)) {
                rowId = Math.round(Math.random() * Number.MAX_SAFE_INTEGER);
            }
            rows.push(rowId);
            for (let col = 0; col < colsCount; col++) {
                let cell = document.createElement('div');
                cell.innerHTML = tableData[row][Object.keys(tableData[row])[col]];
                let cellClassName = generateCellClassName(tableData, col);
                cell.className = col === 0 ? 'first cell' : 'cell ' + cellClassName;
                cell.classList.add(`row-${rowId}`);
                if (stickyColumn === true && col === 0) {
                    cell.classList.add('sticky-first-column');
                }
                cell.addEventListener('mouseover', function () {
                    hoverRow(`row-${rowId}`, true);
                }, {passive: false});
                cell.addEventListener('mouseout', function () {
                    hoverRow(`row-${rowId}`, false);
                }, {passive: false});
                tbody.appendChild(cell);
            }
        }
    }

    /*    function makeHeadRowSticky(tableContainerSelector) {
            let firstRow = document.querySelectorAll(tableContainerSelector + ' .tbody .head');
            firstRow.forEach(function (element) {
                element.classList.add('sticky-head-row');
            });
        }

        function makeFirstColumnSticky(tableContainerSelector) {
            let firstColumn = document.querySelectorAll(tableContainerSelector + ' .tbody .first');
            firstColumn.forEach(function (element) {
                element.classList.add('sticky-first-column');
            });
        }*/

    function generateTableContent(tableSettings) {

        tableSettings.tableContainerElement = $$(tableSettings.tableContainerSelector);
        let tableContainerElement = tableSettings.tableContainerElement;
        let colsCount = getColsCount(tableSettings);

        if (tableContainerElement.tableSettings === undefined || tableSettings.forceRemoveHeaders === true) {
            generateHeaders(tableSettings, colsCount, tableSettings.stickyRow);
        }

        let tbody = getTableBodyElement(tableSettings);
        styleColsRows(tableSettings.tableData, colsCount, tbody);
        generateRows(tableSettings.tableData, colsCount, tbody, tableSettings.stickyColumn);

        tableSettings.tableContainerElement.className = tableSettings.stickyRow ? 'table sticky' : 'table';

        /*
                if(tableSettings.stickyRow === true) {
                    makeHeadRowSticky(tableSettings.tableContainerSelector);
                }
                if(tableSettings.stickyColumn === true) {
                    makeFirstColumnSticky(tableSettings.tableContainerSelector);
                }
        */

        tableContainerElement.tableSettings = tableSettings;
    }

    function generateTablePagination(tableSettings) {

    }



    function updateTable(tableSettings) {
        trigger('communicate/table/data', {tableSettings: tableSettings, callbackEvent: 'table/generate/new-data'});
    }

    on('table/generate/new-data', function (params) {
        let newTableSettings = params.tableSettings;
        newTableSettings.tableData = params.newTableData.data;
        generateTableContent(newTableSettings);
        generateTablePagination(newTableSettings);
    });

    return {
        // generateTable: generateTable
        updateTable: updateTable
    };

})();