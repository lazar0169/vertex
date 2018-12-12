const aftFilter = (function () {
    let advanceTableFilter = $$('#aft-advance-table-filter');
    let advanceTableFilterActive = $$('#aft-advance-table-filter-active');
    let clearAdvanceFilter = $$('#aft-advance-table-filter-clear');
    let aftMachinesNumbers = $$('#aft-machines-number');
    let aftAdvenceApplyFilters = $$('#aft-advance-table-filter-apply').children[0];
    let advanceTableFilterInfobar = $$('#aft-advance-table-filter-active-infobar');
    let clearAdvanceFilterInfobar = $$('#aft-advance-table-filter-active-infobar-button').children[0];


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
        showSelectedFilters();
        advanceTableFilterInfobar.style.visibility = 'visible';



    });


    aftMachinesNumbers.appendChild(dropdown.generate(machinesNumber));
    //test
    let proba = $$('#aft-advance-table-filter-date-range');
    proba.appendChild(dropdownDate.generate(nekiniz));

    let proba6 = $$('#aft-advance-table-filter-column');
    proba6.appendChild(multiDropdown.generate(columnName));

    // let proba2 = $$('#aft-advance-table-filter-finished');
    // proba2.appendChild(dropdownDate.generate(nekiniz));

    // proba2.appendChild(multiDropdown.generate(nekiniz2));
    //proba3.appendChild(multiDropdown.generate(nekiniz3));


    function showAdvanceTableFilter() {
        advanceTableFilter.classList.toggle('aft-advance-active');
        advanceTableFilterActive.classList.toggle('hidden');
    }

    advanceTableFilter.addEventListener('click', function () {
        showAdvanceTableFilter();
    });

    clearAdvanceFilter.addEventListener('click', function () {
        trigger('clear/dropdown/filter', { data: advanceTableFilterActive });
        advanceTableFilterInfobar.style.visibility = 'hidden';
    });
    clearAdvanceFilterInfobar.addEventListener('click', function () {
        trigger('clear/dropdown/filter', { data: advanceTableFilterActive });
        showSelectedFilters();
        advanceTableFilterInfobar.style.visibility = 'hidden';
    });
    function showSelectedFilters() {

        for (let count = 0; count < advanceTableFilterActive.children.length - 1; count++) {
            if (advanceTableFilterActive.children[count].children[1].children[0].dataset && advanceTableFilterActive.children[count].children[1].children[0].dataset.value !== '-') {
                advanceTableFilterInfobar.children[1].children[count].children[0].innerHTML = advanceTableFilterActive.children[count].children[0].innerHTML;
                advanceTableFilterInfobar.children[1].children[count].children[1].innerHTML = advanceTableFilterActive.children[count].children[1].children[0].title;
                advanceTableFilterInfobar.children[1].children[count].title = advanceTableFilterActive.children[count].children[1].children[0].title;
                advanceTableFilterInfobar.children[1].children[count].classList.remove('hidden');
            }
            else {
                advanceTableFilterInfobar.children[1].children[count].classList.add('hidden');
            }

        }

    }

})();