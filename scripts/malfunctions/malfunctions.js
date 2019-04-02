const malfunctions = (function () {
    let addMalfunctionMsg = $$('#malfunctions-add-message');
    let malfunctionsDetailsStatus = $$('#malfunction-details-change-status');
    let malfunctionsDetailsProblemType = $$('#malfunction-details-change-type');

    const events = {
        activated: 'malfunctions/activated',
        getMalfunctions: 'malfunctions/get',
        previewMalfunctions: 'malfunctions/preview',
        filterTable: 'malfunctions/table/filter',
        showChangeStateMalfunctionMessage: 'malfunction/changeState'
    };
    const malfunctionsTableId = 'table-container-malfunctions';
    let malfunctionsTable = null;

    /*********************----Module Events------*********************/
    on(events.activated, function (params) {
        trigger(communication.events.malfunctions.getMalfunctions, { endpointId: 0 });
    });

    on(events.getMalfunctions, function (params) {
        dropdown.generate({ values: params.data.Data.ItemValue.ChangeStateList, parent: malfunctionsDetailsStatus });
        dropdown.generate({ values: params.data.Data.ItemValue.ProblemTypeList, parent: malfunctionsDetailsProblemType });
        malfunctionsDetailsStatus.children[1].addEventListener('click', function (e) {
            if (e.target.dataset.id === '3') {
                malfunctionsDetailsProblemType.classList.remove('hidden');
            }
            else {
                malfunctionsDetailsProblemType.classList.add('hidden');
            }
        })

        malfunctionsServiceMessage(params.data.Data.ItemValue.ServiceMessage);
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
        trigger('malfunctions/filters/init', { endpointId: params.additionalData });
        $$('#malfunctions-info').appendChild(malfunctionsTable);
        trigger('preloader/hide');
    });

    on(events.previewMalfunctions, function (params) {
        let data = params.data.Data;
        $$(`#${malfunctionsTableId}`).update(data);
    });

    on(events.showChangeStateMalfunctionMessage, function (params) {
        trigger('notifications/show', {
            message: localization.translateMessage(params.data.MessageCode),
            type: params.data.MessageType,
        });
        trigger('show/app');
        $$('#malfunctions-details-change-state').classList.add('hidden');
        $$('#malfunctions-details').classList.add('collapse');

        let filters = malfunctionsFilter.prepareMalfunctionsFilters();
        trigger(communication.events.malfunctions.previewMalfunctions, { data: filters });
    });
    /*------------------Show malfunction details--------------------------*/

    on(table.events.rowClick(malfunctionsTableId), function (params) {
        $$('#malfunctions-details').classList.remove('collapse');
        $$('#black-area').classList.add('show');
        trigger('malfunctions-details/machines-history', params.target.additionalData);

    });
    /*------------------------------------------------------------------*/
    on(table.events.sort(malfunctionsTableId), function () {
        trigger(events.filterTable);
    });

    on(table.events.pageSize(malfunctionsTableId), function () {
        trigger(events.filterTable);
    });

    on(table.events.pagination(malfunctionsTableId), function () {
        trigger(events.filterTable);
    });

    addMalfunctionMsg.children[0].addEventListener('keyup', function (event) {
        if (addMalfunctionMsg.children[0].value) {
            addMalfunctionMsg.children[1].classList.remove('hidden')
        }
        else {
            addMalfunctionMsg.children[1].classList.add('hidden')
        }
        addMalfunctionMsg.children[1].innerHTML = '&#10004;';
        addMalfunctionMsg.children[1].dataset.value = 'save';
        addMalfunctionMsg.children[1].title = localization.translateMessage(addMalfunctionMsg.children[1].dataset.value);
        if (event.keyCode === 13) {
            addMalfunctionMsg.children[1].innerHTML = '&#10006;';
            trigger(communication.events.malfunctions.setServiceMessage, {
                data: {
                    'EndpointId': 0,
                    'Message': addMalfunctionMsg.children[0].value
                }
            });
            addMalfunctionMsg.children[0].blur();
        }
    });

    addMalfunctionMsg.children[1].addEventListener('click', function () {
        if (addMalfunctionMsg.children[1].dataset.value === 'remove') {
            addMalfunctionMsg.children[0].value = "";
            addMalfunctionMsg.children[0].focus();
            addMalfunctionMsg.children[1].classList.add('hidden');
        }
        else {
            addMalfunctionMsg.children[1].innerHTML = '&#10006;';
            addMalfunctionMsg.children[1].dataset.value = 'remove';
            addMalfunctionMsg.children[1].title = localization.translateMessage(addMalfunctionMsg.children[1].dataset.value);
        }

        trigger(communication.events.malfunctions.setServiceMessage, {
            data: {
                'EndpointId': 0,
                'Message': addMalfunctionMsg.children[0].value
            }
        });
    });

    function malfunctionsServiceMessage(data) {
        addMalfunctionMsg.children[0].value = data;
        if (addMalfunctionMsg.children[0].value) {
            addMalfunctionMsg.children[1].classList.remove('hidden')
        }
        else {
            addMalfunctionMsg.children[1].classList.add('hidden')
        }
        addMalfunctionMsg.children[1].innerHTML = '&#10006;';
        addMalfunctionMsg.children[1].dataset.value = 'remove';
        addMalfunctionMsg.children[1].title = addMalfunctionMsg.children[1].dataset.value;
    }
    function getFiltersFromAPI(endpointId) {
        let data = {
            'EndpointId': endpointId
        };
        let successEvent = 'malfunctions/filters/display';
        trigger(communication.events.malfunctions.getFilters, {
            data: data,
            successEvent: successEvent,
        });
    }

    on('malfunctions/filters/init', function (params) {
        getFiltersFromAPI(params.endpointId);
    });
    /*--------------------------------- MALFUNCTIONS EVENTS -----------------------------------*/
    // get malfunctions (all)
    on(communication.events.malfunctions.getMalfunctions, function (params) {
        trigger('preloader/show');
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
    //get preview malfunctions
    on(communication.events.malfunctions.previewMalfunctions, function (params) {
        let route = communication.apiRoutes.malfunctions.previewMalfunctions;
        let request = communication.requestTypes.post;
        let data = params.data;
        let successEvent = events.previewMalfunctions;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            requestType: request,
            data: data,
            successEvent: successEvent,
            errorEvent: errorEvent,
        });
    });
    // get filters
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
        let successEvent = 'malfunctions/set-service-message/show-server-message';
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            requestType: request,
            data: data,
            successEvent,
            errorEvent
        });
    });
    // change malfunction state
    on(communication.events.malfunctions.changeMalfunctionState, function (params) {
        let route = communication.apiRoutes.malfunctions.changeMalfunctionState;
        let request = communication.requestTypes.post;
        let successEvent = events.showChangeStateMalfunctionMessage;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            requestType: request,
            data: params.data,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });
    /*-----------------------------------------------------------------------------------------*/
})();