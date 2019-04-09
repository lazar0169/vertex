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

    function prepareData() {
        let data = {};
        data.EndpointId = parseInt(detailsBar.settings.endpointId);
        data.Gmcid = parseInt(detailsBar.settings.gmcid);
        return data;
    }

    //--------------------Details Tab-----------------------------------------//
    on('machines/machines-details', function (params) {
        let settings = {}
        settings.endpointId = params.endpointId;
        settings.gmcid = params.data.Properties.Gmcid;
        detailsBar.settings = settings;

        selectTab('machine-details-tab');
        selectInfoContent('machine-details-tab');
    });

    on('get-machines/machines-details', function () {
        let EntryData = prepareData();
        let data = {};
        data.successAction = 'machines/details'
        trigger(communication.events.machines.getMachineDetails, { data, EntryData });
    });

    on('machines/details', function (params) {
        fillDetailsTab(params)
        details.show();
        trigger('machines/details-edit-machine', params);
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
        machineLastJackpotTable = table.init({ id: '' }, { Items: data.LastJackpots });
        $$('#machine-last-jackpot').appendChild(machineLastJackpotTable);
    }
    //------------------------------------------------------------------------//

    //----------------------Service Tab--------------------------------------//
    let machineSerial = $$('#machine-service-serial');
    let machineCode = $$('#machine-service-code');
    let machineGmcid = $$('#machine-service-gmcid');
    let serviceModeCheckbox = $$('#machine-details-service-mode-checkbox');
    toggle.generate({
        element: serviceModeCheckbox.parentNode
    });

    on('machines/details-service', function (params) {
        fillServiceData(params)
    });

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

    on('get-machines/machines-service', function () {
        let EntryData = prepareData();
        let data = {};
        data.successAction = 'machines/details-service'
        trigger(communication.events.machines.getMachineServiceData, { data, EntryData });
        serviceModeCheckbox.parentNode.onclick = function () {
            data.successAction = 'machines/details-service-switch';
            EntryData.IsInServiceMode = toggle.isChecked(serviceModeCheckbox.parentNode);
            trigger(communication.events.machines.switchServiceMode, { data, EntryData });
        }
    });

    on('machines/details-service-switch', function (params) {
        trigger('notifications/show', {
            message: localization.translateMessage(params.data.MessageCode),
            type: params.data.MessageType,
        });
    });
    //----------------------------------------------------------------------//

    //---------------------Events Tab---------------------------------------------------------//
    let machinesEventsTable = null;
    let machinesEventsTableId = 'machines-events-table-id'

    let detailsPaginationEvents = $$('#pagination-events');
    let paginationEventsPrev = detailsPaginationEvents.children[0];
    let paginationEventsNext = detailsPaginationEvents.children[2];

    paginationEventsPrev.onclick = function () {
        if (machinesEventsTable.settings.page !== 1) {
            machinesEventsTable.settings.page -= 1;
            detailsPaginationEvents.children[1].innerHTML = machinesEventsTable.settings.page;
            let data = {}
            let EntryData = defaultPaginationGetData(machinesEventsTable);
            data.successAction = 'machines/details-events-pagination';
            trigger(communication.events.machines.previewMachineEvents, { data, EntryData });
        }
    }

    paginationEventsNext.onclick = function () {
        if (machinesEventsTable.data.totalItems === 20) {
            machinesEventsTable.settings.page += 1;
            detailsPaginationEvents.children[1].innerHTML = machinesEventsTable.settings.page;
            let data = {}
            let EntryData = defaultPaginationGetData(machinesEventsTable);
            data.successAction = 'machines/details-events-pagination';
            trigger(communication.events.machines.previewMachineEvents, { data, EntryData });
        }
    }

    on('get-machines/machines-events', function () {
        let EntryData = prepareData();
        let data = {};
        data.successAction = 'machines/details-events'
        trigger(communication.events.machines.getMachineEvents, { data, EntryData });
    });

    on('machines/details-events', function (params) {
        fillEventsTab(params);
    });

    on('machines/details-events-pagination', function (params) {
        let data = params.data.Data;
        $$(`#${machinesEventsTableId}`).update(data);
    });

    function fillEventsTab(params) {
        let items = params.data.Data
        if (machinesEventsTable !== null) {
            machinesEventsTable.destroy();
        }
        machinesEventsTable = table.init({ id: machinesEventsTableId }, items);
        let settings = {}
        settings = machinesEventsTable.settings;
        settings.EndpointId = params.additionalData;
        settings.Gmcid = items.Gmcid;
        settings.Date = items.Date;
        detailsPaginationEvents.children[1].innerHTML = machinesEventsTable.settings.page;
        $$('#machine-events-tab-info').appendChild(machinesEventsTable);
    }
    //----------------------------------------------------------------------------------------//

    //-----------------------------History Tab------------------------------------------------//
    let machinesHistoryTable = null;
    let machinesHistoryTableId = 'machine-history-table-content';
    let detailsPaginationHistory = $$('#pagination-history');
    let paginationHistoryPrev = detailsPaginationHistory.children[0];
    let paginationHistoryNext = detailsPaginationHistory.children[2];

    paginationHistoryPrev.onclick = function () {
        if (machinesHistoryTable.settings.page !== 1) {
            machinesHistoryTable.settings.page -= 1;
            detailsPaginationHistory.children[1].innerHTML = machinesHistoryTable.settings.page;
            let data = {}
            let EntryData = defaultPaginationGetData(machinesHistoryTable);
            data.successAction = 'machines/details-history-pagination';
            trigger(communication.events.machines.previewMachineHistory, { data, EntryData });
        }
    }
    paginationHistoryNext.onclick = function () {
        if (machinesHistoryTable.data.totalItems === 20) {
            machinesHistoryTable.settings.page += 1;
            detailsPaginationHistory.children[1].innerHTML = machinesHistoryTable.settings.page;
            let data = {}
            let EntryData = defaultPaginationGetData(machinesHistoryTable);
            data.successAction = 'machines/details-history-pagination';
            trigger(communication.events.machines.previewMachineHistory, { data, EntryData });
        }
    }

    on('get-machines/machines-history', function () {
        let EntryData = prepareData();
        let data = {};
        data.successAction = 'machines/details-history'
        trigger(communication.events.machines.getMachineHistory, { data, EntryData });
    });

    on('machines/details-history', function (params) {
        fillHistoryTab(params);
    });

    on('machines/details-history-pagination', function (params) {
        let data = params.data.Data;
        $$(`#${machinesHistoryTableId}`).update(data);
    });

    function defaultPaginationGetData(table) {
        let EntryData = {};
        EntryData.EndpointId = table.settings.EndpointId;
        EntryData.Gmcid = table.settings.Gmcid;
        EntryData.Page = table.settings.page;
        EntryData.PageSize = table.settings.pageSize;
        EntryData.Date = table.settings.Date;
        return EntryData;
    }

    function fillHistoryTab(params) {

        let items = params.data.Data
        if (machinesHistoryTable !== null) {
            machinesHistoryTable.destroy();
        }
        machinesHistoryTable = table.init({ id: machinesHistoryTableId }, items);
        let settings = {}
        settings = machinesHistoryTable.settings;
        settings.EndpointId = params.additionalData;
        settings.Gmcid = items.Gmcid;
        settings.Date = items.Date;
        detailsPaginationHistory.children[1].innerHTML = machinesHistoryTable.settings.page;
        $$('#machine-history-tab-info').appendChild(machinesHistoryTable);
    }
    //---------------------------------------------------------------------------------------//

    //--------------------------------------Meters Tab--------------------------------------//
    let machinesMetersTable = null;
    const machinesMetersTableId = 'table-container-machines-meters';


    on('get-machines/machines-meters', function () {
        let EntryData = prepareData();
        let data = {};
        data.successAction = 'machines/details-meters'
        trigger(communication.events.machines.getAllMachineMeters, { data, EntryData });
    });

    on('machines/details-meters', function (params) {
        fillMetersTab(params);
        $$('#details-bar-edit-meters').classList.add('hidden');

        let categories = $$('#details-bar-edit-meters').getElementsByClassName('opened-closed-wrapper');
        for (let category of categories) {
            category.parentNode.children[1].classList.add('hidden')
            category.children[1].classList.remove('opened-arrow');
        }
    });

    on('machines/details-meters-preview', function (params) {
        let data = params.data.Data;
        $$(`#${machinesMetersTableId}`).update(data);
    });

    function fillMetersTab(params) {
        let items = params.data.Data
        if (machinesMetersTable !== null) {
            machinesMetersTable.destroy();
        }
        machinesMetersTable = table.init({ id: machinesMetersTableId }, items);
        $$('#machine-meters-tab-info').appendChild(machinesMetersTable);

    }

    on(table.events.pagination(machinesMetersTableId), function () {
        let EntryData = prepareData();
        EntryData.Page = machinesMetersTable.settings.page;
        EntryData.PageSize = machinesMetersTable.settings.pageSize;
        let data = {};
        data.successAction = 'machines/details-meters-preview'
        trigger(communication.events.machines.previewMachineMeters, { data, EntryData })
    });

    on(table.events.rowClick(machinesMetersTableId), function (params) {
        let EntryData = prepareData()
        EntryData.MeterGroupId  = params.target.additionalData.Properties.MeterGroupId;
        if (params.event.target.classList.contains('actionlist-6')) {
            EntryData.Date = params.target.additionalData.EntryData.MeterData.Time;
            console.log('ovo ce da edituje miter');
            let data = {}
            data.successAction = 'machines/details-meters-edit'
            trigger(communication.events.machines.showMachineMeters, { data, EntryData });

        }
        else if (params.event.target.classList.contains('actionlist-7')) {
            console.log('ovo ce da brise miter');
            let data = {}
            data.successAction = 'machines/details-meters-remove'
            trigger(communication.events.machines.removeMeter, { data, EntryData });
        }
    });

    on('machines/details-meters-remove', function (params) {
        trigger('notifications/show', {
            message: localization.translateMessage(params.data.MessageCode),
            type: params.data.MessageType,
        });
        let EntryData = prepareData();
        EntryData.Page = machinesMetersTable.settings.page;
        EntryData.PageSize = machinesMetersTable.settings.pageSize;
        let data = {}
        data.successAction = 'machines/details-meters-preview'
        trigger(communication.events.machines.previewMachineMeters, { data, EntryData });
    });

    on('machines/details-meters-save', function (params) {
        trigger('notifications/show', {
            message: localization.translateMessage(params.data.MessageCode),
            type: params.data.MessageType,
        });
    });
    //-------------------------------------------------------------------------------------//

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
    return {
        prepareData
    }
})();