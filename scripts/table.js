let table = (function () {

    let rows = [];

/*

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
                head.classList.add('sticky');
            }
            tbody.appendChild(head);
        }
        tableSettings.tableContainerElement.appendChild(tbody);
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
                    cell.classList.add('sticky');
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


    function generateTableContent(tableSettings) {

        tableSettings.tableContainerElement = $$(tableSettings.tableContainerSelector);

        let tableContainerElement = tableSettings.tableContainerElement;
        let colsCount = getColsCount(tableSettings);

        if (tableSettings.dataEvent === undefined) {
            let htmlEvent = tableContainerElement.getAttribute('data-data-event');
            if (htmlEvent === undefined) {
                console.error('no data event provided');
            }
            else {
                tableSettings.dataEvent = htmlEvent;
            }
        }

        if (tableContainerElement.tableSettings === undefined || tableSettings.forceRemoveHeaders === true) {
            generateHeaders(tableSettings, colsCount, tableSettings.stickyRow);
        }

        let tbody = getTableBodyElement(tableSettings);
        styleColsRows(tableSettings.tableData, colsCount, tbody);
        generateRows(tableSettings.tableData, colsCount, tbody, tableSettings.stickyColumn);


        tableContainerElement.tableSettings = tableSettings;
    }

    function generateTablePagination(tableSettings) {
        let pageCount = tableSettings.pageCount;
        let activePageNumber = tableSettings.activePageNumber;
    }


    function updateTable(tableSettings) {
        let event = tableSettings.dataEvent;
        let params = {
            page: 3,
            pageSize: 10,
            filters: {}
        };

        trigger(event, {tableSettings: tableSettings, parameters: params, callbackEvent: 'table/update'});
    }


    //callback event when new data is passed to table
    on('table/update', function (params) {
        let tableSettings = params.tableSettings;
        let data = params.data;

        //update table settings
        tableSettings.data = params.data;
        //update paginacije
        tableSettings.pagination = {
            activePage: params.page,
            pages: [],
            lastPage: params.lastPage
        };

        generateRows(tableSettings);
        updatePagination(tableSettings.pagination);
        console.log(tableSettings.tableContainerElement.tableSettings);
        //


        generateRows();

        generateTableContent(newTableSettings);
        generateTablePagination(newTableSettings);
    });



*/


    function getEvent(tableSettings) {
        let event;

        if (tableSettings.dataEvent !== undefined) {
            event = tableSettings.dataEvent;
        }
        else if (tableSettings.tableContainerElement.dataset.dataEvent !== undefined) {
            event = tableSettings.tableContainerElement.dataset.dataEvent;
        }
        else {
            console.error('No needed event!');
        }
        return event;
    }

    function getTableBodyElement(tableSettings) {
        let tbody = tableSettings.tableContainerElement.getElementsByClassName('tbody')[0];
        return tbody;
    }

    function getColsCount(tableSettings) {
        let colsCount;
        let tbody = getTableBodyElement(tableSettings);
        if (tbody === undefined || tbody === null || tableSettings.forceRemoveHeaders === true) {
            //ToDo: proveri koja je razlika izmedju object.keys.length i bez keys.length
            colsCount = Object.keys(tableSettings.tableData[0]).length;
        }
        else {
            let headElements = tbody.getElementsByClassName('head');
            colsCount = headElements.length;
        }
        return colsCount;
    }

    function hasHeaders(tableSettings) {
        if (tableSettings.tableContainerElement.getElementsByClassName('head').length > 0) {
            return true;
        }
        else {
            return false;
        }
    }

    function initTableContent(tableSettings){
        let tbody = document.createElement('div');
        tbody.className = 'tbody';
        tableSettings.tableContainerElement.appendChild(tbody);
    }

    function generateTableHeaders(tableSettings) {

        let colsCount = getColsCount(tableSettings);

        let headers = hasHeaders(tableSettings);

        if (!headers || tableSettings.forceRemoveHeaders === true) {
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
                //head.classList.add();
                if (tableSettings.stickyRow === true) {
                    head.classList.add('sticky');
                }
                //ToDo: bind handlers to the head elements
                tbody.appendChild(head);
            }
            tableSettings.tableContainerElement.prepend(tbody);
        }
        else {
            //
        }
    }

    function generateCellClassName(tableData, colNumber) {
        let cellClassName = 'cell-' + Object.keys(tableData[0])[colNumber];
        cellClassName = cellClassName.toLowerCase();
        cellClassName = cellClassName.replace(' ', '-');
        return cellClassName;
    }

    function hoverRow(elements, highlight = false) {
        for (let element of document.getElementsByClassName(elements)) {
            element.classList[highlight ? "add" : "remove"]('hover');
        }
    }

    function styleColsRows(tableSettingsData, colsCount, tbody) {
        tbody.style.gridTemplateColumns = `repeat(${colsCount}, 1fr)`;
        tbody.style.gridTemplateRows = `repeat(${tableSettingsData.length}, 1fr)`;
    }

    function generateTableRows(tableSettings) {

        let colsCount = getColsCount(tableSettings);
        let tbody = getTableBodyElement(tableSettings);

        for (let row = 0; row < tableSettings.tableData.length; row++) {
            let rowId = Math.round(Math.random() * Number.MAX_SAFE_INTEGER);
            while (rows.includes(rowId)) {
                rowId = Math.round(Math.random() * Number.MAX_SAFE_INTEGER);
            }
            rows.push(rowId);
            for (let col = 0; col < colsCount; col++) {
                let cell = document.createElement('div');
                cell.innerHTML = tableSettings.tableData[row][Object.keys(tableSettings.tableData[row])[col]];
                let cellClassName = generateCellClassName(tableSettings.tableData, col);
                cell.className = col === 0 ? 'first cell' : 'cell ' + cellClassName;
                cell.classList.add(`row-${rowId}`);
                if (tableSettings.stickyColumn === true && col === 0) {
                    cell.classList.add('sticky');
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

        styleColsRows(tableSettings.tableData, colsCount, tbody);
    }

    function generateTablePagination(tableSettings) {
        let callbackEvent = 'table/pagination/display';
        trigger('template/render', {templateElementSelector: '#pagination', callbackEvent: callbackEvent, tableSettings: tableSettings});
    }

    on('table/pagination/display', function(params){
        let paginationElement = params.element;
        let tableContainerElement = params.params.tableSettings.tableContainerElement;
        tableContainerElement.appendChild(paginationElement);
    });

    function updateTablePagination() {
        //
    }

    function updateTable(tableSettings) {
        generateTableHeaders(tableSettings);
        generateTableRows(tableSettings);
        updateTablePagination(tableSettings);
    }

    function initUpdateTable(tableSettings) {

        //get data from page
        let data = {
            activePage: 2,
            filters: 0
        };

        console.log(tableSettings.dataEvent);

        trigger(tableSettings.dataEvent, {
            data: data,
            tableSettings: tableSettings,
            callbackEvent: 'table/update'
        });
    }

    on('table/update', function (params) {
        updateTable(params.tableSettings);
    });

    /* tableSettings: {
    dataEvent:
    tableContainerSelector:
     }
     */
    function init(tableSettings) {

        tableSettings.tableContainerElement = $$(tableSettings.tableContainerSelector);
        let tableContainerElement = tableSettings.tableContainerElement;
        tableContainerElement.tableSettings = tableSettings;

        tableSettings.dataEvent = getEvent(tableSettings);

        // initTableContent(tableSettings);

        generateTablePagination(tableSettings);

        if (tableSettings.tableData === undefined) {
            generateTableHeaders(tableSettings);
            initUpdateTable(tableSettings);
        }

        else {
            updateTable(tableSettings);
        }

    }

    return {
        init: init

    };

})();