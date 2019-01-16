let machines = (function () {

    on('machines/activated', function () {
        setTimeout(function () {
            trigger('preloader/hide');
            trigger('communicate/casinos/getAllMachines', {})
        }, 2000);
    });

    on('machines/display-machine-info/', function (e) {
    });

    on('machines/display-machine-info/error', function (e) {
        data = e.data;
        alert('An error occurred.');
    });

    function topBarInfoBoxValue(data) {
        let topBarValueCashable = $$('#top-bar-machines').getElementsByClassName('element-topbar-active-machines');
        topBarValueCashable[0].innerHTML = data.NumberOfActiveMachines;
        let topBarNumberOfCashableTickets = $$('#top-bar-machines').getElementsByClassName('element-topbar-all-machines');
        topBarNumberOfCashableTickets[0].innerHTML = `/${data.NumberOfMachines}`;

        let topBarInfoPromoValue = $$('#top-bar-machines').getElementsByClassName('element-topbar-total-bet-machines');
        topBarInfoPromoValue[0].innerHTML = data.TotalBet;

        let topBarnumberOfPromoTickets = $$('#top-bar-machines').getElementsByClassName('element-topbar-total-current-credits-machines');
        topBarnumberOfPromoTickets[0].innerHTML = data.TotalCurrentCredits;
    }

    on('showing-machines-top-bar-value', function (data) {
        topBarInfoBoxValue(data.dataItemValue)

    });


})();