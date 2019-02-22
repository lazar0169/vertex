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

    /*------------------------------------ MACHINES EVENTS ----------------------------------*/

    //get all machines
    on(communication.events.machines.getMachines, function (params) {
        let route = communication.apiRoutes.machines.getMachines;
        let data = params.data;
        let request = communication.requestTypes.post;
        let tableSettings = params.tableSettings;
        let successEvent = params.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            request: request,
            settingsObject: tableSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //machines get machine details
    on(communication.events.machines.getMachineDetails, function (params) {
        let route = communication.apiRoutes.machines.getMachineDetails;
        let data = params.data;
        let request = communication.requestTypes.post;
        let tableSettings = params.tableSettings;
        let successEvent = params.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            request: request,
            settingsObject: tableSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //machines get service data
    on(communication.events.machines.getMachineServiceData, function (params) {
        let route = communication.apiRoutes.machines.getMachineServiceData;
        let data = params.data;
        let request = communication.requestTypes.post;
        let tableSettings = params.tableSettings;
        let successEvent = params.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            request: request,
            settingsObject: tableSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //machines swich service mode
    on(communication.events.machines.switchServiceMode, function (params) {
        let route = communication.apiRoutes.machines.switchServiceMode;
        let data = params.data;
        let request = communication.requestTypes.post;
        let tableSettings = params.tableSettings;
        let successEvent = params.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            request: request,
            settingsObject: tableSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //machines get history
    on(communication.events.machines.getMachineHistory, function (params) {
        let route = communication.apiRoutes.machines.getMachineHistory;
        let data = params.data;
        let request = communication.requestTypes.post;
        let tableSettings = params.tableSettings;
        let successEvent = params.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            request: request,
            settingsObject: tableSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //machines preview machine history
    on(communication.events.machines.previewMachineHistory, function (params) {
        let route = communication.apiRoutes.machines.previewMachineHistory;
        let data = params.data;
        let request = communication.requestTypes.post;
        let tableSettings = params.tableSettings;
        let successEvent = params.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            request: request,
            settingsObject: tableSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //machines get events
    on(communication.events.machines.getMachineEvents, function (params) {
        let route = communication.apiRoutes.machines.getMachineEvents;
        let data = params.data;
        let request = communication.requestTypes.post;
        let tableSettings = params.tableSettings;
        let successEvent = params.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            request: request,
            settingsObject: tableSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //machines get preview events
    on(communication.events.machines.previewMachineEvents, function (params) {
        let route = communication.apiRoutes.machines.previewMachineEvents;
        let data = params.data;
        let request = communication.requestTypes.post;
        let tableSettings = params.tableSettings;
        let successEvent = params.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            request: request,
            settingsObject: tableSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //machines get all meters
    on(communication.events.machines.getAllMachineMeters, function (params) {
        let route = communication.apiRoutes.machines.getAllMachineMeters;
        let data = params.data;
        let request = communication.requestTypes.post;
        let tableSettings = params.tableSettings;
        let successEvent = params.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            request: request,
            settingsObject: tableSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //machines preview meters
    on(communication.events.machines.previewMachineMeters, function (params) {
        let route = communication.apiRoutes.machines.previewMachineMeters;
        let data = params.data;
        let request = communication.requestTypes.post;
        let tableSettings = params.tableSettings;
        let successEvent = params.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            request: request,
            settingsObject: tableSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //machines remove meter
    on(communication.events.machines.removeMeter, function (params) {
        let route = communication.apiRoutes.machines.removeMeter;
        let data = params.data;
        let request = communication.requestTypes.post;
        let tableSettings = params.tableSettings;
        let successEvent = params.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            request: request,
            settingsObject: tableSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //machines save meter
    on(communication.events.machines.saveMachineMeters, function (params) {
        let route = communication.apiRoutes.machines.saveMachineMeters;
        let data = params.data;
        let request = communication.requestTypes.post;
        let tableSettings = params.tableSettings;
        let successEvent = params.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            request: request,
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
        let successEvent = params.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            request: request,
            settingsObject: tableSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //machines edit machine
    on(communication.events.machines.editMachine, function (params) {
        let route = communication.apiRoutes.machines.editMachine;
        let data = params.data;
        let request = communication.requestTypes.post;
        let tableSettings = params.tableSettings;
        let successEvent = params.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            request: request,
            settingsObject: tableSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //machines save machine
    on(communication.events.machines.saveMachine, function (params) {
        let route = communication.events.machines.saveMachine;
        let data = params.data;
        let request = communication.requestTypes.post;
        let tableSettings = params.tableSettings;
        let successEvent = params.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            request: request,
            settingsObject: tableSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //machines remove machine
    on(communication.events.machines.removeMachineFromCasino, function (params) {
        let route = communication.apiRoutes.machines.removeMachineFromCasino;
        let data = params.data;
        let request = communication.requestTypes.post;
        let tableSettings = params.tableSettings;
        let successEvent = params.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            request: request,
            settingsObject: tableSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //machines info
    on(communication.events.machines.machineInfo, function (params) {
        let machineId = params.machineId;
        let callbackEventName = params.successEvent;
        let route = "machine/" + machineId;
        let data = typeof params.data === typeof undefined ? null : params.data;
        let xhr = createRequest(route, requestTypes.get, data, callbackEventName);
        xhr = setDefaultHeaders(xhr);
        xhr = setAuthHeader(xhr);
        send(xhr);
    });

    /*-----------------------------------------------------------------------------------------*/


})();