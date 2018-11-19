const jackpotFilter = (function () {
    let advanceTableFilter = $$('#jackpot-advance-table-filter');
    let jackpotMachinesNumbers = $$('#jackpot-machines-number');
    let addJackpot = $$('#jackpot-add-jackpot').children[0];
    let addNewJackpot = $$('#add-new-jackpot-wrapper');
    let jackpotTab = $$('#jackpot-tab');

    jackpotMachinesNumbers.appendChild(dropdown.generate(machinesNumber));

    advanceTableFilter.addEventListener('click', function () {
        advanceTableFilter.classList.toggle('jackpot-advance-active');
    });

    jackpotTab.addEventListener('click', function () {
        addNewJackpot.classList.add('hidden');
    });
    addJackpot.addEventListener('click', function () {
        addNewJackpot.classList.remove('hidden');
    });


})();