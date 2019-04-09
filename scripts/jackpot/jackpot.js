const jackpots = (function () {

    let pageJackpot = $$('#page-jackpots');


    const events = {
        activated: 'jackpots/activated',
        getJackpots: 'jackpot/get-jackpots',
        getJackpotHistory: 'jackpot/get-jackpot-history',

    };

    on(events.activated, function (params) {
        let jackpotId = params.params[0].value;
        pageJackpot.settings = {
            EndpointId: jackpotId
        }
        let data = {}
        data.successAction = 'jackpot/set-filters'
        let EntryData = getEndpointId()
        selectTab('jackpot-tab');
        selectInfoContent('jackpot-tab');
        trigger(communication.events.jackpots.getFilters, { data, EntryData });

    });

    function getEndpointId() {
        let endpointId = pageJackpot.settings.EndpointId;
        let EntryData = {};
        EntryData.EndpointId = endpointId;
        return EntryData;
    }
    //------------------Jackpot Tab----------------------------------------//
    const jackpotsTableId = 'table-container-jackpots';
    let jackpotsTable = null;


    on(events.getJackpots, function (params) {
        let EntryData = getEndpointId()
        let data = {};
        data.successAction = 'jackpot/show-jackpots-table'
        trigger(communication.events.jackpots.getJackpots, { data, EntryData });
    });

    on('jackpot/show-jackpots-table', function (params) {
        if (jackpotsTable !== null) {
            jackpotsTable.destroy();
        }
        jackpotsTable = table.init({
            id: jackpotsTableId,
            pageSizeContainer: '#jackpot-machines-number',
            appearanceButtonsContainer: '#jackpot-show-space'
        },
            params.data.Data);
        $$('#jackpot-tab-info').appendChild(jackpotsTable);
        trigger('preloader/hide');
    });
    //---------------------------------------------------------------------//


    //-----------------------Jackpot History Tab------------------------------//
    const jackpotsHistoryTableId = 'table-container-jackpot-history';
    let jackpotsHistoryTable = null;

    on(events.getJackpotHistory, function (params) {
        let data = {};
        data.successAction = 'jackpot/show-jackpots-history-table'
        let EntryData = getEndpointId();
        trigger(communication.events.jackpots.getJackpotHistory, { data, EntryData });
    });

    on('jackpot/show-jackpots-history-table', function (params) {
        if (jackpotsHistoryTable !== null) {
            jackpotsHistoryTable.destroy();
        }
        jackpotsHistoryTable = table.init({
            id: jackpotsHistoryTableId,
            // pageSizeContainer: '#jackpot-machines-number',
            // appearanceButtonsContainer: '#jackpot-show-space'
        },
            params.data.Data);
        $$('#jackpot-history-tab-info').appendChild(jackpotsHistoryTable);
        trigger('preloader/hide');
    });
    //-------------------------------------------------------------------------//

    //get all jackpots +++
    on(communication.events.jackpots.getJackpots, function (params) {
        trigger('preloader/show');
        let route = communication.apiRoutes.jackpots.getJackpots;
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

    //preview jackpots
    on(communication.events.jackpots.previewJackpots, function (params) {
        let route = communication.apiRoutes.jackpots.previewJackpots;
        let data = params.data;
        let request = communication.requestTypes.post;
        let successEvent = tableSettings.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            requestType: request,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //get jackpots events
    on(communication.events.jackpots.getEvents, function (params) {
        let route = communication.apiRoutes.jackpots.getEvents;
        let data = params.data;
        let request = communication.requestTypes.post;
        let successEvent = tableSettings.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            requestType: request,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //preview jackpots events
    on(communication.events.jackpots.previewEvents, function (params) {
        let route = communication.apiRoutes.jackpots.previewEvents;
        let data = params.data;
        let request = communication.requestTypes.post;
        let successEvent = tableSettings.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            requestType: request,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //get jackpots history
    on(communication.events.jackpots.getJackpotHistory, function (params) {
        trigger('preloader/hide');
        let route = communication.apiRoutes.jackpots.getJackpotHistory;
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

    //preview jackpots history
    on(communication.events.jackpots.previewJackpotHistory, function (params) {
        let route = communication.apiRoutes.jackpots.previewJackpotHistory;
        let data = params.data;
        let request = communication.requestTypes.post;
        let successEvent = tableSettings.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            requestType: request,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //get jackpots filters +++
    on(communication.events.jackpots.getFilters, function (params) {
        let route = communication.apiRoutes.jackpots.getFilters;
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

    //show jackpots info
    on(communication.events.jackpots.showJackpotInfo, function (params) {
        let route = communication.apiRoutes.jackpots.showJackpotInfo;
        let data = params.data;
        let request = communication.requestTypes.post;
        let successEvent = tableSettings.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            requestType: request,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //set ignore restrictions
    on(communication.events.jackpots.setIgnoreRestrictions, function (params) {
        let route = communication.apiRoutes.jackpots.setIgnoreRestrictions;
        let data = params.data;
        let request = communication.requestTypes.post;
        let successEvent = tableSettings.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            requestType: request,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //show jackpot edit info
    on(communication.events.jackpots.showJackpotEditInfo, function (params) {
        let route = communication.apiRoutes.jackpots.showJackpotEditInfo;
        let data = params.data;
        let request = communication.requestTypes.post;
        let successEvent = tableSettings.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            requestType: request,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //change jackpot state
    on(communication.events.jackpots.changeJackpotState, function (params) {
        let route = communication.apiRoutes.jackpots.changeJackpotState;
        let data = params.data;
        let request = communication.requestTypes.post;
        let successEvent = tableSettings.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            requestType: request,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //remove jackpot
    on(communication.events.jackpots.removeJackpot, function (params) {
        let route = communication.apiRoutes.jackpots.removeJackpot;
        let data = params.data;
        let request = communication.requestTypes.post;
        let successEvent = tableSettings.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            requestType: request,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //add jackpot
    on(communication.events.jackpots.addJackpot, function (params) {
        let route = communication.apiRoutes.jackpots.addJackpot;
        let data = params.data;
        let request = communication.requestTypes.post;
        let successEvent = tableSettings.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            requestType: request,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //get jackpot settings
    on(communication.events.jackpots.getJackpotSettings, function (params) {
        let route = communication.apiRoutes.jackpots.getJackpotSettings;
        let data = params.data;
        let request = communication.requestTypes.post;
        let successEvent = tableSettings.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            requestType: request,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //get jackpot plasma settings
    on(communication.events.jackpots.getJackpotPlasmaSettings, function (params) {
        let route = communication.apiRoutes.jackpots.getJackpotPlasmaSettings;
        let data = params.data;
        let request = communication.requestTypes.post;
        let successEvent = tableSettings.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            requestType: request,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //set jackpot settings
    on(communication.events.jackpots.setJackpotSettings, function (params) {
        let route = communication.apiRoutes.jackpots.setJackpotSettings;
        let data = params.data;
        let request = communication.requestTypes.post;
        let successEvent = tableSettings.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            requestType: request,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //set jackpot plasma settings
    on(communication.events.jackpots.setJackpotPlasmaSettings, function (params) {
        let route = communication.apiRoutes.jackpots.setJackpotPlasmaSettings;
        let data = params.data;
        let request = communication.requestTypes.post;
        let successEvent = tableSettings.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            requestType: request,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //save jackpot settings
    on(communication.events.jackpots.saveJackpot, function (params) {
        let route = communication.apiRoutes.jackpots.saveJackpot;
        let data = params.data;
        let request = communication.requestTypes.post;
        let successEvent = tableSettings.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            requestType: request,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //raports jackpot 
    on(communication.events.jackpots.reportsJackpot, function (params) {
        let route = communication.apiRoutes.jackpots.reportsJackpot;
        let data = params.data;
        let request = communication.requestTypes.post;
        let successEvent = tableSettings.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            requestType: request,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });
})();