const ticketsFilter = (function () {
    let ticketAdvanceFilter = $$('#tickets-advance-table-filter');
    let ticketMachinesNumbers = $$('#tickets-machines-number');


    ticketMachinesNumbers.appendChild(dropdown.generate(machinesNumber));


    ticketAdvanceFilter.addEventListener('click', function () {
        showAdvanceTableFilter()
    });
   
    function showAdvanceTableFilter() {
        ticketAdvanceFilter.classList.toggle('advance-filter-active');
        
    }
})();