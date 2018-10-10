const aftFilter = (function () {
    let advanceTableFilter = $$('#aft-advance-table-filter');
    let advanceTableFilterActive = $$('#aft-advance-table-filter-active');
    let clearAdvanceFilter = $$('#aft-advance-table-filter-clear');
    let aftMachinesNumbers = $$('#aft-machines-number');
    let proba2 = $$('#aft-advance-table-filter-finished');
    let proba3 = $$('#aft-advance-table-filter-jackpot');
    let proba4 = $$('#aft-advance-table-filter-type');
    let proba5 = $$('#aft-advance-table-filter-status');
    let proba6 = $$('#aft-advance-table-filter-column');
    let proba = $$('#aft-advance-table-filter-date-range');

    window.addEventListener('load', function () {
        aftMachinesNumbers.appendChild(dropdown.generate(machinesNumber));
        proba.appendChild(dropdown.generate(nekiniz));
        proba2.appendChild(multiDropdown.generate(nekiniz2));
        proba3.appendChild(multiDropdown.generate(nekiniz3));
        proba4.appendChild(multiDropdown.generate(nekiniz4));
        proba5.appendChild(multiDropdown.generate(nekiniz5));
        proba6.appendChild(multiDropdown.generate(nekiniz6));
    });

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