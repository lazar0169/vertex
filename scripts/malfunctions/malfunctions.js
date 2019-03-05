const malfunctions = (function () {
    let addMalfunctionMsg = $$('#malfunctions-add-message');
    const events = {
        activated: 'malfunctions/activated',
        getMalfunctions: 'malfunctions/get',
        previewMalfunctions: 'malfunctions/preview',
        filterTable: 'malfunctions/table/filter'
    };
    const malfunctionsTableId = 'table-container-malfunctions';

    let malfunctionsTable = null;


    /*********************----Module Events------*********************/
    on(events.activated, function (params) {
        trigger(communication.events.malfunctions.getMalfunctions, { endpointId: 0 });

    });
    on(events.getMalfunctions, function (params) {
        if (malfunctionsTable !== null) {
            malfunctionsTable.destroy();
        }
        malfunctionsTable = table.init({
            endpointId: params.additionalData,
            id: malfunctionsTableId,
            pageSizeContainer: '#malfunctions-number',
            appearanceButtonsContainer: '#malfunctions-show-space'
        },
            params.data.Data);
        $$('#malfunctions-info').appendChild(malfunctionsTable);
    });

    addMalfunctionMsg.children[0].addEventListener('keyup', function () {
        if (addMalfunctionMsg.children[0].value) {
            addMalfunctionMsg.children[1].classList.remove('hidden')
        }
        else {
            addMalfunctionMsg.children[1].classList.add('hidden')
        }
    });
    addMalfunctionMsg.children[1].addEventListener('click', function () {
        addMalfunctionMsg.children[0].value = "";
        addMalfunctionMsg.children[1].classList.add('hidden');
    });

    /*--------------------------------- MALFUNCTIONS EVENTS -----------------------------------*/
    // get malfunctions (all)
    on(communication.events.malfunctions.getMalfunctions, function (params) {
        let route = communication.apiRoutes.malfunctions.getMalfunctions;
        let request = communication.requestTypes.post;
        let data = {
            'EndpointId': params.data
        };
        let successEvent = events.getMalfunctions;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            requestType: request,
            data: data,
            successEvent: successEvent,
            errorEvent: errorEvent,
            additionalData: params.endpointId
        });
    });

    //tickets preview ticket action
    //tickets pagination sorting and filtering
    on(communication.events.malfunctions.previewMalfunctions, function (params) {
        let route = communication.apiRoutes.malfunctions.previewMalfunctions;
        let request = communication.requestTypes.post;
        let data = params.data;
        let successEvent = events.getMalfunctions;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            requestType: request,
            data: data,
            successEvent: successEvent,
            errorEvent: errorEvent,


        });
    });

    //tickets get filter values
    on(communication.events.malfunctions.getFilters, function (params) {
        let route = communication.apiRoutes.malfunctions.getFilters;
        let request = communication.requestTypes.post;
        let data = params.data;
        let successEvent = params.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            requestType: request,
            data: data,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    // set service message
    on(communication.events.malfunctions.setServiceMessage, function (params) {
        let route = communication.apiRoutes.malfunctions.setServiceMessage;
        let request = communication.requestTypes.post;
        let data = params.data;
        let successEvent = formSettings.submitSuccessEvent;
        let errorEvent = formSettings.submitErrorEvent;
        trigger('communicate/createAndSendXhr', {
            route: route,
            requestType: request,
            data: data,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    // change malfunction state
    on(communication.events.malfunctions.changeMalfunctionState, function (params) {
        let route = communication.apiRoutes.malfunctions.changeMalfunctionState;
        let request = communication.requestTypes.post;
        let data = params.data;
        let formSettings = params.formSettings;
        let successEvent = formSettings.submitSuccessEvent;
        let errorEvent = formSettings.submitErrorEvent;
        trigger('communicate/createAndSendXhr', {
            route: route,
            requestType: request,
            data: data,
            settingsObject: formSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    /*-----------------------------------------------------------------------------------------*/
})();