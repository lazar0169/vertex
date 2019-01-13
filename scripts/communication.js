let communication = (function () {

    const apiRoutes = {
        authorization: {
            login: "login/",
            logout: "logout/",
        },
        aft: {
            edit: "aft/",
            list: "list/",
            ticket: "ticket/",
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
        aft: {
            transactions: {
                getTransactions: 'communicate/aft/getTransactions',
                previewTransactions: 'communicate/aft/previewTransactions',
                cancelTransaction: 'communication/aft/transactions/cancel',
                addTransaction: '',
                cancelPendingTransaction: '',
                getNotificationSettings: 'communicate/aft/getNotificationSettings',
                saveNotificationSettings: 'communicate/aft/saveNotificationSettings',
                getBasicSettings: 'communicate/aft/getBasicSettings',
                saveBasicSettings: 'communicate/aft/saveBasicSettings',
                getFilters: 'communicate/aft/getFilters'
            },
            data: {
                prepare: 'communicate/aft/data/prepare'
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

    const apiUrl = 'https://api.fazigaming.com/';

    let timeout = null;

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
                    redeemedAt:formatTimeData(entry.EntryData.RedeemedTime),
                }
            };
            counter++;
        });

        tableSettings.tableData = formatedData;

        return formatedData;
    }


// create and send xhr
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


    /*------------------------------------ AFT EVENTS ------------------------------------*/
    //aft cancel transaction
    on(events.aft.transactions.cancelTransaction, function (params) {
        console.log('params');
        console.log(params);
        let data = {
            EndpointId: params.transactionData.endpointId,
            Gmcid: params.transactionData.gmcid,
            JidtString: params.transactionData.jidtString,
            EndpointName: params.transactionData.endpointName,
        };
        let route = params.status.pending === true ? apiRoutes.aft.cancelPendingTransaction : apiRoutes.aft.cancelTransaction;
        sendRequest(route, requestTypes.post, data, 'aft/transactions/canceled', 'aft/transactions/canceled/error');
    });
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
    on('communicate/aft/previewTransactions', function (params) {
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


//aft get notification settings
    on('communicate/aft/getNotificationSettings', function (params) {
        let route = apiRoutes.aft.getNotificationSettings;
        // let successEvent = 'aft/tab/notifications/display';
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
    on('communicate/aft/saveNotificationSettings', function (params) {
        let route = apiRoutes.aft.saveNotificationSettings;
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
            requestType: request,
            errorEvent: errorEvent,
            settingsObject: formSettings
        });
    });

//aft get basic settings
    on('communicate/aft/getBasicSettings', function (params) {
        let route = apiRoutes.aft.getBasicSettings;
        // let successEvent = 'aft/tab/transactions/display';
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
    on('communicate/aft/saveBasicSettings', function (params) {
        let route = apiRoutes.aft.saveBasicSettings;
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
            requestType: request,
            errorEvent: errorEvent,
            settingsObject: formSettings
        });
    });

//aft get filters
    on('communicate/aft/getFilters', function (params) {
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

//aft add transaction
    on('communicate/aft/addTransaction', function (params) {
        let route = apiRoutes.aft.addTransaction;
        let successEvent = 'aft/addTransaction';
        let data = params.data;
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

//aft cancel transaction
    on('communicate/aft/cancelTransaction', function (params) {
        let route = apiRoutes.aft.cancelTransaction;
        let successEvent = 'table/update';
        let data = params.data;
        let request = requestTypes.post;
        let tableSettings = params.tableSettings;
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

//aft cancel pending transaction
    on('communicate/aft/cancelPendingTransaction', function (params) {
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

//prepare data for aft  page
    on(events.aft.data.prepare, function (params) {
        let tableSettings = params.settingsObject;
        let data = params.data;
        tableSettings.tableData = prepareAftTableData(tableSettings, data);
        trigger(tableSettings.updateTableEvent, {data: data, settingsObject: tableSettings});
    });

    /*--------------------------------------------------------------------------------------*/


    /*------------------------------------ TICKETS EVENTS ------------------------------------*/
//tickets get tickets
    on(events.tickets.getTickets, function (params) {
        console.log('get tickets called');
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
//pagination sorting and filtering
    on('communicate/tickets/previewTickets', function (params) {
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

//getting filter values
    on('communicate/tickets/getFilters', function (params) {
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


//getting values for show sms settings
    on('communicate/tickets/showSmsSettings', function (params) {
        let route = apiRoutes.tickets.showSmsSettings;
        // let successEvent = 'tickets/tab/smsSettings/display';
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


//ShowTitoMaxValueSettings
    on('communicate/tickets/showMaxValueSettings', function (params) {
        let route = apiRoutes.tickets.showMaxValueSettings;
        // let successEvent = 'tickets/tab/maxValue/display';
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

//ShowTicketAppearanceSettings
    on('communicate/tickets/ticketAppearance', function (params) {
        let route = apiRoutes.tickets.ticketAppearance;
        // let successEvent = 'tickets/tab/appearance/display';
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


//SaveTitoSmsAction
    on('communicate/tickets/saveSmsSettings', function (params) {
        let route = apiRoutes.tickets.saveSmsSettings;
        // let successEvent = 'tickets/tab/smsSettings/update';
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


//SaveTitoMaxValuesAction
    on('communicate/tickets/saveMaxValuesAction', function (params) {
        let route = apiRoutes.tickets.saveMaxValuesAction;
        // let successEvent = 'tickets/tab/maxValue/update';
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


//SaveTicketAppearanceAction
    on('communicate/tickets/saveAppearance', function (params) {
        let route = apiRoutes.tickets.saveAppearance;
        // let successEvent = 'tickets/tab/appearance/update';
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


//prepare data for tickets  page
    on(events.tickets.parseRemoteData, function (params) {
        console.log('parse remote tickets data called');
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
            requestType: request,
            errorEvent: errorEvent
        });

        //todo needs to be deleted
        //trigger('communicate/casinos/previewMachines', {})
        //trigger('communicate/casinos/getMachineDetails', {})
        //trigger('communicate/casinos/getMachineServiceData', {})
        //trigger('communicate/casinos/swichServiceMode', {})
        //trigger('communicate/casinos/getMachinesHistory', {})
        //trigger('communicate/casinos/previewMachinesHistory', {})
        //trigger('communicate/casinos/getMachinesEvents', {})
        //trigger('communicate/casinos/previewMachineEvents', {})
        //trigger('communicate/casinos/getAllMachinesMeters', {})
        //trigger('communicate/casinos/previewMachinesMeters', {})
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
            requestType: request,
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
    })
    /*------------------------------------ MODULE EVENTS ------------------------------------*/
    on('communication/error/', handleError);

    /*------------------------------------ MODULE PRIVATE FUNCTIONS ------------------------------------*/
    function sendRequest(route, type, data, successEvent, errorEvent, additionalData) {
        let xhr = createRequest(route, type, data, successEvent, errorEvent, additionalData);
        xhr = setDefaultHeaders(xhr);
        xhr = setAuthHeader(xhr);
        send(xhr);
    }

    function handleError(error) {
        console.log(error.message);
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

    return {
        events: events,
        apiRoutes: apiRoutes
    }
})
();