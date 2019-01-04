let table = (function () {

    let columnClassPrefix = 'column-';
    let rowClassPrefix = 'row-';
    let cellClassPrefix = 'cell-';
    let activeColumnElementsClass = 'active-column';
    let activeRowElementsClass = 'row-chosen';
    let rows = [];

    // 'null' as dataset values are always converted to string
    const nullFilterValues = ['-',null,'null'];

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
            colNames.push({Name: element.innerText.replace(' ', '')})
        });
        colNames.unshift({Name: "-"});
        return colNames;
    }

    function getCountOfAllColumns(tableSettings) {
        let colsCount = 0;
        let tbody = getTableBodyElement(tableSettings);

        let headElements = tbody.getElementsByClassName('head');

        if (headElements !== undefined && headElements !== null && headElements.length > 0) {
            colsCount = headElements.length;
        } else if (tableSettings.tableData !== undefined || tableSettings.tableData.length !== 0) {
            colsCount = Object.keys(tableSettings.tableData[0].rowData).length;

        }
        return colsCount;
    }

    function getColsCount(tableSettings) {
        let colsCount;
        if (tableSettings.ColumnsToShow === undefined || tableSettings.ColumnsToShow === null || tableSettings.ColumnsToShow.length === 0) {
            colsCount = getCountOfAllColumns(tableSettings);
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

    function getHeaders(tableSettings) {
        return tableSettings.tableContainerElement.getElementsByClassName('head');
    }

    function hasHeaders(tableSettings) {
        return tableSettings.tableContainerElement.getElementsByClassName('head').length > 0;
    }

    function generateTableHeaders(tableSettings) {
        let colsCount = getCountOfAllColumns(tableSettings);
        let headers = hasHeaders(tableSettings);

        let tbody = getTableBodyElement(tableSettings);
        if (!headers || tableSettings.forceRemoveHeaders === true) {
            if (tbody !== null && tbody !== undefined) {
                tbody.parentNode.removeChild(tbody);
            }
            tbody = document.createElement('div');
            tbody.className = 'tbody';

            let columnNames = Object.keys(tableSettings.tableData[0].rowData);

            for (let col = 0; col < colsCount; col++) {
                let head = document.createElement('div');
                //head.innerHTML = makeColumnTitle(Object.keys(tableSettings.formatedData[0])[col]);
                head.innerHTML = localization.translateMessage(columnNames[col], head);
                head.className = 'head cell';
                let columnName = columnNames[col].toLowerCase();
                columnName = columnName.replace(/ /g, '-');
                head.dataset.sortName = columnName;
                head.classList.add('text-uppercase');
                head.classList.add(columnClassPrefix + columnName);

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

            let filterContainerElement = tableSettings.tableContainerElement.getElementsByClassName('element-table-filters-container')[0];
            insertAfter(filterContainerElement, tbody);
        } else {
            setTableDimensions(tableSettings, colsCount, tbody);
        }
    }

    function generateTableRows(tableSettings) {
        let colsCount = getCountOfAllColumns(tableSettings);
        let tbody = getTableBodyElement(tableSettings);
        let tableItems = tbody.getElementsByClassName('table-item');
        //remove displayed rows
        if (tableItems !== undefined && tableItems != null) {
            while (tableItems.length > 0) {
                let item = tableItems[0];
                item.parentNode.removeChild(item);
            }
        }

        let rowsCount = tableSettings.tableData.length;

        for (let row = 0; row < rowsCount; row++) {
            let rowId = Math.round(Math.random() * Number.MAX_SAFE_INTEGER);
            while (rows.includes(rowId)) {
                rowId = Math.round(Math.random() * Number.MAX_SAFE_INTEGER);
            }

            //let tooltipErrorCode = tableSettings.tableDataItems[row].Properties.ErrorCode;

            let rowKeys = Object.keys(tableSettings.tableData[row].rowData);

            for (let col = 0; col < colsCount; col++) {
                let cell = document.createElement('div');
                let rowData = tableSettings.tableData[row].rowData;
                let dataKey = rowKeys[col];

                let cellContent = rowData[dataKey];

                //handle case if cellContent is html element
                if (isElement(cellContent) || isNode(cellContent)) {
                    cell.appendChild(cellContent);
                } else {
                    cell.innerHTML = cellContent;
                }

                let cellColumnClass = generateCellClassName(dataKey);

                cell.classList.add('cell');
                cell.classList.add('table-item');
                cell.classList.add(rowClassPrefix + rowId);
                cell.classList.add(cellColumnClass);
                //ToDo: Document this
                if (dataKey === 'actions') {
                    cell.classList.add('table-actions-column');
                }

                let headers = getHeaders(tableSettings);
                let header = headers[col];
                if (!header.classList.contains(cellColumnClass)) {
                    header.classList.add(cellColumnClass);
                }

                //ToDo: test if 0 or 1
                if (tableSettings.stickyColumn === true && col === 1) {
                    cell.classList.add('sticky');
                }
                if (tableSettings.onHoverRow === undefined) {
                    cell.addEventListener('mouseover', function () {
                        hoverRow(rowClassPrefix + rowId, true);
                    }, {passive: false});
                }

                cell.addEventListener('mouseout', function () {
                    hoverRow(rowClassPrefix + rowId, false);
                }, {passive: false});

                //There are 3 callbacks - before click on cell,after click on cell and override for click on cell

                cell.addEventListener('click', function () {
                    //check if there's on beforeCellClick handler
                    if (tableSettings.onBeforeCellClick !== undefined) {
                        tableSettings.onBeforeCellClick(dataKey, cellContent, cell, col, tableSettings.tableData[row], rowId, cellColumnClass, tableSettings)
                    }
                    currentOffset = cell.getClientRects()[0];
                    //check if there's custom on cell click hadler
                    if (tableSettings.onCellClick === undefined) {
                        selectRow(tableSettings, rowClassPrefix + rowId);
                    } else {
                        tableSettings.onCellClick(dataKey, cellContent, cell, col, tableSettings.tableData[row], rowId, cellColumnClass, tableSettings);

                    }
                    if (tableSettings.onAfterCellClick !== undefined) {
                        tableSettings.onAfterCellClick(dataKey, cellContent, cell, col, tableSettings.tableData[row], rowId, cellColumnClass, tableSettings);
                    }
                });

                tbody.appendChild(cell);

                //parameters:
                // column - name of the property/column
                // cellContent - formatted data
                // cell - cell html element
                // position - position of the column from the left border of the table (0,1,2...)
                // row data - remote row data
                if (tableSettings.onDrawRowCell !== null) {
                    if (isFunction(tableSettings.onDrawRowCell)) {
                        tableSettings.onDrawRowCell(dataKey, cellContent, cell, col, tableSettings.tableData[row]);
                    } else if (isString(tableSettings.onDrawRowCell)) {
                        trigger(tableSettings.onDrawRowCell, {
                            key: dataKey,
                            value: cellContent,
                            element: cell,
                            position: col,
                            rowData: tableSettings.tableData[row]
                        })
                    }
                }
            }
        }
        if (rowsCount > 0) {
            //highlight sorted column if there is one
            setSortActiveColumn(tableSettings);
            setTableDimensions(tableSettings, colsCount, tbody);
        }
    }

    function generateCellClassName(propertyName) {
        return columnClassPrefix + propertyName.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
    }

    function hoverRow(elements, highlight = false) {
        for (let element of document.getElementsByClassName(elements)) {
            element.classList[highlight ? "add" : "remove"]('hover');
        }
    }

    function setTableDimensions(tableSettings, colsCount, tbody) {
        tbody.style.gridTemplateColumns = null;
        tbody.style.gridTemplateRows = null;
        //tbody.style.gridTemplateColumns = '25px ' + `repeat(${colsCount}, 1fr)` + '50px';
        let tableSettingsData = tableSettings.tableData;
        if (tableSettingsData !== undefined && tableSettingsData !== null && tableSettingsData.length > 0) {
            tbody.style.gridTemplateRows = `repeat(${tableSettingsData.length}, 1fr)`;
        }
        let headers = getHeaders(tableSettings);
        if (headers !== undefined && headers.length > 0) {
            let style = '';
            for (let i = 0; i < headers.length; i++) {
                let header = headers[i];
                if (!header.classList.contains('hidden')) {
                    if (header.classList.contains('fixed-width')) {
                        style += " " + header.offsetWidth + 'px';
                    } else {
                        style += " 1fr";
                    }
                }
            }
            tbody.style.gridTemplateColumns = style.trim();

        } else {
            tbody.style.gridTemplateColumns = `repeat(${colsCount}, 1fr)`;
        }
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
            removeTransactionPopup();
            //todo dummy data
            trigger('communicate/aft/cancelTransaction', {
                data: {
                    EndpointId: 2,
                    EndpointName: 'name',
                    Gmcid: 123,
                    JidtString: 'string'
                }

            })
        });
    });

    function selectRow(tableSettings, row) {
        let selectedTableRowCells = tableSettings.tableContainerElement.getElementsByClassName(activeRowElementsClass);
        while (selectedTableRowCells.length > 0) {
            selectedTableRowCells[0].classList.remove(activeRowElementsClass);
        }
        console.log(row);
        let newSelectedRowCells = tableSettings.tableContainerElement.getElementsByClassName(row);

        for (let i = 0; i < newSelectedRowCells.length; i++) {
            newSelectedRowCells[i].classList.add(activeRowElementsClass);
        }
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
        trigger(moduleName + '/filters/pagination', {tableSettings: tableSettings});
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

        let colsCount = getCountOfAllColumns(tableSettings);
        generateTableHeaders(tableSettings);
        generateTableRows(tableSettings);

        setSortingHeader(tableSettings);

        if (tableSettings.ColumnsToShow !== undefined && tableSettings.ColumnsToShow !== null && tableSettings.ColumnsToShow.length > 0) {
            showSelectedColumns(tableSettings, tableSettings.ColumnsToShow);
        }
        let itemsCount = tableSettings.tableData === null ? 0 : Object.keys(tableSettings.tableData).length;

        if (itemsCount > 0) {
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
            setTableDimensions(tableSettings, 1, tbody);

        }
    }

    function initFilters(tableSettings) {
        let moduleName = tableSettings.pageSelectorId.replace('#page-', '');
        trigger(moduleName + '/filters/init', {tableSettings: tableSettings});
    }

    on('table/update', function (params) {
        let tableSettings = params.settingsObject;
        tableSettings.NumOfItems = params.data.Data.NumOfItems;
        if (tableSettings.filtersInitialized === undefined || tableSettings.filtersInitialized === false) {
            initFilters(tableSettings);
            showNormalTable(tableSettings);
        }
        updateTable(tableSettings);
    });

    function initTable(tableSettings) {
        let data = {EndpointId: tableSettings.endpointId};
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
        trigger(moduleName + '/filters/pageSize', {tableSettings: tableSettings});
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
        tableSettings.sort = {
            SortOrder: sortingType.descending,
            SortName: tableSettings.sortActiveColumn
        };
        let sortActiveColumnElements = tableSettings.tableContainerElement.getElementsByClassName(columnClassPrefix + tableSettings.sortActiveColumn);
        for (let i = 0; i < sortActiveColumnElements.length; i++) {
            if (sortActiveColumnElements[i].classList.contains('head')) {
                sortActiveColumnElements[i].classList.add('sort-active');
                sortActiveColumnElements[i].classList.add('sort-desc');
                sortActiveColumnElements[i].dataset.direction = sortingDataAtt.descending;
            }
            sortActiveColumnElements[i].classList.add(activeRowElementsClass);
        }
    }

    function makeColumnActiveFromHeader(header, tableSettings) {
        let headers = getHeaders(tableSettings);
        //be sure that there's only one active header
        for (let i = 0; i < headers.length; i++) {
            if (headers[i] !== header) {
                headers[i].classList.remove('sort-active');
                headers[i].classList.remove('sort-asc');
                headers[i].classList.remove('sort-desc');
                headers[i].classList.remove(activeRowElementsClass);
                delete headers[i].dataset.direction;
            }
        }
        if (header !== undefined) {
            header.classList.add('sort-active');
            header.classList.add(activeRowElementsClass);
            toggleDirection(header, tableSettings);

            let columnName = getColumnNameFromHeadElement(tableSettings, header);
            console.log('active column name');
            console.log(columnName);
            let columnElements = tableSettings.tableContainerElement.getElementsByClassName(columnName);
            for (let j = 0; j < columnElements.length; j++) {
                columnElements[j].classList.add(activeRowElementsClass);
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
        let cellName = columnClassPrefix + sortName;
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
            if (header.classList.contains(columnClassPrefix + tableSettings.sortActiveColumn)) {
                makeColumnActiveFromHeader(header, tableSettings);
            }
        }
    }

    /*--------------------------------------------------------------------------------------*/


    /*--------------------------- SORTING LINK CLICK HANDLERS ----------------------------*/
    function handleSortingLinkClick(e) {
        let element = e.target;
        let table = element.parentNode.parentNode;
        let tableSettings = table.tableSettings;
        e.preventDefault();
        deselectActiveColumn(table);

        makeColumnActiveFromHeader(element, tableSettings);
        //set active column class
        //parse to array
        let classes = Array.prototype.slice.call(element.classList, 0);
        let result = classes.filter(function (item, index) {
            return /^column/.test(item);
        });
        tableSettings.sortActiveColumn = result[0].replace(columnClassPrefix, '');
        let moduleName = tableSettings.pageSelectorId.replace('#page-', '');
        let sorting = getSorting(tableSettings);
        trigger(moduleName + '/filters/sorting', {tableSettings: tableSettings, sorting: sorting});
    }

    function bindSortingLinkHandler(element) {
        element.removeEventListener('click', handleSortingLinkClick);
        element.addEventListener('click', handleSortingLinkClick);
    }

    function bindSortingLinkHandlers(tableSettings) {
        let headElements = getHeaders(tableSettings);
        for (let i = 0; i < headElements.length; i++) {
            let headElement = headElements[i];
            bindSortingLinkHandler(headElement);
        }
    }

    /*--------------------------------------------------------------------------------------*/


    /*------------------------------- SHOWING/HIDING COLUMNS -------------------------------*/

    function getColumnNameFromHeadElement(tableSettings, headElement) {
        let classList = headElement.classList;
        let cellClassName;
        for (let i = 0; i < classList.length; i++) {
            if (classList[i].includes(columnClassPrefix)) {
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
        //resize table

    }

    function getColsToShowNames(columnsToShowTitles) {
        let columnsToShow = [];
        if (columnsToShow !== undefined) {
            columnsToShowTitles.forEach(function (columnTitle) {
                columnsToShow.push(columnClassPrefix + columnTitle.toLowerCase());
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
            //ToDo:preraditi
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
        setTableDimensions(tableSettings, colsCount, tbodyElement);
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
            console.log('no selected filter value');
            console.log(filterElement.dataset.value);
            //proveriti s Nikolom ovo
            //accumulated[name] = filterElement.dataset.value !== '-' ? filterElement.dataset.value.split(',') : null;

            accumulated[name] = nullFilterValues.indexOf(filterElement.dataset.value) < 0 ? filterElement.dataset.value.split(',') : null;
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
        tableSettings.tableContainerElement.classList.add('vertex-table');
        let tableContainerElement = tableSettings.tableContainerElement;
        tableContainerElement.tableSettings = tableSettings;

        tableSettings.PageSize = 50;

        if (tableSettings.dataEvent !== null) {
            tableSettings.dataEvent = getEvent(tableSettings);
        }
        //check if all settings argument are set correctly
        if (tableSettings.onBeforeCellClick !== undefined && !isFunction(tableSettings.onBeforeCellClick)) {
            console.error('onBeforeCellClick callback is not a function');
        }
        if (tableSettings.onCellClick !== undefined && !isFunction(tableSettings.onCellClick)) {
            console.error('onCellClick callback is not a function');
        }
        if (tableSettings.onAfterCellClick !== undefined && !isFunction(tableSettings.onAfterCellClick)) {
            console.error('onAfterCellClick callback is not a function');
        }
        generateTablePagination(tableSettings);
        generatePageSizeDropdown(tableSettings);
        tableSettings.activePage = 1;
        delete tableSettings.ColumnsToShow;

        if (tableSettings.tableData === undefined) {
            //generateTableHeaders(tableSettings);
            setTableDimensions(tableSettings, getColsCount(tableSettings), getTableBodyElement(tableSettings));
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
        removeTransactionPopup: removeTransactionPopup,
        parseFilterValues: parseFilterValues
    };

    /*--------------------------------------------------------------------------------------*/


    /*--------------------------------------------HELPER FUNCTIONS-----------------------------------------*/
    function deselectActiveColumn(table) {
        let activeElements = table.getElementsByClassName(activeRowElementsClass);
        while (activeElements.length > 0) {
            activeElements[0].classList.remove(activeRowElementsClass);
        }
    }

    function parseFilterValues(array, nameProperty, valueProperty, nullValue) {
        return array.map(function (elem) {
            let item = {};
            item.name = elem[nameProperty];
            if (nullValue === 'undefined') {
                item.value = elem[valueProperty];
            } else {
                //unsafe comparison needed here as all results from api are handled as string
                if (elem[valueProperty] == nullValue) {
                    item.value = null;
                } else {
                    item.value = elem[valueProperty];
                }
            }
            //hack to avoid conflicts with current dropdowns
            item.parsed = true;
            return item;
        });
    }
})();