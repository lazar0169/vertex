const machinesFilter = (function () {
    let advanceTableFilter = $$('#machines-advance-table-filter');
    let advanceTableFilterActive = $$('#machines-advance-table-filter-active')
    let machinesTopBar = $$('#top-bar-machines');
    let machinesTopBarActiveMachines = machinesTopBar.getElementsByClassName("element-topbar-active-machines")[0];
    let machinesTopBarAllMachines = machinesTopBar.getElementsByClassName("element-topbar-all-machines")[0];
    let machinesTopBarTotalBet = machinesTopBar.getElementsByClassName("element-topbar-total-bet-machines")[0];
    let machinesTopBarCurrentCredits = machinesTopBar.getElementsByClassName("element-topbar-total-current-credits-machines")[0];

    function topBarInfoBoxValue(params) {
        machinesTopBarActiveMachines.innerHTML = params.NumberOfActiveMachines;
        machinesTopBarAllMachines.innerHTML = `/ ${params.NumberOfMachines}`;
        machinesTopBarTotalBet.innerHTML = params.TotalBet;
        machinesTopBarCurrentCredits.innerHTML = params.TotalCurrentCredits;
    }

    on('showing-machines-top-bar-value', function (params) {
        topBarInfoBoxValue(params.data.Data.ItemValue)
    });

    advanceTableFilter.children[0].addEventListener('click', function () {
        advanceTableFilter.classList.toggle('advance-filter-active');
        trigger('opened-arrow', { div: advanceTableFilter.children[0] });
        advanceTableFilterActive.classList.toggle('hidden');
    });
})();