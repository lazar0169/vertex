const aftFilter = (function () {
    let advanceTableFilter = $$('#aft-advance-table-filter');
    let advanceTableFilterActive = $$('#aft-advance-table-filter-active');
    let clearAdvanceFilter = $$('#aft-advance-table-filter-clear');
    let aftMachinesNumbers = $$('#aft-machines-number');
    


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