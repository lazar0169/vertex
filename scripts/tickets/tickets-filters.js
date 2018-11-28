const ticketsFilter = (function () {
    let ticketAdvanceFilter = $$('#tickets-advance-table-filter');
    let ticketMachinesNumbers = $$('#tickets-machines-number');
    let advanceTableFilterActive = $$('#tickets-advance-table-filter-active');


    // ticketMachinesNumbers.appendChild(dropdown.generate(machinesNumber));


    function showAdvanceTableFilter() {
        ticketAdvanceFilter.classList.toggle('aft-advance-active');
        advanceTableFilterActive.classList.toggle('hidden');
    }

    ticketAdvanceFilter.addEventListener('click', function () {
        alert('show advance table filter');
        showAdvanceTableFilter();
    });

})();