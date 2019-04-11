const jackpots = (function () {

    let pageJackpot = $$('#page-jackpots');
    let jackpotDailyLimitTopBar = $$('#top-bar-jackpots').children[0].children[2];
    let jackpotPaidTodayTopBar = $$('#top-bar-jackpots').children[1].children[2];


    const events = {
        activated: 'jackpots/activated',
        getJackpots: 'jackpot/get-jackpots',
        getJackpotHistory: 'jackpot/get-jackpot-history',
        getEvents: 'jackpot/get-jackpot-events',
        getJackpotAnimtionSettings: 'jackpot/get-jackpot-animation-settings'

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

        trigger('jackpot/tab/notification-settings', { endpointId: jackpotId });
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
        let data = params.data.Data;
        jackpotDailyLimitTopBar.innerHTML = formatFloatValue(data.ItemValue.DailyLimitValue / 100);
        jackpotPaidTodayTopBar.innerHTML = formatFloatValue(data.ItemValue.PaidTodayValue / 100);

        if (jackpotsTable !== null) {
            jackpotsTable.destroy();
        }
        jackpotsTable = table.init({
            id: jackpotsTableId,
        },
            data);
        $$('#jackpot-tab-info').appendChild(jackpotsTable);
        trigger('preloader/hide');
    });
    //---------------------------------------------------------------------//


    //-----------------------Jackpot History Tab------------------------------//
    const jackpotHistoryTableId = 'table-container-jackpot-history';
    let jackpotHistoryTable = null;

    on(events.getJackpotHistory, function (params) {
        let data = {};
        data.successAction = 'jackpot/show-jackpot-history-table'
        let EntryData = getEndpointId();
        trigger(communication.events.jackpots.getJackpotHistory, { data, EntryData });
    });

    on('jackpot/show-jackpot-history-table', function (params) {
        if (jackpotHistoryTable !== null) {
            jackpotHistoryTable.destroy();
        }
        jackpotHistoryTable = table.init({
            id: jackpotHistoryTableId,
            pageSizeContainer: '#jackpot-machines-number',
            appearanceButtonsContainer: '#jackpot-show-space'
        },
            params.data.Data);
        $$('#jackpot-history-tab-info').appendChild(jackpotHistoryTable);
        trigger('preloader/hide');
    });
    //-------------------------------------------------------------------------//

    //-----------------------Jackpot Events Tab------------------------------//
    const jackpotEventsTableId = 'table-container-jackpot-events';
    let jackpotEventsTable = null;

    on(events.getEvents, function (params) {
        let data = {};
        data.successAction = 'jackpot/show-jackpot-events-table'
        let EntryData = getEndpointId();
        trigger(communication.events.jackpots.getEvents, { data, EntryData });
    });

    on('jackpot/show-jackpot-events-table', function (params) {
        if (jackpotEventsTable !== null) {
            jackpotEventsTable.destroy();
        }
        jackpotEventsTable = table.init({
            id: jackpotEventsTableId,
            // pageSizeContainer: '#jackpot-machines-number',
            // appearanceButtonsContainer: '#jackpot-show-space'
        },
            params.data.Data);
        $$('#jackpot-events-tab-info').appendChild(jackpotEventsTable);
        trigger('preloader/hide');
    });
    //-------------------------------------------------------------------------//

    //-------------------Jackpot Animation Settings---------------------------//


    //------------------------------------------------------------------------//


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

    //get jackpots events ++++
    on(communication.events.jackpots.getEvents, function (params) {
        trigger('preloader/show');
        let route = communication.apiRoutes.jackpots.getEvents;
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

    //get jackpots history ++++
    on(communication.events.jackpots.getJackpotHistory, function (params) {
        trigger('preloader/show');
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

    //get jackpot settings ++++
    on(communication.events.jackpots.getJackpotSettings, function (params) {
        let route = communication.apiRoutes.jackpots.getJackpotSettings;
        let request = communication.requestTypes.post;
        let data = params.data;
        let formSettings = params.additionalData;
        let successEvent = formSettings.populateData;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            requestType: request,
            data: data,
            additionalData: formSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //get jackpot plasma settings ++++
    on(communication.events.jackpots.getJackpotPlasmaSettings, function (params) {
        let route = communication.apiRoutes.jackpots.getJackpotPlasmaSettings;
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

    //set jackpot settings ++++
    on(communication.events.jackpots.setJackpotSettings, function (params) {
        let route = communication.apiRoutes.jackpots.setJackpotSettings;
        let request = communication.requestTypes.post;
        let data = params.data;
        let formSettings = params.additionalData;
        let successEvent = formSettings.submitSuccessEvent;
        let errorEvent = formSettings.submitErrorEvent;
        trigger('communicate/createAndSendXhr', {
            route: route,
            requestType: request,
            data: data,
            additionalData: formSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //set jackpot plasma settings +++
    on(communication.events.jackpots.setJackpotPlasmaSettings, function (params) {
        let route = communication.apiRoutes.jackpots.setJackpotPlasmaSettings;
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

    return {
        getEndpointId
    }
})();