let communication = (function () {

    /*-------------------------------------- VARIABLES ---------------------------------------*/

    const apiUrl = 'https://api.fazigaming.com/';

    const apiRoutes = {
        authorization: {
            login: 'login/',
            logout: 'logout/',
        },
        aft: {
            edit: 'api/aft/',
            list: 'api/list/',
            ticket: 'api/ticket/',
            getTransactions: 'api/transactions/',
            previewTransactions: 'api/transactions/previewtransactions/',
            getNotificationSettings: 'api/transactions/getnotificationsettings/',
            saveNotificationSettings: 'api/transactions/savenotificationsettings/',
            getBasicSettings: 'api/transactions/getbasicsettings/',
            saveBasicSettings: 'api/transactions/savebasicsettings/',
            getFilters: 'api/transactions/getfilters/',
            addTransaction: 'api/transactions/addtransaction/',
            cancelTransaction: 'api/transactions/canceltransaction/',
            cancelPendingTransaction: 'api/transactions/cancelpendingtransaction/'
        },
        tickets: {
            getTickets: 'api/tickets/',
            previewTickets: 'api/tickets/previewtickets/',
            getFilters: 'api/tickets/getfilters',
            showSmsSettings: 'api/tickets/smssettings/',
            showMaxValueSettings: 'api/tickets/maxvaluesettings/',
            ticketAppearance: 'api/tickets/ticketappearance/',
            saveSmsSettings: 'api/tickets/savesmssettings/',
            saveMaxValuesAction: 'api/tickets/savemaxvalues/',
            saveAppearance: 'api/tickets/saveappearance/'
        }
    };

    const events = {
        authorization: {
            login: 'login/',
            logout: 'logout/',
        },
        aft: {
            transactions: {
                getTransactions: 'communicate/aft/getTransactions',
                previewTransactions: 'communicate/aft/previewTransactions',
                cancelTransaction: 'communication/aft/transactions/cancel',
                addTransaction: 'communicate/aft/addTransaction',
                cancelPendingTransaction: 'communicate/aft/cancelPendingTransaction',
                getBasicSettings: 'communicate/aft/getBasicSettings',
                saveBasicSettings: 'communicate/aft/saveBasicSettings',
                getNotificationSettings: 'communicate/aft/getNotificationSettings',
                saveNotificationSettings: 'communicate/aft/saveNotificationSettings',
                getFilters: 'communicate/aft/getFilters'
            },
            data: {
                parseRemoteData: 'communicate/aft/data/parseRemoteData'
            }
        },
        tickets: {
            parseRemoteData: 'communicate/tickets/data/parse',
            getTickets: 'communicate/tickets/getTickets/',
            previewTickets: 'communicate/tickets/previewTickets',
            getFilters: 'communicate/tickets/getFilters',
            showSmsSettings: 'communicate/tickets/showSmsSettings',
            saveSmsSettings: 'communicate/tickets/saveSmsSettings',
            showMaxValueSettings: 'communicate/tickets/showMaxValueSettings',
            saveMaxValuesAction: 'communicate/tickets/saveMaxValuesAction',
            ticketAppearance: 'communicate/tickets/ticketAppearance',
            saveAppearance: 'communicate/tickets/saveAppearance'
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

    let timeout = null;

    /*-----------------------------------------------------------------------------------------*/


    /*--------------------------------------- FUNCTIONS ---------------------------------------*/

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
        if (data.TokenInfo !== undefined && data.TokenInfo !== null) {

            sessionStorage["token"] = JSON.stringify(data.TokenInfo);
            refreshToken(data.TokenInfo);
        } else {
            sessionStorage["token"] = JSON.stringify(data);
            refreshToken(data);
        }
        if (typeof callbackEvent !== typeof undefined && callbackEvent !== null) {
            trigger(callbackEvent, {data: data, settingsObject: settingsObject});
        }
    }

    function error(xhr, errorEventCallback) {
        //try to parse error as JSON
        let errorResponse = tryParseJSON(xhr.responseText);
        if (errorResponse === 'undefined') {
            errorResponse = xhr.responseText;
        }
        //ToDo: refactor to send xhr only
        let errorData = {'message': errorResponse, 'xhr': xhr};
        if (typeof errorEventCallback !== typeof undefined) {
            if (isString(errorEventCallback)) {
                trigger(errorEventCallback, errorData);
            } else if (isFunction(errorEventCallback)) {
                errorEventCallback(errorData);
            }
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
        let entries = data.Data.Items;
        let formatedData = [];
        let counter = 0;
        entries.forEach(function (entry) {
                if (entry.EntryData.CreatedBy === null || entry.EntryData.CreatedBy === '') {
                    entry.EntryData.CreatedBy = '';

                } else {
                    entry.EntryData.CreatedBy = '<time class="table-time">' + formatTimeData(entry.EntryData.CreatedTime) + '</time>' + '<label>by ' + entry.EntryData.CreatedBy + '</label>';

                }
                if (entry.EntryData.FinishedBy === null || entry.EntryData.FinishedBy === '') {
                    entry.EntryData.FinishedBy = '';

                } else {
                    entry.EntryData.FinishedBy = '<time class="table-time">' + formatTimeData(entry.EntryData.FinishedTime) + '</time>' + '<label>by ' + entry.EntryData.FinishedBy + '</label>';

                }
                delete entry.EntryData.CreatedTime;
                delete entry.EntryData.FinishedTime;
                entry.EntryData.AmountCashable = formatFloatValue(entry.EntryData.AmountCashable / 100);
                entry.EntryData.AmountPromo = formatFloatValue(entry.EntryData.AmountPromo / 100);

                entry.EntryData.Status = '<div title="' + localization.translateMessage(entry.Properties.ErrorCode) + '">' + entry.EntryData.Status + '</div>'

                let cancelIndicator = document.createElement('span');
                let icon = document.createElement('i');
                //ToDo: Ubaciti klasu za font
                icon.innerHTML = 'X';
                let text = document.createElement('span');
                text.innerHTML = localization.translateMessage('Cancel', text);
                cancelIndicator.classList.add('cancel-indicator');
                cancelIndicator.appendChild(icon);
                cancelIndicator.appendChild(text);

                formatedData[counter] = {
                    rowData: {
                        flag: entry.Properties.FlagList[0],
                        createdBy: entry.EntryData.CreatedBy,
                        finishedBy: entry.EntryData.FinishedBy,
                        status: localization.translateMessage(entry.EntryData.Status),
                        machineName: entry.EntryData.MachineName,
                        type: localization.translateMessage(entry.EntryData.Type),
                        cashable: entry.EntryData.AmountCashable,
                        promo: entry.EntryData.AmountPromo,
                        actions: cancelIndicator
                    },
                    data: {
                        isPayoutPossible: entry.Properties.IsPayoutPossible,
                        gmcid: entry.Properties.Gmcid,
                        jidtString: entry.Properties.JidtString
                    }
                };
                counter++;
            }
        );

        return formatedData;
    }

    function formatTimeData(timeData) {
        return timeData.replace(/-/g, '/').replace('T', ' ').replace(/\..*/, '');
    }

    //ToDo: refactor in on rowDisplay
    function prepareTicketsTableData(tableSettings, data) {
        let entry = data.Data.Items;
        let formatedData = [];
        let counter = 0;
        entry.forEach(function (entry) {
            /* if (entry.EntryData.CashoutedBy === null || entry.EntryData.CashoutedBy === '') {
                 entry.EntryData.CashoutedBy = '<time class="table-time">' + formatTimeData(entry.EntryData.CashoutedTime) + '</time>' + '<br/>' + '<label>' + entry.EntryData.CashoutedBy + '</label>';

             } else {
                 entry.EntryData.CashoutedBy = '<time class="table-time">' + formatTimeData(entry.EntryData.CashoutedTime) + '</time>' + '<br/>' + '<label>by ' + entry.EntryData.CashoutedBy + '</label>';

             }
             if (entry.EntryData.RedeemedBy === null || entry.EntryData.RedeemedBy === '') {
                 entry.EntryData.RedeemedBy = '<time class="table-time">' + formatTimeData(entry.EntryData.RedeemedTime) + '</time>' + '<br/>' + '<label>' + entry.EntryData.RedeemedBy + '</label>';

             } else {
                 entry.EntryData.RedeemedBy = '<time class="table-time">' + formatTimeData(entry.EntryData.RedeemedTime) + '</time>' + '<br/>' + '<label>by ' + entry.EntryData.RedeemedBy + '</label>';

             }*/
            entry.EntryData.Amount = formatFloatValue(entry.EntryData.Amount / 100);

            formatedData[counter] = {
                rowData: {
                    code: entry.EntryData.FullTicketValIdationNumber,
                    issuedBy: entry.EntryData.CashoutedBy,
                    redeemedBy: entry.EntryData.RedeemedBy,
                    status: localization.translateMessage(entry.EntryData.Status),
                    type: entry.EntryData.TicketType,
                    amount: entry.EntryData.Amount
                },
                data: {
                    issuedAt: formatTimeData(entry.EntryData.CashoutedTime),
                    redeemedAt: formatTimeData(entry.EntryData.RedeemedTime),
                }
            };
            counter++;
        });

        tableSettings.tableData = formatedData;

        //ToDo Neske: Pitati Nikolu šta je ovo
        //trigger('showing-tickets-top-bar-value', { dataItemValue: data.Data.ItemValue })

        return formatedData;
    }

    function sendRequest(route, type, data, successEvent, errorEvent, additionalData) {
        let xhr = createRequest(route, type, data, successEvent, errorEvent, additionalData);
        xhr = setDefaultHeaders(xhr);
        xhr = setAuthHeader(xhr);
        send(xhr);
    }

    function handleError(error) {
        if (error.xhr.status < 500) {
            trigger('notifications/show', {
                message: localization.translateMessage(error.message.MessageCode.toString()),
                type: error.message.MessageType
            });
            if (error.TokenInfo !== undefined) {
                refreshToken(error.TokenInfo);
            }
        } else {
            trigger('notifications/show', {
                message: localization.translateMessage('InternalServerError'),
                type: notifications.messageTypes.error
            });
        }
    }

    /*----------------------------------------------------------------------------------------*/
    /*---------------------------------------- EVENTS ----------------------------------------*/
    /*----------------------------------------------------------------------------------------*/

    //create and send xhr
    on('communicate/createAndSendXhr', function (params) {
        let xhr = createRequest(params.route, params.requestType, params.data, params.successEvent, params.errorEvent, params.settingsObject);
        xhr = setDefaultHeaders(xhr);
        xhr = setAuthHeader(xhr);
        send(xhr);
    });

    //pagination event
    on('communicate/pagination', function (params) {
        let event = params.event;
        let dataForApi = params.data;
        trigger(event, {data: dataForApi, tableSettings: params.tableSettings, callbackEvent: params.callbackEvent});
    });

    //generate events
    on('communicate/category', function (params) {
        trigger(`communicate/${params.category.toLowerCase()}`);
    });

    /*----------------------------------------------------------------------------------------*/

    /*--------------------------------- AUTHORISATION EVENTS ---------------------------------*/

    //login
    on(events.authorization.login, function (params) {
        let route = apiRoutes.authorization.login;
        let successEvent = params.successEvent;
        let errorEvent = params.errorEvent;
        let data = typeof params.data === typeof undefined ? null : params.data;
        let xhr = createRequest(route, requestTypes.post, data, successEvent, errorEvent);
        xhr = setDefaultHeaders(xhr);
        send(xhr);
    });

    /*----------------------------------------------------------------------------------------*/


    /*------------------------------------- JACKPOTS EVENTS -----------------------------------*/


    /*-----------------------------------------------------------------------------------------*/


    /*------------------------------------- TICKETS EVENTS ------------------------------------*/

    //tickets get tickets
    on(events.tickets.getTickets, function (params) {
        let route = apiRoutes.tickets.getTickets;
        let tableSettings = params.tableSettings;
        let successEvent = tableSettings.processRemoteData;
        let request = requestTypes.post;
        let data = params.data;
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

    //tickets preview ticket action
    //tickets pagination sorting and filtering
    on(events.tickets.previewTickets, function (params) {
        let route = apiRoutes.tickets.previewTickets;
        let tableSettings = params.tableSettings;
        let successEvent = tableSettings.processRemoteData;
        let request = requestTypes.post;
        let data = params.data;
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

    //tickets get filter values
    on(events.tickets.getFilters, function (params) {
        let route = apiRoutes.tickets.getFilters;
        let successEvent = params.successEvent;
        let request = requestTypes.post;
        let data = params.data;
        let tableSettings = params.tableSettings;
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

    //tickets getting values for show sms settings
    on(events.tickets.showSmsSettings, function (params) {
        let route = apiRoutes.tickets.showSmsSettings;
        let formSettings = params.formSettings;
        let successEvent = formSettings.populateData;
        let request = requestTypes.post;
        let data = params.data;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            requestType: request,
            data: data,
            successEvent: successEvent,
            errorEvent: errorEvent,
            settingsObject: formSettings
        });
    });

    //tickets SaveTitoSmsAction
    on(events.tickets.saveSmsSettings, function (params) {
        let route = apiRoutes.tickets.saveSmsSettings;
        let formSettings = params.formSettings;
        let successEvent = formSettings.submitSuccessEvent;
        let errorEvent = formSettings.submitErrorEvent;
        let request = requestTypes.post;
        let data = params.data;
        trigger('communicate/createAndSendXhr', {
            route: route,
            requestType: request,
            data: data,
            successEvent: successEvent,
            errorEvent: errorEvent,
            settingsObject: formSettings
        });
    });

    //tickets ShowTitoMaxValueSettings
    on(events.tickets.showMaxValueSettings, function (params) {
        let route = apiRoutes.tickets.showMaxValueSettings;
        let formSettings = params.formSettings;
        let successEvent = formSettings.populateData;
        let request = requestTypes.post;
        let data = params.data;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            requestType: request,
            data: data,
            successEvent: successEvent,
            errorEvent: errorEvent,
            settingsObject: formSettings
        });
    });

    //tickets SaveTitoMaxValuesAction
    on(events.tickets.saveMaxValuesAction, function (params) {
        let route = apiRoutes.tickets.saveMaxValuesAction;
        let formSettings = params.formSettings;
        let successEvent = formSettings.submitSuccessEvent;
        let errorEvent = formSettings.submitErrorEvent;
        let request = requestTypes.post;
        let data = params.data;
        trigger('communicate/createAndSendXhr', {
            route: route,
            requestType: request,
            data: data,
            successEvent: successEvent,
            errorEvent: errorEvent,
            settingsObject: formSettings
        });
    });

    //ShowTicketAppearanceSettings
    on(events.tickets.ticketAppearance, function (params) {
        let route = apiRoutes.tickets.ticketAppearance;
        let formSettings = params.formSettings;
        let successEvent = formSettings.populateData;
        let request = requestTypes.post;
        let data = params.data;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            requestType: request,
            data: data,
            successEvent: successEvent,
            errorEvent: errorEvent,
            settingsObject: formSettings
        });
    });

    //SaveTicketAppearanceAction
    on(events.tickets.saveAppearance, function (params) {
        let route = apiRoutes.tickets.saveAppearance;
        let formSettings = params.formSettings;
        let successEvent = formSettings.submitSuccessEvent;
        let errorEvent = formSettings.submitErrorEvent;
        let request = requestTypes.post;
        let data = params.data;
        trigger('communicate/createAndSendXhr', {
            route: route,
            requestType: request,
            data: data,
            successEvent: successEvent,
            errorEvent: errorEvent,
            settingsObject: formSettings
        });
    });

    //parseRemoteData data for tickets  page
    on(events.tickets.parseRemoteData, function (params) {
        let tableSettings = params.settingsObject;
        let data = params.data;
        prepareTicketsTableData(tableSettings, data);
        trigger(tableSettings.updateEvent, {data: data, settingsObject: tableSettings});
    });

    /*-----------------------------------------------------------------------------------------*/


    /*-------------------------------------- AFT EVENTS ---------------------------------------*/

    //aft get transactions
    on(events.aft.transactions.getTransactions, function (params) {
        let route = apiRoutes.aft.getTransactions;
        let tableSettings = params.tableSettings;
        let successEvent = tableSettings.processRemoteData;
        let data = params.data;
        let request = requestTypes.post;
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

    //aft pagination filtering sorting
    //aft preview transactions
    on(events.aft.transactions.previewTransactions, function (params) {
        let route = apiRoutes.aft.previewTransactions;
        let tableSettings = params.tableSettings;
        let successEvent = tableSettings.processRemoteData;
        let data = params.data;
        let request = requestTypes.post;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            successEvent: successEvent,
            data: data,
            requestType: request,
            errorEvent: errorEvent,
            settingsObject: tableSettings
        });
    });

    //aft cancel transaction
    on(events.aft.transactions.cancelTransaction, function (params) {
        let data = {
            EndpointId: params.transactionData.endpointId,
            Gmcid: params.transactionData.gmcid,
            JidtString: params.transactionData.jidtString,
            EndpointName: params.transactionData.endpointName,
        };
        let route = params.status.pending === true ? apiRoutes.aft.cancelPendingTransaction : apiRoutes.aft.cancelTransaction;
        sendRequest(route, requestTypes.post, data, 'aft/transactions/canceled', 'aft/transactions/canceled/error');
    });

    //aft add transaction
    on(events.aft.transactions.addTransaction, function (params) {
        let route = apiRoutes.aft.addTransaction;
        let successEvent = params.formSettings.submitSuccessEvent;
        let data = params.data;
        let request = requestTypes.post;
        let errorEvent = params.formSettings.submitErrorEvent;
        trigger('communicate/createAndSendXhr', {
            route: route,
            successEvent: successEvent,
            data: data,
            requestType: request,
            errorEvent: errorEvent
        });
    });

    //aft cancel pending transaction
    on(events.aft.transactions.cancelPendingTransaction, function (params) {
        let route = apiRoutes.aft.cancelPendingTransaction;
        let successEvent = 'communicate/test';
        let data = params.data;
        let request = requestTypes.post;
        let errorEvent = '';
        let tableSettings = params.tableSettings;
        trigger('communicate/createAndSendXhr', {
            route: route,
            successEvent: successEvent,
            data: data,
            requestType: request,
            errorEvent: errorEvent,
            settingsObject: tableSettings
        });
    });

    //aft get basic settings
    on(events.aft.transactions.getBasicSettings, function (params) {
        let route = apiRoutes.aft.getBasicSettings;
        let formSettings = params.formSettings;
        let successEvent = formSettings.populateData;
        let data = params.data;
        let request = requestTypes.post;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            successEvent: successEvent,
            data: data,
            requestType: request,
            errorEvent: errorEvent,
            settingsObject: formSettings
        });
    });

    //aft save basic settings
    on(events.aft.transactions.saveBasicSettings, function (params) {
        let route = apiRoutes.aft.saveBasicSettings;
        let formSettings = params.formSettings;
        let successEvent = formSettings.submitSuccessEvent;
        let errorEvent = formSettings.submitErrorEvent;
        let data = params.data;
        let request = requestTypes.post;
        trigger('communicate/createAndSendXhr', {
            route: route,
            successEvent: successEvent,
            data: data,
            requestType: request,
            errorEvent: errorEvent,
            settingsObject: formSettings
        });
    });

    //aft get notification settings
    on(events.aft.transactions.getNotificationSettings, function (params) {
        let route = apiRoutes.aft.getNotificationSettings;
        let formSettings = params.formSettings;
        let successEvent = formSettings.populateData;
        let data = params.data;
        let request = requestTypes.post;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            successEvent: successEvent,
            data: data,
            requestType: request,
            errorEvent: errorEvent,
            settingsObject: formSettings
        });
    });

    //aft save notification settings
    on(events.aft.transactions.saveNotificationSettings, function (params) {
        let route = apiRoutes.aft.saveNotificationSettings;
        let formSettings = params.formSettings;
        let successEvent = formSettings.submitSuccessEvent;
        let errorEvent = formSettings.submitErrorEvent;
        let data = params.data;
        let request = requestTypes.post;
        trigger('communicate/createAndSendXhr', {
            route: route,
            successEvent: successEvent,
            data: data,
            requestType: request,
            errorEvent: errorEvent,
            settingsObject: formSettings
        });
    });

    //aft get filters
    on(events.aft.transactions.getFilters, function (params) {
        let route = apiRoutes.aft.getFilters;
        let successEvent = params.successEvent;
        let request = requestTypes.post;
        let errorEvent = '';
        let tableSettings = params.tableSettings;
        trigger('communicate/createAndSendXhr', {
            route: route,
            successEvent: successEvent,
            data: params.data,
            requestType: request,
            errorEvent: errorEvent,
            settingsObject: tableSettings
        });
    });

    //parseRemoteData data for aft  page
    on(events.aft.data.parseRemoteData, function (params) {
        let tableSettings = params.settingsObject;
        let data = params.data;
        tableSettings.tableData = prepareAftTableData(tableSettings, data);
        trigger(tableSettings.updateTableEvent, {data: data, settingsObject: tableSettings});
    });

    /*---------------------------------------------------------------------------------------*/


    /*----------------------------------- CASINOS EVENTS ------------------------------------*/


    /*---------------------------------------------------------------------------------------*/


    /*------------------------------------ MACHINES EVENTS ----------------------------------*/

// machines get service data
    //get all machines
    on('communicate/casinos/getAllMachines', function (params) {
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
    });

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
            requestType: request,
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
            requestType: request,
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
            requestType: request,
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
            requestType: request,
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
            requestType: request,
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
            requestType: request,
            errorEvent: errorEvent
        });
    });

// machines get preview events
    on('communicate/casinos/previewMachineEvents', function (params) {
        let route = 'api/machines/previewevents/';
        let successEvent = 'communicate/test';
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
            requestType: request,
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
            requestType: request,
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
            requestType: request,
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
            requestType: request,
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
            requestType: request,
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
            requestType: request,
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
            requestType: request,
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
            requestType: request,
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
            requestType: request,
            errorEvent: errorEvent
        });
    });

    //machines
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

    /*-----------------------------------------------------------------------------------------*/


    /*--------------------------------- MALFUNCTIONS EVENTS -----------------------------------*/

    /*-----------------------------------------------------------------------------------------*/


    /*------------------------------------ USERS EVENTS ---------------------------------------*/

    /*-----------------------------------------------------------------------------------------*/


    /*----------------------------------- REFRESH TOKEN ---------------------------------------*/

    function refreshToken(tokenInfo) {
        if (timeout !== null) {
            window.clearTimeout(timeout);
            timeout = null;
        }

        timeout = window.setTimeout(function () {
            alert("Your token has expired. Please Login to continue!");
            trigger('logout');
        }, tokenInfo.expires_in * 1000);
    }

    on('communicate/token/refresh', function (params) {
        refreshToken(params.token);
    });

    /*----------------------------------------------------------------------------------------*/


    return {
        apiRoutes: apiRoutes,
        events: events
    }

})();