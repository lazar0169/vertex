let table = (function () {

        let rows = [];
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
        const tagNames = { //caps letters
            input: 'INPUT',
            textarea: 'TEXTAREA',
            select: 'SELECT'
        };
        const types = {
            checkbox: 'checkbox',
            radio: 'radio'
        };
        const attributes = {
            multiple: 'multiple'
        };

        /*---------------------------- FUNCTIONS FOR GENERATING TABLE ----------------------------*/

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
            // let headElements = tbody.getElementsByClassName('head');
            let headElements = Array.from(tbody.getElementsByClassName('head'));
            console.log('head elements', headElements);
            headElements.forEach(function (element) {
                colNames.push({Name: element.innerText})
            });
            colNames.unshift({Name: "-"});
            return colNames;
        }

        function getColsCount(tableSettings) {
            let colsCount;
            let tbody = getTableBodyElement(tableSettings);
            if (tbody === undefined || tbody === null || tableSettings.forceRemoveHeaders === true) {
                //ToDo: proveri koja je razlika izmedju object.keys.length i bez keys.length
                colsCount = Object.keys(tableSettings.tableData[0]).length;
            } else {
                let headElements = tbody.getElementsByClassName('head');
                colsCount = headElements.length;
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
            if (tableSettings.tableContainerElement.getElementsByClassName('head').length > 0) {
                return true;
            } else {
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
                for (let col = 1; col < colsCount; col++) {
                    let head = document.createElement('div');
                    head.innerHTML = Object.keys(tableSettings.tableData[0])[col];
                    head.className = 'head cell';
                    let columnName = Object.keys(tableSettings.tableData[0])[col];
                    columnName = columnName.toLowerCase();
                    columnName = columnName.replace(/ /g, '-');
                    head.dataset.sortName = columnName;
                    head.classList.add('cell-' + columnName);
                    //head.classList.add();
                    if (tableSettings.stickyRow === true) {
                        head.classList.add('sticky');
                        if (tableSettings.stickyColumn === false) {
                            head.classList.add('first-cell');
                        } else {
                            head.classList.remove('first-cell');
                        }
                    }
                    tbody.appendChild(head);
                    head.addEventListener('click', function () {
                        makeColumnActive(head, tableSettings);
                    });
                }
                let filterContainerElement = tableSettings.tableContainerElement.getElementsByClassName('element-table-filters-container')[0];
                insertAfter(filterContainerElement, tbody);
            } else {
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
            tbody.style.gridTemplateColumns = `repeat(${colsCount - 1}, 1fr)`;
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
                for (let col = 1; col < colsCount; col++) {
                    let cell = document.createElement('div');
                    cell.innerHTML = tableSettings.tableData[row][Object.keys(tableSettings.tableData[row])[col]];
                    let cellClassName = generateCellClassName(tableSettings.tableData, col);
                    cell.className = 'cell ' + cellClassName;
                    if (col === 1) {
                        cell.classList.add('first');
                        cell.classList.add('cell');
                    }
                    cell.classList.add(`row-${rowId}`);
                    cell.classList.add(`row-flag-${tableSettings.tableData[row][Object.keys(tableSettings.tableData[row])[0]]}`);
                    if (tableSettings.stickyColumn === true && col === 1) {
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

        /*--------------------------------------------------------------------------------------*/


        /*-------------------------------------- PAGINATION ---------------------------------------*/

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
            bindPaginationLinkHandlers();

        });

        function displayLastPageNumber(tableSettings) {
            let lastPagePaginationElement = tableSettings.tableContainerElement.getElementsByClassName('pagination-last-page element-pagination-link')[0];

            lastPagePaginationElement.addEventListener('mouseover', function () {
                lastPagePaginationElement.innerHTML = lastPagePaginationElement.dataset.page;
            });

            lastPagePaginationElement.addEventListener('mouseout', function () {
                lastPagePaginationElement.innerHTML = '>>';
            });
        }

        function updateTablePagination(tableSettings) {
            //toDo: dummy data
            let activePage = 1;
            let lastPage = 220;

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
                paginationButtons[i].dataset.page = paginationArray[i];
                paginationButtons[i].innerHTML = paginationArray[i];
                if (paginationButtons[i].innerHTML == activePage) {
                    paginationButtons[i].classList.add('active');
                } else if (paginationArray[i] === undefined) {
                    paginationButtons[i].classList.add('hidden');
                }
            }
            displayLastPageNumber(tableSettings);
        }

        /*--------------------------------------------------------------------------------------*/


        /*---------------------------------- UPDATING TABLE -----------------------------------*/

        function updateTable(tableSettings) {
            generateTableHeaders(tableSettings);
            generateTableRows(tableSettings);
            updateTablePagination(tableSettings);
        }

        function initFilters(tableSettings){
            let moduleName = tableSettings.pageSelectorId.replace('#page-', '');
            console.log('module name in init filters', moduleName);
            aftFilter.initFilters(tableSettings);
        }

        on('table/update', function (params) {
            let tableSettings = params.tableSettings;
            let tableData = [];
            let apiItems = params.data.Data.Items;

            console.log('Api items for table update: ', apiItems);

            apiItems.forEach(function (item) {
                tableData.push(item.EntryData);
            });

            tableSettings.tableData = transformApiData(tableData);
            initFilters(tableSettings);
            updateTable(tableSettings);
        });

        function initUpdateTable(tableSettings) {
            //get data from page

            let data = {EndpointId: tableSettings.endpointId};

            trigger(tableSettings.dataEvent, {
                data: data,
                tableSettings: tableSettings,
                callbackEvent: 'table/update'
            });
        }

        /*--------------------------------------------------------------------------------------*/


        /*-------------------------- PAGINATION LINK CLICK HANDLERS ---------------------------*/

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

        /*--------------------------------------------------------------------------------------*/


        /*-------------------------------------- SORTING --------------------------------------*/

        function getHeaders(tableSettings) {
            return tableSettings.tableContainerElement.getElementsByClassName('head');
        }

        function getActiveColumn(tableSettings) {
            return tableSettings.tableContainerElement.getElementsByClassName('sort-active')[0];
        }

        function makeColumnActive(header, tableSettings) {
            let headers = getHeaders(tableSettings);
            for (let i = 0; i < headers.length; i++) {
                if (headers[i] !== header) {
                    headers[i].classList.remove('sort-active');
                    headers[i].classList.remove('sort-asc');
                    headers[i].classList.remove('sort-desc');
                    delete headers[i].dataset.direction;
                }
            }
            header.classList.add('sort-active');
            toggleDirection(header, tableSettings);
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

        function removeFlagClass(columnElement) {
            let flagClassRegExp = /(row-flag-\d+) ?/;
            let columnElementClasses = columnElement.className;
            let flagClass = flagClassRegExp.exec(columnElementClasses)[1];
            columnElement.classList.remove(flagClass);

        }

        function hideColumn(tableSettings, columnName) {
            let colsCount = getCurrentColsCount(tableSettings);
            let columnElements = tableSettings.tableContainerElement.getElementsByClassName('cell-' + columnName);
            console.log(columnElements);
            if (columnElements.length !== 0) {
                for (let i = 0; i < columnElements.length; i++) {
                    if (i !== 0) {
                        removeFlagClass(columnElements[i]);
                    }
                    columnElements[i].classList.add('hidden-column');
                    columnElements[i].classList.remove('head');
                }
                let tbody = getTableBodyElement(tableSettings);
                tbody.style.gridTemplateColumns = `repeat(${colsCount - 1}, 1fr)`;
            } else {
                alert('There is no such column!');
            }
        }

        /*--------------------------------------------------------------------------------------*/


        /*------------------------------------ FILTERING ------------------------------------*/

        function collectAllFilterElements(tableSettings) {
            let filterElements;
            if(tableSettings.pageSelectorId !== undefined) {
                filterElements = $$(tableSettings.pageSelectorId).getElementsByClassName('element-table-filters');
            } else if(tableSettings.filterContainerSelector !== undefined) {
                filterElements = $$(tableSettings.filterContainerSelector).getElementsByClassName('element-table-filters');
            } else {
                filterElements = $$(tableSettings.tableContainerElement.getElementsByClassName('element-table-filters'));
            }
/*            if (tableSettings.filterContainerSelector !== undefined) {
                filterElements = $$(tableSettings.filterContainerSelector).getElementsByClassName('element-table-filters');
            } else {
                filterElements = tableSettings.pageSelectorId.getElementsByClassName('element-table-filters');
            }*/
            return filterElements;
        }

        function isSingleCheckbox(element) {
            return element.type === types.checkbox && document.getElementsByName(element.name).length === 1;
        }

        function getPageSize(tableSettings) {
            if (tableSettings.filters.numberOfPages === undefined) {
                let pagesNumberElement = tableSettings.tableContainerElement.getElementsByClassName('pages-number')[0];
                let pagesNumberValue = pagesNumberElement.options[pagesNumberElement.selectedIndex].value;
                tableSettings.filters.numberOfPages = pagesNumberValue;
            }
            return tableSettings.filters.numberOfPages;
        }

        function getQuerySearch(tableSettings) {
            if (tableSettings.filters.querySearch === undefined) {
                let querySearchElement = tableSettings.tableContainerElement.getElementsByClassName('query-search')[0];
                let querySearchValue = querySearchElement.value;
                tableSettings.filters.querySearch = querySearchValue;
            }
            return tableSettings.filters.querySearch;
        }

        function collectFiltersFromPage(tableSettings) {
            tableSettings.filters = {};
            let filterElements = collectAllFilterElements(tableSettings);
            console.log('all filter elements', filterElements);
            let processedElements = Array.prototype.slice.apply(filterElements).map(function (element) {
                return element.dataset.value !== '-' ? element.dataset.value.split(',') : null
            });
            console.log('Processed elements', processedElements);
            //todo ajust to work with AFT
            /*            getPageSize(tableSettings);
                        getQuerySearch(tableSettings);*/
            return processedElements;
        }

        /*
                function collectFiltersFromPage(tableSettings) {
                    tableSettings.filters = {};
                    let filterName, filterValue, filterValueArrayCheckBox = [], filterValueArraySelect = [];
                    let filterElements = collectAllFilterElements(tableSettings);
                    console.log('colected filter elements', filterElements);
                    for (let i = 0; i < filterElements.length; i++) {
                        if (filterElements[i].tagName === tagNames.textarea || filterElements[i].tagName === tagNames.input || filterElements[i].tagName === tagNames.select) {
                            filterName = filterElements[i].name;
                            if (filterElements[i].tagName === tagNames.textarea || filterElements[i].tagName === tagNames.input) {
                                if (filterElements[i].type === types.radio && filterElements[i].checked === true) { //radio
                                    filterValue = filterElements[i].value;
                                    tableSettings.filters[filterName] = filterValue;
                                } else if (isSingleCheckbox(filterElements[i]) && filterElements[i].checked === true) {
                                    filterName = filterElements[i].name;
                                    filterValue = filterElements[i].value;
                                    tableSettings.filters[filterName] = filterValue;
                                } else if (filterElements[i].type === types.checkbox && filterElements[i].checked === true) { //checkbox
                                    filterValueArrayCheckBox.push(filterElements[i].value);
                                    tableSettings.filters[filterName] = filterValueArrayCheckBox;
                                } else if (filterElements[i].type !== types.checkbox && filterElements[i].type !== types.radio) { //text area & input
                                    filterValue = filterElements[i].value;
                                    tableSettings.filters[filterName] = filterValue;
                                }
                            } else if (filterElements[i].tagName === tagNames.select) { //select
                                if (filterElements[i].attributes[attributes.multiple]) { //select multiple
                                    let selectedOptions = filterElements[i].selectedOptions;
                                    for (let i = 0; i < selectedOptions.length; i++) {
                                        filterValueArraySelect.push(selectedOptions[i].value);
                                    }
                                    tableSettings.filters[filterName] = filterValueArraySelect;
                                } else {
                                    filterValue = filterElements[i].options[filterElements[i].selectedIndex].value;
                                    tableSettings.filters[filterName] = filterValue;
                                }
                            }
                        } else { //div
                            filterName = filterElements[i].dataset.name;
                            filterValue = filterElements[i].dataset.value;
                            tableSettings.filters[filterName] = filterValue;
                        }
                    }
                    //todo ajust to work with AFT
                    /!*            getPageSize(tableSettings);
                                getQuerySearch(tableSettings);*!/
                    return tableSettings.filters;
                }
        */

        function setPageFilters(tableSettings) {
            let filters = tableSettings.filters;
            let filterElements = collectAllFilterElements(tableSettings);

            for (let i = 0; i < filterElements.length; i++) {
                if (filterElements[i].tagName === tagNames.input || filterElements[i].tagName === tagNames.textarea) { //input and textarea
                    if (filterElements[i].type !== types.radio && filterElements[i].type !== types.checkbox && filters.hasOwnProperty(filterElements[i].name)) { //single input and textarea
                        filterElements[i].value = filters[filterElements[i].name];
                    } else if (filterElements[i].type === types.radio && filters.hasOwnProperty(filterElements[i].name)) { //input radio
                        filterElements[i].checked = (filterElements[i].value === filters[filterElements[i].name]);
                    } else if (filterElements[i].type === types.checkbox) {
                        if (isSingleCheckbox(filterElements[i])) {
                            filterElements[i].checked = (filters[filterElements[i].name] !== undefined);//input single checkbox
                        } else {
                            if (filters[filterElements[i].name] !== undefined) {
                                filterElements[i].checked = filters[filterElements[i].name].includes(filterElements[i].value); //input multiple checkboxes
                            } else {
                                filterElements[i].checked = false;
                            }
                        }
                    }
                } else if (filterElements[i].tagName === tagNames.select) { //select & multiple select
                    if (filters.hasOwnProperty(filterElements[i].name)) {
                        let options = filterElements[i].options; //options in select element
                        for (let o = 0; o < options.length; o++) {
                            filterElements[i].options[o].selected = filters[filterElements[i].name].includes(options[o].value);
                        }
                    }
                }
            }
        }

        /*--------------------------------------------------------------------------------------*/


        /*------------------------------- PREPARING DATA FOR API -------------------------------*/

        function getActivePage(tableSettings) {
            let activePageButton = tableSettings.tableContainerElement.getElementsByClassName('element-pagination-page-button active')[0];
            let activePageNumber = activePageButton.dataset.page;
            tableSettings.activePage = activePageNumber;
            alert('Active page number is: ' + activePageNumber);
            return activePageNumber;
        }

        function prepareDataForApi(tableSettings) {
            getSorting(tableSettings);
            getActivePage(tableSettings);
            collectFiltersFromPage(tableSettings);

            let dataForApi = {};
            let sorting = tableSettings.sort;
            let activePage = tableSettings.activePage;
            let filters = tableSettings.filters;

            Object.keys(sorting).forEach(function (key) {
                dataForApi[key] = sorting[key];
            });

            dataForApi['activePage'] = activePage;

            Object.keys(filters).forEach(function (key) {
                dataForApi[key] = filters[key];
            });

            dataForApi = JSON.stringify(dataForApi);
            return dataForApi;
        }

        /*--------------------------------------------------------------------------------------*/


        /*------------------------------- TRANSFORMING DATA FROM API -------------------------------*/

        function transformApiData(data) {
            return data;
        }

        /*--------------------------------------------------------------------------------------*/


        /*------------------------------- COMMUNICATION WITH API -------------------------------*/

        function getApiResponse(tableSettings) {
            let dataForApi = prepareDataForApi(tableSettings);
            let callbackEvent = 'table/update';
            trigger(tableSettings.dataEvent, {
                tableSettings: tableSettings,
                data: dataForApi,
                callbackEvent: callbackEvent
            });
        }

        /*--------------------------------------------------------------------------------------*/


        /*--------------------------------- EVENT HANLDERS ---------------------------------*/

        on('table/filters/apply', function (params) {
            alert('APPLY FILTERS');
            collectFiltersFromPage(params.tableSettings);
        });

        /*--------------------------------------------------------------------------------------*/


        /*--------------------------------- INITIALIZING TABLE ---------------------------------*/

        function init(tableSettings) {

            tableSettings.tableContainerElement = $$(tableSettings.tableContainerSelector);
            let tableContainerElement = tableSettings.tableContainerElement;
            tableContainerElement.tableSettings = tableSettings;

            if (tableSettings.dataEvent !== null) {
                tableSettings.dataEvent = getEvent(tableSettings);
            }

            generateTablePagination(tableSettings);

            if (tableSettings.tableData === undefined) {
                // generateTableHeaders(tableSettings);
                initUpdateTable(tableSettings);
            } else {
                updateTable(tableSettings);
            }

/*            let applyButton = tableContainerElement.getElementsByClassName('apply')[0];
            if (applyButton !== undefined) {
                applyButton.addEventListener('click', function () {
                    getApiResponse(tableSettings);
                    console.log('Table settings after clicking Apply button: ', tableSettings);
                });
            }

            let resetButton = tableContainerElement.getElementsByClassName('reset')[0];
            if (resetButton !== undefined) {
                resetButton.addEventListener('click', function () {
                    setPageFilters(tableSettings);
                    console.log('Table settings after clicking Reset button: ', tableSettings);
                });
            }

            let hideColumnButton = tableContainerElement.getElementsByClassName('hide-column-button')[0];
            if (hideColumnButton !== undefined) {
                hideColumnButton.addEventListener('click', function () {
                    let columnInputElement = tableContainerElement.getElementsByClassName('hide-column-input')[0];
                    let columnName = columnInputElement.value;
                    hideColumn(tableSettings, columnName);
                });
            }*/
        }

        return {
            init: init,
            getColNamesOfDisplayedTable: getColNamesOfDisplayedTable,
            collectFiltersFromPage: collectFiltersFromPage,
            setPageFilters: setPageFilters,
            getPageSize: getPageSize,
            getSorting: getSorting
        };

        /*--------------------------------------------------------------------------------------*/

    }
)();