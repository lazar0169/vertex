const aftFilter = (function () {
    let advanceTableFilter = $$('#aft-advance-table-filter');
    let advanceTableFilterActive = $$('#aft-advance-table-filter-active');
    let clearAdvanceFilter = $$('#aft-advance-table-filter-clear');
    let aftMachinesNumbers = $$('#aft-machines-number');
    let aftAdvanceApplyFilters = $$('#aft-advance-table-filter-apply').children[0];



    function initFilters(tableSettings) {
        //filter elements
        let aftAdvanceTableFilterDateRange = $$('#aft-advance-table-filter-date-range');
        let aftAdvanceTableFilterFinished = $$('#aft-advance-table-filter-finished');
        let aftAdvanceTableFilterJackpot = $$('#aft-advance-table-filter-jackpot');
        let aftAdvanceTableFilterType = $$('#aft-advance-table-filter-type');
        let aftAdvanceTableFilterStatus = $$('#aft-advance-table-filter-status');
        let aftAdvanceTableFilterColumn = $$('#aft-advance-table-filter-column');


        //getting filters from API
        function getFiltersFromAPI(endpointId) {
            let data = {
                'EndpointId': endpointId
            };
            trigger('communicate/aft/getFilters', {data: data});
        }

        let endpointId = 2;
        getFiltersFromAPI(endpointId);


        console.log('table settings pre nego da pozovem get cols count', tableSettings);
        let colsCount = table.getColsCountOfDisplayedTable(tableSettings);
        console.log('colsCOunt', colsCount);
        let colsCountArray = [];
        for (let i = 0; i < colsCount.length; i++) {
            colsCountArray.push({
                'Name': i+1
            });
        }
        console.log('colsCountArray', colsCountArray);

        //display initial filters
        function displayFilters(filters) {

            //generating dropdown menus
            aftMachinesNumbers.appendChild(dropdown.generate(machinesNumber));
            aftAdvanceTableFilterDateRange.appendChild(dropdownDate.generate(nekiniz));
            aftAdvanceTableFilterFinished.appendChild(multiDropdown.generate(nekiniz));
            aftAdvanceTableFilterJackpot.appendChild(multiDropdown.generate(filters.JackpotNameList));
            aftAdvanceTableFilterType.appendChild(multiDropdown.generate(filters.TypeList));
            aftAdvanceTableFilterStatus.appendChild(multiDropdown.generate(filters.StatusList));
            // aftAdvanceTableFilterColumn.appendChild(multiDropdown.generate(colsCountArray));
        }

        on('aft/filters/display', function (params) {
            let apiResponseData = params.data;
            let filters = apiResponseData.Data;
            displayFilters(filters);
        });


        let filtersContainer = $$(tableSettings.filterContainerSelector);
        let applyButton = filtersContainer.getElementsByClassName('aft-filters-apply')[0];

        if (applyButton !== undefined) {
            applyButton.addEventListener('click', function () {
                trigger('table/filters/apply', {tableSettings: tableSettings});
                console.log('Table settings after clicking Apply button: ', tableSettings);
            });
        }
    };


    function showAdvanceTableFilter() {
        advanceTableFilter.classList.toggle('aft-advance-active');
        advanceTableFilterActive.classList.toggle('hidden');
    }

    advanceTableFilter.addEventListener('click', function () {
        showAdvanceTableFilter();
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