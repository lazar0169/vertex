const aftFilter = (function () {
    let advanceTableFilter = $$('#aft-advance-table-filter');
    let advanceTableFilterActive = $$('#aft-advance-table-filter-active');
    let clearAdvanceFilter = $$('#aft-advance-table-filter-clear');
    let aftMachinesNumbers = $$('#aft-machines-number');
    let aftAdvanceApplyFilters = $$('#aft-advance-table-filter-apply').children[0];

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
        trigger('communicate/aft/getFilters', {data: data, successEvent: successEvent, tableSettings: tableSettingsObject});
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
        aftAdvanceTableFilterColumn.appendChild(multiDropdown.generate(colNames));
    }

    function initFilters(tableSettings) {
        let endpointId = 2;
        getFiltersFromAPI(endpointId, tableSettings);
    }

    on('aft/filters/display', function (params) {
        let apiResponseData = params.data;
        console.log('api response data', apiResponseData);
        let filters = apiResponseData.Data;
        let tableSettings = params.tableSettings;
        displayFilters(filters, tableSettings);
    });

    clearAdvanceFilter.addEventListener('click', function () {
        trigger('clear/dropdown/filter', {data: advanceTableFilterActive});
    });

    aftAdvanceApplyFilters.addEventListener('click', function () {
        /*
                let aftDataRange = $$('#aft-advance-table-filter-date-range').children[1].children[0].dataset.value;
                let aftFinishedBy = $$('#aft-advance-table-filter-finished').children[1].children[0].dataset.value;
                let aftJackpot = $$('#aft-advance-table-filter-jackpot').children[1].children[0].dataset.value;
                let aftType = $$('#aft-advance-table-filter-type').children[1].children[0].dataset.value;
                let aftStatus = $$('#aft-advance-table-filter-status').children[1].children[0].dataset.value;
                let aftChooseColumn = $$('#aft-advance-table-filter-column').children[1].children[0].dataset.value;
                trigger('communicate/aft/previewTransactions', {});


                console.log({
                    'aftDataRange': {
                        'aftDataRange': aftDataRange
                    },
                    'aftFinishedBy': {
                        'aftFinishedBy': aftFinishedBy

                    },
                    'aftJackpot': {
                        'aftJackpot': aftJackpot
                    },
                    'aftType': {
                        'aftType': aftType
                    },
                    'aftStatus': {
                        'aftStatus': aftStatus
                    },
                    'aftChooseColumn': {
                        'aftChooseColumn': aftChooseColumn
                    }
                })*/
    });

    return {
        initFilters: initFilters
    };

})();