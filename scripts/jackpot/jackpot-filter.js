const jackpotFilter = (function () {
    let advanceTableFilter = $$('#jackpot-advance-table-filter');
    let jackpotMachinesNumbers = $$('#jackpot-machines-number');
    let addJackpot = $$('#jackpot-add-jackpot').children[0];
    let jackpotAddMachine = $$('#jackpot-add-machines-wrapper');
    let jackpotAddMachineVendor = $$('#jackpot-add-machines-filter-vendor').children[0];
    let jackpotAddMachineVendorList = $$('#jackpot-add-machines-filter-vendor').children[1];
    let jackpotAddMachineType = $$('#jackpot-add-machines-filter-type').children[0];
    let jackpotAddMachineTypeList = $$('#jackpot-add-machines-filter-type').children[1];
    let jackpotAddButton = $$('#jackpot-add-machines-buttons').children[0];
    let jackpotBackButton = $$('#jackpot-add-machines-buttons').children[1];
    let jackpotAddAllMachines = $$('#jackpot-add-machines-filter').children[0];

    jackpotMachinesNumbers.appendChild(dropdown.generate(machinesNumber));

    advanceTableFilter.addEventListener('click', function () {
        advanceTableFilter.classList.toggle('jackpot-advance-active');
    });
    addJackpot.addEventListener('click', function () {
        $$('#black-area').classList.add('show');
        jackpotAddMachine.classList.toggle('hidden');
    });
    jackpotAddMachineVendor.addEventListener('click', function () {
        jackpotAddMachineVendorList.classList.toggle('hidden');
    });
    jackpotAddMachineType.addEventListener('click', function () {
        jackpotAddMachineTypeList.classList.toggle('hidden');
    });
    jackpotAddButton.addEventListener('click', function () {
        alert('Add jackpot');
    });
    jackpotAddAllMachines.addEventListener('click', function () {
        alert('Add all machines');
    });
    jackpotBackButton.addEventListener('click', function () {
        trigger('show/app');
    });

    on('show/app', function () {
        jackpotAddMachine.classList.add('hidden');
    });
})();