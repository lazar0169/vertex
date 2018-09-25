const AFTFilter = (function () {
    let advanceTableFilter = $$('#AFT-advance-table-filter');
    let advanceTableFilterActive = $$('#AFT-advance-table-filter-active');

    advanceTableFilter.addEventListener('click', function () {
        showAdvanceTableFilter()
    });

    function showAdvanceTableFilter() {
        advanceTableFilter.classList.contains('AFT-advance-active') ? advanceTableFilter.classList.remove('AFT-advance-active') : advanceTableFilter.classList.add('AFT-advance-active')
        advanceTableFilterActive.classList.contains('hidden') ? advanceTableFilterActive.classList.remove('hidden') : advanceTableFilterActive.classList.add('hidden');
    
    }

})();