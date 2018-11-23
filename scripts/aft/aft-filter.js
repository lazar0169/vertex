const aftFilter = (function () {
    let advanceTableFilter = $$('#aft-advance-table-filter');
    let advanceTableFilterActive = $$('#aft-advance-table-filter-active');
    let clearAdvanceFilter = $$('#aft-advance-table-filter-clear');
    let aftMachinesNumbers = $$('#aft-machines-number');
    let aftAdvanceApplyFilters = $$('#aft-advance-table-filter-apply').children[0];

    let currentTableSettingsObject;
    let endpointId;

    function setTableSettings(tableSettings) {
        currentTableSettingsObject = tableSettings;
    }

    function showAdvanceTableFilter() {
        advanceTableFilter.classList.toggle('aft-advance-active');
        advanceTableFilterActive.classList.toggle('hidden');
    }

    advanceTableFilter.addEventListener('click', function () {
        showAdvanceTableFilter();
    });

    function getFiltersFromAPI(endpointId, tableSettings) {
        let data = {
            'EndpointId': endpointId
        };
        let tableSettingsObject = tableSettings;
        let successEvent = 'aft/filters/display';
        trigger('communicate/aft/getFilters', {
            data: data,
            successEvent: successEvent,
            tableSettings: tableSettingsObject
        });
    }

    function getColNamesOfTable(tableSettings) {
        let colsCount = table.getColNamesOfDisplayedTable(tableSettings);
        let colsCountArray = [];
        for (let i = 0; i < colsCount.length; i++) {
            colsCountArray.push({
                'Name': i + 1
            });
        }
        return colsCountArray;
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

        aftMachinesNumbers.appendChild(dropdown.generate(machinesNumber));
        aftAdvanceTableFilterDateRange.appendChild(dropdownDate.generate(nekiniz));
        aftAdvanceTableFilterFinished.appendChild(multiDropdown.generate(filters.MachineNameList));
        aftAdvanceTableFilterJackpot.appendChild(multiDropdown.generate(filters.JackpotNameList));
        aftAdvanceTableFilterType.appendChild(multiDropdown.generate(filters.TypeList));
        aftAdvanceTableFilterStatus.appendChild(multiDropdown.generate(filters.StatusList));
        // aftAdvanceTableFilterColumn.appendChild(multiDropdown.generate(colNames));
    }

    on('aft/filters/display', function (params) {
        let apiResponseData = params.data;
        console.log('api response data', apiResponseData);
        let tableSettings = params.tableSettings;
        let filters = apiResponseData.Data;
        console.log('filters', filters);
        console.log('table settings filters', tableSettings.filters);
        displayFilters(filters, tableSettings);
    });

    function initFilters(tableSettings) {
        setTableSettings(tableSettings);
        endpointId = tableSettings.endpointId;
        getFiltersFromAPI(endpointId, tableSettings);
    }

    clearAdvanceFilter.addEventListener('click', function () {
        trigger('clear/dropdown/filter', {data: advanceTableFilterActive});
    });

    aftAdvanceApplyFilters.addEventListener('click', function () {
        console.log('aft table settings', currentTableSettingsObject);
        let pageFilters = table.collectFiltersFromPage(currentTableSettingsObject);
        console.log('page filters', pageFilters);
        // let pageSize = table.getPageSize(currentTableSettingsObject);
        let filtersForApi = {
            "EndpointId": endpointId,
            "DateFrom": pageFilters[0],
            "DateTo": pageFilters[0],
            "MachineList": pageFilters[1],
            "JackpotList": pageFilters[2],
            "Status": pageFilters[4],
            "Type": pageFilters[3],
            "BasicData": {
                "Page": 1,
                "PageSize": ''/*pageSize*/,
                "SortOrder": '',
                "SortName": ''
            }
        };
        currentTableSettingsObject.filters = filtersForApi;

        console.log(filtersForApi);

        let successEvent = 'aft/table/update';
        trigger('communicate/aft/previewTransactions', {data: filtersForApi, successEvent: successEvent});

    });

    on('aft/table/update', function(params){
        let apiData = params.data;
        let tableSettings = params.tableSettings;
        trigger('table/update', {data: apiData, tableSettings: tableSettings});

    });

    on('aft/filters/apply', function(params){
        console.log('params', params);
        alert('APPLIED');
    });

    return {
        initFilters: initFilters
    };

})();