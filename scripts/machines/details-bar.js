const detailsBar = (function () {
    let detailsBar = $$('#details-bar');
    let closeDetailsBar = $$('#machine-close-details-bar');
    let blackArea = $$('#black-area');
    let editCurrentMachine = $$('#edit-current-machine');
    let editMode = $$('#machine-edit-mode');
    let machineName = $$('#machine-current-name');
    let casinoServerName = $$('#machine-curent-casino');
    let ordinalNumber = $$('#machine-id').children[1];
    let aftServerName = $$('#machine-aft-name').children[1];
    let titoServerName = $$('#machine-tito-name').children[1];
    let machineVendor = $$('#machine-vendor').children[1];
    let machineType = $$('#machine-type').children[1];
    let speedType = $$('#machine-speed').children[1];
    let notificationValueLimit = $$('#machine-notification').children[1];
    let allowedPromoTickets = $$('#machine-tito-promo')
    let allowedTransaction = $$('#machine-allowed-transactions').children[1];
    let maxValueForTicketPrinting = $$('#machine-tito-max');
    let maxValueForTransaction = $$('#machine-aft-max').children[1];
    let jackpotServerName = $$('#machine-jackpot-server');

    let machineLastJackpot = null;


    let details = function () {
        return {
            hide: function () {
                detailsBar.classList.add('collapse');
                blackArea.classList.remove('show');
            },
            show: function () {
                blackArea.classList.add('show');
                detailsBar.classList.remove('collapse');
            }
        };
    }();
    let editMachine = function () {
        return {
            hide: function () {
                editMode.classList.add('collapse');
            },
            show: function () {
                editMode.classList.remove('collapse');
                details.hide();
            }
        };
    }();

    on('machines/machines-details', function (params) {
        selectTab('machine-details-tab');
        selectInfoContent('machine-details-tab');
        let data = {}
        let EntryData = {}
        EntryData.EndpointId = params.endpointId;
        EntryData.Gmcid = params.data.Properties.Gmicd;
        data.successAction = 'machines/details'

        trigger(communication.events.machines.getMachineDetails, { data, EntryData })

    });
    on('machines/details', function (params) {
        fillDetailsTab(params)
        details.show();
    })

    function fillDetailsTab(params) {
        let data = params.data.Data;

        machineName.innerHTML = data.MachineName;
        casinoServerName.innerHTML = data.CasinoServerName;
        ordinalNumber.innerHTML = data.OrdinalNumber;
        aftServerName.innerHTML = data.AftServerName;
        titoServerName.innerHTML = data.TitoServerName
        machineVendor.innerHTML = data.Vendor;
        machineType.innerHTML = data.Type;
        notificationValueLimit.innerHTML = data.NotificationValueLimit;
        allowedPromoTickets.innerHTML = data.AllowedPromoTickets ? localization.translateMessage('Yes') : localization.translateMessage('No');
        allowedTransaction.innerHTML = data.AllowedTransaction ? localization.translateMessage('Yes') : localization.translateMessage('No');
        maxValueForTicketPrinting.innerHTML = data.MaximumValueForTicketPrinting;
        maxValueForTransaction.innerHTML = data.MaximumValueForTransaction;
        jackpotServerName.innerHTML = data.JackpotServerName.join(", ");
        speedType.innerHTML = '------->ne stize sa servera<-------';

        if (machineLastJackpot !== null) {
            machineLastJackpot.destroy();
        }
        machineLastJackpot = table.init({
            id: '',
        },
            { Items: data.LastJackpots });
        $$('#machine-last-jackpot').appendChild(machineLastJackpot);
    }

    editCurrentMachine.addEventListener('click', function () {
        editMachine.show();
    });

    closeDetailsBar.addEventListener('click', function () {
        details.hide();
    });

    window.addEventListener('keyup', function (event) {
        if (event.keyCode == 27) {
            details.hide();

        }
    });

    on('show/app', function () {
        details.hide();
    });



})();