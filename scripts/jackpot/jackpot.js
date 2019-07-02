const jackpots = (function () {

    let pageJackpot = $$('#page-jackpots');
    let jackpotDailyLimitTopBar = $$('#top-bar-jackpots').children[0].children[2];
    let jackpotPaidTodayTopBar = $$('#top-bar-jackpots').children[1].children[2];

    const jackpotBlockType = {
        'Stop': 0,
        'Hide': 1,
        'Gone': 2,
    }

    const events = {
        activated: 'jackpots/activated',
        getJackpots: 'jackpot/get-jackpots',
        previewJackpots: 'jackpot/preview-jackpot',
        getJackpotHistory: 'jackpot/get-jackpot-history',
        getEvents: 'jackpot/get-jackpot-events',
        previewEvents: 'jackpot/preview-jackpot-events',
        getJackpotAnimationSettings: 'jackpot/get-jackpot-animation-settings',
        saveJackpot: 'jackpot/save-jackpot',
        changeJackpotState: 'jackpot/change-jackpot-state'
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
        trigger(events.getJackpotAnimationSettings)
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
        jackpotDailyLimitTopBar.innerHTML = formatFloatValue(data.ItemValue.DailyLimitValue);
        jackpotPaidTodayTopBar.innerHTML = formatFloatValue(data.ItemValue.PaidTodayValue);

        if (jackpotsTable !== null) {
            jackpotsTable.destroy();
        }
        jackpotsTable = table.init({
            id: jackpotsTableId,
            isJackpot: true
        },
            data);
        $$('#jackpot-tab-info').appendChild(jackpotsTable);

        $$('#add-new-jackpot-wrapper').settings = data.ItemValue;
        trigger('preloader/hide');
    });

    on(table.events.sort(jackpotsTableId), function () {
        let filtersForApi = prepareJackpotFIlters(jackpotsTableId);
        trigger(communication.events.jackpots.previewJackpots, { data: filtersForApi });
    });

    on(events.previewJackpots, function (params) {
        let data = params.data.Data;
        $$(`#${jackpotsTableId}`).update(data);
    });

    on(events.saveJackpot, function (params) {
        // console.log(params)
        let filtersForApi = prepareJackpotFIlters(jackpotsTableId);
        trigger(communication.events.jackpots.previewJackpots, { data: filtersForApi });
        $$('#add-new-jackpot-wrapper').classList.add('hidden');

    });

    on(table.events.rowClick(jackpotsTableId), function (params) {
        let event = params.event;
        let target = params.target;
        let data = {};
        data.Id = target.additionalData.Properties.Id;
        data.EndpointId = $$('#page-jackpots').settings.EndpointId;
        data.Hidden = target.additionalData.Properties.Hidden;
        data.Gone = target.additionalData.Properties.Gone;
        data.Stopped = target.additionalData.Properties.Stopped;
        data.BlockType = target.additionalData.Properties.BlockType;

        if (event.target.classList.contains('actionlist-2')) {
            console.log('kliknuto na akciju 2')
        }
        else if (event.target.classList.contains('actionlist-hidden')) {
            console.log('kliknuto na akciju sakrij dzekpot')
            data.BlockType = jackpotBlockType.Hide;
            trigger(communication.events.jackpots.changeJackpotState, { data });
        }
        else if (event.target.classList.contains('actionlist-deactivate')) {
            console.log('kliknuto na akciju deaktviraj dzekpot');
            data.BlockType = jackpotBlockType.Gone;
            trigger(communication.events.jackpots.changeJackpotState, { data });
        }
        else if (event.target.classList.contains('actionlist-stop')) {
            console.log('kliknuto na akciju stopiraj jackpot');
            data.BlockType = jackpotBlockType.Stop;
            trigger(communication.events.jackpots.changeJackpotState, { data });
        }
        else {
            console.log('prikazi detalje za dzekpot')
        }
        console.log(data)
    });

    on(events.changeJackpotState, function (params) {
        trigger('notifications/show', {
            message: localization.translateMessage(params.data.MessageCode),
            type: params.data.MessageType,
        });
        let filtersForApi = prepareJackpotFIlters(jackpotsTableId);
        trigger(communication.events.jackpots.previewJackpots, { data: filtersForApi });
    })

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
            pageSizeContainer: '#jackpot-events-machines-number',
            appearanceButtonsContainer: '#jackpot-events-show-space'
        },
            params.data.Data);
        $$('#jackpot-events-tab-info').appendChild(jackpotEventsTable);
        trigger('preloader/hide');
    });

    on(table.events.pageSize(jackpotEventsTableId), function () {
        let filtersForApi = prepareJackpotFIlters(jackpotEventsTableId);
        trigger(communication.events.jackpots.previewEvents, { data: filtersForApi });
    });

    on(events.previewEvents, function (params) {
        let data = params.data.Data;
        $$(`#${jackpotEventsTableId}`).update(data);
    });

    on(table.events.pagination(jackpotEventsTableId), function (params) {
        let filtersForApi = prepareJackpotFIlters(jackpotEventsTableId);
        trigger(communication.events.jackpots.previewEvents, { data: filtersForApi });
    });

    function prepareJackpotFIlters(tableId) {
        let table = $$(`#${tableId}`);
        let endpointId = getEndpointId();
        let filters = {
            'EndpointId': endpointId.EndpointId
        }
        table.getFilters(filters);

        let filtersForApi = {
            'EndpointId': filters.EndpointId,
            'Page': filters.BasicData.Page,
            'PageSize': filters.BasicData.PageSize,
            'SortOrder': filters.BasicData.SortOrder,
            'SortName': filters.BasicData.SortName

        }
        return filtersForApi
    }

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

    //preview jackpots ++++
    on(communication.events.jackpots.previewJackpots, function (params) {
        let route = communication.apiRoutes.jackpots.previewJackpots;
        let data = params.data;
        let request = communication.requestTypes.post;
        let successEvent = events.previewJackpots;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            requestType: request,
            successEvent: successEvent,
            errorEvent: errorEvent,
            additionalData: params.EndpointId
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
        let successEvent = events.previewEvents;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            requestType: request,
            successEvent: successEvent,
            errorEvent: errorEvent,
            additionalData: params.EndpointId
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
        let successEvent = events.changeJackpotState;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            requestType: request,
            successEvent: successEvent,
            errorEvent: errorEvent,
            additionalData: params.EndpointId
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
        let successEvent = events.saveJackpot;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            requestType: request,
            successEvent: successEvent,
            errorEvent: errorEvent,

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