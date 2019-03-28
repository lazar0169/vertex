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
    let machineLastJackpotTable = null;
    let machinesHistoryTable = null;
    let machinesMetersTable = null;
    let machinesEventsTable = null;

    let machineSerial = $$('#machine-service-serial');
    let machineCode = $$('#machine-code');
    let machineGmcid = $$('#machine-service-gmcid');
    let serviceModeCheckbox = $$('#machine-details-service-mode-checkbox');
    toggle.generate({
        element: serviceModeCheckbox.parentNode
    });
    serviceModeCheckbox.parentNode.addEventListener('click', function () {
        let data = {}
        let EntryData = {}
        data.successAction = 'machines/details-service-switch';
        EntryData.Gmcid = parseInt(machineGmcid.dataset.gmcid);
        EntryData.EndpointId = parseInt(detailsBar.dataset.endpointId);
        EntryData.IsInServiceMode = toggle.isChecked(serviceModeCheckbox.parentNode);
        trigger(communication.events.machines.switchServiceMode, { data, EntryData });
    })



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
        detailsBar.dataset.endpointId = params.endpointId;
        let data = {}
        let EntryData = {}
        EntryData.EndpointId = params.endpointId;
        EntryData.Gmcid = params.data.Properties.Gmcid;

        data.successAction = 'machines/details'
        trigger(communication.events.machines.getMachineDetails, { data, EntryData });

        data.successAction = 'machines/details-history'
        trigger(communication.events.machines.getMachineHistory, { data, EntryData });

        data.successAction = 'machines/details-meters'
        trigger(communication.events.machines.getAllMachineMeters, { data, EntryData });

        data.successAction = 'machines/details-events'
        trigger(communication.events.machines.getMachineEvents, { data, EntryData });

        data.successAction = 'machines/details-service'
        trigger(communication.events.machines.getMachineServiceData, { data, EntryData });

    });

    on('machines/details', function (params) {
        fillDetailsTab(params)
        details.show();
    });

    on('machines/details-history', function (params) {
        fillHistoryTab(params)
    });

    on('machines/details-meters', function (params) {
        fillMetersTab(params)
    });

    on('machines/details-events', function (params) {
        fillEventsTab(params);
    });

    on('machines/details-service', function (params) {
        fillServiceData(params)
    });
    on('machines/details-service-switch', function (params) {
        trigger('notifications/show', {
            message: localization.translateMessage(params.data.MessageCode),
            type: params.data.MessageType,
        });
    });



    function fillDetailsTab(params) {
        let data = params.data.Data;

        machineName.innerHTML = data.MachineName;
        casinoServerName.innerHTML = data.CasinoServerName;
        ordinalNumber.innerHTML = data.OrdinalNumber;
        aftServerName.innerHTML = data.AftServerName;
        titoServerName.innerHTML = data.TitoServerName
        machineVendor.innerHTML = data.Vendor;
        machineType.innerHTML = data.Type;
        notificationValueLimit.innerHTML = formatFloatValue(data.NotificationValueLimit / 100);
        allowedPromoTickets.innerHTML = data.AllowedPromoTickets ? localization.translateMessage('Yes') : localization.translateMessage('No');
        allowedTransaction.innerHTML = data.AllowedTransaction ? localization.translateMessage('Yes') : localization.translateMessage('No');
        maxValueForTicketPrinting.innerHTML = formatFloatValue(data.MaximumValueForTicketPrinting / 100);
        maxValueForTransaction.innerHTML = formatFloatValue(data.MaximumValueForTransaction / 100);
        jackpotServerName.innerHTML = data.JackpotServerName.join(", ");
        speedType.innerHTML = localization.translateMessage(data.SpeedType);

        if (machineLastJackpotTable !== null) {
            machineLastJackpotTable.destroy();
        }
        machineLastJackpotTable = table.init({
            id: '',
        },
            { Items: data.LastJackpots });
        $$('#machine-last-jackpot').appendChild(machineLastJackpotTable);
    }

    function fillHistoryTab(params) {
        let items = params.data.Data
        if (machinesHistoryTable !== null) {
            machinesHistoryTable.destroy();
        }
        machinesHistoryTable = table.init({
            id: '',
        }, items);
        $$('#machine-history-tab-info').appendChild(machinesHistoryTable);
    }

    function fillMetersTab(params) {
        let items = params.data.Data
        if (machinesMetersTable !== null) {
            machinesMetersTable.destroy();
        }
        machinesMetersTable = table.init({
            id: ''
        }, items);
        $$('#machine-meters-tab-info').appendChild(machinesMetersTable);
    }

    function fillEventsTab(params) {
        let items = params.data.Data
        if (machinesEventsTable !== null) {
            machinesEventsTable.destroy();
        }
        machinesEventsTable = table.init({
            id: '',
        }, items);
        $$('#machine-events-tab-info').appendChild(machinesEventsTable);
    }

    function fillServiceData(params) {
        let items = params.data.Data;
        if (items.ServiceMode) {
            serviceModeCheckbox.parentNode.vertexToggle.check();
        } else {
            serviceModeCheckbox.parentNode.vertexToggle.uncheck();
        }
        machineSerial.innerHTML = items.SerialNumber;
        machineCode.innerHTML = items.Code;
        machineGmcid.innerHTML = items.Gmcid;
        machineGmcid.dataset.gmcid = items.Gmcid;
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