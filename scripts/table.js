let table = (function () {

    let rows = [];

    function hoverRow(elements, highlight = false) {
        for (let element of document.getElementsByClassName(elements)) {
            element.classList[highlight ? "add" : "remove"]('hover');
        }
    }

    function styleColsRows(tableSettingsData, colsCount, tbody) {
        tbody.style.gridTemplateColumns = `repeat(${colsCount}, 1fr)`;
        tbody.style.gridTemplateRows = `repeat(${tableSettingsData.length}, 1fr)`;
    }

    function generateHeaders(tableSettings, colsCount) {
        let tbody = getTableBodyElement(tableSettings);
        if(tbody !== null) {
            tbody.parentNode.removeChild(tbody);
        }
        tbody = document.createElement('div');
        tbody.className = 'tbody';
        for (let col = 0; col < colsCount; col++) {
            let head = document.createElement('div');
            head.innerHTML = Object.keys(tableSettings.tableData[0])[col];
            head.className = 'head cell';
            tbody.appendChild(head);
        }
        tableSettings.tableContainerElement.appendChild(tbody);
    }

    function getTableBodyElement (tableSettings) {
        let tbody = document.querySelector(tableSettings.tableContainerSelector+' .tbody');
        return tbody;
    }

    function generateRows(tableData, colsCount, tbody) {
        for (let row = 0; row < tableData.length; row++) {
            let rowId = Math.round(Math.random() * Number.MAX_SAFE_INTEGER);
            while (rows.includes(rowId)) {
                rowId = Math.round(Math.random() * Number.MAX_SAFE_INTEGER);
            }
            rows.push(rowId);
            for (let col = 0; col < colsCount; col++) {
                let cell = document.createElement('div');
                cell.innerHTML = tableData[row][Object.keys(tableData[row])[col]];
                cell.className = col === 0 ? 'first cell' : 'cell '+'cell-'+Object.keys(tableData[0])[row];
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
    }

    function getColsCount(tableSettings) {
        let colsCount;
        let tbody = getTableBodyElement(tableSettings);
        if (tbody === undefined || tableSettings.forceRemoveHeaders === true) {
            colsCount = Object.keys(tableSettings.tableData[0]).length;
        }
        else {
            let headElements = document.querySelectorAll('#'+tbody.id+' .head');
            colsCount = headElements.length;
        }
        return colsCount;
    }

    function generateTable(tableSettings) {

        tableSettings.tableContainerElement = $$(tableSettings.tableContainerSelector);
        let tableContainerElement = tableSettings.tableContainerElement;
        let colsCount = getColsCount(tableSettings);

        if (tableContainerElement.tableSettings === undefined || tableSettings.forceRemoveHeaders === true) {
            generateHeaders(tableSettings, colsCount);
        }

        let tbody = getTableBodyElement(tableSettings);
        styleColsRows(tableSettings.tableData, colsCount, tbody);
        generateRows(tableSettings.tableData, colsCount, tbody);

        tableSettings.tableContainerElement.className = tableSettings.sticky ? 'table sticky' : 'table';
        tableContainerElement.tableSettings = tableSettings;
    }

    return {
        generateTable: generateTable
    };

})();