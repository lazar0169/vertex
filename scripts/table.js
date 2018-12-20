let table = (function () {

    let rows = [];

    const sortOrderEnum = {
        0: 'none',
        1: 'asc',
        2: 'desc'
    };

    const sortingType = {
        none: 0,
        ascending: 1,
        descending: 2
    };

    const sortingClass = {
        ascending: 'sort-asc',
        descending: 'sort-desc'
    };

    const sortingDataAtt = {
        ascending: 'asc',
        descending: 'desc'
    };

    let currentOffset;


    /*---------------------------- FUNCTIONS FOR GENERATING TABLE ----------------------------*/

    function makeColumnTitle(columnName) {
        let columnTitle = columnName.replace(/([a-z](?=[A-Z]))/g, '$1 ');
        /*        let columnTitle = columnName.match(/([a-z])([A-Z])+/g);
                columnTitle = columnTitle.join(' ');*/
        return columnTitle;
    }

    function insertAfter(referenceNode, newNode) {
        return referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    function getEvent(tableSettings) {
        let event;

        if (tableSettings.dataEvent !== undefined) {
            event = tableSettings.dataEvent;
        } else if (tableSettings.tableContainerElement.dataset.dataEvent !== undefined) {
            event = tableSettings.tableContainerElement.dataset.dataEvent;
        } else {
            console.error('Event doesn\'t exist!');
        }
        return event;
    }

    function getTableBodyElement(tableSettings) {
        return tableSettings.tableContainerElement.getElementsByClassName('tbody')[0];
    }

    function getColNamesOfDisplayedTable(tableSettings) {
        let colNames = [];
        let tbody = getTableBodyElement(tableSettings);
        let headElements = Array.from(tbody.getElementsByClassName('head'));
        headElements.forEach(function (element) {
            colNames.push({ Name: element.innerText.replace(' ', '') })
        });
        colNames.unshift({ Name: "-" });
        return colNames;
    }

    function getCountOfAllColumns(tableSettings) {
        let colsCount;
        let tbody = getTableBodyElement(tableSettings);
        if (tableSettings === undefined || tableSettings.tableData === undefined || tableSettings.tableData === null || tableSettings.tableData.length === 0) {
            colsCount = 0;
        } else {
            if (tbody === undefined || tbody === null || tableSettings.tableData !== undefined || tableSettings.tableData.length !== 0 || tableSettings.forceRemoveHeaders === true) {
                //ToDo: proveri koja je razlika izmedju object.keys.length i bez keys.length
                colsCount = Object.keys(tableSettings.tableData[0]).length;
            } else {
                let headElements = tbody.getElementsByClassName('head');
                colsCount = headElements.length;
            }
        }
        return colsCount;
    }

    function getColsCount(tableSettings) {
        let colsCount;
        if (tableSettings.ColumnsToShow === undefined || tableSettings.ColumnsToShow === null || tableSettings.ColumnsToShow.length === 0) {
            getCountOfAllColumns(tableSettings);
        } else {
            colsCount = tableSettings.ColumnsToShow.length;
        }
        return colsCount;
    }

    function getCurrentColsCount(tableSettings) {
        let colsCount;
        let headers = getHeaders(tableSettings);
        colsCount = headers.length;
        return colsCount;
    }

    function hasHeaders(tableSettings) {
        return tableSettings.tableContainerElement.getElementsByClassName('head').length > 0;
    }

    function generateTableHeaders(tableSettings) {
        let colsCount = getCountOfAllColumns(tableSettings);
        let headers = hasHeaders(tableSettings);

        if (!headers || tableSettings.forceRemoveHeaders === true) {
            let tbody = getTableBodyElement(tableSettings);
            if (tbody !== null && tbody !== undefined) {
                tbody.parentNode.removeChild(tbody);
            }
            tbody = document.createElement('div');
            tbody.className = 'tbody';

            let head = document.createElement('div');
            head.innerHTML = '';
            head.classList.add('cell-flag');
            head.classList.add('cell');
            head.classList.add('first-cell');
            tbody.appendChild(head);

            for (let col = 0; col < colsCount; col++) {
                let head = document.createElement('div');
                head.innerHTML = makeColumnTitle(Object.keys(tableSettings.formatedData[0])[col]);
                head.className = 'head cell';
                let columnName = Object.keys(tableSettings.formatedData[0])[col];
                columnName = columnName.toLowerCase();
                columnName = columnName.replace(/ /g, '-');
                head.dataset.sortName = columnName;
                head.classList.add('text-uppercase');
                head.classList.add('cell-' + columnName);
                if (tableSettings.tableDataItems[0].Properties.IsPayoutPossible) {
                    head.classList.add('payout');
                }
                if (tableSettings.stickyRow === true) {
                    head.classList.add('sticky');
                    if (tableSettings.stickyColumn === false) {
                        head.classList.add('first-cell');
                    } else {
                        head.classList.remove('first-cell');
                    }
                }
                if (col === colsCount - 1) {
                    head.classList.add('last-cell');
                }
                tbody.appendChild(head);
            }
            let cancel = document.createElement('div');
            cancel.innerHTML = '';
            cancel.classList.add('cell');
            cancel.classList.add('cell-cancel-head');
            cancel.classList.add('cell-cancel');
            if (tableSettings.stickyColumn === true) {
                cancel.classList.add('sticky');
            }
            tbody.appendChild(cancel);
            let filterContainerElement = tableSettings.tableContainerElement.getElementsByClassName('element-table-filters-container')[0];
            insertAfter(filterContainerElement, tbody);
        } else {

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
        tbody.style.gridTemplateColumns = null;
        tbody.style.gridTemplateRows = null;
        tbody.style.gridTemplateColumns = '25px ' + `repeat(${colsCount}, 1fr)` + '50px';
        tbody.style.gridTemplateRows = `repeat(${tableSettingsData.length}, 1fr)`;
    }

    function cancelTransactionPopup(tableSettings, row) {
        let cancelTransactionPopupElement = tableSettings.tableContainerElement.getElementsByClassName('cancel-transaction')[0];
        if (cancelTransactionPopupElement === undefined || cancelTransactionPopupElement === null) {
            let callbackEvent = 'table/cancelTransaction/display';
            trigger('template/render', {
                templateElementSelector: '#cancel-transaction-template',
                callbackEvent: callbackEvent,
                tableSettings: tableSettings
            });
        }
    }

    function removeTransactionPopup() {
        let cancelTransactionPopupElements = document.body.getElementsByClassName('cancel-transaction');
        if (cancelTransactionPopupElements.length > null) {
            for (let i = 0; i < cancelTransactionPopupElements.length; i++) {
                cancelTransactionPopupElements[i].parentNode.removeChild(cancelTransactionPopupElements[i]);
            }
        }
    }

    function positionElement(cancelTransactionElement) {
        cancelTransactionElement.style.top = currentOffset.top;
        cancelTransactionElement.style.left = currentOffset.left;
    }

    on('table/cancelTransaction/display', function (params) {
        removeTransactionPopup();
        let cancelTransactionElement = params.element;
        document.body.prepend(cancelTransactionElement);
        cancelTransactionElement.classList.add('cancel-transaction');
        positionElement(cancelTransactionElement);
        let buttonYes = cancelTransactionElement.getElementsByClassName('btn-yes')[0];
        let buttonNo = cancelTransactionElement.getElementsByClassName('btn-no')[0];
        buttonNo.addEventListener('click', function () {
            removeTransactionPopup();
        });
        buttonYes.addEventListener('click', function () {
            //todo add functionlity for this
            removeTransactionPopup();
        });
    });


    on('table/cancelButton', function (params) {
        let tableSettings = params.model.tableSettings;
        let row = params.model.row;
        let rowElements = tableSettings.tableContainerElement.getElementsByClassName(row);
        let cancelButtonElement = params.element;
        cancelButtonElement.classList.add('cancel-button');
        for (let i = 0; i < rowElements.length; i++) {
            if (rowElements[i].classList.contains('cell-cancel')) {
                rowElements[i].appendChild(cancelButtonElement);
            }
        }
        cancelButtonElement.addEventListener('click', function(){
            cancelTransactionPopup(tableSettings, row);
        });

    });

    function showCancelButton(tableSettings, row) {
        let callbackEvent = 'table/cancelButton';
        trigger('template/render', {
            templateElementSelector: '#cancel-button-template',
            callbackEvent: callbackEvent,
            model: {
                row: row,
                tableSettings: tableSettings
            }
        });
    }

    function removeCancelButtons() {
        let cancelButtonElements = document.body.getElementsByClassName('cancel-button');
        if (cancelButtonElements.length > null) {
            for (let i = 0; i < cancelButtonElements.length; i++) {
                cancelButtonElements[i].parentNode.removeChild(cancelButtonElements[i]);
            }
        }
    }

    function selectRow(tableSettings, row) {
        let tableCells = tableSettings.tableContainerElement.getElementsByClassName('cell');
        removeCancelButtons(tableSettings);
        showCancelButton(tableSettings, row);
        for (let i = 0; i < tableCells.length; i++) {
            if (!tableCells[i].classList.contains(row)) {
                tableCells[i].classList.remove('row-chosen');
            } else {
                if (tableCells[i].classList.contains('payout')) {
                    removeTransactionPopup(tableSettings, row);
                    if (tableCells[i].classList.contains('row-chosen')) {
                        cancelTransactionPopup(tableSettings, row);
                    } else {
                        tableCells[i].classList.toggle('row-chosen');
                    }
                    tableCells[i].title = localization.translateMessage('CancelTranslation');
                }
            }
        }
    }

    function generateTableRows(tableSettings) {

        let colsCount = getCountOfAllColumns(tableSettings);
        let tbody = getTableBodyElement(tableSettings);

        for (let row = 0; row < tableSettings.tableData.length; row++) {
            let rowId = Math.round(Math.random() * Number.MAX_SAFE_INTEGER);
            while (rows.includes(rowId)) {
                rowId = Math.round(Math.random() * Number.MAX_SAFE_INTEGER);
            }
            rows.push(rowId);
            let cell = document.createElement('div');
            cell.innerHTML = '';
            cell.classList.add('cell');
            cell.classList.add('cell-flag');
            cell.classList.add(`row-${rowId}`);
            cell.classList.add(`row-flag-${tableSettings.tableDataItems[row].Properties.FlagList[0]}`);
            if (tableSettings.tableDataItems[row].Properties.IsPayoutPossible) {
                cell.classList.add('payout');
            }
            tbody.appendChild(cell);

            let tooltipErrorCode = tableSettings.tableDataItems[row].Properties.ErrorCode;

            for (let col = 0; col < colsCount; col++) {
                let cell = document.createElement('div');
                cell.innerHTML = tableSettings.formatedData[row][Object.keys(tableSettings.formatedData[row])[col]];
                let cellClassName = generateCellClassName(tableSettings.formatedData, col);
                cell.className = 'cell ' + cellClassName;
                if (col === 0) {
                    cell.classList.add('first');
                    cell.classList.add('cell');
                }
                cell.classList.add(`row-${rowId}`);
                cell.classList.add(`row-flag-${tableSettings.tableDataItems[row].Properties.FlagList[0]}`);
                if (tableSettings.tableDataItems[row].Properties.IsPayoutPossible) {
                    cell.classList.add('payout');
                }
                if (tableSettings.stickyColumn === true && col === 1) {
                    cell.classList.add('sticky');
                }
                cell.addEventListener('mouseover', function () {
                    hoverRow(`row-${rowId}`, true);
                }, { passive: false });
                cell.addEventListener('mouseout', function () {
                    hoverRow(`row-${rowId}`, false);
                }, { passive: false });
                cell.addEventListener('click', function () {
                    currentOffset = cell.getClientRects()[0];
                    selectRow(tableSettings, `row-${rowId}`);
                });
                if (col === colsCount - 1) {
                    cell.classList.add('last-cell')
                }
                tbody.appendChild(cell);
            }
            let cancelCell = document.createElement('div');
            cancelCell.innerHTML = '';
            cancelCell.classList.add('cell');
            cancelCell.classList.add('cell-cancel');
            cancelCell.classList.add(`row-${rowId}`);
            cancelCell.classList.add(`row-flag-${tableSettings.tableDataItems[row].Properties.FlagList[0]}`);
            if (tableSettings.tableDataItems[row].Properties.IsPayoutPossible) {
                cancelCell.classList.add('payout');
            }
            tbody.appendChild(cancelCell);
        }
        styleColsRows(tableSettings.formatedData, colsCount, tbody);
    }

    /*--------------------------------------------------------------------------------------*/


    /*-------------------------------------- PAGINATION ---------------------------------------*/


    function hidePagination(tableSettings) {
        let paginationElement = tableSettings.tableContainerElement.getElementsByClassName('pagination')[0];
        paginationElement.classList.add('hidden');
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
        } else return;
    }

    on('table/pagination/display', function (params) {
        let paginationElement = params.element;
        let tableSettings = params.params.tableSettings;
        let tableBodyElement = getTableBodyElement(tableSettings);
        insertAfter(tableBodyElement, paginationElement);
        bindPaginationLinkHandlers(tableSettings);
    });

    function updateTablePagination(tableSettings) {
        let paginationElement = tableSettings.tableContainerElement.getElementsByClassName('pagination')[0];
        paginationElement.classList.remove('hidden');
        let activePage = tableSettings.activePage !== undefined ? tableSettings.activePage : 1;
        activePage = parseInt(activePage);
        let pageSize = tableSettings.filters && tableSettings.filters.BasicData && tableSettings.filters.BasicData.PageSize !== undefined ? tableSettings.filters.BasicData.PageSize : 50;
        pageSize = parseInt(pageSize);
        let numOfItems = tableSettings.NumOfItems !== undefined ? tableSettings.NumOfItems : 50;
        numOfItems = parseInt(numOfItems);
        let lastPage = Math.ceil(numOfItems / pageSize);

        // let rowNumber = 1; //todo

        if (lastPage === 1 /*|| tableSettings.tableData.length < pageSize*/) {
            hidePagination(tableSettings);
        } else {
            let paginationFirstPage = tableSettings.tableContainerElement.getElementsByClassName('pagination-first-page')[0];
            let paginationPreviousPage = tableSettings.tableContainerElement.getElementsByClassName('pagination-previous-page')[0];
            let paginationNextPage = tableSettings.tableContainerElement.getElementsByClassName('pagination-next-page')[0];
            let paginationLastPage = tableSettings.tableContainerElement.getElementsByClassName('pagination-last-page')[0];

            /*            let paginationRowNumber = tableSettings.tableContainerElement.getElementsByClassName('pagination-row-number')[0];
                        paginationRowNumber.innerHTML = rowNumber.toString();
                        paginationRowNumber.value = rowNumber.toString();*/ //todo

            paginationFirstPage.dataset.page = '1';
            if (activePage - 1 > 0) {
                let previousPage = activePage - 1;
                paginationPreviousPage.dataset.page = previousPage.toString();
            } else {
                paginationPreviousPage.dataset.page = '1';
            }

            if (activePage !== lastPage) {
                let nextPage = activePage + 1;
                paginationNextPage.dataset.page = nextPage.toString();
            } else {
                paginationNextPage.dataset.page = lastPage.toString();
            }

            paginationLastPage.dataset.page = lastPage.toString();

            let paginationArray = [];

            if (lastPage >= 3) {
                if (activePage === lastPage) {
                    paginationArray = [activePage - 2, activePage - 1, activePage];
                } else if (activePage === 1) {
                    paginationArray = [activePage, activePage + 1, activePage + 2];
                } else {
                    paginationArray = [activePage - 1, activePage, activePage + 1];
                }
            } else if (lastPage === 2) {
                paginationArray = ['1', '2'];
            } else {
                paginationArray = ['1'];
            }

            let paginationButtons = tableSettings.tableContainerElement.getElementsByClassName('element-pagination-page-button');

            for (let i = 0; i < paginationButtons.length; i++) {
                paginationButtons[i].classList.remove('active');
            }

            for (let i = 0; i < paginationButtons.length; i++) {
                paginationButtons[i].dataset.page = paginationArray[i];
                paginationButtons[i].innerHTML = paginationArray[i];
                if (paginationButtons[i].innerHTML === activePage.toString()) {
                    paginationButtons[i].classList.add('active');
                } else if (paginationArray[i] === undefined) {
                    paginationButtons[i].classList.add('hidden');
                }
            }
        }
    }

    function resetPaginationActiveButtons(tableSettings) {
        let paginationButtons = Array.prototype.slice.call(tableSettings.tableContainerElement.getElementsByClassName('element-pagination-page-button'));
        paginationButtons.forEach(function (paginationButton) {
            paginationButton.classList.remove('active');
        });
    }

    /*--------------------------------------------------------------------------------------*/


    /*-------------------------- PAGINATION LINK CLICK HANDLERS ---------------------------*/

    function handleLinkClick(e, tableSettings) {
        e.preventDefault();
        resetPaginationActiveButtons(tableSettings);
        e.target.classList.add('active');
        tableSettings.activePage = e.target.dataset.page;

        let moduleName = tableSettings.pageSelectorId.replace('#page-', '');
        trigger(moduleName + '/filters/pagination', { tableSettings: tableSettings });
    }

    function bindPaginationLinkHandler(element, tableSettings) {
        element.removeEventListener('click', function (e, tableSettings) {
            handleLinkClick(e, tableSettings);
        });
        element.addEventListener('click', function (e) {
            handleLinkClick(e, tableSettings);
        });
    }

    function bindPaginationLinkHandlers(tableSettings) {
        let paginationElements = $$('.element-pagination-link');
        for (let i = 0; i < paginationElements.length; i++) {
            let paginationElement = paginationElements[i];
            bindPaginationLinkHandler(paginationElement, tableSettings);
        }
    }

    /*--------------------------------------------------------------------------------------*/


    /*---------------------------CONDENSED / EXPANDED TABLE VIEW----------------------------*/

    function resetTableView(tableSettings) {
        tableSettings.tableContainerElement.classList.remove('table-condensed');
        tableSettings.tableContainerElement.classList.remove('table-expanded');
        $$(tableSettings.pageSelectorId).getElementsByClassName('show-table-condensed')[0].classList.remove('show-space-active');
        $$(tableSettings.pageSelectorId).getElementsByClassName('show-table-expanded')[0].classList.remove('show-space-active');
    }

    function showNormalTable(tableSettings) {
        resetTableView(tableSettings);
        $$(tableSettings.pageSelectorId).getElementsByClassName('show-table-expanded')[0].classList.add('show-space-active');
        tableSettings.tableContainerElement.classList.add('table-expanded');
    }

    function bindTableViewLinkHandlers(tableSettings) {
        let tableCondensedButton = $$(tableSettings.pageSelectorId).getElementsByClassName('show-table-condensed')[0];
        let tableThickButton = $$(tableSettings.pageSelectorId).getElementsByClassName('show-table-expanded')[0];

        tableCondensedButton.addEventListener('click', function () {
            resetTableView(tableSettings);
            tableSettings.tableContainerElement.classList.add('table-condensed');
            tableCondensedButton.classList.add('show-space-active');
        });
        tableThickButton.addEventListener('click', function () {
            resetTableView(tableSettings);
            tableSettings.tableContainerElement.classList.add('table-expanded');
            tableThickButton.classList.add('show-space-active');
        });
    }

    /*---------------------------------- UPDATING TABLE -----------------------------------*/

    function updateTable(tableSettings) {
        removeTransactionPopup();
        removeCancelButtons();
        let colsCount = getCountOfAllColumns(tableSettings);
        generateTableHeaders(tableSettings);
        generateTableRows(tableSettings);
        setSortingHeader(tableSettings);
        if (tableSettings.ColumnsToShow) {
            showSelectedColumns(tableSettings, tableSettings.ColumnsToShow);
        }
        if (colsCount !== 0 && colsCount !== undefined) {
            updateTablePagination(tableSettings);
            bindSortingLinkHandlers(tableSettings);
            bindTableViewLinkHandlers(tableSettings);
            if (tableSettings.defaultSortColumnSet === false) {
                setDefaultActiveColumn(tableSettings);
            }
        } else {
            hidePagination(tableSettings);
            let noDataElement = document.createElement('div');
            noDataElement.classList.add('empty-table');
            noDataElement.innerText = 'No data to display...';
            let tbody = getTableBodyElement(tableSettings);
            while (tbody.firstChild) {
                tbody.removeChild(tbody.firstChild);
            }
            tbody.appendChild(noDataElement);
        }
    }

    function initFilters(tableSettings) {
        let moduleName = tableSettings.pageSelectorId.replace('#page-', '');
        trigger(moduleName + '/filters/init', { tableSettings: tableSettings });
    }

    on('table/update', function (params) {

        let tableSettings = params.settingsObject;
        let tableData = [];
        let tableDataItems = [];
        let apiItems = params.data.Data.Items;

        apiItems.forEach(function (item) {
            tableData.push(item.EntryData);
            tableDataItems.push(item);
        });

        tableSettings.tableData = tableData;
        tableSettings.tableDataItems = tableDataItems;
        tableSettings.NumOfItems = params.data.Data.NumOfItems;
        if (tableSettings.filtersInitialized === undefined || tableSettings.filtersInitialized === false) {
            initFilters(tableSettings);
            showNormalTable(tableSettings);
        }
        updateTable(tableSettings);
    });

    function initTable(tableSettings) {
        let data = { EndpointId: tableSettings.endpointId };
        tableSettings.defaultSortColumnSet = false;

        trigger(tableSettings.dataEvent, {
            data: data,
            tableSettings: tableSettings
        });
    }

    /*--------------------------------------------------------------------------------------*/


    /*-------------------------------------- PAGE SIZE -------------------------------------*/

    function generatePageSizeDropdown(tableSettings) {
        let pageSizeElement = $$(tableSettings.pageSelectorId).getElementsByClassName('page-size')[0];
        dropdown.generate(machinesNumber, pageSizeElement);
        bindPageSizeLinkHandlers(tableSettings);
    }

    function getPageSize(tableSettings) {
        let pageSizeElement = $$(tableSettings.pageSelectorId).getElementsByClassName('page-size')[0];
        if (pageSizeElement !== undefined && pageSizeElement !== null) {
            let choosenOption = pageSizeElement.getElementsByClassName('element-table-filters')[0];
            let pageSizeValue = choosenOption.dataset.value;
            pageSizeValue = parseInt(pageSizeValue, 10);
            tableSettings.PageSize = pageSizeValue;
            return pageSizeValue;
        }
    }

    function handlePageSizeLinkClick(e, tableSettings) {
        e.preventDefault();
        let moduleName = tableSettings.pageSelectorId.replace('#page-', '');
        trigger(moduleName + '/filters/pageSize', { tableSettings: tableSettings });
    }

    function bindPageSizeLinkHandler(element, tableSettings) {
        element.removeEventListener('click', function (e, tableSettings) {
            handlePageSizeLinkClick(e, tableSettings);
        });
        element.addEventListener('click', function (e) {
            handlePageSizeLinkClick(e, tableSettings);
        });
    }

    function bindPageSizeLinkHandlers(tableSettings) {
        let pageSizeButton = $$(tableSettings.pageSelectorId).getElementsByClassName('page-size')[0];
        if (pageSizeButton !== undefined && pageSizeButton !== null) {
            let pageSizeOptions = pageSizeButton.getElementsByClassName('single-option');
            for (let i = 0; i < pageSizeOptions.length; i++) {
                bindPageSizeLinkHandler(pageSizeOptions[i], tableSettings);
            }
        }
    }

    /*--------------------------------------------------------------------------------------*/


    /*-------------------------------------- SORTING --------------------------------------*/

    function getHeaders(tableSettings) {
        return tableSettings.tableContainerElement.getElementsByClassName('head');
    }

    function getActiveColumn(tableSettings) {
        return tableSettings.tableContainerElement.getElementsByClassName('sort-active')[0];
    }

    function setDefaultActiveColumn(tableSettings) {
        tableSettings.defaultSortColumnSet = true;
        let sortActiveColumnElements = tableSettings.tableContainerElement.getElementsByClassName('cell-' + tableSettings.sortActiveColumn);
        for (let i = 0; i < sortActiveColumnElements.length; i++) {
            if (sortActiveColumnElements[i].classList.contains('head')) {
                sortActiveColumnElements[i].classList.add('sort-active');
                sortActiveColumnElements[i].classList.add('sort-desc');
                sortActiveColumnElements[i].dataset.direction = sortingDataAtt.descending;
            }
            sortActiveColumnElements[i].classList.add('active-column');
        }
    }

    function makeColumnActiveFromHeader(header, tableSettings) {
        let headers = getHeaders(tableSettings);
        for (let i = 0; i < headers.length; i++) {
            if (headers[i] !== header) {
                headers[i].classList.remove('sort-active');
                headers[i].classList.remove('sort-asc');
                headers[i].classList.remove('sort-desc');
                headers[i].classList.remove('active-column');
                delete headers[i].dataset.direction;
            }
        }
        if (header !== undefined) {
            header.classList.add('sort-active');
            header.classList.add('active-column');
            toggleDirection(header, tableSettings);

            let tableCells = tableSettings.tableContainerElement.getElementsByClassName('cell');
            Array.prototype.slice.call(tableCells).forEach(function (cell) {
                cell.classList.remove('active-column')
            });

            let columnName = getColumnNameFromHeadElement(tableSettings, header);
            let columnElements = tableSettings.tableContainerElement.getElementsByClassName(columnName);
            for (let j = 0; j < columnElements.length; j++) {
                columnElements[j].classList.add('active-column');
            }
        }
    }

    function toggleDirection(header) {
        if (!header.classList.contains(sortingClass.ascending) && !header.classList.contains(sortingClass.descending) && !header.dataset.direction) {
            header.classList.add(sortingClass.ascending);
            header.dataset.direction = sortingDataAtt.ascending;
        } else if (header.classList.contains(sortingClass.descending)) {
            header.classList.remove(sortingClass.descending);
            header.classList.add(sortingClass.ascending);
            header.dataset.direction = sortingDataAtt.ascending;
        } else {
            header.classList.remove(sortingClass.ascending);
            header.classList.add(sortingClass.descending);
            header.dataset.direction = sortingDataAtt.descending;
        }
    }

    function getSorting(tableSettings) {
        tableSettings.sort = {
            SortOrder: '',
            SortName: ''
        };
        let activeHeader = getActiveColumn(tableSettings);
        if (activeHeader !== undefined) {
            tableSettings.sort.SortName = activeHeader.dataset.sortName;
            if (activeHeader.dataset.direction === sortingDataAtt.ascending) {
                tableSettings.sort.SortOrder = sortingType.ascending;
            } else if (activeHeader.dataset.direction === sortingDataAtt.descending) {
                tableSettings.sort.SortOrder = sortingType.descending;
            }
        } else {
            tableSettings.sort.SortName = null;
            tableSettings.sort.SortOrder = null;
        }
        return tableSettings.sort;
    }

    function getHeadElementBySortName(tableSettings, sortName) {
        let cellName = 'cell-' + sortName;
        return tableSettings.tableContainerElement.getElementsByClassName(cellName)[0];
    }

    function setSortingHeader(tableSettings) {
        if (tableSettings.sort) {
            let sortName = tableSettings.sort.SortName;
            let sortOrder = tableSettings.sort.SortOrder;
            if (sortName !== null && sortName !== undefined) {
                let activeHeadElement = getHeadElementBySortName(tableSettings, sortName);
                if (activeHeadElement !== undefined) {
                    makeColumnActiveFromHeader(activeHeadElement, tableSettings);
                    activeHeadElement.classList.add('sort-' + sortOrderEnum[sortOrder]);
                }
            }
        }
    }

    function setSortActiveColumn(tableSettings) {
        let headers = getHeaders(tableSettings);
        for (let header of headers) {
            if (header.classList.contains('cell-' + tableSettings.sortActiveColumn)) {
                makeColumnActiveFromHeader(header);
            }
        }
    }

    function removeFlagClass(columnElement) {
        let flagClassRegExp = /(row-flag-\d+) ?/;
        let columnElementClasses = columnElement.className;
        if (flagClassRegExp.exec(columnElementClasses) !== null) {
            let flagClass = flagClassRegExp.exec(columnElementClasses)[1];
            columnElement.classList.remove(flagClass);
        }
    }

    /*--------------------------------------------------------------------------------------*/


    /*--------------------------- SORTING LINK CLICK HANDLERS ----------------------------*/


    function handleSortingLinkClick(e, tableSettings) {
        e.preventDefault();
        makeColumnActiveFromHeader(e.target, tableSettings);
        let moduleName = tableSettings.pageSelectorId.replace('#page-', '');
        let sorting = getSorting(tableSettings);
        trigger(moduleName + '/filters/sorting', { tableSettings: tableSettings, sorting: sorting });
    }

    function bindSortingLinkHandler(element, tableSettings) {
        element.removeEventListener('click', function (e, tableSettings) {
            handleSortingLinkClick(e, tableSettings);
        });
        element.addEventListener('click', function (e) {
            handleSortingLinkClick(e, tableSettings);
        });
    }

    function bindSortingLinkHandlers(tableSettings) {
        let headElements = getHeaders(tableSettings);
        for (let i = 0; i < headElements.length; i++) {
            let headElement = headElements[i];
            bindSortingLinkHandler(headElement, tableSettings);
        }
    }

    /*--------------------------------------------------------------------------------------*/


    /*------------------------------- SHOWING/HIDING COLUMNS -------------------------------*/

    function getColumnNameFromHeadElement(tableSettings, headElement) {
        let classList = headElement.classList;
        let cellClassName;
        for (let i = 0; i < classList.length; i++) {
            if (classList[i].includes('cell-')) {
                cellClassName = classList[i];
            }
        }
        return cellClassName;
    }

    function getColumnNames(tableSettings) {
        let headers = getHeaders(tableSettings);
        let columnNames = [];
        for (let i = 0; i < headers.length; i++) {
            columnNames.push(getColumnNameFromHeadElement(tableSettings, headers[i]));
        }
        return columnNames;
    }

    function showColumn(tableSettings, columnName) {
        let columnElements = tableSettings.tableContainerElement.getElementsByClassName(columnName);
        let columnElementsArray = Array.prototype.slice.call(columnElements);
        columnElementsArray.forEach(function (columnElement) {
            columnElement.classList.remove('hidden-column');
        });


    }

    function getColsToShowNames(columnsToShowTitles) {
        let columnsToShow = [];
        if (columnsToShow !== undefined) {
            columnsToShowTitles.forEach(function (columnTitle) {
                columnsToShow.push('cell-' + columnTitle.toLowerCase());
            });
        }
        return columnsToShow;
    }

    function hideAllColumns(tableSettings) {
        let allCells = tableSettings.tableContainerElement.getElementsByClassName('cell');
        for (let i = 0; i < allCells.length; i++) {
            allCells[i].classList.add('hidden-column');
        }
    }

    function showSelectedColumns(tableSettings, columnsToShowTitles) {

        hideAllColumns(tableSettings);
        let tbodyElement = tableSettings.tableContainerElement.getElementsByClassName('tbody')[0];
        let colsCount;

        if (columnsToShowTitles === null || columnsToShowTitles === undefined || columnsToShowTitles.length === 0) {
            let allColumns = getColumnNames(tableSettings);
            colsCount = allColumns.length;
            showColumn(tableSettings, 'cell-flag');
            showColumn(tableSettings, 'cell-cancel');
            allColumns.forEach(function (column) {
                showColumn(tableSettings, column);
            });
        } else {
            let columnsToShow = getColsToShowNames(columnsToShowTitles);
            colsCount = columnsToShow.length;
            showColumn(tableSettings, 'cell-flag');
            showColumn(tableSettings, 'cell-cancel');
            columnsToShow.forEach(function (column) {
                showColumn(tableSettings, column);
            });
        }
        styleColsRows(tableSettings, colsCount, tbodyElement);
    }

    /*--------------------------------------------------------------------------------------*/


    /*------------------------------------ FILTERING ------------------------------------*/

    function collectAllFilterContainers(tableSettings) {
        let filterElements;
        if (tableSettings.pageSelectorId !== undefined) {
            filterElements = $$(tableSettings.pageSelectorId).getElementsByClassName('select-container');
        } else if (tableSettings.filterContainerSelector !== undefined) {
            filterElements = $$(tableSettings.filterContainerSelector).getElementsByClassName('select-container');
        } else {
            filterElements = $$(tableSettings.tableContainerElement.getElementsByClassName('select-container'));
        }
        return filterElements;
    }

    function collectFiltersFromPage(tableSettings) {
        tableSettings.filters = {};
        let filterContainers = collectAllFilterContainers(tableSettings);

        let filters = Array.prototype.slice.apply(filterContainers).reduce(function (accumulated, element) {
            let name = element.dataset.name;
            let filterElement = element.getElementsByClassName('element-table-filters')[0];
            accumulated[name] = filterElement.dataset.value !== '-' ? filterElement.dataset.value.split(',') : null;
            return accumulated;
        }, {});
        if (filters.Columns === null) {
            filters.Columns = [];
        }
        return filters;
    }

    /*--------------------------------------------------------------------------------------*/

    /*--------------------------------- INITIALIZING TABLE ---------------------------------*/

    function init(tableSettings) {

        tableSettings.tableContainerElement = $$(tableSettings.tableContainerSelector);
        let tableContainerElement = tableSettings.tableContainerElement;
        tableContainerElement.tableSettings = tableSettings;

        tableSettings.PageSize = 50;

        if (tableSettings.dataEvent !== null) {
            tableSettings.dataEvent = getEvent(tableSettings);
        }

        generateTablePagination(tableSettings);
        generatePageSizeDropdown(tableSettings);
        tableSettings.activePage = 1;
        delete tableSettings.ColumnsToShow;

        if (tableSettings.tableData === undefined) {
            // generateTableHeaders(tableSettings);
            initTable(tableSettings);
        } else {
            updateTable(tableSettings);
        }
    }

    return {
        init: init,
        getColNamesOfDisplayedTable: getColNamesOfDisplayedTable,
        collectFiltersFromPage: collectFiltersFromPage,
        getSorting: getSorting,
        getPageSize: getPageSize,
        removeTransactionPopup: removeTransactionPopup
    };

    /*--------------------------------------------------------------------------------------*/

})();