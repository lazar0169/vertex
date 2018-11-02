let table = (function () {

    let rows = [];

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
        let paginationElement = tableSettings.tableContainerElement.getElementsByClassName('pagination')[0];
        if (paginationElement === undefined) {
            let callbackEvent = 'table/pagination/display';
            trigger('template/render', {
                templateElementSelector: '#pagination',
                callbackEvent: callbackEvent,
                tableSettings: tableSettings
            });
        }

        else return;
    }

    on('table/pagination/display', function (params) {
        let paginationElement = params.element;
        let tableContainerElement = params.params.tableSettings.tableContainerElement;
        tableContainerElement.appendChild(paginationElement);
        bindPaginationLinkHandlers();

    });

    function updateTablePagination(tableSettings) {
        //toDo: dummy data
        let activePage = 3;
        let lastPage = 6;

        let paginationFirstPage = tableSettings.tableContainerElement.getElementsByClassName('pagination-first-page')[0];
        let paginationPreviousPage = tableSettings.tableContainerElement.getElementsByClassName('pagination-previous-page')[0];
        let paginationNextPage = tableSettings.tableContainerElement.getElementsByClassName('pagination-next-page')[0];
        let paginationLastPage = tableSettings.tableContainerElement.getElementsByClassName('pagination-last-page')[0];

        paginationFirstPage.dataset.page = '1';
        if (activePage - 1 > 0) {
            let previousPage = activePage - 1;
            paginationPreviousPage.dataset.page = previousPage.toString();
        }
        else {
            paginationPreviousPage.dataset.page = '1';
        }


        if (activePage !== lastPage) {
            let nextPage = activePage + 1;
            paginationNextPage.dataset.page = nextPage.toString();
        }
        else {
            paginationNextPage.dataset.page = lastPage.toString();
        }

        paginationLastPage.dataset.page = lastPage.toString();

        let paginationArray = [];

        if (lastPage >= 3) {
            if (activePage === lastPage) {
                paginationArray = [activePage - 2, activePage - 1, activePage];
            }
            else if (activePage === 1) {
                paginationArray = [activePage, activePage + 1, activePage + 2];
            }
            else {
                paginationArray = [activePage - 1, activePage, activePage + 1];
            }
        }
        else if (lastPage === 2) {
            paginationArray = ['1', '2'];
        }
        else {
            paginationArray = ['1'];
        }

        let paginationButtons = tableSettings.tableContainerElement.getElementsByClassName('element-pagination-page-button');

        for (let i = 0; i < paginationButtons.length; i++) {
            paginationButtons[i].dataset.page = paginationArray[i];
            paginationButtons[i].innerHTML = paginationArray[i];
            if (paginationButtons[i].innerHTML == activePage) {
                paginationButtons[i].classList.add('active');
            }
            else if (paginationArray[i] === undefined) {
                paginationButtons[i].classList.add('hidden');
            }
        }
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


    function handleLinkClick(e) {
        e.preventDefault();
        let page = e.target.dataset.page;
        alert(page);
    }

    function bindPaginationLinkHandler(element) {
        element.removeEventListener('click', handleLinkClick);
        element.addEventListener('click', handleLinkClick);
    }

    function bindPaginationLinkHandlers() {
        let paginationElements = $$('.element-pagination-link');
        for (let i = 0; i < paginationElements.length; i++) {
            let paginationElement = paginationElements[i];
            bindPaginationLinkHandler(paginationElement);
        }
    }

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