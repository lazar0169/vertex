const jackpots = (function () {

    let pageJackpot = $$('#page-jackpots');
    let jackpotDailyLimitTopBar = $$('#top-bar-jackpots').children[0].children[2];
    let jackpotPaidTodayTopBar = $$('#top-bar-jackpots').children[1].children[2];
    let jackpotEditDetailsWrapper = $$("#jackpot-edit-details-wrapper");
    let jackpotDetailsChosenMachine = $$('#jackpot-details-chosen-machine');

    const jackpotBlockType = {
        'Stop': 0,
        'Hide': 1,
        'Gone': 2,
    }
    const jackpotGrowthType = {
        0: "None",
        1: "AutomaticLoading",
        2: "BetLoading",
        3: "DiscreteLoading"
    }
    const inputTypes = {
        singleSelect: 'single-select',
        integer: 'int',
        float: 'float',
        string: 'string',
        array: 'array',
        vertexSlide: 'vertex-slide',
        radio: 'radio'
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
        changeJackpotState: 'jackpot/change-jackpot-state',
        showJackpotInfo: 'jackpot/show-jackpot-info',
        removeJackpot: 'jackpot/remove-jackpot',
        setIgnoreRestrictions: 'jackpot/set-ignore-restrictions',
        showJackpotEditInfo: 'jackpot/show-jackpot-edit-info',
        previewJackpotHistory: 'jackpot/preview-jackpot-history',
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

        $$('#add-new-jackpot-wrapper').settingsTable = data.ItemValue;
        trigger('preloader/hide');
    });

    on(table.events.sort(jackpotsTableId), function () {
        let filtersForApi = prepareJackpotFilters(jackpotsTableId);
        trigger(communication.events.jackpots.previewJackpots, { data: filtersForApi });
    });

    on(events.previewJackpots, function (params) {
        let data = params.data.Data;
        $$(`#${jackpotsTableId}`).update(data);
    });

    on(events.saveJackpot, function (params) {
        // console.log(params)
        trigger('notifications/show', {
            message: localization.translateMessage(params.data.MessageCode),
            type: params.data.MessageType,
        });

        selectTab('jackpot-tab');
        selectInfoContent('jackpot-tab');
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
            let EndpointId = data.EndpointId;
            let Id = data.Id;
            trigger(communication.events.jackpots.showJackpotEditInfo, { EndpointId, Id });
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
            let EndpointId = data.EndpointId;
            let Id = data.Id;
            trigger(communication.events.jackpots.showJackpotInfo, { EndpointId, Id });

        }
        console.log(data)
    });



    on(events.changeJackpotState, function (params) {
        trigger('notifications/show', {
            message: localization.translateMessage(params.data.MessageCode),
            type: params.data.MessageType,
        });
        let filtersForApi = prepareJackpotFilters(jackpotsTableId);
        trigger(communication.events.jackpots.previewJackpots, { data: filtersForApi });
    });

    on(events.showJackpotInfo, function (params) {
        let data = params.data.Data;
        jackpotEditDetailsWrapper.settings = data
        $$('#jackpot-edit-details-header').children[0].innerHTML = data.Title;
        $$('#jackpot-edit-details-general-info-wrapper').innerHTML = `<div class="display-flex">
                            <div class="element-multilanguage" data-translation-key="StartValue">${localization.translateMessage("StartValue:")}</div>
                            <div>${formatFloatValue(data.StartValue)}</div>
                            </div>

                            <div class="display-flex">
                            <div class="element-multilanguage" data-translation-key="Value">${localization.translateMessage("Value:")}</div>
                            <div>${formatFloatValue(data.CurrentValue)}</div>
                            </div>
                            

                            <div class="display-flex">
                            <div class="element-multilanguage" data-translation-key="Status">${localization.translateMessage("Status:")}</div>
                            <div>${localization.translateMessage(data.StatusDescription)}</div>
                            </div>

                            <div class="display-flex">
                            <div class="element-multilanguage" data-translation-key="GrowthType">${localization.translateMessage("GrowthType:")}</div>
                            <div>${localization.translateMessage(jackpotGrowthType[data.Loading])}</div>
                            </div>`

        for (let checkbox of $$('#jackpot-edit-details-conditions-checkbox').children) {
            for (let key of Object.keys(data.IgnoreList)) {
                if (checkbox.dataset.name === key) {
                    if (data.IgnoreList[key] !== null) {
                        checkbox.classList.remove('not-clickable');
                        let checkboxData = {}
                        checkboxData.checkbox = checkbox;
                        checkboxData.isChecked = data.IgnoreList[key];
                        checkboxChangeState.generateCheckbox(checkboxData);
                        break;
                    } else {
                        checkboxChangeState.checkboxIsChecked(checkbox.getElementsByClassName('form-checkbox')[0].children[0], false)
                        checkbox.classList.add('not-clickable');
                    }
                }
            }
        }
        jackpotDetailsChosenMachine.settings = '';
        jackpotDetailsChosenMachine.innerHTML = localization.translateMessage('ChooseMachine');
        jackpotDetailsBar.generateMachinesList(data.MachineRestrictionList);


        $$('#black-area').classList.add('show');
        jackpotEditDetailsWrapper.classList.remove('collapse');
    });

    on(events.removeJackpot, function (params) {
        trigger('notifications/show', {
            message: localization.translateMessage(params.data.MessageCode),
            type: params.data.MessageType,
        });
        jackpotEditDetailsWrapper.classList.add('collapse');
        $$('#black-area').classList.remove('show');

        let filtersForApi = prepareJackpotFilters(jackpotsTableId);
        trigger(communication.events.jackpots.previewJackpots, { data: filtersForApi });
    });

    on(events.setIgnoreRestrictions, function (params) {
        trigger('notifications/show', {
            message: localization.translateMessage(params.data.MessageCode),
            type: params.data.MessageType,
        });
        jackpotEditDetailsWrapper.classList.add('collapse');
        $$('#black-area').classList.remove('show');

        let filtersForApi = prepareJackpotFilters(jackpotsTableId);
        trigger(communication.events.jackpots.previewJackpots, { data: filtersForApi });
    });

    on(events.showJackpotEditInfo, function (params) {
        console.log('showJackpotEditInfo');
        console.log(params);
        let addJackpotListData = params.data.Data.AddJackpotLists;

        addNewJackpot.fillAdvanceSettings(addJackpotListData)


        let jackpotData = params.data.Data.Jackpot;
        $$('#add-new-jackpot-content-header').innerHTML = localization.translateMessage('EditJackpot');

        // for (let inputElement of $$('#add-new-jackpot-wrapper').getElementsByClassName('element-form-data')) {
        //     let inputName = inputElement.name ? inputElement.name : inputElement.children[0].dataset.name;
        //     let value;
        //     if (inputName) {
        //         value = findProp(jackpotData, inputName);
        //     }
        //     switch (inputElement.dataset.type) {
        //         case inputTypes.singleSelect:
        //             jackpotData[inputName] ? inputElement.set(jackpotData[inputName]) : inputElement.reset();
        //             break;
        //         case inputTypes.integer:
        //             if (value || value === 0) {
        //                 inputElement.value = value
        //             }
        //             break;
        //         case inputTypes.float:
        //             // inputElement.value = formatFloatValue(dataToDisplay[inputName] / valueMultiplier);
        //             if (value || value === 0) {
        //                 inputElement.value = formatFloatValue(value);
        //                 inputElement.dataset.value = value;
        //             }
        //             break;
        //         case inputTypes.string:
        //             inputElement.value = jackpotData[inputName] ? jackpotData[inputName] : '';
        //             break;
        //         case inputTypes.array:
        //             if (jackpotData[inputName].length === 1) {
        //                 inputElement.value = jackpotData[inputName][0];
        //             }
        //             break;

        //         case inputTypes.vertexSlide:
        //             inputElement.checked = jackpotData[inputName];
        //             break;

        //         case inputTypes.radio:

        //             if (inputElement.dataset.value === jackpotData[inputElement.parentNode.dataset.name] || parseInt(inputElement.dataset.value) === jackpotData[inputElement.parentNode.dataset.name]) {
        //                 checkboxChangeState.checkboxIsChecked(inputElement, true);
        //             }
        //             break;
        //         default:
        //             inputElement.value = jackpotData[inputName] ? jackpotData[inputName] : '';
        //     }
        // }

        // for (let inputElement of $$('#add-new-jackpot-content-inputs').getElementsByClassName('element-form-data')) {
        //     inputElement.value = jackpotData[inputElement.name]
        // }

        // for (let radioElement of $$('#add-new-jackpot-content-inputs-radio').getElementsByClassName('form-radio')) {
        //     if (jackpotData[radioElement.parentNode.dataset.name]) {
        //         if (radioElement.dataset.value === jackpotData[radioElement.parentNode.dataset.name] || parseInt(radioElement.dataset.value) === jackpotData[radioElement.parentNode.dataset.name]) {
        //             checkboxChangeState.checkboxIsChecked(radioElement.getElementsByClassName('form-input')[0], true);
        //         }
        //     }
        // }

        // for (let controlSettings of $$('#add-new-jackpot-wrapper').getElementsByClassName('add-new-jackpot-control-settings')) {
        //     checkboxChangeState.checkboxIsChecked(controlSettings.getElementsByClassName('form-switch')[0], jackpotData[controlSettings.dataset.name]);
        // }


        $$('#add-new-jackpot-wrapper').classList.remove('hidden')
    });

    // function findProp(obj, searchKey) {
    //     let objKeys = Object.keys(obj);
    //     for (let key of objKeys) {
    //         if (key === searchKey) {
    //             return obj[`${key}`];
    //         }
    //         if (typeof obj[`${key}`] === 'object') {
    //             let result = findProp(obj[`${key}`], searchKey);
    //             if (result !== undefined) {
    //                 return result;
    //             }
    //         }
    //     }
    //     return undefined;
    // }

    function clearAddJackpotInput(wrapper) {

        for (let inputElement of wrapper.getElementsByClassName('element-form-data')) {
            switch (inputElement.dataset.type) {
                case inputTypes.singleSelect:
                    inputElement.reset();
                    break;

                default:
                    inputElement.value = '';
            }
        }
    }

    on('jackpot/clear-add-jackpot-input', function () {
        clearAddJackpotInput($$('#add-new-jackpot-wrapper'));
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
            exportButtonsContainer: '#wrapper-jackpot-export-to',
            appearanceButtonsContainer: '#jackpot-show-space'
        },
            params.data.Data);
        $$('#jackpot-history-tab-info').appendChild(jackpotHistoryTable);
        trigger('preloader/hide');
    });

    on(table.events.pageSize(jackpotHistoryTableId), function () {
        let filtersForApi = jackpotFilter.prepareJackpotHistoryFilters(jackpotHistoryTableId);
        trigger(communication.events.jackpots.previewJackpotHistory, { data: filtersForApi });
    });

    on(table.events.pagination(jackpotHistoryTableId), function (params) {
        let filtersForApi = jackpotFilter.prepareJackpotHistoryFilters(jackpotHistoryTableId);
        trigger(communication.events.jackpots.previewJackpotHistory, { data: filtersForApi });
    });

    on(table.events.sort(jackpotHistoryTableId), function () {
        let filtersForApi = jackpotFilter.prepareJackpotHistoryFilters(jackpotHistoryTableId);
        trigger(communication.events.jackpots.previewJackpotHistory, { data: filtersForApi });
    });

    on(events.previewJackpotHistory, function (params) {
        let data = params.data.Data;
        $$(`#${jackpotHistoryTableId}`).update(data);
        trigger('preloader/hide');
    });

    on(table.events.export(jackpotHistoryTableId), function (params) {
        let jackpotHistoryTable = params.table;
        let filters = null;
        if (jackpotHistoryTable.settings.filters === null) {

            filters = {
                'EndpointId': getEndpointId().EndpointId,
                'SelectedPeriod': {
                    DateFrom: null,
                    DateTo: null,
                    Period: 0
                },
                'MachineList': null,
                'MachineIdList': null,
                'JackpotList': null,
                'CasinoList': null,
                BasicData: {
                    SortOrder: jackpotHistoryTable.settings.sort.direction,
                    SortName: jackpotHistoryTable.settings.sort.name
                },
            };
        } else {
            //clone table filters;
            filters = aftTable.cloneFiltersForExport();
        }
        filters.SelectedColumns = jackpotHistoryTable.getVisibleColumns();
        let event = null;
        switch (params.type.name) {
            case table.exportFileTypes.pdf.name:
                event = communication.events.jackpots.exportToPDF;
                break;
            case table.exportFileTypes.excel.name:
                event = communication.events.jackpots.exportToXLS;
                break;
            default:
                console.error('unsuported export type');
                break;
        }
        trigger(event, { data: filters });
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
        let filtersForApi = prepareJackpotFilters(jackpotEventsTableId);
        trigger(communication.events.jackpots.previewEvents, { data: filtersForApi });
    });

    on(events.previewEvents, function (params) {
        let data = params.data.Data;
        $$(`#${jackpotEventsTableId}`).update(data);
    });

    on(table.events.pagination(jackpotEventsTableId), function (params) {
        let filtersForApi = prepareJackpotFilters(jackpotEventsTableId);
        trigger(communication.events.jackpots.previewEvents, { data: filtersForApi });
    });



    function prepareJackpotFilters(tableId) {
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

    //preview jackpots history ++++
    on(communication.events.jackpots.previewJackpotHistory, function (params) {
        trigger('preloader/show');
        let route = communication.apiRoutes.jackpots.previewJackpotHistory;
        let data = params.data;
        let request = communication.requestTypes.post;
        let successEvent = events.previewJackpotHistory;
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
        let data = params;
        let request = communication.requestTypes.post;
        let successEvent = events.showJackpotInfo;
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

    //set ignore restrictions ++++
    on(communication.events.jackpots.setIgnoreRestrictions, function (params) {
        let route = communication.apiRoutes.jackpots.setIgnoreRestrictions;
        let data = params;
        let request = communication.requestTypes.post;
        let successEvent = events.setIgnoreRestrictions;
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

    //show jackpot edit info
    on(communication.events.jackpots.showJackpotEditInfo, function (params) {
        let route = communication.apiRoutes.jackpots.showJackpotEditInfo;
        let data = params;
        let request = communication.requestTypes.post;
        let successEvent = events.showJackpotEditInfo;
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

    //remove jackpot ++++
    on(communication.events.jackpots.removeJackpot, function (params) {
        let route = communication.apiRoutes.jackpots.removeJackpot;
        let data = params;
        let request = communication.requestTypes.post;
        let successEvent = events.removeJackpot;
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

    on(communication.events.jackpots.exportToPDF, function (params) {
        let data = params.data;
        communication.sendRequest(communication.apiRoutes.jackpots.exportToPDF, communication.requestTypes.post, data,
            table.events.saveExportedFile, communication.handleError, { type: table.exportFileTypes.pdf.type }, [{
                name: 'responseType',
                value: 'arraybuffer'
            }]);
    });

    on(communication.events.jackpots.exportToXLS, function (params) {
        //ToDo za ovo ne postoji backend
    });

    return {
        getEndpointId,
        clearAddJackpotInput
    }
})();