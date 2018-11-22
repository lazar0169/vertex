const aftFilter = (function () {
    let advanceTableFilter = $$('#aft-advance-table-filter');
    let advanceTableFilterActive = $$('#aft-advance-table-filter-active');
    let clearAdvanceFilter = $$('#aft-advance-table-filter-clear');
    let aftMachinesNumbers = $$('#aft-machines-number');
    let aftAdvenceApplyFilters = $$('#aft-advance-table-filter-apply').children[0];

    let aftAdvanceTableFilterDateRange = $$('#aft-advance-table-filter-date-range');
    let aftAdvanceTableFilterFinished = $$('#aft-advance-table-filter-finished');
    let aftAdvanceTableFilterJackpot = $$('#aft-advance-table-filter-jackpot');
    let aftAdvanceTableFilterType = $$('#aft-advance-table-filter-type');
    let aftAdvanceTableFilterStatus = $$('#aft-advance-table-filter-status');
    let aftAdvanceTableFilterColumn = $$('#aft-advance-table-filter-column');

    // let proba3 = $$('#aft-advance-table-filter-jackpot');
    // proba3.appendChild(multiDropdown.generate(machinesVendors));

    aftAdvenceApplyFilters.addEventListener('click', function () {
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

    // let proba = $$('#aft-advance-table-filter-date-range');

    aftMachinesNumbers.appendChild(dropdown.generate(machinesNumber));
    aftAdvanceTableFilterDateRange.appendChild(dropdownDate.generate(nekiniz));
    aftAdvanceTableFilterFinished.appendChild(dropdownDate.generate(nekiniz2));
    aftAdvanceTableFilterJackpot.appendChild(dropdownDate.generate(nekiniz3));
    aftAdvanceTableFilterType.appendChild(dropdownDate.generate(nekiniz4));
    aftAdvanceTableFilterStatus.appendChild(dropdownDate.generate(nekiniz5));
    aftAdvanceTableFilterColumn.appendChild(dropdownDate.generate(nekiniz6));


    // let proba2 = $$('#aft-advance-table-filter-finished');
    // proba2.appendChild(dropdownDate.generate(nekiniz));

    // proba2.appendChild(multiDropdown.generate(nekiniz2));
    //proba3.appendChild(multiDropdown.generate(nekiniz3));


    function showAdvanceTableFilter() {
        advanceTableFilter.classList.toggle('aft-advance-active');
        advanceTableFilterActive.classList.toggle('hidden');
    }

    advanceTableFilter.addEventListener('click', function () {
        showAdvanceTableFilter()
    });

    clearAdvanceFilter.addEventListener('click', function () {
        trigger('clear/dropdown/filter', { data: advanceTableFilterActive });
    });

})();