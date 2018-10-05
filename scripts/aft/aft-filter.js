const aftFilter = (function () {
    let advanceTableFilter = $$('#aft-advance-table-filter');
    let advanceTableFilterActive = $$('#aft-advance-table-filter-active');
    let clearAdvanceFilter = $$('#aft-advance-table-filter-clear');

    advanceTableFilter.addEventListener('click', function () {
        showAdvanceTableFilter()
    });
    clearAdvanceFilter.addEventListener('click', function () {
        clearAllFilter(advanceTableFilterActive);
    });

    function showAdvanceTableFilter() {
        advanceTableFilter.classList.toggle('aft-advance-active');
        advanceTableFilterActive.classList.toggle('hidden');
    }
})();