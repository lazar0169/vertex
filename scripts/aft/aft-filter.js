const aftFilter = (function () {
    let advanceTableFilter = $$('#aft-advance-table-filter');
    let advanceTableFilterActive = $$('#aft-advance-table-filter-active');
    let clearAdvanceFilter = $$('#aft-advance-table-filter-clear');
    let aftMachinesNumbers = $$('#aft-machines-number');
    let aftAdvanceApplyFilters = $$('#aft-advance-table-filter-apply').children[0];

    //filter elements
    let aftAdvanceTableFilterDateRange = $$('#aft-advance-table-filter-date-range');
    let aftAdvanceTableFilterFinished = $$('#aft-advance-table-filter-finished');
    let aftAdvanceTableFilterJackpot = $$('#aft-advance-table-filter-jackpot');
    let aftAdvanceTableFilterType = $$('#aft-advance-table-filter-type');
    let aftAdvanceTableFilterStatus = $$('#aft-advance-table-filter-status');
    let aftAdvanceTableFilterColumn = $$('#aft-advance-table-filter-column');

    //generating dropdown menus
    aftMachinesNumbers.appendChild(dropdown.generate(machinesNumber));
    aftAdvanceTableFilterDateRange.appendChild(dropdownDate.generate(nekiniz));
    aftAdvanceTableFilterFinished.appendChild(dropdownDate.generate(nekiniz2));
    aftAdvanceTableFilterJackpot.appendChild(dropdownDate.generate(nekiniz3));
    aftAdvanceTableFilterType.appendChild(dropdownDate.generate(nekiniz4));
    aftAdvanceTableFilterStatus.appendChild(dropdownDate.generate(nekiniz5));
    aftAdvanceTableFilterColumn.appendChild(dropdownDate.generate(nekiniz6));

    function showAdvanceTableFilter() {
        advanceTableFilter.classList.toggle('aft-advance-active');
        advanceTableFilterActive.classList.toggle('hidden');
    }

    function getFiltersFromAPI(endpointId){
        let data = {
            'EndpointId': endpointId
        };
        trigger('communicate/aft/getFilters', {data: data});
    }

    function displayFilters(filters){
        console.log('filters', filters);
    }

    advanceTableFilter.addEventListener('click', function () {
        showAdvanceTableFilter();

        let endpointId = 2;
        getFiltersFromAPI(endpointId);

        on('aft/displayFilters', function(params){
            let apiResponseData = params.data;
            let filters = apiResponseData.Data;
            displayFilters(filters);
        });
    });

    clearAdvanceFilter.addEventListener('click', function () {
        trigger('clear/dropdown/filter', { data: advanceTableFilterActive });
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

})();