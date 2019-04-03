let machines = (function () {
    const machinesTableId = 'table-container-machines';
    let machinesTable = null;
    let autoSelect = $$('#auto-select-status');



    const events = {
        activated: 'machines/activated',
        displayMachinesInfo: 'machines/display-machine-info/',
        previewMachines: 'machines/preview-machines',
        filterTable: 'machines/table/filter',
        // showChangeStateMalfunctionMessage: 'malfunction/changeState'
    };
    on(events.activated, function (params) {
        let machinesId = params.params[0].value;
        let tableSettings = {};
        tableSettings.successEvent = "machines/display-machine-info/"
        trigger(communication.events.machines.getMachines, { data: { EndpointId: machinesId }, tableSettings });
        autoSelect.dataset.value = 'on';
        autoSelect.innerHTML = localization.translateMessage(autoSelect.dataset.value);
        machinesFilter.setAutoInterval();
    });

    on('machines/display-machine-info/error', function (e) {
        data = e.data;
        alert('An error occurred.');
    });

    on(events.displayMachinesInfo, function (params) {
        let machinesFiltersVendors = $$('#machines-advance-table-filter-vendors');
        let machinesFiltersStatus = $$('#machines-advance-table-filter-status');

        let machinesVendors = params.data.Data.ItemValue.VendorList;
        let machinesStatus = params.data.Data.ItemValue.StatusList;

        dropdown.generate({ values: machinesVendors, parent: machinesFiltersVendors, type: 'multi' });
        dropdown.generate({ values: machinesStatus, parent: machinesFiltersStatus, type: 'multi' });

        trigger('showing-machines-top-bar-value', params);

        if (machinesTable !== null) {
            machinesTable.destroy();
        }
        machinesTable = table.init({
            endpointId: params.additionalData,
            id: machinesTableId,
            pageSizeContainer: '#machine-filters-number-machines',
            appearanceButtonsContainer: '#machine-filters-show-space'
        },
            params.data.Data);
        $$('#machines-content').appendChild(machinesTable);
    });

    on(table.events.sort(machinesTableId), function () {
        trigger(events.filterTable);
    });

    on(table.events.pageSize(machinesTableId), function () {
        trigger(events.filterTable);
    });

    on(table.events.pagination(machinesTableId), function () {
        trigger(events.filterTable);
    });

    on('machines/table/filter', function (params) {
        filterMachinesTable();
    });

    function filterMachinesTable() {
        let filters = prepareMachinesFilters();
        trigger(communication.events.machines.previewMachines, { data: filters });
    }

    function prepareMachinesFilters() {
        var table = $$('#table-container-machines');
        var machineWithPlayer = $$('#machine-filters-player').getElementsByClassName('form-checkbox')[0].children[0].checked ? true : false;
        var vendorList = $$('#machines-advance-table-filter-vendors').children[1].get();
        var statusesList = $$('#machines-advance-table-filter-status').children[1].get();


        var filters = {
            'EndpointId': table.settings.endpointId,
            'VendorList': vendorList === 'null' ? null : vendorList.split(',').map(Number),
            'Status': statusesList === 'null' ? null : statusesList.split(',').map(Number),
            'AdditionalData': {
                'OnlyActive': machineWithPlayer ? true : false,
                'MachineName': ''
            }
        };
        filters = table.getFilters(filters);
        return filters;
    }

    on(events.previewMachines, function (params) {
        let data = params.data.Data;
        $$(`#${machinesTableId}`).update(data);
        trigger('showing-machines-top-bar-value', params);
    });

    on(table.events.rowClick(machinesTableId), function (params) {
        trigger('machines/machines-details', { data: params.target.additionalData, endpointId: parseInt($$('#table-container-machines').dataset.endpointId) });
    });


    /*------------------------------------ MACHINES EVENTS ----------------------------------*/

    //get all machines
    on(communication.events.machines.getMachines, function (params) {
        let route = communication.apiRoutes.machines.getMachines;
        let data = params.data;
        let request = communication.requestTypes.post;
        let tableSettings = params.tableSettings;
        let successEvent = tableSettings.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            requestType: request,
            additionalData: data.EndpointId,
            settingsObject: tableSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //get preview machines
    on(communication.events.machines.previewMachines, function (params) {
        // trigger('preloader/show');
        let route = communication.apiRoutes.machines.previewMachines;
        let request = communication.requestTypes.post;
        let data = params.data;
        let successEvent = 'machines/preview-machines';
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            requestType: request,
            additionalData: data.EndpointId,
            data: data,
            successEvent: successEvent,
            errorEvent: errorEvent,
        });
    });

    //machines get machine details
    on(communication.events.machines.getMachineDetails, function (params) {
        let route = communication.apiRoutes.machines.getMachineDetails;
        let data = params.EntryData;
        let request = communication.requestTypes.post;
        let successEvent = params.data.successAction;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            requestType: request,
            successEvent: successEvent,
            errorEvent: errorEvent,
            additionalData: params.EntryData.EndpointId
        });
    });

    //machines get service data
    on(communication.events.machines.getMachineServiceData, function (params) {
        let route = communication.apiRoutes.machines.getMachineServiceData;
        let data = params.EntryData;
        let request = communication.requestTypes.post;
        let successEvent = params.data.successAction;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            requestType: request,
            successEvent: successEvent,
            errorEvent: errorEvent,
            additionalData: params.EntryData.EndpointId
        });
    });

    //machines switch service mode
    on(communication.events.machines.switchServiceMode, function (params) {
        let route = communication.apiRoutes.machines.switchServiceMode;
        let data = params.EntryData;
        let request = communication.requestTypes.post;
        let successEvent = params.data.successAction;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            requestType: request,
            successEvent: successEvent,
            errorEvent: errorEvent,
            additionalData: params.EntryData.EndpointId
        });
    });

    //machines get history
    on(communication.events.machines.getMachineHistory, function (params) {
        let route = communication.apiRoutes.machines.getMachineHistory;
        let data = params.EntryData;
        let request = communication.requestTypes.post;
        let successEvent = params.data.successAction;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            requestType: request,
            successEvent: successEvent,
            errorEvent: errorEvent,
            additionalData: params.EntryData.EndpointId
        });
    });

    //machines preview machine history
    on(communication.events.machines.previewMachineHistory, function (params) {
        let route = communication.apiRoutes.machines.previewMachineHistory;
        let data = params.data;
        let request = communication.requestTypes.post;
        let tableSettings = params.tableSettings;
        let successEvent = tableSettings.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            requestType: request,
            settingsObject: tableSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //machines get events
    on(communication.events.machines.getMachineEvents, function (params) {
        let route = communication.apiRoutes.machines.getMachineEvents;
        let data = params.EntryData;
        let request = communication.requestTypes.post;
        let successEvent = params.data.successAction;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            requestType: request,
            successEvent: successEvent,
            errorEvent: errorEvent,
            additionalData: params.EntryData.EndpointId
        });
    });

    //machines get preview events
    on(communication.events.machines.previewMachineEvents, function (params) {
        let route = communication.apiRoutes.machines.previewMachineEvents;
        let data = params.data;
        let request = communication.requestTypes.post;
        let tableSettings = params.tableSettings;
        let successEvent = tableSettings.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            requestType: request,
            settingsObject: tableSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //machines get all meters
    on(communication.events.machines.getAllMachineMeters, function (params) {
        let route = communication.apiRoutes.machines.getAllMachineMeters;
        let data = params.EntryData;
        let request = communication.requestTypes.post;
        let successEvent = params.data.successAction;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            requestType: request,
            successEvent: successEvent,
            errorEvent: errorEvent,
            additionalData: params.EntryData.EndpointId
        });
    });

    //machines preview meters
    on(communication.events.machines.previewMachineMeters, function (params) {
        let route = communication.apiRoutes.machines.previewMachineMeters;
        let data = params.EntryData;
        let request = communication.requestTypes.post;
        let successEvent = params.data.successAction;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            requestType: request,
            successEvent: successEvent,
            errorEvent: errorEvent,
            additionalData: params.EntryData.EndpointId
        });
    });

    //machines remove meter
    on(communication.events.machines.removeMeter, function (params) {
        let route = communication.apiRoutes.machines.removeMeter;
        let data = params.EntryData;
        let request = communication.requestTypes.post;
        let successEvent = params.data.successAction;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            requestType: request,
            successEvent: successEvent,
            errorEvent: errorEvent,
            additionalData: params.EntryData.EndpointId
        });
    });

    //machines save meter
    on(communication.events.machines.saveMachineMeters, function (params) {
        let route = communication.apiRoutes.machines.saveMachineMeters;
        let data = params.data;
        let request = communication.requestTypes.post;
        let tableSettings = params.tableSettings;
        let successEvent = tableSettings.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            requestType: request,
            settingsObject: tableSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //machines show meters
    on(communication.events.machines.showMachineMeters, function (params) {
        let route = communication.apiRoutes.machines.showMachineMeters;
        let data = params.data;
        let request = communication.requestTypes.post;
        let tableSettings = params.tableSettings;
        let successEvent = tableSettings.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            requestType: request,
            settingsObject: tableSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //machines edit machine
    on(communication.events.machines.editMachine, function (params) {
        let route = communication.apiRoutes.machines.editMachine;
        let data = params.EntryData;
        let request = communication.requestTypes.post;
        let successEvent = params.data.successAction;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            requestType: request,
            successEvent: successEvent,
            errorEvent: errorEvent,
            additionalData: params.EntryData.EndpointId
        });
    });

    //machines save machine
    on(communication.events.machines.saveMachine, function (params) {
        let route = communication.events.machines.saveMachine;
        let data = params.data;
        let request = communication.requestTypes.post;
        let tableSettings = params.tableSettings;
        let successEvent = tableSettings.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            requestType: request,
            settingsObject: tableSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //machines remove machine
    on(communication.events.machines.removeMachineFromCasino, function (params) {
        let route = communication.apiRoutes.machines.removeMachineFromCasino;
        let data = params.EntryData;
        let request = communication.requestTypes.post;
        let successEvent = params.data.successAction;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            requestType: request,
            successEvent: successEvent,
            errorEvent: errorEvent,
            additionalData: params.EntryData.EndpointId
        });
    });

    //machines info
    on(communication.events.machines.machineInfo, function (params) {
        let machineId = params.machineId;
        let callbackEventName = tableSettings.successEvent;
        let route = "machine/" + machineId;
        let data = typeof params.data === typeof undefined ? null : params.data;
        let xhr = createRequest(route, requestTypes.get, data, callbackEventName);
        xhr = setDefaultHeaders(xhr);
        xhr = setAuthHeader(xhr);
        send(xhr);
    });

    /*-----------------------------------------------------------------------------------------*/

    return {
        prepareMachinesFilters
    }
})();