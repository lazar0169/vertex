const jackpotFilter = (function () {
    let advanceTableFilter = $$('#jackpot-advance-table-filter');
    let jackpotMachinesNumbers = $$('#jackpot-machines-number');
    let addJackpot = $$('#jackpot-add-jackpot').children[0];
    let addNewJackpot = $$('#add-new-jackpot-wrapper');
    let jackpotTab = $$('#jackpot-tab');

    //number of machines, dropdown
    dropdown.generate({ optionValue: machinesNumber, parent: jackpotMachinesNumbers, type: 'single' })
    
    advanceTableFilter.addEventListener('click', function () {
        advanceTableFilter.classList.toggle('advance-filter-active');
        trigger('opened-arrow', { div: advanceTableFilter.children[0] });
    });

    //close add new jackpot form
    jackpotTab.addEventListener('click', function () {
        addNewJackpot.classList.add('hidden');
    });
    //show add new jackop form
    addJackpot.addEventListener('click', function () {
        addNewJackpot.classList.remove('hidden');
    });
})();