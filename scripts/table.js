let table = (function () {

        //html class name constants
        const columnClassPrefix = 'column';
        const rowClassPrefix = 'row-';
        const cellClassPrefix = 'cell-';
        const flagCellClassPrefix = 'row-flag-';
        const exportToButtonsClass = 'element-table-export-to';
        const activeColumnElementsClass = 'active-column';
        const emptyTableElementClass = 'table-element-no-data';
        const activeRowElementsClass = 'row-chosen';
        const hiddenCellClassName = 'hidden';
        const sortOrderClassPrefix = 'table-sort-order-id';
        const defaultPageSize = 50;
        const defaultPage = 1;
        let rows = [];

        // 'null' as dataset values are always converted to string
        const nullFilterValues = ['-', null, 'null'];

        const exportFileTypes = {
            pdf: 'application/pdf'
        }

        const exportTypes = {
            event: 'event',
            url: 'url',
            callback: 'callback'
        };

        const events = {
            saveExportedFile: 'table/export/save-file'
        }

        const sortOrderEnum = {
            none: 0,
            ascending: 1,
            descending: 2
        };

        const sortingClass = {
            ascending: 'sort-asc',
            descending: 'sort-desc'
        };

        const sortDirections = {
            ascending: 'asc',
            descending: 'desc'
        };

        const tableActions = {
            0: createEditMachineAction(),
            1: createCancelTransactionAction(),
            2: createEditJackpotAction(),
            3: createEditMalfunctionAction(),
            4: createEditUserAction(),
            5: createDeleteUserAction()
        };

        //region MODULE EVENTS
        on(events.saveExportedFile, function (params) {
            let data = params.data;
            let blob = new Blob([data], {type: 'application/pdf'});
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'Report.pdf';
            link.click();
        });
        on('table/show-selected-filters/infobar', showSelectedFilters);
        on('table/before-filter', function (params) {
            trigger(params.tableSettings.filterDataEvent, {
                data: params.data,
                tableSettings: params.tableSettings
            });
            trigger('filters/show-selected-filters', {
                active: params.activeFiltersContainer,
                infobar: params.activeFiltersContainer
            });
        });
        on('table/dismiss-popup', function (params) {
            dismissPopup(params.target, params.tableSelector);
        });
        on('table/disable-scroll', function (params) {
            disableScroll(params.tableSelector);
        });
        on('table/enable-scroll', function (params) {
            enableScroll(params.tableSelector);
        });
        on('table/deselect/active-row', function (params) {
            deselectActiveRow(params.tableSettings.tableContainerElement);
        });
        on('table/deselect/hover-row', function (params) {
            deselectHoverRow(params.tableSettings.tableContainerElement);
        });
        //endregion

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

            if (tableSettings.getDataEvent !== undefined) {
                event = tableSettings.getDataEvent;
            } else if (tableSettings.tableContainerElement.dataset.getDataEvent !== undefined) {
                event = tableSettings.tableContainerElement.dataset.getDataEvent;
            } else {
                console.error('getDataEvent Event doesn\'t exist!');
            }
            return event;
        }


        function getTableBodyElement(tableSettings) {
            return tableSettings.tableContainerElement.getElementsByClassName('tbody')[0];
        }

        function getCountOfAllColumns(tableSettings) {
            let colsCount = 0;
            let tbody = getTableBodyElement(tableSettings);

            let headElements = tbody.getElementsByClassName('head');

            if (headElements !== undefined && headElements !== null && headElements.length > 0) {
                colsCount = headElements.length;
            } else if (tableSettings.tableData !== undefined && tableSettings.tableData.length > 0) {
                colsCount = Object.keys(tableSettings.tableData[0].EntryData).length;

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

        function hasHeaders(tableSettings) {
            return tableSettings.tableContainerElement.getElementsByClassName('head').length > 0;
        }

        function generateTableHeaders(tableSettings) {

            let tbody = getTableBodyElement(tableSettings);
            //be sure that tbody is not duplicated
            if (tbody !== null && tbody !== undefined) {
                tbody.parentNode.removeChild(tbody);
            }
            tbody = document.createElement('div');
            tbody.className = 'tbody';

            if (!isEmpty(tableSettings.tableData)) {
                let columnNames = Object.keys(tableSettings.tableData[0].EntryData);
                for (let col = 0; col < columnNames.length; col++) {
                    let cell = createHeaderTableCell(tableSettings.stickyRow);
                    let columnName = columnNames[col];
                    cell.dataset.column = columnName;
                    let cellColumnClass = generateCellClassName(columnName);
                    cell.classList.add(cellColumnClass);

                    if (columnName !== 'FlagList' && columnName !== 'ActionList') {
                        cell.innerHTML = localization.translateMessage(columnName, cell);
                        cell.classList.add('sortable');
                    }
                    tbody.appendChild(cell);
                }

                //ToDo Neske: skloni ovo
                let filterContainerElement = tableSettings.tableContainerElement.getElementsByClassName('element-table-filters-container')[0];
                insertAfter(filterContainerElement, tbody);
                generateTablePagination(tableSettings);
                generatePageSizeDropdown(tableSettings);
                generateNoDataElement(tableSettings);
                bindHandlers(tableSettings);
            } else {
                console.error('could not generate table headers without data');
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

            let visibleColumns = tableSettings.visibleColumns.length > 0 ? tableSettings.visibleColumns : [];
            let visibleColumnsClasses = [];
            if (visibleColumns.length > 0) {
                for (let i = 0; i < visibleColumns.length; i++) {
                    visibleColumnsClasses.push(generateCellClassName(visibleColumns[i]));
                }
            }

            for (let row = 0; row < rowsCount; row++) {
                let rowId = Math.round(Math.random() * Number.MAX_SAFE_INTEGER);

                while (rows.includes(rowId)) {
                    rowId = Math.round(Math.random() * Number.MAX_SAFE_INTEGER);
                }

                let rowData = tableSettings.tableData[row];
                let tempRow = JSON.parse(JSON.stringify(rowData.EntryData));

                //parse data

                //pages containing field: AFT
                if (tempRow.CreatedBy !== undefined) {
                    if (!isEmpty(tempRow.CreatedBy.Time) && !isEmpty(tempRow.CreatedBy.Name)) {
                        tempRow.CreatedBy = createTimeUserCellHTML(formatTimeData(tempRow.CreatedBy.Time), tempRow.CreatedBy.Name);
                    } else {
                        tempRow.CreatedBy = '';
                    }
                }
                //pages containing field: AFT
                if (tempRow.FinishedBy !== undefined) {
                    if (!isEmpty(tempRow.FinishedBy.Time) && !isEmpty(tempRow.FinishedBy.Name)) {
                        tempRow.FinishedBy = createTimeUserCellHTML(formatTimeData(tempRow.FinishedBy.Time), tempRow.FinishedBy.Name);
                    } else {
                        tempRow.FinishedBy = '';
                    }
                }
                //pages containing field: Tickets
                if (tempRow.IssuedBy !== undefined) {
                    if (!isEmpty(tempRow.IssuedBy.Time) && !isEmpty(tempRow.IssuedBy.Name)) {
                        tempRow.IssuedBy = createTimeUserCellHTML(formatTimeData(tempRow.IssuedBy.Time), tempRow.IssuedBy.Name);
                    } else {
                        tempRow.FinishedBy = '';
                    }
                }
                //pages containing field: Tickets
                if (tempRow.RedeemedBy !== undefined) {
                    if (!isEmpty(tempRow.RedeemedBy.Time) && !isEmpty(tempRow.RedeemedBy.Name)) {
                        tempRow.RedeemedBy = createTimeUserCellHTML(formatTimeData(tempRow.RedeemedBy.Time), tempRow.RedeemedBy.Name);
                    } else {
                        tempRow.RedeemedBy = '';
                    }
                }

                //pages containing field: AFT,Malfunctions
                if (tempRow.FlagList !== undefined) {
                    let flagElement = document.createElement('div');
                    flagElement.classList.add('flag-element');
                    flagElement.classList.add(`flag-${tempRow.FlagList[0]}`);
                    tempRow.FlagList = flagElement.outerHTML;
                }
                //pages containing field: Malfunctions,Users,AFT
                if (tempRow.ActionList !== undefined) {
                    let cellHTML = '';
                    for (let i = 0; i < tempRow.ActionList.length; i++) {
                        cellHTML += tableActions[tempRow.ActionList[i]].outerHTML;
                    }
                    tempRow.ActionList = cellHTML;
                }

                //pages containing field: Tickets,AFT
                if (tempRow.Status !== undefined) {
                    tempRow.Status = localization.translateMessage(tempRow.Status);
                }
                //pages containing field: Tickets
                if (tempRow.TicketType !== undefined) {
                    tempRow.TicketType = localization.translateMessage(tempRow.TicketType);
                }
                //pages containing field: AFT,Malfunctions
                if (tempRow.Type !== undefined) {
                    tempRow.Type = localization.translateMessage(tempRow.Type);
                }
                //pages containing field: Malfunctions
                if (tempRow.Priority !== undefined) {
                    tempRow.Priority = localization.translateMessage(tempRow.Priority);
                }

                let columnIndex = 0;
                for (let column in tempRow) {
                    // noinspection JSUnfilteredForInLoop
                    let cellColumnClass = generateCellClassName(column);
                    let cell = createBodyTableCellElement(rowId, column, tableSettings, rowData);
                    //add column number class
                    cell.classList.add(`table-column-${columnIndex + 1}`);

                    let cellData = tempRow[column];
                    //set cell to be clickable if criteria are met
                    if (
                        !isEmpty(rowData.Properties.IsPayoutPossible) && rowData.Properties.IsPayoutPossible //aft
                    ) {
                        cell.classList.add('clickable');
                    }

                    if (Number.isInteger(cellData)) {
                        cell.innerHTML = formatFloatValue(cellData);
                    } else {
                        cell.innerHTML = cellData;
                        //ToDo: if language will be changed from within the application, there are attributes that needs to be set up on cell element using following function
                        //cell.innerHTML = localization.translateMessage(cellData,cell);
                    }

                    //ToDo neske: proveri jel je neophodno
                    if (tableSettings.columns.indexOf(column) < 0) {
                        tableSettings.columns.push({
                            column
                        });
                    }

                    //hide hidden columns
                    let headers = getHeaders(tableSettings);
                    let header = headers[columnIndex];
                    if (header.dataset.alwaysVisible === undefined || header.dataset.alwaysVisible === false) {
                        if (visibleColumnsClasses.length > 0) {
                            if (visibleColumnsClasses.indexOf(cellColumnClass) > -1) {
                                cell.classList.remove(hiddenCellClassName);
                                header.classList.remove(hiddenCellClassName);
                            } else {
                                cell.classList.add(hiddenCellClassName);
                                header.classList.add(hiddenCellClassName);
                            }
                        } else {
                            cell.classList.remove(hiddenCellClassName);
                            header.classList.remove(hiddenCellClassName);
                        }
                    }

                    //set first column sticky if needed
                    if (tableSettings.stickyColumn === true && columnIndex === 0) {
                        cell.classList.add('sticky');
                    }
                    columnIndex++;
                    tbody.appendChild(cell);
                }
            }
            if (rowsCount > 0) {
                //highlight sorted column if there is one
                markActiveColumnRows(tableSettings);
                updateTablePagination(tableSettings);
                //highlight after response from API is received
                deselectActiveColumn(tableSettings);
                highlightSortedColumn(tableSettings);
                tbody.classList.remove('d-hide');
                tableSettings.noDataElement.classList.add('d-hide');
                setTableDimensions(tableSettings, colsCount, tbody);
            } else {
                hidePagination(tableSettings);
                tableSettings.noDataElement.classList.remove('d-hide');
                tbody.classList.add('d-hide');
                setTableDimensions(tableSettings, 1, tbody);
            }
            return tbody;
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

        function generateHeadersOrderClasses(tableSettings) {
            let headers = getHeaders(tableSettings);
            for (let i = 0; i < headers.length; i++) {
                let header = headers[i];
                if (header.dataset.sortId !== undefined && header.dataset.sortId !== null
                    && header.dataset.sortId !== '') {
                    header.classList.add(`${sortOrderClassPrefix}-${header.dataset.sortId}`)
                }
            }
        }

        function highlightSortedColumn(tableSettings) {
            let activeHeader = getSortedHeaderByAPIdata(tableSettings);
            if (activeHeader !== undefined && activeHeader !== null) {
                activeHeader.classList.add(activeColumnElementsClass);
                setSortDirectionOnHeader(activeHeader, tableSettings.sort.sortDirection);
                let columnClass = getColumnNameFromHeadElement(activeHeader);
                let columnElements = tableSettings.tableContainerElement.getElementsByClassName(columnClass);
                for (let i = 0; i < columnElements.length; i++) {
                    columnElements[i].classList.add(activeColumnElementsClass);
                }
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
            if (paginationElement !== undefined) {
                paginationElement.parentNode.removeChild(paginationElement);
            }
            let callbackEvent = 'table/pagination/display';
            trigger('template/render', {
                templateElementSelector: '#pagination',
                callbackEvent: callbackEvent,
                tableSettings: tableSettings
            });
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
            let activePage = tableSettings.activePage;
            activePage = parseInt(activePage);
            let pageSize = tableSettings.filters && tableSettings.filters.BasicData && tableSettings.filters.BasicData.PageSize !== undefined ? tableSettings.filters.BasicData.PageSize : 50;
            pageSize = parseInt(pageSize);
            let numOfItems = tableSettings.TotalNumberOfItems;
            numOfItems = parseInt(numOfItems);
            let lastPage = Math.ceil(numOfItems / pageSize);

            // let rowNumber = 1; //todo

            if (lastPage === 1) {
                hidePagination(tableSettings);
            } else {
                let paginationFirstPage = tableSettings.tableContainerElement.getElementsByClassName('pagination-first-page')[0];
                let paginationPreviousPage = tableSettings.tableContainerElement.getElementsByClassName('pagination-previous-page')[0];
                let paginationNextPage = tableSettings.tableContainerElement.getElementsByClassName('pagination-next-page')[0];
                let paginationLastPage = tableSettings.tableContainerElement.getElementsByClassName('pagination-last-page')[0];

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

        function handlePaginationLinkClick(e, tableSettings) {
            e.preventDefault();
            resetPaginationActiveButtons(tableSettings);
            e.target.classList.add('active');
            tableSettings.activePage = parseInt(e.target.dataset.page);
            //ToDo: refactor this to be in table module
            let moduleName = tableSettings.pageSelectorId.replace('#page-', '');
            trigger(moduleName + '/filters/pagination', {tableSettings: tableSettings});
        }

        function bindPaginationLinkHandler(element, tableSettings) {
            element.removeEventListener('click', function (e, tableSettings) {
                handlePaginationLinkClick(e, tableSettings);
            });
            element.addEventListener('click', function (e) {
                handlePaginationLinkClick(e, tableSettings);
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

        function bindExportToHandlers(tableSettings) {
            let exportButtons = tableSettings.filtersContainerElement.getElementsByClassName(exportToButtonsClass);
            for (let i = 0; i < exportButtons.length; i++) {
                exportButtons[i].dataset.target = tableSettings.tableContainerSelector;
                exportButtons[i].addEventListener('click', onTableExportButtonClicked);
            }
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

            if (!hasHeaders(tableSettings)) {
                generateTableHeaders(tableSettings);
            }

            generateTableRows(tableSettings);
            if (tableSettings.showPreloader) {
                trigger('preloader/hide');
            }
        }

        function initFilters(tableSettings) {
            let moduleName = tableSettings.pageSelectorId.replace('#page-', '');
            trigger(moduleName + '/filters/init', {tableSettings: tableSettings});
        }

        on('table/filter', filterTable);

        on('table/update', function (params) {
            let tableSettings = params.settingsObject;
            tableSettings.TotalNumberOfItems = params.data.Data.NumOfItems;
            if (tableSettings.filtersInitialized === undefined || tableSettings.filtersInitialized === false) {
                initFilters(tableSettings);
                showNormalTable(tableSettings);
            }
            //update sorting data from API
            tableSettings.onSort = {
                sortDirection: params.data.Data.ItemValue.SortDirection,
                sortName: params.data.Data.ItemValue.SortedBy,
            };
            updateTable(tableSettings);
        });

        function createTable(tableSettings) {
            let data = {EndpointId: tableSettings.endpointId};
            tableSettings.defaultSortColumnSet = false;


            if (tableSettings.showPreloader) {
                trigger('preloader/show')
            }
            trigger(tableSettings.getDataEvent, {
                data: data,
                tableSettings: tableSettings
            });
        }

        /*--------------------------------------------------------------------------------------*/


        function generateNoDataElement(tableSettings) {
            let noData = tableSettings.tableContainerElement.getElementsByClassName(emptyTableElementClass);
            if (noData.length <= 0) {
                let noDataElement = document.createElement('div');
                noDataElement.classList.add(emptyTableElementClass);
                noDataElement.classList.add('d-hide');
                noDataElement.innerText = 'No data to display...';
                tableSettings.tableContainerElement.appendChild(noDataElement);
                tableSettings.noDataElement = noDataElement;
            } else {
                tableSettings.noDataElement = noData[0];
            }
        }

        /*-------------------------------------- PAGE SIZE -------------------------------------*/


        function generatePageSizeDropdown(tableSettings) {
            let pageSizeDropdown = tableSettings.filtersContainerElement.getElementsByClassName('page-size')[0];
            //dropdown.generate(machinesNumber, pageSizeDropdown);
            dropdown.generate({optionValue: machinesNumber, parent: pageSizeDropdown});

            bindPageSizeLinkHandlers(pageSizeDropdown, tableSettings);
        }

        function getPageSize(tableSettings) {
            let pageSizeElement = $$(tableSettings.pageSelectorId).getElementsByClassName('page-size')[0];
            if (pageSizeElement !== undefined && pageSizeElement !== null) {
                let choosenOption = pageSizeElement.getElementsByClassName('element-table-filters')[0];
                let pageSizeValue = choosenOption.dataset.value;
                pageSizeValue = parseInt(pageSizeValue);
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

        function bindPageSizeLinkHandlers(pageSizeDropdown, tableSettings) {
            if (pageSizeDropdown !== undefined && pageSizeDropdown !== null) {
                let pageSizeOptions = pageSizeDropdown.getElementsByClassName('single-option');
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

        function getSortedHeader(tableSettings) {
            return tableSettings.tableContainerElement.getElementsByClassName('sort-active')[0];
        }

        function getSortedHeaderByAPIdata(tableSettings) {
            return tableSettings.tableContainerElement.getElementsByClassName(`${sortOrderClassPrefix}-${tableSettings.sort.sortName}`)[0];
        }

        function markActiveColumnRows(tableSettings) {
            let headers = getHeaders(tableSettings);
            let columnName = null;
            for (let i = 0; i < headers.length; i++) {
                let header = headers[i];
                if (header.classList.contains('active-column')) {
                    columnName = getColumnNameFromHeadElement(header);
                }
            }
            if (columnName !== null) {
                let columnElements = tableSettings.tableContainerElement.getElementsByClassName(columnName);
                for (let j = 0; j < columnElements.length; j++) {
                    columnElements[j].classList.add(activeColumnElementsClass);
                }
            }
        }

        function setSortingAttributes(header, tableSettings) {
            let headers = getHeaders(tableSettings);

            //be sure that there's only one active header
            for (let i = 0; i < headers.length; i++) {
                if (headers[i] !== header) {
                    headers[i].classList.remove('sort-active');
                    headers[i].classList.remove('sort-asc');
                    headers[i].classList.remove('sort-desc');
                    headers[i].classList.remove(activeColumnElementsClass);
                    delete headers[i].dataset.direction;
                }
            }
            if (header !== undefined) {
                header.classList.add('sort-active');
                // header.classList.add(activeColumnElementsClass);
                toggleSortDirectionClasses(header);
            }
        }

        function toggleSortDirectionClasses(header) {
            if (!header.classList.contains(sortingClass.ascending) && !header.classList.contains(sortingClass.descending) && !header.dataset.direction) {
                header.classList.add(sortingClass.ascending);
                header.dataset.direction = sortDirections.ascending;
            } else if (header.classList.contains(sortingClass.descending)) {
                header.classList.remove(sortingClass.descending);
                header.classList.add(sortingClass.ascending);
                header.dataset.direction = sortDirections.ascending;
            } else {
                header.classList.remove(sortingClass.ascending);
                header.classList.add(sortingClass.descending);
                header.dataset.direction = sortDirections.descending;
            }
        }

        function setSortDirectionOnHeader(header, sortDirection) {
            header.classList.remove(sortingClass.ascending);
            header.classList.remove(sortingClass.descending);
            header.dataset.direction = null;
            if (sortDirection === sortOrderEnum.ascending) {
                header.classList.add('sort-active');
                header.classList.add(sortingClass.ascending);
                header.dataset.direction = sortDirections.ascending;

            } else if (sortDirection === sortOrderEnum.descending) {
                header.classList.add('sort-active');
                header.classList.add(sortingClass.descending);
                header.dataset.direction = sortDirections.descending;

            }
        }

        function setSorting(tableSettings) {
            tableSettings.sort = {
                sortDirection: null,
                sortName: null,
            };

            let activeHeader = getSortedHeader(tableSettings);

            if (activeHeader !== undefined) {
                tableSettings.sort.sortName = activeHeader.dataset.column;
                if (activeHeader.dataset.direction === sortDirections.ascending) {
                    tableSettings.sort.sortDirection = sortOrderEnum.ascending;
                } else if (activeHeader.dataset.direction === sortDirections.descending) {
                    tableSettings.sort.sortDirection = sortOrderEnum.descending;
                }
            } else {
                tableSettings.sort.sortName = null;
                tableSettings.sort.sortDirection = null;
            }
        }

        function setSortActiveColumn(tableSettings) {
            let headers = getHeaders(tableSettings);
            for (let header of headers) {
                if (header.classList.contains(columnClassPrefix + tableSettings.sortActiveColumn)) {
                    setSortingAttributes(header, tableSettings);
                }
            }
        }

        /*--------------------------------------------------------------------------------------*/


        /*--------------------------- SORTING LINK CLICK HANDLERS ----------------------------*/
        function handleSortingLinkClick(e) {
            let element = e.target;
            let table = element.parentNode.parentNode;
            let tableSettings = table.tableSettings;
            tableSettings.activePage = 1;
            e.preventDefault();
            setSortingAttributes(element, tableSettings);
            let moduleName = tableSettings.pageSelectorId.replace('#page-', '');
            setSorting(tableSettings);
            trigger(moduleName + '/filters/sorting', {tableSettings: tableSettings});
        }

        function bindSortingLinkHandler(element) {
            element.removeEventListener('click', handleSortingLinkClick);
            element.addEventListener('click', handleSortingLinkClick);
        }

        function bindSortingLinkHandlers(tableSettings) {
            let headElements = getHeaders(tableSettings);
            for (let i = 0; i < headElements.length; i++) {
                let headElement = headElements[i];
                if (headElement.classList.contains('sortable')) {
                    bindSortingLinkHandler(headElement);
                }
            }
        }

        /*--------------------------------------------------------------------------------------*/


        /*------------------------------- SHOWING/HIDING COLUMNS -------------------------------*/

        function getColumnNameFromHeadElement(headElement) {
            let classList = headElement.classList;
            for (let i = 0; i < classList.length; i++) {
                let className = classList[i];
                if (className.indexOf(columnClassPrefix) === 0) {
                    return className;
                }
            }
            return null;
        }


        /*--------------------------------------------------------------------------------------*/


        /*------------------------------------ FILTERING ------------------------------------*/

        function collectAllFilterContainers(tableSettings) {
            let filterElements;
            if (tableSettings.pageSelectorId !== undefined) {
                filterElements = $$(tableSettings.pageSelectorId).getElementsByClassName('select-container');
            } else if (tableSettings.advancedFilterContainerSelector !== undefined) {
                filterElements = $$(tableSettings.advancedFilterContainerSelector).getElementsByClassName('select-container');
            } else {
                filterElements = $$(tableSettings.tableContainerElement.getElementsByClassName('select-container'));
            }
            return filterElements;
        }

        function collectFiltersFromPage(tableSettings) {
            //tableSettings.filters = {};
            let filterContainers = collectAllFilterContainers(tableSettings);

            let filters = Array.prototype.slice.apply(filterContainers).reduce(function (accumulated, element) {
                let name = element.dataset.name;
                let filterElement = element.getElementsByClassName('element-table-filters')[0];
                //proveriti s Nikolom ovo
                //accumulated[name] = filterElement.dataset.value !== '-' ? filterElement.dataset.value.split(',') : null;
                if (filterElement !== undefined) {
                    accumulated[name] = nullFilterValues.indexOf(filterElement.dataset.value) < 0 ? filterElement.dataset.value.split(',') : null;
                } else {
                    accumulated[name] = null;
                }
                return accumulated;
            }, {});
            if (filters.Columns === undefined || filters.Columns === null) {
                filters.Columns = [];
            }
            return filters;
        }

        function filterTable(params) {
            let tableSettings = params.tableSettings;
            if (tableSettings.showPreloader) {
                trigger('preloader/show');
            }
            trigger(tableSettings.filterDataEvent, {
                tableSettings: tableSettings,
                data: params.data,
            });
            if (params.activeFiltersElement !== undefined &&
                params.infobarElement !== undefined) {
                showSelectedFilters({
                    active: params.activeFiltersElement,
                    infobar: params.infobarElement
                });
            }
        }

        /*--------------------------------------------------------------------------------------*/

        //region refactored functions
        function init2(settings) {
            let table = document.createElement('div');
            table.classList.add('table');
            table.classList.add('vertex-table');
            table.classList.add('table-expanded');
            table.setAttribute('id', settings.id);
            setDefaultSettings(settings);
            table.settings = settings;

            table.elements = {
                body: generateTableBody(),
                noDataElement: generateNoDataElement2(),
                pagination: generatePagination()
            }

            table.appendChild(table.elements.body);
            table.appendChild(table.elements.noDataElement);
            table.appendChild(table.elements.pagination);
            //bind functions
            table.update = update;
            table.sort = sort;

            if (!isEmpty(settings.data)) {
                table.update(settings.data);
            }

            //bindHandlers();

            return table;
        }

        function update(data) {
            let table = this;
            let settings = table.settings;
            if (isEmpty(data)) {
                return table;
            }
            if (data.length <= 0) {
                table.elements.body.classList.add('d-hide');
                table.elements.body.noDataElement.classList.remove('d-hide');
            } else {
                table.elements.body.classList.remove('d-hide');
                table.elements.body.noDataElement.classList.add('d-hide');
                if (!hasHeaders2(table)) {
                    generateHeaders(table, data);
                }
                generateRows(table, data);
            }
            if (table.settings.showPreloader) {
                trigger('preloader/hide');
            }
        }

        function sort(column) {
            let table = this;
            let settings = table.settings;
            if (settings.sort.name === column) {
                if (settings.sort.direction === sortDirections.ascending) {
                    settings.sort.direction = sortDirections.descending;
                }
                if (settings.sort.direction === sortDirections.descending) {
                    settings.sort.direction = sortDirections.ascending;
                }
            } else {
                settings.sort.name = column;
                settings.sort.direction = settings.defaultSortDirection
            }
            trigger(`table/${table.settings.id}/sort`, {table: table});
        }

        function generateHeaders(table, data) {
            let tbody = table.elements.body;
            let settings = table.settings;
            if (!isEmpty(data)) {
                let columnNames = Object.keys(data[0].EntryData);
                for (let col = 0; col < columnNames.length; col++) {
                    let cell = createHeaderTableCell(table.settings.stickyRow);
                    let columnName = columnNames[col];
                    cell.dataset.column = columnName;
                    let cellColumnClass = generateCellClassName(columnName);
                    cell.classList.add(cellColumnClass);

                    settings.columns[columnName] = {
                        column: columnName,
                        visible: true,
                        class: cellColumnClass,
                        width: '1fr'
                    };

                    if (columnName === 'FlagList') {
                        settings.columns[columnName].width = '25px';
                    }

                    if (columnName !== 'FlagList' && columnName !== 'ActionList') {
                        cell.innerHTML = localization.translateMessage(columnName, cell);
                        cell.classList.add('sortable');
                        cell.addEventListener('click', onSort);
                    }
                    tbody.appendChild(cell);
                }

                //ToDo Neske: skloni ovo
                generateTablePagination(tableSettings);
                generatePageSizeDropdown(tableSettings);
                bindHandlers(tableSettings);
            } else {
                console.error('could not generate table headers without data');
            }
        }

        function generateRows(table, data) {
            let settings = table.settings;
            let tbody = table.elements.body;

            let tableItems = tbody.getElementsByClassName('table-item');
            //remove displayed rows
            if (tableItems !== undefined && tableItems != null) {
                while (tableItems.length > 0) {
                    let item = tableItems[0];
                    item.parentNode.removeChild(item);
                }
            }

            let rowsCount = data.length;
            for (let row = 0; row < rowsCount; row++) {
                let rowId = Math.round(Math.random() * Number.MAX_SAFE_INTEGER);

                while (rows.includes(rowId)) {
                    rowId = Math.round(Math.random() * Number.MAX_SAFE_INTEGER);
                }

                let rowData = data[row];
                let tempRow = JSON.parse(JSON.stringify(rowData.EntryData));

                //parse data

                //pages containing field: AFT
                if (tempRow.CreatedBy !== undefined) {
                    if (!isEmpty(tempRow.CreatedBy.Time) && !isEmpty(tempRow.CreatedBy.Name)) {
                        tempRow.CreatedBy = createTimeUserCellHTML(formatTimeData(tempRow.CreatedBy.Time), tempRow.CreatedBy.Name);
                    } else {
                        tempRow.CreatedBy = '';
                    }
                }
                //pages containing field: AFT
                if (tempRow.FinishedBy !== undefined) {
                    if (!isEmpty(tempRow.FinishedBy.Time) && !isEmpty(tempRow.FinishedBy.Name)) {
                        tempRow.FinishedBy = createTimeUserCellHTML(formatTimeData(tempRow.FinishedBy.Time), tempRow.FinishedBy.Name);
                    } else {
                        tempRow.FinishedBy = '';
                    }
                }
                //pages containing field: Tickets
                if (tempRow.IssuedBy !== undefined) {
                    if (!isEmpty(tempRow.IssuedBy.Time) && !isEmpty(tempRow.IssuedBy.Name)) {
                        tempRow.IssuedBy = createTimeUserCellHTML(formatTimeData(tempRow.IssuedBy.Time), tempRow.IssuedBy.Name);
                    } else {
                        tempRow.FinishedBy = '';
                    }
                }
                //pages containing field: Tickets
                if (tempRow.RedeemedBy !== undefined) {
                    if (!isEmpty(tempRow.RedeemedBy.Time) && !isEmpty(tempRow.RedeemedBy.Name)) {
                        tempRow.RedeemedBy = createTimeUserCellHTML(formatTimeData(tempRow.RedeemedBy.Time), tempRow.RedeemedBy.Name);
                    } else {
                        tempRow.RedeemedBy = '';
                    }
                }

                //pages containing field: AFT,Malfunctions
                if (tempRow.FlagList !== undefined) {
                    let flagElement = document.createElement('div');
                    flagElement.classList.add('flag-element');
                    flagElement.classList.add(`flag-${tempRow.FlagList[0]}`);
                    tempRow.FlagList = flagElement.outerHTML;
                }
                //pages containing field: Malfunctions,Users,AFT
                if (tempRow.ActionList !== undefined) {
                    let cellHTML = '';
                    for (let i = 0; i < tempRow.ActionList.length; i++) {
                        cellHTML += tableActions[tempRow.ActionList[i]].outerHTML;
                    }
                    tempRow.ActionList = cellHTML;
                }

                //pages containing field: Tickets,AFT
                if (tempRow.Status !== undefined) {
                    tempRow.Status = localization.translateMessage(tempRow.Status);
                }
                //pages containing field: Tickets
                if (tempRow.TicketType !== undefined) {
                    tempRow.TicketType = localization.translateMessage(tempRow.TicketType);
                }
                //pages containing field: AFT,Malfunctions
                if (tempRow.Type !== undefined) {
                    tempRow.Type = localization.translateMessage(tempRow.Type);
                }
                //pages containing field: Malfunctions
                if (tempRow.Priority !== undefined) {
                    tempRow.Priority = localization.translateMessage(tempRow.Priority);
                }

                let columnIndex = 0;
                for (let column in tempRow) {
                    // noinspection JSUnfilteredForInLoop
                    let cellColumnClass = generateCellClassName(column);
                    let cell = generateBodyTableCellElement2(rowId, column, settings, rowData);
                    //add column number class
                    cell.classList.add(`table-column-${columnIndex + 1}`);

                    let cellData = tempRow[column];
                    //set cell to be clickable if criteria are met
                    if (
                        !isEmpty(rowData.Properties.IsPayoutPossible) && rowData.Properties.IsPayoutPossible //aft
                    ) {
                        cell.classList.add('clickable');
                    }

                    if (Number.isInteger(cellData)) {
                        cell.innerHTML = formatFloatValue(cellData);
                    } else {
                        cell.innerHTML = cellData;
                        //ToDo: if language will be changed from within the application, there are attributes that needs to be set up on cell element using following function
                        //cell.innerHTML = localization.translateMessage(cellData,cell);
                    }

                    //hide hidden columns
                    let columnData = settings.columns[column];
                    if (columnData.visible === true) {
                        cell.classList.add(hiddenCellClassName);
                    }

                    //set first column sticky if needed
                    if (tableSettings.stickyColumn === true && columnIndex === 0) {
                        cell.classList.add('sticky');
                    }
                    columnIndex++;
                    tbody.appendChild(cell);
                }
            }
            if (rowsCount > 0) {
                //highlight sorted column if there is one
                markActiveColumnRows(tableSettings);
                updateTablePagination(tableSettings);
                //highlight after response from API is received
                deselectActiveColumn(tableSettings);
                highlightSortedColumn(tableSettings);
                tbody.classList.remove('d-hide');
                tableSettings.noDataElement.classList.add('d-hide');
                setTableDimensions(tableSettings, colsCount, tbody);
            } else {
                hidePagination(tableSettings);
                tableSettings.noDataElement.classList.remove('d-hide');
                tbody.classList.add('d-hide');
                setTableDimensions(tableSettings, 1, tbody);
            }
            return tbody;
        }


// region generate elements helper functions
        function generateTableBody() {
            let tbody = document.createElement('div');
            tbody.className = 'tbody';
            return tbody;
        }

        function generateNoDataElement2() {
            let noDataElement = document.createElement('div');
            noDataElement.classList.add(emptyTableElementClass);
            noDataElement.classList.add('d-hide');
            noDataElement.innerText = 'No data to display...';
            return noDataElement;
        }

        function generatePagination() {
            return template.render('#pagination', {});
        }

        function createEditMachineAction() {
        }

        function createCancelTransactionAction() {
            let cancelIndicator = document.createElement('span');
            let icon = document.createElement('i');
            //ToDo: Ubaciti klasu za font
            icon.innerHTML = 'X';
            let text = document.createElement('span');
            text.innerHTML = localization.translateMessage('Cancel', text);
            cancelIndicator.classList.add('cancel-indicator');
            cancelIndicator.appendChild(icon);
            cancelIndicator.appendChild(text);
            return cancelIndicator;
        }

        function createEditJackpotAction() {
        }

        function createEditMalfunctionAction() {
        }

        function createEditUserAction() {
        }

        function createDeleteUserAction() {
        }

        function generateBodyTableCellElement2(rowId, column, settings, rowData) {
            let cellColumnClass = generateCellClassName(column);
            let cell = document.createElement('div');
            cell.classList.add('cell');
            cell.classList.add('table-item');
            cell.classList.add(rowClassPrefix + rowId);
            cell.classList.add(cellColumnClass);
            if (column === 'actions') {
                cell.classList.add('table-actions-column');
            }
            cell.additionalData = rowData;

            //set handlers
            cell.addEventListener('mouseover', function () {
                hoverRow(rowClassPrefix + rowId, true);
            }, {passive: false});
            cell.addEventListener('mouseout', function () {
                hoverRow(rowClassPrefix + rowId, false);
            }, {passive: false});
            cell.addEventListener('click', function (e) {
                //check if there's on beforeCellClick handler
                trigger(`table/${settings.id}/cell/clicked/`, {event: e, target: cell});
            });
            return cell;
        }


//endregion

//region helper functions
        function getHeaders2(table) {
            return table.getElementsByClassName('head');
        }

        function hasHeaders2(table) {
            return getHeaders2(table).length > 0;
        }

        function bindHandlers2(table) {
            bindTableViewLinkHandlers(tableSettings);
            //bindExportToHandlers(tableSettings);
        }

        function highightSortedColumn(table, column, direction) {
            let settings = table.settings;
            if (column === undefined) {
                column = settings.sort.name;
            }
            if (direction === undefined) {
                direction = settings.sort.direction;
            }
            let headers = getHeaders2(table);
            for (let header in headers) {
                let headerColumn = header.dataset.column;
                header.classList.remove(activeColumnElementsClass, sortingClass.ascending, sortingClass.descending);
                if (column === headerColumn) {
                    let directionClass = direction === sortDirections.ascending ? sortingClass.ascending : sortingClass.descending;
                    header.classList.add(directionClass);
                    header.classList.add(activeColumnElementsClass);
                }
            }
            //ToDo:
            let columnItems = ''
        }


//endregion

//region event handlers
        function onSort(e) {
            //get clicked header
            e.preventDefault();
            let element = e.target;
            let table = element.parentNode.parentNode;
            let settings = table.settings;
            settings.page = 1;
            let column = element.dataset('column');
            table.sort(column);
        }

//endregion

//endregion

        /*--------------------------------- INITIALIZING TABLE ---------------------------------*/


        function init(tableSettings) {

            let tableContainerElement = $$(tableSettings.tableContainerSelector);
            //remove reference on previous table settings
            if (tableContainerElement.tableSettings !== undefined) {
                delete tableContainerElement.tableSettings;
            }

            //cache table and filters containers in table settings
            tableSettings.tableContainerElement = tableContainerElement;
            tableSettings.filtersContainerElement = $$(tableSettings.filtersContainerSelector);


            if (tableSettings.advancedFiltersContainerElement !== undefined) {
                tableSettings.advancedFiltersContainerElement = $$(tableSettings.advancedFilterContainerSelector);

            }
            //set advanced filters container element automatically
            else if (tableSettings.filtersContainerElement.getElementsByClassName('advance-table-filter').length > 0) {
                tableSettings.advancedFiltersContainerElement = tableSettings.filtersContainerElement.getElementsByClassName('advance-table-filter')[0];
                tableSettings.advancedFilterContainerSelector = `#${tableSettings.advancedFiltersContainerElement.id}`;
            }

            tableSettings.tableContainerElement.classList.add('vertex-table');

            tableContainerElement.tableSettings = tableSettings;

            if (tableSettings.getDataEvent !== null) {
                tableSettings.getDataEvent = getEvent(tableSettings);
            }

            setDefaultSettings(tableSettings);
            checkTableSettings(tableSettings);


            delete tableSettings.ColumnsToShow;

            if (tableSettings.tableData === undefined) {
                createTable(tableSettings);
            } else {
                updateTable(tableSettings);
            }
        }

        return {
            init: init,
            getColNamesOfDisplayedTable: getColNamesOfDisplayedTable,
            getHideableColumns: getHideableColumns,
            collectFiltersFromPage: collectFiltersFromPage,
            getSorting: setSorting,
            getPageSize: getPageSize,
            parseFilterValues: parseFilterValues,
            getBounds: getBounds,
            setFiltersPage: setFiltersPage,
            //constants
            exportTypes: exportTypes,
            events: events,
            exportFileTypes: exportFileTypes,
            init2: init2
        };

        /*--------------------------------------------------------------------------------------*/


        /*--------------------------------------------HELPER FUNCTIONS--------------------------*/
        function getVisibleColumnIds(tableSettings) {
            let headers = getHeaders(tableSettings);
            let ids = [];
            if (tableSettings.visibleColumns.length === 0) {
                for (let i = 0; i < headers.length; i++) {
                    let header = headers[i];
                    if (!isEmpty(header.dataset.columnId)) {
                        ids.push(header.dataset.columnId);
                    }

                }
            } else {
                for (let i = 0; i < headers.length; i++) {
                    let header = headers[i];
                    let columnName = header.dataset.columnName;
                    let columnId = header.dataset.columnId;
                    if (!isEmpty(columnId)) {
                        if (tableSettings.visibleColumns.indexOf(columnName) >= 0) {
                            ids.push(columnId);
                        }
                    }
                }
            }
            return ids;
        }


        function bindHandlers(tableSettings) {
            bindSortingLinkHandlers(tableSettings);
            bindTableViewLinkHandlers(tableSettings);
            bindExportToHandlers(tableSettings);
        }

        function showSelectedFilters(params) {
            let filterActive = params.active;
            let filterInfobar = params.infobar;
            for (let count = 0; count < filterActive.children.length - 1; count++) {
                if (filterActive.children[count].children[1].children[0].dataset && filterActive.children[count].children[1].children[0].dataset.value !== 'null') {
                    filterInfobar.children[1].children[count].children[0].innerHTML = filterActive.children[count].children[0].innerHTML;
                    filterInfobar.children[1].children[count].children[1].innerHTML = filterActive.children[count].children[1].children[0].title;
                    filterInfobar.children[1].children[count].title = filterActive.children[count].children[1].children[0].title;
                    filterInfobar.children[1].children[count].classList.remove('hidden');
                } else {
                    filterInfobar.children[1].children[count].classList.add('hidden');
                }
            }
            for (let isHidden of filterInfobar.children[1].children) {
                if (isHidden.classList && !isHidden.classList.contains('hidden') && !isHidden.classList.contains('button-wrapper')) {
                    filterInfobar.classList.remove('hidden');
                    return;
                } else {
                    filterInfobar.classList.add('hidden');
                }
            }
        }

        function dismissPopup(target, tableSelector) {
            dimissPopUp(target);
            enableScroll(tableSelector);
        }

        function disableScroll(tableSelector) {
            let tbody = $$(tableSelector).getElementsByClassName('tbody')[0];
            tbody.classList.add('no-scroll');
        }

        function enableScroll(tableSelector) {
            let tbody = $$(tableSelector).getElementsByClassName('tbody')[0];
            tbody.classList.remove('no-scroll');
        }

        function setDefaultSettings(settings) {
            if (settings.filters === undefined) {
                settings.filters = null;
            }
            if (settings.visibleColumns === undefined) {
                settings.visibleColumns = [];
            }
            if (settings.columns === undefined) {
                settings.columns = {};
            }
            //set default fort values
            if (settings.defaultSortDirection === undefined) {
                settings.defaultSortDirection = sortDirections.ascending;
            }
            if (settings.sort === undefined) {
                settings.sort = {};
            }
            if (settings.sort.direction === undefined) {
                settings.sort.direction = null;
            }
            if (settings.sort.name === undefined) {
                settings.sort.name = null;
            }
            if (settings.stickyColumn === undefined) {
                settings.stickyColumn = false;
            }
            if (settings.filtersInitialized === undefined) {
                settings.filtersInitialized = false;
            }
            if (settings.forceRemoveHeaders === undefined) {
                settings.forceRemoveHeaders = false;
            }
            if (settings.PageSize === undefined) {
                settings.PageSize = defaultPageSize;
            }
            if (settings.page === undefined) {
                settings.page = defaultPage;
            }
            if (settings.showPreloader === undefined) {
                settings.showPreloader = true;
            }
        }

        function checkTableSettings(tableSettings) {
            //check if all settings argument are set correctly
            //check callback functions - allow either function or a string - name of the event to be triggered
            if (tableSettings.onAfterDrawRows !== undefined &&
                !isFunction(tableSettings.onAfterDrawRows) &&
                !isString(tableSettings.onAfterDrawRows)) {
                console.error('onBeforeCellClick callback is not a function or event trigger');
            }
            if (tableSettings.onDrawRowCell !== undefined &&
                !isFunction(tableSettings.onDrawRowCell) &&
                !isString(tableSettings.onDrawRowCell)) {
                console.error('onDrawRowCell callback is not a function or event trigger');
            }
            if (tableSettings.onBeforeCellClick !== undefined && !isFunction(tableSettings.onBeforeCellClick)) {
                console.error('onBeforeCellClick callback is not a function');
            }
            if (tableSettings.onBeforeCellClick !== undefined && !isFunction(tableSettings.onBeforeCellClick)) {
                console.error('onBeforeCellClick callback is not a function');
            }
            if (tableSettings.onCellClick !== undefined && !isFunction(tableSettings.onCellClick)) {
                console.error('onCellClick callback is not a function');
            }
            if (tableSettings.onAfterCellClick !== undefined && !isFunction(tableSettings.onAfterCellClick)) {
                console.error('onAfterCellClick callback is not a function');
            }
        }

        function deselectActiveColumn(tableSettings) {
            let activeElements = tableSettings.tableContainerElement.getElementsByClassName(activeColumnElementsClass);
            while (activeElements.length > 0) {
                activeElements[0].classList.remove(activeColumnElementsClass);
            }
        }

        function deselectActiveRow(table) {
            let activeElements = table.getElementsByClassName(activeRowElementsClass);

            while (activeElements.length > 0) {
                activeElements[0].classList.remove(activeRowElementsClass);
            }
        }

        function deselectHoverRow(table) {
            let elements = table.getElementsByClassName('hover');
            while (elements.length > 0) {
                elements[0].classList.remove('hover');
            }
        }

        function onTableExportButtonClicked(event) {
            let button = event.target;
            let tableSettings = $$(button.dataset.target).tableSettings;
            let fileType = button.dataset.fileType;

            if (tableSettings.exportTo === undefined) {
                console.error(`Table export to settings are not defined.`);
            } else if (tableSettings.exportTo[fileType] === undefined) {
                console.error(`Export to ${fileType} settings are not set in tableSettings.exportTo`);
            } else {
                let exportSettings = tableSettings.exportTo[fileType];
                if (exportSettings.type === exportTypes.event) {
                    trigger(exportSettings.value, {
                        tableSettings: tableSettings,
                        selectedColumns: getVisibleColumnIds(tableSettings)
                    });
                }
                //ToDo: cases where export type value is function or url
            }

        }

        /*-------------------------------PUBLIC HELPER FUNCTIONS--------------------------------*/
        function setFiltersPage(currentTableSettingsObject, filtersForApi) {

            if (currentTableSettingsObject.filters !== null) {
                if (currentTableSettingsObject.filters.BasicData !== undefined) {
                    let clonedFilters = JSON.parse(JSON.stringify(filtersForApi));
                    let clonedExistingFilters = JSON.parse(JSON.stringify(currentTableSettingsObject.filters));

                    //delete pages as that data will differ from old and new filters data
                    delete clonedFilters.BasicData.Page;
                    delete clonedFilters.TokenInfo;
                    delete clonedExistingFilters.BasicData.Page;
                    delete clonedExistingFilters.TokenInfo;
                    if (!compareObjects(clonedFilters, clonedExistingFilters)) {
                        currentTableSettingsObject.activePage = 1;
                        filtersForApi.BasicData.Page = 1;
                    }
                }
            }
        }

        function getBounds(tableSettings) {
            return tableSettings.tableContainerElement.getBoundingClientRect();
        }

        function getHideableColumns(tableSettings) {
            let headers = Array.from(getHeaders(tableSettings));
            let columns = [];

            headers.forEach(function (element) {
                if (element.dataset.alwaysVisible === undefined || element.dataset.alwaysVisible === false) {
                    let item = {};
                    if (element.dataset.columnName === undefined) {
                        item.value = element.innerText.replace(' ', '');
                        item.name = element.dataset.translationKey;
                    } else {
                        item.name = element.dataset.translationKey;
                        item.value = element.dataset.columnName;
                    }
                    columns.push(item)
                }
            });
            return columns;

        }

        function getColNamesOfDisplayedTable(tableSettings) {
            let colNames = [];
            let tbody = getTableBodyElement(tableSettings);
            let headElements = Array.from(tbody.getElementsByClassName('head'));
            headElements.forEach(function (element) {
                let name = '';
                if (element.dataset.columnName === 'undefined') {
                    name = element.dataset.columnName;
                } else {
                    name = element.innerText.replace(' ', '');
                }
                colNames.push({Name: name})
            });
            colNames.unshift({Name: "-"});
            return colNames;
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

        /** HTML generating helper function **/

        function createHeaderTableCell(sticky) {
            let cell = document.createElement('div');
            cell.classList.add('head');
            cell.classList.add('cell');
            cell.classList.add('text-uppercase');
            if (sticky) {
                cell.classList.add('sticky');
            }
            return cell;
        }

        function createBodyTableCellElement(rowId, column, settings, rowData) {
            let cellColumnClass = generateCellClassName(column);
            let cell = document.createElement('div');
            cell.classList.add('cell');
            cell.classList.add('table-item');
            cell.classList.add(rowClassPrefix + rowId);
            cell.classList.add(cellColumnClass);
            if (column === 'actions') {
                cell.classList.add('table-actions-column');
            }
            cell.additionalData = rowData;

            //set handlers
            cell.addEventListener('mouseover', function () {
                hoverRow(rowClassPrefix + rowId, true);
            }, {passive: false});
            cell.addEventListener('mouseout', function () {
                hoverRow(rowClassPrefix + rowId, false);
            }, {passive: false});
            let tableSelector = settings.tableContainerSelector;
            cell.addEventListener('click', function (e) {
                //check if there's on beforeCellClick handler
                trigger(`table/${tableSelector}/cell/clicked/`, {event: e, target: cell});
            });
            return cell;
        }

        function createTimeUserCellHTML(time, user) {
            let timeElement = createTableTimeElement(time);
            let userElement = document.createElement('label');
            userElement.innerHTML = user;

            return timeElement.outerHTML + userElement.outerHTML;
        }

        function createTableTimeElement(content) {
            let time = document.createElement('time');
            time.classList.add('table-time');
            time.innerHTML = content;
            return time;
        }
    }

)
();