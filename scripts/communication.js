let communication = (function () {

    const apiRoutes = {
        authorization: {
            login: "login/",
            logout: "logout/",
        },
        aft: {
            edit: "aft/",
            list: "list/",
            ticket: "ticket/"
        }
    };

    const xhrStates = {
        unsent: 0,
        opened: 1,
        headersReceived: 2,
        loading: 3,
        done: 4
    };

    const requestTypes = {
        get: 'GET',
        post: 'POST',
        delete: 'DELETE'
    };

    const apiUrl = 'https://api.fazigaming.com/';

    function createGetRequest(route) {
        let xhr = new XMLHttpRequest();
        xhr.open(requestTypes.get, apiUrl + route, true);
        return xhr;
    }

    function createPostRequest(route, data) {
        let xhr = new XMLHttpRequest();
        xhr.open(requestTypes.post, apiUrl + route, true);
        xhr.customData = data;
        return xhr;
    }

    function createDeleteRequest(route) {
        let xhr = new XMLHttpRequest();
        xhr.open(requestTypes.delete, apiUrl + route, true);
        return xhr;
    }

    function success(xhr, callbackEvent, settingsObject) {
        let data = tryParseJSON(xhr.responseText);
        //update token in sessionStorage
        sessionStorage["token"] = JSON.stringify(data.TokenInfo);
        if (typeof callbackEvent !== typeof undefined && callbackEvent !== null) {
            trigger(callbackEvent, {data: data, settingsObject: settingsObject});
        }
        trigger('communicate/token/refresh', {token: data.TokenInfo});
    }

    function error(xhr, errorEventCallback) {
        let errorData = {"message": xhr.responseText};
        if (typeof errorEventCallback !== typeof undefined) {
            trigger(errorEventCallback, errorData);
        }
    }

    function createRequest(route, requestType, data, successEvent, errorEvent, settingsObject) {
        let xhr;
        if (requestType === requestTypes.get) {
            xhr = createGetRequest(route);
        } else if (requestType === requestTypes.post) {
            xhr = createPostRequest(route, data);
        } else if (requestType === requestTypes.delete) {
            xhr = createDeleteRequest(route);
        }
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState === xhrStates.done && xhr.status >= 200 && xhr.status < 300) {
                success(xhr, successEvent, settingsObject);
            } else if (xhr.readyState === xhrStates.done && xhr.status >= 400) {
                error(xhr, errorEvent);
            }
        };
        return xhr;
    }

    function send(xhr) {
        if (typeof xhr.customData !== typeof undefined) {
            return xhr.send(JSON.stringify(xhr.customData));
        }
        return xhr.send();
    }

    //helper functions
    function tryParseJSON(jsonString) {
        try {
            let o = JSON.parse(jsonString);
            if (o && typeof o === "object") {
                return o;
            }
        } catch (e) {
            console.error('Forwarded variable is not of JSON type!');
        }
        return undefined;
    }

    function setDefaultHeaders(xhr) {
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Accept", "application/json");
        return xhr;
    }

    function setAuthHeader(xhr) {
        // take token from sessionStorage and set refresh and authorization 
        let token = JSON.parse(sessionStorage['token']);
        xhr.setRequestHeader('refresh', token.refresh_token);
        xhr.setRequestHeader('Authorization', 'Bearer ' + token.access_token);
        return xhr;
    }

    function setHeader(xhr, header, value) {
        xhr.setRequestHeader(header, value);
    }


    function prepareAftTableData(tableSettings, data) {
        let tableData = data.Data.Items;
        let formatedData = {};
        tableData.forEach(function (entry) {
            if (entry.EntryData.CreatedBy === null || entry.EntryData.CreatedBy === '') {
                entry.EntryData.CreatedBy = '';

            } else {
                entry.EntryData.CreatedBy = '<time class="table-time">' + formatTimeData(entry.EntryData.CreatedTime) + '</time>' + '<h6>by ' + entry.EntryData.CreatedBy + '</h6>';

            }
            if (entry.EntryData.FinishedBy === null || entry.EntryData.FinishedBy === '') {
                entry.EntryData.FinishedBy = '';

            } else {
                entry.EntryData.FinishedBy = '<time class="table-time">' + formatTimeData(entry.EntryData.FinishedTime) + '</time>' + '<h6>by ' + entry.EntryData.FinishedBy + '</h6>';

            }
            delete entry.EntryData.CreatedTime;
            delete entry.EntryData.FinishedTime;
            entry.EntryData.AmountCashable = formatFloatValue(entry.EntryData.AmountCashable % 100);
            entry.EntryData.AmountPromo = formatFloatValue(entry.EntryData.AmountPromo % 100);
        });

        for (let i = 0; i < tableData.length; i++) {
            formatedData[i] = {
                createdBy: tableData[i].EntryData.CreatedBy,
                finishedBy: tableData[i].EntryData.FinishedBy,
                status:  tableData[i].EntryData.Status,
                machineName:  tableData[i].EntryData.MachineName,
                type:  tableData[i].EntryData.Type,
                cashable:  tableData[i].EntryData.AmountCashable,
                promo:  tableData[i].EntryData.AmountPromo,
            };
        }

        tableSettings.formatedData = formatedData;

        return formatedData;
    }

    function formatTimeData(timeData){
        return timeData.replace(/-/g, '/').replace('T', ' ').replace(/\..*/,'');
    }

    function prepareTicketsTableData(tableSettings, data) {
        let tableData = data.Data.Items;
        let formatedData = {};
        tableData.forEach(function (entry) {
            if (entry.EntryData.CashoutedBy === null || entry.EntryData.CashoutedBy === '') {
                entry.EntryData.CashoutedBy = '<time class="table-time">' + formatTimeData(entry.EntryData.CashoutedTime) + '</time>' + '<h6>' + entry.EntryData.CashoutedBy + '</h6>';

            } else {
                entry.EntryData.CashoutedBy = '<time class="table-time">' + formatTimeData(entry.EntryData.CashoutedTime) + '</time>' + '<h6>by ' + entry.EntryData.CashoutedBy + '</h6>';

            }
            if (entry.EntryData.RedeemedBy === null || entry.EntryData.RedeemedBy === '') {
                entry.EntryData.RedeemedBy = '<time class="table-time">' + formatTimeData(entry.EntryData.RedeemedTime) + '</time>' + '<h6>' + entry.EntryData.RedeemedBy + '</h6>';

            } else {
                entry.EntryData.RedeemedBy = '<time class="table-time">' + formatTimeData(entry.EntryData.RedeemedTime) + '</time>' + '<h6>by ' + entry.EntryData.RedeemedBy + '</h6>';

            }
            entry.EntryData.Amount = formatFloatValue(entry.EntryData.Amount % 100);
            delete entry.EntryData.CashoutedTime;
            delete entry.EntryData.RedeemedTime;
/*            let entryData = {};
            entryData.Code = entry.EntryData.FullTicketValIdationNumber;
            delete entry.EntryData.FullTicketValIdationNumber;
            Object.keys(entry.EntryData).forEach(function(key) {
                entryData[key] = entry.EntryData[key];
            });
            entry.EntryData = entryData;*/
            if(entry.EntryData.TicketType === 'CashableTicket') {
                entry.EntryData.TicketType = '<i class="tickets-cashable"></i>'+ entry.EntryData.TicketType;
            }
        });
        for (let i = 0; i < tableData.length; i++) {
            formatedData[i] = {
                code: tableData[i].EntryData.FullTicketValIdationNumber,
                issuedBy: tableData[i].EntryData.CashoutedBy,
                redeemedBy:  tableData[i].EntryData.RedeemedBy,
                status:  tableData[i].EntryData.Status,
                type:  tableData[i].EntryData.TicketType,
                amount:  tableData[i].EntryData.Amount
            };
        }

        console.log('formated data', formatedData);

        tableSettings.formatedData = formatedData;

        return formatedData;
    }


    // create and send xhr
    on('communicate/createAndSendXhr', function (params) {
        let xhr = createRequest(params.route, params.request, params.data, params.successEvent, params.errorEvent, params.settingsObject);
        xhr = setDefaultHeaders(xhr);
        xhr = setAuthHeader(xhr);
        send(xhr);
    });

    on('jovana/test', function (params) {
        // parse parameters for table
        let tableData = [];
        params.data.Data.Items.forEach(function (item) {
            tableData.push(item.EntryData);
        });
    });


    //pagination event
    on('communicate/pagination', function (params) {
        let event = params.event;
        let dataForApi = params.data;
        trigger(event, {data: dataForApi, tableSettings: params.tableSettings, callbackEvent: params.callbackEvent});
    });


    /*------------------------------------ AFT EVENTS ------------------------------------*/

    //aft get transactions
    on('communicate/aft/getTransactions', function (params) {
        let route = 'api/transactions/';
        let tableSettings = params.tableSettings;
        let successEvent = tableSettings.prepareDataEvent;
        let data = params.data;
        let request = requestTypes.post;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            request: request,
            data: data,
            successEvent: successEvent,
            errorEvent: errorEvent,
            settingsObject: tableSettings
        });
    });

    //aft pagination filtering sorting
    //aft preview transactions
    on('communicate/aft/previewTransactions', function (params) {
        let route = 'api/transactions/previewtransactions/';
        let tableSettings = params.tableSettings;
        let successEvent = tableSettings.prepareDataEvent;
        let data = params.data;
        let request = requestTypes.post;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            successEvent: successEvent,
            data: data,
            request: request,
            errorEvent: errorEvent,
            settingsObject: tableSettings
        });
    });


    //aft get notification settings
    on('communicate/aft/getNotificationSettings', function (params) {
        let route = 'api/transactions/getnotificationsettings';
        // let successEvent = 'aft/tab/notifications/display';
        let formSettings = params.formSettings;
        let successEvent = formSettings.fillFormEvent;
        let data = params.data;
        let request = requestTypes.post;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            successEvent: successEvent,
            data: data,
            request: request,
            errorEvent: errorEvent,
            settingsObject: formSettings
        });
    });

    //aft save notification settings
    on('communicate/aft/saveNotificationSettings', function (params) {
        let route = 'api/transactions/savenotificationsettings/';
        // let successEvent = 'aft/tab/notifications/update';
        let formSettings = params.formSettings;
        let successEvent = formSettings.submitSuccessEvent;
        let errorEvent = formSettings.submitErrorEvent;
        let data = params.data;
        let request = requestTypes.post;
        trigger('communicate/createAndSendXhr', {
            route: route,
            successEvent: successEvent,
            data: data,
            request: request,
            errorEvent: errorEvent,
            settingsObject: formSettings
        });
    });

    //aft get basic settings
    on('communicate/aft/getBasicSettings', function (params) {
        let route = 'api/transactions/getbasicsettings/';
        // let successEvent = 'aft/tab/transactions/display';
        let formSettings = params.formSettings;
        let successEvent = formSettings.fillFormEvent;
        let data = params.data;
        let request = requestTypes.post;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            successEvent: successEvent,
            data: data,
            request: request,
            errorEvent: errorEvent,
            settingsObject: formSettings
        });
    });

    //aft save basic settings
    on('communicate/aft/saveBasicSettings', function (params) {
        let route = 'api/transactions/savebasicsettings/';
        // let successEvent = 'aft/tab/transactions/update';
        let formSettings = params.formSettings;
        let successEvent = formSettings.submitSuccessEvent;
        let errorEvent = formSettings.submitErrorEvent;
        let data = params.data;
        let request = requestTypes.post;
        trigger('communicate/createAndSendXhr', {
            route: route,
            successEvent: successEvent,
            data: data,
            request: request,
            errorEvent: errorEvent,
            settingsObject: formSettings
        });
    });

    //aft get filters
    on('communicate/aft/getFilters', function (params) {
        let route = 'api/transactions/getfilters';
        let successEvent = params.successEvent;
        let request = requestTypes.post;
        let errorEvent = '';
        let tableSettings = params.tableSettings;
        trigger('communicate/createAndSendXhr', {
            route: route,
            successEvent: successEvent,
            data: params.data,
            request: request,
            errorEvent: errorEvent,
            settingsObject: tableSettings
        });
    });

    //aft add transaction
    on('communicate/aft/addTransaction', function (params) {
        let route = 'api/transactions/addtransaction/';
        let successEvent = 'aft/addTransaction';
        let data = params.data;
        let request = requestTypes.post;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            successEvent: successEvent,
            data: data,
            request: request,
            errorEvent: errorEvent
        });
    });

    //aft cancel transaction
    on('communicate/aft/cancelTransaction', function (params) {
        let route = 'api/transactions/canceltransaction/';
        let successEvent = 'communicate/test';
        let data = params.data;
        let request = requestTypes.post;
        let tableSettings = params.tableSettings;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            successEvent: successEvent,
            data: data,
            request: request,
            errorEvent: errorEvent,
            settingsObject: tableSettings
        });
    });

    //aft cancel pending transaction
    on('communicate/aft/cancelPendingTransaction', function (params) {
        let route = 'api/transactions/cancelpendingtransaction/';
        let successEvent = 'communicate/test';
        let data = params.data;
        let request = requestTypes.post;
        let errorEvent = '';
        let tableSettings = params.tableSettings;
        trigger('communicate/createAndSendXhr', {
            route: route,
            successEvent: successEvent,
            data: data,
            request: request,
            errorEvent: errorEvent,
            settingsObject: tableSettings
        });
    });

    //prepare data for aft  page
    on('communicate/aft/data/prepare', function (params) {
        let tableSettings = params.settingsObject;
        let data = params.data;
        prepareAftTableData(tableSettings, data);
        console.log('table settings object in communciate aft data prepare', tableSettings);
        trigger(tableSettings.updateTableEvent, {data: data, settingsObject: tableSettings});
    });

    /*--------------------------------------------------------------------------------------*/


    /*------------------------------------ TICKETS EVENTS ------------------------------------*/
    //tickets get tickets
    on('communicate/tickets/getTickets', function (params) {
        let route = 'api/tickets/';
        let tableSettings = params.tableSettings;
        let successEvent = tableSettings.prepareDataEvent;
        let request = requestTypes.post;
        let data = params.data;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            request: request,
            data: data,
            successEvent: successEvent,
            errorEvent: errorEvent,
            settingsObject: tableSettings
        });
    });

    //tickets preview ticket action
    //pagination sorting and filtering
    on('communicate/tickets/previewTickets', function (params) {
        let route = 'api/tickets/previewtickets/';
        let tableSettings = params.tableSettings;
        let successEvent = tableSettings.prepareDataEvent;
        let request = requestTypes.post;
        let data = params.data;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            request: request,
            data: data,
            successEvent: successEvent,
            errorEvent: errorEvent,
            settingsObject: tableSettings
        });
    });

    //getting filter values
    on('communicate/tickets/getFilters', function (params) {
        let route = 'api/tickets/getfilters/';
        let successEvent = params.successEvent;
        let request = requestTypes.post;
        let data = params.data;
        let tableSettings = params.tableSettings;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            request: request,
            data: data,
            successEvent: successEvent,
            errorEvent: errorEvent,
            settingsObject: tableSettings
        });
    });


    //getting values for show sms settings
    on('communicate/tickets/showSmsSettings', function (params) {
        let route = 'api/tickets/smssettings/';
        // let successEvent = 'tickets/tab/smsSettings/display';
        let formSettings = params.formSettings;
        let successEvent = formSettings.fillFormEvent;
        let request = requestTypes.post;
        let data = params.data;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            request: request,
            data: data,
            successEvent: successEvent,
            errorEvent: errorEvent,
            settingsObject: formSettings
        });
    });


    //ShowTitoMaxValueSettings
    on('communicate/tickets/showMaxValueSettings', function (params) {
        let route = 'api/tickets/maxvaluesettings/';
        // let successEvent = 'tickets/tab/maxValue/display';
        let formSettings = params.formSettings;
        let successEvent = formSettings.fillFormEvent;
        let request = requestTypes.post;
        let data = params.data;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            request: request,
            data: data,
            successEvent: successEvent,
            errorEvent: errorEvent,
            settingsObject: formSettings
        });
    });

    //ShowTicketAppearanceSettings
    on('communicate/tickets/ticketAppearance', function (params) {
        let route = 'api/tickets/ticketappearance/';
        // let successEvent = 'tickets/tab/appearance/display';
        let formSettings = params.formSettings;
        let successEvent = formSettings.fillFormEvent;
        let request = requestTypes.post;
        let data = params.data;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            request: request,
            data: data,
            successEvent: successEvent,
            errorEvent: errorEvent,
            settingsObject: formSettings
        });
    });


    //SaveTitoSmsAction
    on('communicate/tickets/saveSmsSettings', function (params) {
        let route = 'api/tickets/savesmssettings/';
        // let successEvent = 'tickets/tab/smsSettings/update';
        let formSettings = params.formSettings;
        let successEvent = formSettings.submitSuccessEvent;
        let errorEvent = formSettings.submitErrorEvent;
        let request = requestTypes.post;
        let data = params.data;
        trigger('communicate/createAndSendXhr', {
            route: route,
            request: request,
            data: data,
            successEvent: successEvent,
            errorEvent: errorEvent,
            settingsObject: formSettings
        });
    });


    //SaveTitoMaxValuesAction
    on('communicate/tickets/saveMaxValuesAction', function (params) {
        let route = 'api/tickets/savemaxvalues/';
        // let successEvent = 'tickets/tab/maxValue/update';
        let formSettings = params.formSettings;
        let successEvent = formSettings.submitSuccessEvent;
        let errorEvent = formSettings.submitErrorEvent;
        let request = requestTypes.post;
        let data = params.data;
        trigger('communicate/createAndSendXhr', {
            route: route,
            request: request,
            data: data,
            successEvent: successEvent,
            errorEvent: errorEvent,
            settingsObject: formSettings
        });
    });


    //SaveTicketAppearanceAction
    on('communicate/tickets/saveAppearance', function (params) {
        let route = 'api/tickets/saveappearance/';
        // let successEvent = 'tickets/tab/appearance/update';
        let formSettings = params.formSettings;
        let successEvent = formSettings.submitSuccessEvent;
        let errorEvent = formSettings.submitErrorEvent;
        let request = requestTypes.post;
        let data = params.data;
        trigger('communicate/createAndSendXhr', {
            route: route,
            request: request,
            data: data,
            successEvent: successEvent,
            errorEvent: errorEvent,
            settingsObject: formSettings
        });
    });


    //prepare data for tickets  page
    on('communicate/tickets/data/prepare', function (params) {
        let tableSettings = params.settingsObject;
        let data = params.data;
        prepareTicketsTableData(tableSettings, data);
        trigger(tableSettings.updateEvent, {data: data, settingsObject: tableSettings});
    });

    /*--------------------------------------------------------------------------------------*/


    //events for login
    on('communicate/login', function (params) {
        let successEvent = params.successEvent;
        let errorEvent = params.errorEvent;
        let route = apiRoutes.authorization.login;
        let data = typeof params.data === typeof undefined ? null : params.data;
        let xhr = createRequest(route, requestTypes.post, data, successEvent, errorEvent);
        xhr = setDefaultHeaders(xhr);
        //xhr = setAuthHeader(xhr);
        send(xhr);
    });


    //events for casino
    on('communicate/casino-info', function (params) {
        //let casinoId = params.casinoId;
        //let callbackEventName = params.successEvent;
        // let data = typeof params.data === typeof undefined ? null : params.data;
        // let xhr = createRequest(route, requestTypes.delete, data, callbackEventName);
        let route = 'api/machines/';
        let successEvent = 'communicate/test'
        let data = {
            'EndpointId': 4
        };
        let request = requestTypes.post;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            successEvent: successEvent,
            data: data,
            request: request,
            errorEvent: errorEvent
        });

        //todo needs to be deleted
        // trigger('communicate/casinos/previewMachines', {})
        // trigger('communicate/casinos/getMachineDetails', {})
        // trigger('communicate/casinos/getMachineServiceData', {})
        // trigger('communicate/casinos/swichServiceMode', {})
        // trigger('communicate/casinos/getMachinesHistory', {})
        // trigger('communicate/casinos/previewMachinesHistory', {})
        // trigger('communicate/casinos/getMachinesEvents', {})
        // trigger('communicate/casinos/previewMachineEvents', {})
        // trigger('communicate/casinos/getAllMachinesMeters', {})
        // trigger('communicate/casinos/previewMachinesMeters', {})
        //trigger('communicate/casinos/removeMeter', {}) server error 500
        // trigger('communicate/casinos/showMachinesMeters', {})
        //trigger('communicate/casinos/saveMachinesMeters', {}) server error 500
        // trigger('communicate/casinos/editMachines', {})
        //trigger('communicate/casinos/saveMachine', {}) server error 500
        //trigger('communicate/casinos/removeMachineFromCasino', {}) server errorm 500
    });

    //data with static values, need to be dynamic
    //machines preview transactions
    on('communicate/casinos/previewMachines', function (params) {
        let route = 'api/machines/previewmachines/';
        let successEvent = 'communicate/test'
        let data = {
            'EndpointId': 4,
            'BasicData': {
                'Page': 1,
                'PageSize': 10,
                'SortOrder': 0,
                'SortName': 0,
            },
            'VendorList': [0],
            'Status': [3],
            'AdditionalData': {
                'OnlyActive': 'false',
                'MachineName': ''
            }
        };
        let request = requestTypes.post;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            successEvent: successEvent,
            data: data,
            request: request,
            errorEvent: errorEvent
        });

    });


    /*------------------------------------ MACHINES EVENTS ------------------------------------*/

    // machines get service data
    on('communicate/casinos/getMachineDetails', function (params) {
        let route = 'api/machines/details/';
        let successEvent = 'communicate/test'
        let data = {
            'EndpointId': 4,
            'Gmcid': 1565666846
        };
        let request = requestTypes.post;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            successEvent: successEvent,
            data: data,
            request: request,
            errorEvent: errorEvent
        });
    });

    // machines get service data
    on('communicate/casinos/getMachineServiceData', function (params) {
        let route = 'api/machines/servicedata/';
        let successEvent = 'communicate/test'
        let data = {
            'EndpointId': 4,
            'Gmcid': 1565666846
        };
        let request = requestTypes.post;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            successEvent: successEvent,
            data: data,
            request: request,
            errorEvent: errorEvent
        });
    });

    //machines swich service mode
    on('communicate/casinos/swichServiceMode', function (params) {
        let route = 'api/machines/switchservicemode/';
        let successEvent = 'communicate/test'
        let data = {
            'EndpointId': 4,
            'Gmcid': 1565666846,
            'IsInServiceMode': true
        };
        let request = requestTypes.post;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            successEvent: successEvent,
            data: data,
            request: request,
            errorEvent: errorEvent
        });
    });

    // machines get history
    on('communicate/casinos/getMachinesHistory', function (params) {
        let route = 'api/machines/history/';
        let successEvent = 'communicate/test'
        let data = {
            'EndpointId': 4,
            'Gmcid': 33193329841023
        };
        let request = requestTypes.post;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            successEvent: successEvent,
            data: data,
            request: request,
            errorEvent: errorEvent
        });
    });

    // machines preview machine history
    on('communicate/casinos/previewMachinesHistory', function (params) {
        let route = 'api/machines/previewhistory/';
        let successEvent = 'communicate/test'
        let data = {
            'EndpointId': 4,
            'Gmcid': 33193329841023,
            'Page': 1,
            'PageSize': 10,
            'Date': '2018-09-13T10:07:16'
        };

        let request = requestTypes.post;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            successEvent: successEvent,
            data: data,
            request: request,
            errorEvent: errorEvent
        });
    });

    // machines get events
    on('communicate/casinos/getMachinesEvents', function (params) {
        let route = 'api/machines/events/';
        let successEvent = 'communicate/test'
        let data = {
            'EndpointId': 4,
            'Gmcid': 33193329841023
        };
        let request = requestTypes.post;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            successEvent: successEvent,
            data: data,
            request: request,
            errorEvent: errorEvent
        });
    });

    // machines get preview events
    on('communicate/casinos/previewMachineEvents', function (params) {
        let route = 'api/machines/previewevents/';
        let successEvent = 'communicate/test'
        let data = {
            'EndpointId': 4,
            'Gmcid': 33193329841023,
            'Page': 1,
            'PageSize': 10,
            'Date': '2018-09-13T10:07:16'
        };
        let request = requestTypes.post;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            successEvent: successEvent,
            data: data,
            request: request,
            errorEvent: errorEvent
        });
    });

    // machines get all meters
    on('communicate/casinos/getAllMachinesMeters', function (params) {
        let route = 'api/machines/allmeters/';
        let successEvent = 'communicate/test'
        let data = {
            'EndpointId': 4,
            'Gmcid': 33193329841023
        };
        let request = requestTypes.post;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            successEvent: successEvent,
            data: data,
            request: request,
            errorEvent: errorEvent
        });
    });

    // machines get preview meters
    on('communicate/casinos/previewMachinesMeters', function (params) {
        let route = 'api/machines/previewallmeters/';
        let successEvent = 'communicate/test'
        let data = {
            'EndpointId': 4,
            'Gmcid': 33193329841023,
            'Page': 1,
            'PageSize': 10,

        };
        let request = requestTypes.post;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            successEvent: successEvent,
            data: data,
            request: request,
            errorEvent: errorEvent
        });
    });

    // machines remove meter
    on('communicate/casinos/removeMeter', function (params) {
        let route = 'api/machines/removemeter';
        let successEvent = 'communicate/test'
        let data = {
            'EndpointId': 4,
            'Gmcid': 33193329841023,
            'Date': '22/09/2018 10:07:16'
        };
        let request = requestTypes.post;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            successEvent: successEvent,
            data: data,
            request: request,
            errorEvent: errorEvent
        });
    });

    // machines save meter
    on('communicate/casinos/saveMachinesMeters', function (params) {
        let route = 'api/machines/savemeter';
        let successEvent = 'communicate/test'
        let data = {
            'EndpointId': 4,
            'Gmcid': 33193329841023,
            'EventTime ': '22/09/2018 10:07:16',
            'Values': []
        };
        let request = requestTypes.post;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            successEvent: successEvent,
            data: data,
            request: request,
            errorEvent: errorEvent
        });
    });

    //  machines show meters
    on('communicate/casinos/showMachinesMeters', function (params) {
        let route = 'api/machines/showmeters/';
        let successEvent = 'communicate/test'
        let data = {
            'EndpointId': 4,
            'Gmcid': 33193329841023,
            'Date': '22/09/2018 10:07:16'
        };
        let request = requestTypes.post;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            successEvent: successEvent,
            data: data,
            request: request,
            errorEvent: errorEvent
        });
    });

    //  machines edit
    on('communicate/casinos/editMachines', function (params) {
        let route = 'api/machines/edit/';
        let successEvent = 'communicate/test'
        let data = {
            'EndpointId': 4,
            'Gmcid': 33193329841023
        };
        let request = requestTypes.post;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            successEvent: successEvent,
            data: data,
            request: request,
            errorEvent: errorEvent
        });
    });

    //machines remove machine from casino
    on('communicate/casinos/removeMachineFromCasino', function (params) {
        let route = 'api/machines/remove/';
        let successEvent = 'communicate/test'
        let data = {
            'EndpointId': 4,
            'Gmcid': 33193329841023
        };
        let request = requestTypes.post;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            successEvent: successEvent,
            data: data,
            request: request,
            errorEvent: errorEvent
        });
    });

    //machines save machine from casino
    on('communicate/casinos/saveMachine', function (params) {
        let route = 'api/machines/save/';
        let successEvent = 'communicate/test'
        let data = {
            'EndpointId': 4,
            'ID': 66666,
            'Name': 'machine#123',
            'Gmcid': 33193329841023,
            'EnableTransactions': true,
            'TransactionLimit': 987654321,
            'Status': 7,
            'MaxAmountForPayoutTicket': 99999999,
            'EnableEscrowedPromoTicket': true,
            'SpeedType': 0,
            'TypeId': 1,
            'Type': 'Slot',
            'Vendor': 'Fazi',
            'VendorId': 2,
            'OrdinalNumber': '2',
            'SerialNumber': '1111111',
            'MeterStepValue': 99999999,
            'MachineCodeName': 'code',
            'MachineCode': 222222222
        };
        let request = requestTypes.post;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            successEvent: successEvent,
            data: data,
            request: request,
            errorEvent: errorEvent
        });
    });

    // machines get all machines

    /*----------------------------------------------------------------------------------------*/


    //events for jackpot


    //events for tickets


    //aft events for machines
    on('communicate/machine-info', function (params) {
        let machineId = params.machineId;
        let callbackEventName = params.successEvent;
        let route = "machine/" + machineId;
        let data = typeof params.data === typeof undefined ? null : params.data;
        let xhr = createRequest(route, requestTypes.get, data, callbackEventName);
        xhr = setDefaultHeaders(xhr);
        xhr = setAuthHeader(xhr);
        send(xhr);
    });


    //events for reports


    //events for users


    //events for service


    //generate events
    on('communicate/category', function (params) {
        trigger(`communicate/${params.category.toLowerCase()}`);
    });

    //test, need to be deleted
    on('communicate/test', function (params) {
        //alert('Successful communication');
    });


    //todo HERE IS THE PART THAT STOPS NORMAL COMMUNICATION BETWEEN MODULES
    /*
        //test, set filters for aft
        window.addEventListener('load', function () {
            trigger('communicate/aft/getFilters', {})
        });
        on('communicate/testFilter', function (params) {
            //alert('Successful communication');
            console.log('communicate/testFilter params.data', params.data);
            params.data.Data.MachineNameList.length === 0 ? alert('Empty params') : proba2.appendChild(multiDropdown.generate(params.data.Data.MachineNameList));
            params.data.Data.JackpotNameList.length === 0 ? alert('Empty params') : proba3.appendChild(multiDropdown.generate(params.data.Data.JackpotNameList));
            params.data.Data.TypeList.length === 0 ? alert('Empty params') : proba4.appendChild(multiDropdown.generate(params.data.Data.TypeList));
            params.data.Data.StatusList.length === 0 ? alert('Empty params') : proba5.appendChild(multiDropdown.generate(params.data.Data.StatusList));
            params.data.Data.ColumnsList.length === 0 ? alert('Empty params') : proba6.appendChild(multiDropdown.generate(params.data.Data.ColumnsList));
        });
    */

    let timeout = null;

    function timeoutSet(params) {
        timeout = setTimeout(function () {
            alert("Your token has expired. Please Login to continue!");
            trigger('logout');
        }, params.token.expires_in * 1000);
    }

    on('communicate/token/refresh', function (params) {
        if (timeout !== null) {
            clearTimeout(timeout);
        }
        timeoutSet(params);
    });


})();