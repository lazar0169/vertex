let table = (function () {

        let rows = [];
        const columnDirection = {
            ascending: 1,
            descending: -1
        };
        const directionClass = {
            ascending: 'sort-asc',
            descending: 'sort-desc'
        };
        const directionDataAtt = {
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


        /*---------------------------- FUNCTIONS FOR GENERATING TABLE ----------------------------*/

        function insertAfter(referenceNode, newNode) {
            return referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        }

        function getEvent(tableSettings) {
            let event;

            if (tableSettings.dataEvent !== undefined) {
                event = tableSettings.dataEvent;
            }
            else if (tableSettings.tableContainerElement.dataset.dataEvent !== undefined) {
                event = tableSettings.tableContainerElement.dataset.dataEvent;
            }
            else {
                console.error('Event doesn\'t exist!');
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
                    let columnName = Object.keys(tableSettings.tableData[0])[col];
                    columnName = columnName.toLowerCase();
                    columnName = columnName.replace(/ /g, '-');
                    head.dataset.sortName = columnName;
                    //head.classList.add();
                    if (tableSettings.stickyRow === true) {
                        head.classList.add('sticky');
                    }
                    tbody.appendChild(head);
                    head.addEventListener('click', function () {
                        makeColumnActive(head, tableSettings);
                    });
                }
                let filterElement = tableSettings.tableContainerElement.getElementsByClassName('element-table-filters-container')[0];
                insertAfter(filterElement, tbody);
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
            }
            else return;
        }

        on('table/pagination/display', function (params) {
            let paginationElement = params.element;
            let tableContainerElement = params.params.tableSettings.tableContainerElement;
            tableContainerElement.appendChild(paginationElement);
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
            displayLastPageNumber(tableSettings);
        }

        /*--------------------------------------------------------------------------------------*/


        /*---------------------------------- UPDATING TABLE -----------------------------------*/

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

            trigger(tableSettings.dataEvent, {
                data: data,
                tableSettings: tableSettings,
                callbackEvent: 'table/update'
            });
        }

        on('table/update', function (params) {
            updateTable(params.tableSettings);
        });

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
            if (!header.classList.contains(directionClass.ascending) && !header.classList.contains(directionClass.descending) && !header.dataset.direction) {
                header.classList.add(directionClass.ascending);
                header.dataset.direction = directionDataAtt.ascending;
            }
            else if (header.classList.contains(directionClass.descending)) {
                header.classList.remove(directionClass.descending);
                header.classList.add(directionClass.ascending);
                header.dataset.direction = directionDataAtt.ascending;
            }
            else {
                header.classList.remove(directionClass.ascending);
                header.classList.add(directionClass.descending);
                header.dataset.direction = directionDataAtt.descending;
            }
        }

        function getSorting(tableSettings) {
            tableSettings.sort = {
                direction: '',
                sortName: ''
            };
            let activeHeader = getActiveColumn(tableSettings);
            if (activeHeader !== undefined) {
                tableSettings.sort.sortName = activeHeader.dataset.sortName;
                if (activeHeader.dataset.direction === directionDataAtt.ascending) {
                    tableSettings.sort.direction = columnDirection.ascending;
                }
                else if (activeHeader.dataset.direction === directionDataAtt.descending) {
                    tableSettings.sort.direction = columnDirection.descending;
                }
            }
            return tableSettings.sort;
        }

        /*--------------------------------------------------------------------------------------*/


        /*------------------------------------ FILTERING ------------------------------------*/

        function collectAllFilterElements(tableSettings) {
            return tableSettings.tableContainerElement.getElementsByClassName('element-table-filters');
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

        function getFilters(tableSettings) {
            tableSettings.filters = {};
            let filterName, filterValue, filterValueArrayCheckBox = [], filterValueArraySelect = [];
            let filterElements = collectAllFilterElements(tableSettings);
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
                        if (filterElements[i].attributes['multiple']) { //select multiple
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
            getPageSize(tableSettings);
            getQuerySearch(tableSettings);
            return tableSettings.filters;
        }

        function setDefaultFilters(tableSettings) {
            tableSettings.defaultFilters = getFilters(tableSettings);
        }

        function resetFilters(tableSettings) {
            let defaultFilters = tableSettings.defaultFilters;
            let filterElements = collectAllFilterElements(tableSettings);

            for (let i = 0; i < filterElements.length; i++) {
                filterElements[i].checked = false;
                filterElements[i].value = null;
                Object.keys(defaultFilters).forEach(function(key){
                    if(filterElements[i].name === key){
                        filterElements[i].value = defaultFilters[key];
                        if(filterElements[i].type === types.radio && filterElements[i].value === defaultFilters[key]){
                            filterElements[i].checked = true;
                        }
                    }
                });
            }
        }

        /*--------------------------------------------------------------------------------------*/


        /*------------------------------- PREPARING DATA FOR API -------------------------------*/

        function getActivePage(tableSettings) {
            let activePageButton = tableSettings.tableContainerElement.getElementsByClassName('element-pagination-page-button active')[0];
            let activePageNumber = activePageButton.dataset.page;
            tableSettings.activePage = activePageNumber;
            alert(activePageNumber);
            return activePageNumber;
        }

        function prepareData(tableSettings) {
            getSorting(tableSettings);
            getActivePage(tableSettings);
            getFilters(tableSettings);

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


        /*------------------------------- COMMUNICATION WITH API -------------------------------*/

        function getApiResponse(tableSettings) {
            let dataForApi = prepareData(tableSettings);
            let callbackEvent = 'table/update';
            trigger(tableSettings.dataEvent, {
                tableSettings: tableSettings,
                data: dataForApi,
                callbackEvent: callbackEvent
            });
        }

        /*--------------------------------------------------------------------------------------*/


        /*--------------------------------- INITIALIZING TABLE ---------------------------------*/

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

            //setting default filters
            setDefaultFilters(tableSettings);

            generateTablePagination(tableSettings);

            if (tableSettings.tableData === undefined) {
                generateTableHeaders(tableSettings);
                initUpdateTable(tableSettings);
            }

            else {
                updateTable(tableSettings);
            }

            let applyButton = tableSettings.tableContainerElement.getElementsByClassName('apply')[0];
            applyButton.addEventListener('click', function () {
                getApiResponse(tableSettings);
                console.log(tableSettings);
            });

            let resetButton = tableSettings.tableContainerElement.getElementsByClassName('reset')[0];
            resetButton.addEventListener('click', function () {
                resetFilters(tableSettings);
                console.log(tableSettings);
            });
        }

        return {
            init: init
        };

        /*--------------------------------------------------------------------------------------*/

    }
)();