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
        const hiddenClass = 'hidden';
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
            saveExportedFile: 'table/export/save-file',
            rowClick: getRowClickEvent,
            pageSize: getPageSizeEvent,
            pagination: getPaginationEvent,
            sort: getSortEvent

        }

        const sortDirections = {
            none: 0,
            ascending: 1,
            descending: 2
        };

        const sortingClass = {
            ascending: 'sort-asc',
            descending: 'sort-desc'
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
        function createColumnClassName(propertyName) {
            return columnClassPrefix + propertyName.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
        }

        function hoverRow(elements, highlight = false) {
            for (let element of document.getElementsByClassName(elements)) {
                element.classList[highlight ? "add" : "remove"]('hover');
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


        /*--------------------------------------------------------------------------------------*/


        /*-------------------------------------- SORTING --------------------------------------*/


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

        function setSorting(tableSettings) {
            tableSettings.sort = {
                sortDirection: null,
                sortName: null,
            };

            let activeHeader = getSortedHeader(tableSettings);

            if (activeHeader !== undefined) {
                tableSettings.sort.sortName = activeHeader.dataset.column;
                if (activeHeader.dataset.direction === sortDirections.ascending) {
                    tableSettings.sort.sortDirection = sortDirections.ascending;
                } else if (activeHeader.dataset.direction === sortDirections.descending) {
                    tableSettings.sort.sortDirection = sortDirections.descending;
                }
            } else {
                tableSettings.sort.sortName = null;
                tableSettings.sort.sortDirection = null;
            }
        }


        //region refactored functions
        function init(settings, data) {
            let table = document.createElement('div');
            table.classList.add('table');
            table.classList.add('vertex-table');
            table.classList.add('table-expanded');
            table.setAttribute('id', settings.id);
            setDefaults(settings, table);

            table.elements = {
                body: generateTableBody(),
                noDataElement: generateNoDataElement2(),
                pagination: generatePagination(),
                pageSize: generatePageSize(table)
            };

            table.appendChild(table.elements.body);
            table.appendChild(table.elements.noDataElement);
            table.appendChild(table.elements.pagination);
            if (table.settings.pageSizeContainer !== null) {
                $$(table.settings.pageSizeContainer).appendChild(table.elements.pageSize);
            }
            //bind functions
            table.update = update;
            table.sort = sort;
            table.destroy = destroy;
            table.getFilters = getFilters;
            table.resetFilters = resetFilters;

            if (!isEmpty(data)) {
                table.update(data);
            }
            return table;
        }

        function update(data) {
            let table = this;

            //ToDo: parse data here
            table.data.items = data.Items;
            table.data.totalItems = data.NumOfItems;
            //update sorting from data received by server
            setSort(table, data.ItemValue.SortedBy, data.ItemValue.SortDirection);

            if (isEmpty(data)) {
                return table;
            }
            if (table.data.items.length <= 0) {
                table.elements.body.classList.add(hiddenClass);
                table.elements.noDataElement.classList.remove(hiddenClass);
            } else {
                table.elements.body.classList.remove(hiddenClass);
                table.elements.noDataElement.classList.add(hiddenClass);
                if (!hasHeaders(table)) {
                    generateHeaders(table);
                }
                generateRows(table);
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
            trigger(events.sort(settings.id), {table: table});
        }

        function destroy() {
            let table = this;
            table.elements.pageSize.parentNode.removeChild(table.elements.pageSize);
            table.parentNode.removeChild(table);
        }

        function getFilters(filters) {
            let table = this;
            let settings = table.settings;

            let basicData = {
                'Page': compareFilters(table, filters) ? settings.page : 1,
                'PageSize': settings.pageSize,
                'SortOrder': settings.sort.direction,
                'SortName': settings.sort.name
            };
            let tokenInfo = sessionStorage.token;

            filters.BasicData = basicData;
            filters.TokenInfo = tokenInfo;

            settings.filters = filters;

            return filters;
        }

        function resetFilters() {
            let settings = this.settings;
            settings.filters = null;
            settings.page = 1;
            settings.sort = {
                direction: null,
                name: null
            }
        }


        function generateHeaders(table) {
            let tbody = table.elements.body;
            let settings = table.settings;
            let items = table.data.items;
            if (!isEmpty(items)) {
                let columnNames = Object.keys(items[0].EntryData);
                for (let col = 0; col < columnNames.length; col++) {
                    let cell = createHeaderTableCell(table.settings.stickyRow);
                    let columnName = columnNames[col];
                    cell.dataset.column = columnName;
                    let cellColumnClass = createColumnClassName(columnName);
                    cell.classList.add(cellColumnClass);
                    settings.columns[columnName] = {
                        column: columnName,
                        visible: true,
                        class: cellColumnClass,
                        width: '1fr',
                        //header containts reference to the header node (element)
                        header: null,
                        hideable: true
                    };
                    if (columnName === 'FlagList') {
                        settings.columns[columnName].width = '50px';
                        settings.columns[columnName].hideable = false;
                    } else if (columnName === 'ActionList') {
                        settings.columns[columnName].hideable = false;
                    }

                    if (columnName !== 'FlagList' && columnName !== 'ActionList') {
                        cell.innerHTML = localization.translateMessage(columnName, cell);
                        cell.classList.add('sortable');
                        cell.addEventListener('click', onSort);
                    }
                    settings.columns[columnName].header = cell;
                    tbody.appendChild(cell);
                }
            } else {
                console.error('could not generate table headers without data');
            }
        }

        function generateRows(table) {
            let settings = table.settings;
            let tbody = table.elements.body;
            let items = table.data.items;

            let tableItems = tbody.getElementsByClassName('table-item');
            //remove displayed rows
            if (tableItems !== undefined && tableItems != null) {
                while (tableItems.length > 0) {
                    let item = tableItems[0];
                    item.parentNode.removeChild(item);
                }
            }

            let rowsCount = items.length;
            for (let row = 0; row < rowsCount; row++) {
                let rowId = Math.round(Math.random() * Number.MAX_SAFE_INTEGER);

                while (rows.includes(rowId)) {
                    rowId = Math.round(Math.random() * Number.MAX_SAFE_INTEGER);
                }

                let rowData = items[row];
                let tempRow = JSON.parse(JSON.stringify(rowData.EntryData));

                /** Data parsing **/
                //region parsing data

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
                //endregion

                let columnIndex = 0;
                for (let column in tempRow) {
                    // noinspection JSUnfilteredForInLoop
                    let cell = generateRowCell(rowId, column, settings, rowData);
                    //add column number class
                    cell.classList.add(`table-column-${columnIndex + 1}`);

                    let cellData = tempRow[column];
                    //set cell to be clickable if criteria are met
                    //ToDo: Add criteria for other pages
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
                    if (columnData.visible === false) {
                        cell.classList.add(hiddenClass);
                        columnData.header.classList.add(hiddenClass);
                    } else {
                        columnData.header.classList.remove(hiddenClass);
                    }
                    //set first column sticky if needed
                    if (settings.stickyColumn === true && columnIndex === 0) {
                        cell.classList.add('sticky');
                    }
                    columnIndex++;
                    tbody.appendChild(cell);
                }
            }
            highlightSortedColumn(table);
            updatePagination(table);
            setDimensions(table);
            return table;
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
            let pagination = template.render('#pagination', {});

            let pages = pagination.getElementsByClassName('element-pagination-link');
            for (let i = 0; i < pages.length; i++) {
                let page = pages[i];
                page.addEventListener('click', onPagination);
            }
            return pagination;
        }

        function generatePageSize(table) {
            let settings = table.settings;
            if (settings.pageSizeContainer === null) {
                return null;
            } else {
                let dd = dropdown.generate({optionValue: machinesNumber});
                bindPageSizeLinkHandlers(dd, table);
                return dd;
            }

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

        function generateRowCell(rowId, column, settings, rowData) {
            let cellColumnClass = createColumnClassName(column);
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
                trigger(events.rowClick(settings.id), {event: e, target: cell});
            });
            return cell;
        }


//endregion

//region helper functions
        function getHeaders(table) {
            return table.getElementsByClassName('head');
        }

        function hasHeaders(table) {
            return getHeaders(table).length > 0;
        }

        function highlightSortedColumn(table, column, direction) {
            let settings = table.settings;
            if (column === undefined) {
                column = settings.sort.name;
            }
            if (direction === undefined) {
                direction = settings.sort.direction;
            }
            let headers = getHeaders(table);
            for (let i = 0; i < headers.length; i++) {
                let header = headers[i];
                let headerColumn = header.dataset.column;
                header.classList.remove(activeColumnElementsClass, sortingClass.ascending, sortingClass.descending);
                if (column === headerColumn) {
                    let directionClass = direction === sortDirections.ascending ? sortingClass.ascending : sortingClass.descending;
                    header.classList.add(directionClass);
                    header.classList.add(activeColumnElementsClass);
                }
            }

            let columnClass = createColumnClassName(column);
            let columnItems = table.elements.body.getElementsByClassName(columnClass);
            for (let i = 0; i < columnItems.length; i++) {
                let cell = columnItems[i];
                cell.classList.add(activeColumnElementsClass);
            }
        }

        function updatePagination(table) {
            let pagination = table.elements.pagination;
            let pageSize = table.settings.pageSize;
            let activePage = table.settings.page;

            let totalItems = table.data.totalItems;
            let lastPage = Math.ceil(totalItems / pageSize);

            if (table.data.items.length <= 0 || lastPage === 1) {
                pagination.classList.add('hidden');
            } else {
                let paginationFirstPage = pagination.getElementsByClassName('pagination-first-page')[0];
                let paginationPreviousPage = pagination.getElementsByClassName('pagination-previous-page')[0];
                let paginationNextPage = pagination.getElementsByClassName('pagination-next-page')[0];
                let paginationLastPage = pagination.getElementsByClassName('pagination-last-page')[0];

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

                let paginationButtons = pagination.getElementsByClassName('element-pagination-page-button');

                for (let i = 0; i < paginationButtons.length; i++) {
                    let button = paginationButtons[i];
                    button.classList.remove('active');
                    button.dataset.page = paginationArray[i];
                    button.innerHTML = paginationArray[i];
                    if (paginationArray[i] === activePage) {
                        button.classList.add('active');
                    } else if (paginationArray[i] === undefined) {
                        button.classList.add('hidden');
                    }
                }
            }
        }

        function setSort(table, column, direction) {
            let settings = table.settings;
            settings.sort.name = column;
            settings.sort.direction = direction;
        }

        function setDimensions(table) {
            let tbody = table.elements.body;

            tbody.style.gridTemplateRows = `repeat(${table.data.items.length}, 1fr)`;

            let templateColumn = '';
            for (let key in table.settings.columns) {
                let column = table.settings.columns[key];
                if (column.visible === true) {
                    templateColumn += `${column.width} `;
                }
            }
            templateColumn = templateColumn.trim();
            tbody.style.gridTemplateColumns = templateColumn;
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
            let column = element.dataset.column;
            table.sort(column);
        }

        function onPagination(e) {
            let target = e.target;
            let table = target.parentNode.parentNode.parentNode;
            table.settings.page = target.dataset.page;
            //ToDo: ovde mozemo trigerovati i filter jer se na paginaciji poziva filtriranje  s api-ja
            trigger(events.pagination(table.settings.id), {table: table});
        }

        function bindPageSizeLinkHandlers(dropdown, table) {
            let options = dropdown.getElementsByClassName('single-option');
            for (let i = 0; i < options.length; i++) {
                let option = options[i];
                option.addEventListener('click', function (e) {
                    let target = e.target;
                    console.log(target);
                    table.settings.pageSize = target.dataset.value;
                    trigger(events.pageSize(table.settings.id), {table: table});
                    //ToDo: ovde takodje mozemo da zovemo filter posto page size inicira filtriranje
                });
            }
        }

//endregion

//endregion

        /*--------------------------------- INITIALIZING TABLE ---------------------------------*/


        return {
            init: init,
            //constants
            exportTypes: exportTypes,
            events: events,
            exportFileTypes: exportFileTypes,
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

        function setDefaults(settings, table) {
            if (settings.filters === undefined) {
                settings.filters = null;
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

            if (settings.pageSize === undefined) {
                settings.pageSize = defaultPageSize;
            }
            if (settings.page === undefined) {
                settings.page = defaultPage;
            }
            if (settings.showPreloader === undefined) {
                settings.showPreloader = true;
            }
            if (settings.pageSizeContainer === undefined) {
                settings.pageSizeContainer = null;
            }
            if (table.data === undefined) {
                table.data = {
                    totalItems: 0,
                    items: []
                }
            }

            table.settings = settings;
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

//region public helper functions

        function compareFilters(table, filters) {
            let settings = table.settings;
            if (settings.filters === null) {
                return false;
            }
            let clonedFilters = JSON.parse(JSON.stringify(filters));
            let tableFilters = JSON.parse(JSON.stringify(settings.filters));

            //delete pages as that data will differ from old and new filters data
            delete clonedFilters.BasicData.Page;
            delete clonedFilters.TokenInfo;
            delete tableFilters.BasicData.Page;
            delete tableFilters.TokenInfo;
            return compareObjects(clonedFilters, tableFilters);

        }

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


        function getRowClickEvent(tableId) {
            return `table/${tableId}/cell/clicked/`;
        }

        function getPageSizeEvent(tableId) {
            return `table/${tableId}/page-size/`;
        }

        function getPaginationEvent(tableId) {
            return `table/${tableId}/pagination/`;
        }

        function getSortEvent(tableId) {
            return `table/${tableId.id}/sort`;
        }


//endregion

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