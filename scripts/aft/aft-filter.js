const aftFilter = (function () {
    let advanceTableFilter = $$('#aft-advance-table-filter');
    let advanceTableFilterActive = $$('#aft-advance-table-filter-active');
    let clearAdvanceFilter = $$('#aft-advance-table-filter-clear');
    let aftMachinesNumbers = $$('#aft-machines-number');
    let aftAdvenceApplyFilters = $$('#aft-advance-table-filter-apply').children[0];

    let proba3 = $$('#aft-advance-table-filter-jackpot');
    proba3.appendChild(multiDropdown.generate(machinesVendors));

    aftAdvenceApplyFilters.addEventListener('click', function () {

        let aftDataRange = $$('#aft-advance-table-filter-date-range').children[1].children[0].dataset.value;
        let aftFinishedBy = $$('#aft-advance-table-filter-finished').children[1].children[0].dataset.value;
        let aftJackpot = $$('#aft-advance-table-filter-jackpot').children[1].children[0].dataset.value;
        let aftType = $$('#aft-advance-table-filter-type').children[1].children[0].dataset.value;
        let aftStatus = $$('#aft-advance-table-filter-status').children[1].children[0].dataset.value;
        let aftChoseColumn = $$('#aft-advance-table-filter-column').children[1].children[0].dataset.value;
        trigger('communicate/aft/previewTransactions', {});


        console.log({
            'aftDataRange': {
                'Date From': aftDataRange[0],
                'Time From': aftDataRange[1],
                'Date To': aftDataRange[2],
                'Time To': aftDataRange[3]
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
            'aftChoseColumn': {
                'aftChoseColumn': aftChoseColumn
            }
        })

    });



    let proba = $$('#aft-advance-table-filter-date-range');

    aftMachinesNumbers.appendChild(dropdown.generate(machinesNumber));
    proba.appendChild(dropdownDate.generate(nekiniz));
    let proba2 = $$('#aft-advance-table-filter-finished');
    proba2.appendChild(dropdownDate.generate(nekiniz));

    // proba2.appendChild(multiDropdown.generate(nekiniz2));
    //proba3.appendChild(multiDropdown.generate(nekiniz3));

    advanceTableFilter.addEventListener('click', function () {
        showAdvanceTableFilter()
    });
    clearAdvanceFilter.addEventListener('click', function () {
        trigger('clear/dropdown/filter', { data: advanceTableFilterActive });
    });

    function showAdvanceTableFilter() {
        advanceTableFilter.classList.toggle('aft-advance-active');
        advanceTableFilterActive.classList.toggle('hidden');
    }
})();