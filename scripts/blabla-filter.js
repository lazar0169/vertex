const aftFilter = (function () {
    let advanceTableFilter = $$('#aft-advance-table-filter');
    let advanceTableFilterActive = $$('#aft-advance-table-filter-active');

    advanceTableFilter.addEventListener('click', function () {
        showAdvanceTableFilter()
    });

    function showAdvanceTableFilter() {
        advanceTableFilter.classList.contains('aft-advance-active') ? advanceTableFilter.classList.remove('aft-advance-active') : advanceTableFilter.classList.add('aft-advance-active')
        advanceTableFilterActive.classList.contains('hidden') ? advanceTableFilterActive.classList.remove('hidden') : advanceTableFilterActive.classList.add('hidden');
    
    }

})();