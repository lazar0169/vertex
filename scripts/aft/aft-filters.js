const aftFilters = (function () {
    let advanceTableFilter = $$('#aft-advance-table-filter');
    let advanceTableFilterActive = $$('#aft-advance-table-filter-active');
    let clearAdvanceFilter = $$('#aft-advance-table-filter-clear');
    let aftMachinesNumbers = $$('#aft-machines-number');
    let aftAdvanceApplyFilters = $$('#aft-advance-table-filter-apply').children[0];

    let currentTableSettingsObject;

    function showAdvanceTableFilter() {
        advanceTableFilter.classList.toggle('aft-advance-active');
        advanceTableFilterActive.classList.toggle('hidden');
    }

    advanceTableFilter.addEventListener('click', function () {
        showAdvanceTableFilter();
    });

    function getFiltersFromAPI(tableSettings) {
        let data = {
            'EndpointId': tableSettings.endpointId
        };
        let tableSettingsObject = tableSettings;
        let successEvent = 'aft/filters/display';
        trigger('communicate/aft/getFilters', {
            data: data,
            successEvent: successEvent,
            tableSettings: tableSettingsObject
        });
    }

    on('aft/filters/init', function(params){
        let tableSettings = params.tableSettings;
        currentTableSettingsObject = tableSettings;
        getFiltersFromAPI(tableSettings);
    });

    function getColNamesOfTable(tableSettings) {
        let colNamesArray = table.getColNamesOfDisplayedTable(tableSettings);
        return colNamesArray;
    }

    function removeChildren(element) {
        while (element.childElementCount > 1) {
            element.removeChild(element.lastChild);
        }
    }

    //display initial filters
    function displayFilters(filters, tableSettings) {

        //filter elements
        let aftAdvanceTableFilterDateRange = $$('#aft-advance-table-filter-date-range');
        let aftAdvanceTableFilterFinished = $$('#aft-advance-table-filter-finished');
        let aftAdvanceTableFilterJackpot = $$('#aft-advance-table-filter-jackpot');
        let aftAdvanceTableFilterType = $$('#aft-advance-table-filter-type');
        let aftAdvanceTableFilterStatus = $$('#aft-advance-table-filter-status');
        let aftAdvanceTableFilterColumn = $$('#aft-advance-table-filter-column');

        let colNames = getColNamesOfTable(tableSettings);

        removeChildren(aftAdvanceTableFilterDateRange);
        removeChildren(aftAdvanceTableFilterFinished);
        removeChildren(aftAdvanceTableFilterJackpot);
        removeChildren(aftAdvanceTableFilterType);
        removeChildren(aftAdvanceTableFilterStatus);
        removeChildren(aftAdvanceTableFilterColumn);

        aftMachinesNumbers.appendChild(dropdown.generate(machinesNumber));
        aftAdvanceTableFilterDateRange.appendChild(dropdownDate.generate(nekiniz));
        aftAdvanceTableFilterFinished.appendChild(multiDropdown.generate(filters.MachineNameList));
        aftAdvanceTableFilterJackpot.appendChild(multiDropdown.generate(filters.JackpotNameList));
        aftAdvanceTableFilterType.appendChild(multiDropdown.generate(filters.TypeList));
        aftAdvanceTableFilterStatus.appendChild(multiDropdown.generate(filters.StatusList));
        aftAdvanceTableFilterColumn.appendChild(multiDropdown.generate(colNames));
    }

    on('aft/filters/display', function (params) {
        let apiResponseData = params.data;
        let tableSettings = params.tableSettings;
        let filters = apiResponseData.Data;
        tableSettings.filters = filters;
        displayFilters(filters, tableSettings);
    });

    clearAdvanceFilter.addEventListener('click', function () {
        trigger('clear/dropdown/filter', {data: advanceTableFilterActive});
    });

    aftAdvanceApplyFilters.addEventListener('click', function () {
        let pageFilters = table.collectFiltersFromPage(currentTableSettingsObject);
        let sorting = table.getSorting(currentTableSettingsObject);
        let filtersForApi = {
            "EndpointId": currentTableSettingsObject.endpointId,
            "DateFrom": pageFilters[1],
            "DateTo": pageFilters[1],
            "MachineList": pageFilters[2],
            "JackpotList": pageFilters[3],
            "Status": pageFilters[5],
            "Type": pageFilters[4],
            "BasicData": {
                "Page": 1,
                "PageSize": pageFilters[0],
                "SortOrder": sorting.SortOrder,
                "SortName": sorting.SortName
            }
        };
        currentTableSettingsObject.filters = filtersForApi;

        let successEvent = 'aft/table/update';
        trigger('communicate/aft/previewTransactions', {data: filtersForApi, successEvent: successEvent, tableSettings: currentTableSettingsObject});

    });

    on('aft/table/update', function (params) {
        let apiData = params.data;
        let tableSettings = params.tableSettings;
        trigger('table/update', {data: apiData, tableSettings: tableSettings});

    });

})();