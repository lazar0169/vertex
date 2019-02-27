const malfunctions = (function () {
    let addMalfunctionMsg = $$('#malfunctions-add-message');

    /*********************----Module Events------*********************/
    on('malfunctions/activated', function (params) {

        let malfunctionsId = 0;

        // selectTab();
        // selectInfoContent();

        let tableSettings = {};
        tableSettings.pageSelectorId = '#page-malfunctions';
        tableSettings.tableContainerSelector = '#table-container-malfunctions';
        tableSettings.filtersContainerSelector = '#malfunctions-filter';
        tableSettings.getDataEvent = communication.events.malfunctions.getMalfunctions;
        tableSettings.filterDataEvent = communication.events.malfunctions.previewMalfunctions;
        tableSettings.updateEvent = 'table/update';
        tableSettings.processRemoteData = communication.events.malfunctions.parseRemoteData;
        tableSettings.endpointId = malfunctionsId;
        tableSettings.id = '';
        tableSettings.stickyRow = true;
        tableSettings.onDrawRowCell = 'malfunctions/table/drawCell';
        tableSettings.Action = tableActionOnClick;
        table.init(tableSettings); //initializing table, filters and page size
    });
    on('malfunctions/table/drawCell', function (params) {
        onDrawTableCell(params.key, params.value, params.element, params.position, params.rowData);
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
        addMalfunctionMsg.children[1].title = localization.translateMessage(addMalfunctionMsg.children[1].dataset.value);
    }
    function getFiltersFromAPI(tableSettings) {
        let data = {
            'EndpointId': tableSettings.endpointId
        };
        let tableSettingsObject = tableSettings;
        let successEvent = 'malfunctions/filters/display';
        trigger(communication.events.malfunctions.getFilters, {
            data: data,
            successEvent: successEvent,
            tableSettings: tableSettingsObject
        });
    }
    on('malfunctions/filters/init', function (params) {
        let tableSettings = params.tableSettings;
        getFiltersFromAPI(tableSettings);
    });


    function tableActionOnClick(data) {
        console.log(data);
    }

    function onDrawTableCell(column, cellContent, cell, position, entryData) {
        if (column === 'flag') {
            if (cellContent !== undefined) {
                cell.classList.add('row-flag-' + cellContent.toString().trim());
            }
            cell.classList.add('cell-flag');
            cell.innerHTML = '';
        } else if (column === 'createdBy') {
            cell.classList.add('flex-column');
            cell.classList.add('justify-content-start');
            cell.classList.add('align-items-start');
            cell.innerHTML = `<time class='table-time'>${entryData.data.createdTime}</time><label>${entryData.rowData.createdBy}</label>`;
        }
        //ToDo: isPayoutPossible property ne postoji kod malfunciona
        if (entryData.rowData.actions) {
            cell.classList.add('clickable');
        }
    }


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

            trigger(communication.events.malfunctions.setServiceMessage, {
                data: {
                    'EndpointId': 0,
                    'Message': addMalfunctionMsg.children[0].value
                }
            });
        }

    });
    addMalfunctionMsg.children[1].addEventListener('click', function () {
        if (addMalfunctionMsg.children[1].dataset.value === 'remove') {
            addMalfunctionMsg.children[0].value = "";
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



    /*--------------------------------- MALFUNCTIONS EVENTS -----------------------------------*/
    // get malfunctions (all)
    on(communication.events.malfunctions.getMalfunctions, function (params) {
        let route = communication.apiRoutes.malfunctions.getMalfunctions;
        let request = communication.requestTypes.post;
        let data = params.data;
        let tableSettings = params.tableSettings;
        let successEvent = tableSettings.processRemoteData;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            requestType: request,
            data: data,
            successEvent: successEvent,
            errorEvent: errorEvent,
            settingsObject: tableSettings
        });
    });
    //get preview malfunctions
    on(communication.events.malfunctions.previewMalfunctions, function (params) {
        let route = communication.apiRoutes.malfunctions.previewMalfunctions;
        let request = communication.requestTypes.post;
        let data = params.data;
        let tableSettings = params.tableSettings;
        let successEvent = tableSettings.processRemoteData;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            requestType: request,
            data: data,
            successEvent: successEvent,
            errorEvent: errorEvent,
            settingsObject: tableSettings
        });
    });

    // get filters
    on(communication.events.malfunctions.getFilters, function (params) {
        let route = communication.apiRoutes.malfunctions.getFilters;
        let request = communication.requestTypes.post;
        let data = params.data;
        let tableSettings = params.tableSettings;
        let successEvent = params.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            requestType: request,
            data: data,
            settingsObject: tableSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    // set service message
    on(communication.events.malfunctions.setServiceMessage, function (params) {
        let route = communication.apiRoutes.malfunctions.setServiceMessage;
        let request = communication.requestTypes.post;
        let data = params.data;
        trigger('communicate/createAndSendXhr', {
            route: route,
            requestType: request,
            data: data
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

    on(communication.events.malfunctions.parseRemoteData, function (params) {
        malfunctionsServiceMessage(params.data.Data.ItemValue.ServiceMessage)
        let tableSettings = params.settingsObject;
        let data = params.data;
        prepareMalfunctionsTableData(tableSettings, data);
        trigger(tableSettings.updateEvent, { data: data, settingsObject: tableSettings });
    });
    /*-----------------------------------------------------------------------------------------*/

    function prepareMalfunctionsTableData(tableSettings, data) {
        let entry = data.Data.Items;
        let formatedData = [];
        let counter = 0;
        entry.forEach(function (entry) {
            formatedData[counter] = {
                rowData: {
                    flag: entry.EntryData.FlagList[0],
                    createdBy: entry.EntryData.CreatedBy.Name ? entry.EntryData.CreatedBy.Name : '',
                    casino: entry.EntryData.Casino,
                    machine: entry.EntryData.Machine,
                    name: entry.EntryData.Name,
                    type: localization.translateMessage(entry.EntryData.Type),
                    priority: localization.translateMessage(entry.EntryData.Priority),
                    actions: entry.EntryData.ActionList[0]
                },
                data: {
                    //ToDo: ovde proslediti da li je red klikabilan ili ne
                    createdTime: formatTimeData(entry.EntryData.CreatedBy.Time),
                    endpointId: entry.Properties.EndpointId,
                    id: entry.Properties.Id,
                    malfunctionsList: entry.Properties.ReportList
                }
            };
            counter++;
        });
        tableSettings.tableData = formatedData;
        return formatedData;
    }

})();