const ticketsFilter = (function () {

    let ticketSortName = {
        type: 1,
        amount: 2,
        code: 3,
        issuedby: 4, //todo check if this is it
        redeemedby: 5, //todo check if this is it
        status: 9
    };

    let ticketStatus = {
        TicketActive: 0,
        TicketDeleted: 1,
        TicketStacked: 2,
        TicketEscrowed: 3,
        TicketPayed: 4,
        TicketNotExisting: 5,
        TicketCanceled: 8

    };

    let ticketType = {
        Cashable: 0,
        Promo: 1,
        Other: 2
    };

    let ticketAdvanceFilter = $$('#tickets-advance-table-filter');
    let advanceTableFilterActive = $$('#tickets-advance-table-filter-active');
    let ticketsMachinesNumbers = $$('#tickets-machines-number');
    let advanceTableFilterInfobar = $$('#ticket-advance-table-filter-active-infobar');
    let clearAdvanceFilterInfobar = $$('#ticket-advance-table-filter-active-infobar-button').children[0];
    let ticketsAdvanceFilterApllyButton = $$('#tickets-advance-table-filter-apply').children[0];
    let ticketsAdvanceFilterCancelButton = $$('#tickets-advance-table-filter-clear').children[0];

    dropdown.generate(machinesNumber, ticketsMachinesNumbers);

    let currentTableSettingsObject;
    let activeHeadElement;

    function showAdvanceTableFilter() {
        ticketAdvanceFilter.classList.add('advance-filter-active');
        advanceTableFilterActive.classList.remove('hidden');
    }

    ticketAdvanceFilter.addEventListener('click', function () {
        showAdvanceTableFilter();
    });

    function getFiltersFromAPI(tableSettings) {
        let data = {
            'EndpointId': tableSettings.endpointId
        };
        let tableSettingsObject = tableSettings;
        let successEvent = 'tickets/filters/display';
        trigger(communication.events.tickets.getFilters, {
            data: data,
            successEvent: successEvent,
            tableSettings: tableSettingsObject
        });
    }

    on('tickets/filters/init', function (params) {
        let tableSettings = params.tableSettings;
        currentTableSettingsObject = tableSettings;
        getFiltersFromAPI(tableSettings);
    });

    function formatChooseColumnTicketsData(chooseColumnListArray) {
        let formattedColumnArray = [];
        let columnObject = {};
        chooseColumnListArray.forEach(function (column) {
            columnObject = {
                Name: localization.translateMessage(column.Name),
                Value: column.Name
            };
            formattedColumnArray.push(columnObject);
        });
        return formattedColumnArray;
    }

    function getColNamesOfTable(tableSettings) {
        let colNamesArray = table.getColNamesOfDisplayedTable(tableSettings);
        colNamesArray = formatChooseColumnTicketsData(colNamesArray);
        return colNamesArray;
    }

    //display initial filters
    function displayFilters(filters, tableSettings) {

        //filter elements
        let ticketsAdvanceTableFiltersStatus = $$('#tickets-advance-table-filter-status');
        let ticketsAdvanceTableFiltersTypes = $$('#tickets-advance-table-filter-types');
        let ticketsAdvanceTableFiltersPrinted = $$('#tickets-advance-table-filter-printed');
        let ticketsAdvanceTableFiltersRedeemed = $$('#tickets-advance-table-filter-redeemed');
        let ticketsAdvanceTableFilterColumn = $$('#tickets-advance-table-filter-column');

        let states =  table.parseFilterValues(filters.TicketStateList, 'Name', 'Id', -1);
        multiDropdown.generate(states, ticketsAdvanceTableFiltersStatus);
        let types =  table.parseFilterValues(filters.TypesList, 'Name', 'Id', -1);
        multiDropdown.generate(types, ticketsAdvanceTableFiltersTypes);
        multiDropdown.generate(filters.PrintedAndRedeemed, ticketsAdvanceTableFiltersPrinted);
        multiDropdown.generate(filters.PrintedAndRedeemed, ticketsAdvanceTableFiltersRedeemed);

        //hide/show columns picker
        ticketsAdvanceTableFilterColumn.classList.add('table-element-select-columns');
        ticketsAdvanceTableFilterColumn.dataset.target = tableSettings.tableContainerSelector;
        let hideableColumns = table.getHideableColumns(tableSettings);
        hideableColumns.unshift({name: '-', value: null});
        //ToDo Neske: this can be removed when solution for parsed hack is found
        let columns = hideableColumns.map(function (item) {
            item.parsed = true;
            return item;
        });
        multiDropdown.generate(columns, ticketsAdvanceTableFilterColumn);
    }


    function formatTicketsApiData(filterArray) {
        if (filterArray !== undefined && filterArray !== null) {
            filterArray.forEach(function (filter) {
                filter.Name = localization.translateMessage(filter.Name);
                filter.Value = filter.Name;
            });
            return filterArray;
        }
    }

    on('tickets/filters/display', function (params) {
        let apiResponseData = params.data;
        let tableSettings = params.settingsObject;
        let filters = apiResponseData.Data;

        filters.PrintedAndRedeemed = formatTicketsApiData(filters.PrintedAndRedeemed);
        filters.TicketStateList = formatTicketsApiData(filters.TicketStateList);
        filters.TypesList = formatTicketsApiData(filters.TypesList);

        tableSettings.filters = filters;
        tableSettings.filtersInitialized = true;
        displayFilters(filters, tableSettings);
    });

    function prepareStatusArrayData(dataArray) {
        let preparedStatusData = [];
        if (dataArray !== null && dataArray !== undefined) {
            dataArray.forEach(function (status) {
                if (ticketStatus[status] !== undefined) {
                    preparedStatusData.push(ticketStatus[status]);
                } else {
                    preparedStatusData.push(null);
                }
            });
        }
        if(preparedStatusData.length === 0) {
            preparedStatusData = null;
        }
        return preparedStatusData;
    }

    function prepareTypeArrayData(dataArray) {
        let preparedTypeData = [];
        if (dataArray !== null && dataArray !== undefined) {
            dataArray.forEach(function (status) {
                if (ticketType[status] !== undefined) {
                    preparedTypeData.push(ticketType[status]);
                } else {
                    preparedTypeData.push(null);
                }
            });
        }
        if(preparedTypeData.length === 0) {
            preparedTypeData = null;
        }
        return preparedTypeData;
    }

    function preparePrintedListData(dataArray) {
        let preparedPrintedListData = [];
        if (dataArray !== null && dataArray !== undefined) {
            dataArray.forEach(function (arrayElement) {
                let object = {
                    Name: arrayElement.toString(),
                    ID: parseInt(arrayElement)
                };
                preparedPrintedListData.push(object);
            });
        }
        if(preparedPrintedListData.length === 0) {
            preparedPrintedListData = null;
        }
        return preparedPrintedListData;
    }

    function prepareRedeemListData(dataArray) {
        let preparedRedeemListData = [];
        if (dataArray !== null && dataArray !== undefined) {
            dataArray.forEach(function (arrayElement) {
                let object = {
                    Name: arrayElement.toString(),
                    ID: parseInt(arrayElement)
                };
                preparedRedeemListData.push(object);
            });
        }
        if(preparedRedeemListData.length === 0) {
            preparedRedeemListData = null;
        }
        return preparedRedeemListData;
    }

    function prepareTicketsFiltersForApi(currentTableSettingsObject) {
        let pageFilters = table.collectFiltersFromPage(currentTableSettingsObject);
        let sortDirection = currentTableSettingsObject.sort.SortDirection;
        let sortName = currentTableSettingsObject.sort.SortName;
        let filtersForApi = {
            "EndpointId": currentTableSettingsObject.endpointId,
            "DateFrom": pageFilters.PrintDate !== null ? pageFilters.PrintDate[0] : pageFilters.PrintDate,
            "DateTo": pageFilters.PrintDate !== null ? pageFilters.PrintDate[0] : pageFilters.PrintDate,
            "RedeemDateFrom": pageFilters.RedeemDate !== null ? pageFilters.RedeemDate[0] : pageFilters.RedeemDate,
            "RedeemDateTo": pageFilters.RedeemDate !== null ? pageFilters.RedeemDate[0] : pageFilters.RedeemDate,
            "PrintedList": preparePrintedListData(pageFilters.Printed),
            "RedeemList": prepareRedeemListData(pageFilters.Redeemed),
            "Status": pageFilters.Status,
            "Type": pageFilters.TypesList,
            "BasicData": {
                "Page": currentTableSettingsObject.activePage,
                "PageSize": parseInt(pageFilters.PageSize, 10),
                "SortOrder": sortDirection,
                "SortName": ticketSortName[sortName] !== undefined ? ticketSortName[sortName] : null
            },
            "TokenInfo": sessionStorage.token
        };

        table.setFiltersPage(currentTableSettingsObject,filtersForApi);
        //Set visible columns for tableSettings object
        currentTableSettingsObject.visibleColumns = pageFilters.Columns;

        currentTableSettingsObject.filters = filtersForApi;

        return filtersForApi;
    }

    ticketsAdvanceFilterApllyButton.addEventListener('click', function () {
        let filtersForApi = prepareTicketsFiltersForApi(currentTableSettingsObject);
        trigger(communication.events.tickets.previewTickets, {
            data: filtersForApi,
            tableSettings: currentTableSettingsObject
        });

        trigger('filters/show-selected-filters', { active: advanceTableFilterActive, infobar: advanceTableFilterInfobar });
    });

    ticketsAdvanceFilterCancelButton.addEventListener('click', function () {
        trigger('clear/dropdown/filter', { data: advanceTableFilterActive });
        trigger('filters/show-selected-filters', { active: advanceTableFilterActive, infobar: advanceTableFilterInfobar });
    });

    on('tickets/filters/pagination', function (params) {
        let tableSettings = params.tableSettings;
        let filtersForApi = prepareTicketsFiltersForApi(tableSettings);
        trigger(communication.events.tickets.previewTickets, {
            tableSettings: tableSettings,
            data: filtersForApi,
            callbackEvent: 'table/update'
        });
    });

    on('tickets/filters/sorting', function (params) {
        let tableSettings = params.tableSettings;
        activeHeadElement = currentTableSettingsObject.tableContainerElement.getElementsByClassName('sort-active');
        if (activeHeadElement !== null && activeHeadElement !== undefined) {
            let filtersForApi = prepareTicketsFiltersForApi(tableSettings);
            filtersForApi.BasicData.SortOrder = params.sorting.SortDirection;
            filtersForApi.BasicData.SortName = ticketSortName[params.sorting.SortName] !== undefined ? ticketSortName[params.sorting.SortName] : null;
            trigger(communication.events.tickets.previewTickets, {
                tableSettings: tableSettings,
                data: filtersForApi,
                callbackEvent: 'table/update'
            });
        }
    });


    clearAdvanceFilterInfobar.addEventListener('click', function () {
        trigger('clear/dropdown/filter', { data: advanceTableFilterActive });
        trigger('filters/show-selected-filters', { active: advanceTableFilterActive, infobar: advanceTableFilterInfobar });
    });

    on('tickets/filters/pageSize', function (params) {
        let tableSettings = params.tableSettings;
        let filtersForApi = prepareTicketsFiltersForApi(tableSettings);
        trigger(communication.events.tickets.previewTickets, {
            tableSettings: tableSettings,
            data: filtersForApi,
            callbackEvent: 'table/update'
        });
    })

})();

