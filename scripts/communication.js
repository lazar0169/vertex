let communication = (function () {

    /*-------------------------------------- VARIABLES ---------------------------------------*/

    const apiUrl = 'https://api.fazigaming.com/';

    const contentTypes = {
        json: 'application/json',
        textHtml: 'text/html'
    }

    const apiRoutes = {
        authorization: {
            login: 'login/',
            logout: 'logout/',
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
            saveAppearance: 'api/tickets/saveappearance/',
            exportToPDF: 'api/tickets/reports/'
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
            cancelPendingTransaction: 'api/transactions/cancelpendingtransaction/',
            exportToPDF: 'api/transactions/reports/'
        },
        casinos: {},
        machines: {
            getMachines: 'api/machines/',
            previewMachines: 'api/machines/previewmachines/',
            getMachineDetails: 'api/machines/details/',
            getMachineServiceData: 'api/machines/servicedata/',
            switchServiceMode: 'api/machines/switchservicemode/',
            getMachineHistory: 'api/machines/history/',
            previewMachineHistory: 'api/machines/previewhistory/',
            getMachineEvents: 'api/machines/events/',
            previewMachineEvents: 'api/machines/previewevents/',
            getAllMachineMeters: 'api/machines/allmeters/',
            previewMachineMeters: 'api/machines/previewallmeters/',
            removeMeter: 'api/machines/removemeter/',
            showMachineMeters: 'api/machines/showmeters/',
            saveMachineMeters: 'api/machines/savemeter/',
            editMachine: 'api/machines/edit/',
            saveMachine: 'api/machines/save/',
            removeMachineFromCasino: 'api/machines/remove/'
        },
        jackpots: {
            getJackpots: 'api/jackpots/',
            previewJackpots: 'api/jackpots/previewjackpots/',
            getEvents: 'api/jackpots/events/',
            previewEvents: 'api/jackpots/previewevents/',
            getJackpotHistory: 'api/jackpots/history/',
            previewJackpotHistory: 'api/jackpots/previewhistory/',
            getFilters: 'api/jackpots/getfilters/',
            showJackpotInfo: 'api/jackpots/showinfo/',
            setIgnoreRestrictions: 'api/jackpots/setignore/',
            showJackpotEditInfo: 'api/jackpots/editjackpot/',
            changeJackpotState: 'api/jackpots/changestate/',
            removeJackpot: ' api/jackpots/remove/',
            addJackpot: 'api/jackpots/addjackpot/',
            getJackpotSettings: 'api/jackpots/getsettings/',
            getJackpotPlasmaSettings: 'api/jackpots/getplasmasettings/',
            setJackpotSettings: 'api/jackpots/savesettings/',
            setJackpotPlasmaSettings: 'api/jackpots/saveplasmasettings/',
            saveJackpot: 'api/jackpots/save/'
        },
        malfunctions: {
            getMalfunctions: 'api/malfunctions/',
            previewMalfunctions: 'api/malfunctions/previewmalfunctions/',
            getFilters: 'api/malfunctions/getfilters/',
            setServiceMessage: 'api/malfunctions/setmessage/',
            changeMalfunctionState: 'api/malfunctions/changestate/'
        }
    };

    const events = {
        authorization: {
            login: 'login/',
            logout: 'logout/',
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
            saveAppearance: 'communicate/tickets/saveAppearance',
            exportToPDF: 'communicate/tickets/export/pdf',
            exportToXLS: 'communicate/tickets/export/xls'
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
        casinos: {},
        machines: {
            getMachines: 'communicate/machines/getMachines',
            previewMachines: 'communicate/machines/previewMachines',
            getMachineDetails: 'communicate/machines/getDetails',
            getMachineServiceData: 'communicate/machines/getServiceData',
            switchServiceMode: 'communicate/machines/switchServiceMode',
            getMachineHistory: 'communicate/machines/getHistory',
            previewMachineHistory: 'communicate/machines/previewHistory',
            getMachineEvents: 'communicate/machines/getEvents',
            previewMachineEvents: 'communicate/machines/previewEvents',
            getAllMachineMeters: 'communicate/machines/getAllMeters',
            previewMachineMeters: 'communicate/machines/previewAllMeters',
            removeMeter: 'communicate/machines/removeMeter',
            showMachineMeters: 'communicate/machines/showMeters',
            saveMachineMeters: 'communicate/machines/saveMeter',
            editMachine: 'communicate/machines/edit',
            saveMachine: 'communicate/machines/save',
            removeMachineFromCasino: 'communicate/machines/remove'
        },
        jackpots: {
            getJackpots: 'communicate/jackpots/',
            previewJackpots: 'communicate/jackpots/previewJackpots/',
            getEvents: 'communicate/jackpots/getEvents/',
            previewEvents: 'communicate/jackpots/previewEvents/',
            getJackpotHistory: 'communicate/jackpots/getHistory/',
            previewJackpotHistory: 'communicate/jackpots/previewHistory/',
            getFilters: 'communicate/jackpots/getFilters/',
            showJackpotInfo: 'communicate/jackpots/showInfo/',
            setIgnoreRestrictions: 'communicate/jackpots/setIgnore/',
            showJackpotEditInfo: 'communicate/jackpots/editInfo/',
            changeJackpotState: 'communicate/jackpots/changeState/',
            removeJackpot: ' communicate/jackpots/remove/',
            addJackpot: 'communicate/jackpots/addJackpot/',
            getJackpotSettings: 'communicate/jackpots/getSettings/',
            getJackpotPlasmaSettings: 'communicate/jackpots/getPlasmaSettings/',
            setJackpotSettings: 'communicate/jackpots/setSettings/',
            setJackpotPlasmaSettings: 'communicate/jackpots/setPlasmaSettings/',
            saveJackpot: 'communicate/jackpots/save/'
        },
        malfunctions: {
            parseRemoteData: 'communicate/malfunctions/data/parse',
            getMalfunctions: 'communicate/malfunctions/',
            previewMalfunctions: 'communicate/malfunctions/previewmalfunctions/',
            getFilters: 'communicate/malfunctions/getfilters/',
            setServiceMessage: 'communicate/malfunctions/setmessage/',
            changeMalfunctionState: 'communicate/malfunctions/changestate/'
        },
        module: {}
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
        let data = null;

        if (xhr.responseType === 'arraybuffer') {
            data = xhr.response;
        } else if (xhr.getResponseHeader('content-type').indexOf(contentTypes.json) >= 0) {
            data = tryParseJSON(xhr.responseText);
            //update token in sessionStorage
            if (data.TokenInfo !== undefined && data.TokenInfo !== null) {

                sessionStorage["token"] = JSON.stringify(data.TokenInfo);
                refreshToken(data.TokenInfo);
            } else {
                sessionStorage["token"] = JSON.stringify(data);
                refreshToken(data);
            }
        } else {
            data = xhr.responseText;
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

    function createRequest(route, requestType, data, successEvent, errorEvent, additionalData, properties) {
        let xhr;

        if (requestType === requestTypes.get) {
            xhr = createGetRequest(route);
        } else if (requestType === requestTypes.post) {
            xhr = createPostRequest(route, data);
        } else if (requestType === requestTypes.delete) {
            xhr = createDeleteRequest(route);
        }

        if (properties === undefined) {
            properties = [];
        }
        for (let i = 0; i < properties.length; i++) {
            let property = properties[i];
            xhr[property.name] = property.value;
        }

        xhr.onreadystatechange = function (e) {
            if (xhr.readyState === xhrStates.done && xhr.status >= 200 && xhr.status < 300) {
                success(xhr, successEvent, additionalData);
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
                entry.EntryData.AmountCashable = formatFloatValue(entry.EntryData.AmountCashable / 100);
                entry.EntryData.AmountPromo = formatFloatValue(entry.EntryData.AmountPromo / 100);

                entry.EntryData.Status = '<div title="' + localization.translateMessage(entry.Properties.ErrorCode) + '">' + localization.translateMessage(entry.EntryData.Status) + '</div>'

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
                        actions: ''
                    },
                    data: {
                        createdTime: formatTimeData(entry.EntryData.CreatedTime),
                        finishedTime: formatTimeData(entry.EntryData.FinishedTime),
                        errorCode: localization.translateMessage(entry.Properties.ErrorCode),
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
        if (isEmpty(timeData)) {
            return '';
        }
        return timeData.replace(/-/g, '/').replace('T', ' ').replace(/\..*/, '');
    }

    function prepareMalfunctionsTableData(tableSettings, data) {
        let entry = data.Data.Items;
        let formatedData = [];
        let counter = 0;
        entry.forEach(function (entry) {
            formatedData[counter] = {
                rowData: {
                    flag: entry.Properties.FlagList[0],
                    createdBy: isEmpty(entry.EntryData.CreatedBy) ? '' : entry.EntryData.CreatedBy,
                    casino: entry.EntryData.Casino,
                    machine: entry.EntryData.Machine,
                    name: entry.EntryData.Name,
                    type: localization.translateMessage(entry.EntryData.Type),
                    priority: localization.translateMessage(entry.EntryData.Priority)
                },
                data: {
                    //ToDo: ovde proslediti da li je red klikabilan ili ne
                    createdTime : formatTimeData(entry.EntryData.CreatedTime),
                    endpointId: entry.Properties.EndpointId,
                    id: entry.Properties.Id
                }
            };
            counter++;
        });

        tableSettings.tableData = formatedData;

        return formatedData;


    }

    //ToDo: refactor in on rowDisplay
    function prepareTicketsTableData(tableSettings, data) {
        let entry = data.Data.Items;
        let formatedData = [];
        let counter = 0;
        entry.forEach(function (entry) {
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
        trigger('showing-tickets-top-bar-value', {dataItemValue: data.Data.ItemValue});
        return formatedData;
    }

    function sendRequest(route, type, data, successEvent, errorEvent, additionalData, properties) {
        let xhr = createRequest(route, type, data, successEvent, errorEvent, additionalData, properties);
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
        let request = requestTypes.post;
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

    //tickets preview ticket action
    //tickets pagination sorting and filtering
    on(events.tickets.previewTickets, function (params) {
        let route = apiRoutes.tickets.previewTickets;
        let request = requestTypes.post;
        let data = params.data;
        let tableSettings = params.tableSettings;
        let successEvent = tableSettings.processRemoteData;
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

    //tickets get filter values
    on(events.tickets.getFilters, function (params) {
        let route = apiRoutes.tickets.getFilters;
        let request = requestTypes.post;
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

    //tickets getting values for show sms settings
    on(events.tickets.showSmsSettings, function (params) {
        let route = apiRoutes.tickets.showSmsSettings;
        let request = requestTypes.post;
        let data = params.data;
        let formSettings = params.formSettings;
        let successEvent = formSettings.populateData;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            requestType: request,
            data: data,
            settingsObject: formSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //tickets SaveTitoSmsAction
    on(events.tickets.saveSmsSettings, function (params) {
        let route = apiRoutes.tickets.saveSmsSettings;
        let request = requestTypes.post;
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

    //tickets ShowTitoMaxValueSettings
    on(events.tickets.showMaxValueSettings, function (params) {
        let route = apiRoutes.tickets.showMaxValueSettings;
        let request = requestTypes.post;
        let data = params.data;
        let formSettings = params.formSettings;
        let successEvent = formSettings.populateData;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            requestType: request,
            data: data,
            settingsObject: formSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //tickets SaveTitoMaxValuesAction
    on(events.tickets.saveMaxValuesAction, function (params) {
        let route = apiRoutes.tickets.saveMaxValuesAction;
        let request = requestTypes.post;
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

    //ShowTicketAppearanceSettings
    on(events.tickets.ticketAppearance, function (params) {
        let route = apiRoutes.tickets.ticketAppearance;
        let request = requestTypes.post;
        let data = params.data;
        let formSettings = params.formSettings;
        let successEvent = formSettings.populateData;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            requestType: request,
            data: data,
            settingsObject: formSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //SaveTicketAppearanceAction
    on(events.tickets.saveAppearance, function (params) {
        let route = apiRoutes.tickets.saveAppearance;
        let request = requestTypes.post;
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

    on(events.tickets.exportToPDF, function (params) {
        let data = null;
        if (params.tableSettings.filters !== null) {
            //clone filters
            data = JSON.parse(JSON.stringify(params.tableSettings.filters));
            delete data.BasicData.Page;
            delete data.BasicData.PageSize;
            delete data.TokenInfo;
        } else {
            data = {
                EndpointId: params.tableSettings.endpointId,
                DateFrom: null,
                DateTo: null,
                MachineList: [],
                JackpotList: [],
                Status: [],
                Type: [],
                BasicData: {
                    SortOrder: null,
                    SortName: null
                },
            };
        }

        data.SelectedColumns = params.selectedColumns;
        sendRequest(apiRoutes.tickets.exportToPDF, requestTypes.post, data, table.events.saveExportedFile, handleError, {type: table.exportFileTypes.pdf}, [{
            name: 'responseType',
            value: 'arraybuffer'
        }]);
    });

    on(events.tickets.exportToXLS, function (params) {

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
        let request = requestTypes.post;
        let data = params.data;
        let tableSettings = params.tableSettings;
        let successEvent = tableSettings.processRemoteData;
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

    //aft pagination filtering sorting
    //aft preview transactions
    on(events.aft.transactions.previewTransactions, function (params) {
        let route = apiRoutes.aft.previewTransactions;
        let request = requestTypes.post;
        let data = params.data;
        let tableSettings = params.tableSettings;
        let successEvent = tableSettings.processRemoteData;
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
        let request = requestTypes.post;
        let data = params.data;
        let successEvent = params.formSettings.submitSuccessEvent;
        let errorEvent = params.formSettings.submitErrorEvent;
        trigger('communicate/createAndSendXhr', {
            route: route,
            requestType: request,
            data: data,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //aft cancel pending transaction
    on(events.aft.transactions.cancelPendingTransaction, function (params) {
        let route = apiRoutes.aft.cancelPendingTransaction;
        let request = requestTypes.post;
        let data = params.data;
        let tableSettings = params.tableSettings;
        let successEvent = ''; //todo see which event goes here
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

    //aft get basic settings
    on(events.aft.transactions.getBasicSettings, function (params) {
        let route = apiRoutes.aft.getBasicSettings;
        let request = requestTypes.post;
        let data = params.data;
        let formSettings = params.formSettings;
        let successEvent = formSettings.populateData;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            requestType: request,
            data: data,
            settingsObject: formSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //aft save basic settings
    on(events.aft.transactions.saveBasicSettings, function (params) {
        let route = apiRoutes.aft.saveBasicSettings;
        let request = requestTypes.post;
        let data = params.data;
        let formSettings = params.formSettings;
        let successEvent = formSettings.submitSuccessEvent;
        let errorEvent = formSettings.submitErrorEvent;
        trigger('communicate/createAndSendXhr', {
            route: route,
            requestType: request,
            data: data,
            successEvent: successEvent,
            settingsObject: formSettings,
            errorEvent: errorEvent
        });
    });

    //aft get notification settings
    on(events.aft.transactions.getNotificationSettings, function (params) {
        let route = apiRoutes.aft.getNotificationSettings;
        let request = requestTypes.post;
        let data = params.data;
        let formSettings = params.formSettings;
        let successEvent = formSettings.populateData;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            requestType: request,
            data: data,
            settingsObject: formSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //aft save notification settings
    on(events.aft.transactions.saveNotificationSettings, function (params) {
        let route = apiRoutes.aft.saveNotificationSettings;
        let request = requestTypes.post;
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

    //aft get filters
    on(events.aft.transactions.getFilters, function (params) {
        let route = apiRoutes.aft.getFilters;
        let request = requestTypes.post;
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

    //ToDo: možda može da se prosledi type i url is table settingsa pa da event bude univerzalan?
    on(events.aft.transactions.exportToPDF, function (params) {

        let data = null;
        if (params.tableSettings.filters !== null) {
            //clone filters
            data = JSON.parse(JSON.stringify(params.tableSettings.filters));
            delete data.BasicData.Page;
            delete data.BasicData.PageSize;
            delete data.TokenInfo;
        } else {
            data = {
                EndpointId: params.tableSettings.endpointId,
                DateFrom: null,
                DateTo: null,
                MachineList: [],
                JackpotList: [],
                Status: [],
                Type: [],
                BasicData: {
                    SortOrder: null,
                    SortName: null
                },
            };
        }
        data.SelectedColumns = params.selectedColumns;
        sendRequest(apiRoutes.aft.exportToPDF, requestTypes.post, data, table.events.saveExportedFile, handleError, {type: table.exportFileTypes.pdf}, [{
            name: 'responseType',
            value: 'arraybuffer'
        }]);
    });

    on(events.aft.transactions.exportToXLS, function (params) {

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
    /*--------------------------------- MALFUNCTIONS EVENTS -----------------------------------*/
    // get malfunctions (all)
    on(events.malfunctions.getMalfunctions, function (params) {
        let route = apiRoutes.malfunctions.getMalfunctions;
        let request = requestTypes.post;
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

    //tickets preview ticket action
    //tickets pagination sorting and filtering
    on(events.malfunctions.previewMalfunctions, function (params) {
        let route = apiRoutes.malfunctions.previewMalfunctions;
        let request = requestTypes.post;
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

    //tickets get filter values
    on(events.malfunctions.getFilters, function (params) {
        let route = apiRoutes.malfunctions.getFilters;
        let request = requestTypes.post;
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
    on(events.malfunctions.setServiceMessage, function (params) {
        let route = apiRoutes.malfunctions.setServiceMessage;
        let request = requestTypes.post;
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

    // change malfunction state
    on(events.malfunctions.changeMalfunctionState, function (params) {
        let route = apiRoutes.malfunctions.changeMalfunctionState;
        let request = requestTypes.post;
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

    on(events.malfunctions.parseRemoteData, function (params) {
        let tableSettings = params.settingsObject;
        let data = params.data;
        prepareMalfunctionsTableData(tableSettings, data);
        trigger(tableSettings.updateEvent, {data: data, settingsObject: tableSettings});
    });
    /*-----------------------------------------------------------------------------------------*/


    /*------------------------------------ MACHINES EVENTS ----------------------------------*/

    //get all machines
    on(events.machines.getMachines, function (params) {
        let route = apiRoutes.machines.getMachines;
        let data = params.data;
        let request = requestTypes.post;
        let tableSettings = params.tableSettings;
        let successEvent = params.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            request: request,
            settingsObject: tableSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //machines get machine details
    on(events.machines.getMachineDetails, function (params) {
        let route = apiRoutes.machines.getMachineDetails;
        let data = params.data;
        let request = requestTypes.post;
        let tableSettings = params.tableSettings;
        let successEvent = params.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            request: request,
            settingsObject: tableSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //machines get service data
    on(events.machines.getMachineServiceData, function (params) {
        let route = apiRoutes.machines.getMachineServiceData;
        let data = params.data;
        let request = requestTypes.post;
        let tableSettings = params.tableSettings;
        let successEvent = params.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            request: request,
            settingsObject: tableSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //machines swich service mode
    on(events.machines.switchServiceMode, function (params) {
        let route = apiRoutes.machines.switchServiceMode;
        let data = params.data;
        let request = requestTypes.post;
        let tableSettings = params.tableSettings;
        let successEvent = params.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            request: request,
            settingsObject: tableSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //machines get history
    on(events.machines.getMachineHistory, function (params) {
        let route = apiRoutes.machines.getMachineHistory;
        let data = params.data;
        let request = requestTypes.post;
        let tableSettings = params.tableSettings;
        let successEvent = params.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            request: request,
            settingsObject: tableSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //machines preview machine history
    on(events.machines.previewMachineHistory, function (params) {
        let route = apiRoutes.machines.previewMachineHistory;
        let data = params.data;
        let request = requestTypes.post;
        let tableSettings = params.tableSettings;
        let successEvent = params.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            request: request,
            settingsObject: tableSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //machines get events
    on(events.machines.getMachineEvents, function (params) {
        let route = apiRoutes.machines.getMachineEvents;
        let data = params.data;
        let request = requestTypes.post;
        let tableSettings = params.tableSettings;
        let successEvent = params.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            request: request,
            settingsObject: tableSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //machines get preview events
    on(events.machines.previewMachineEvents, function (params) {
        let route = apiRoutes.machines.previewMachineEvents;
        let data = params.data;
        let request = requestTypes.post;
        let tableSettings = params.tableSettings;
        let successEvent = params.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            request: request,
            settingsObject: tableSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //machines get all meters
    on(events.machines.getAllMachineMeters, function (params) {
        let route = apiRoutes.machines.getAllMachineMeters;
        let data = params.data;
        let request = requestTypes.post;
        let tableSettings = params.tableSettings;
        let successEvent = params.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            request: request,
            settingsObject: tableSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //machines preview meters
    on(events.machines.previewMachineMeters, function (params) {
        let route = apiRoutes.machines.previewMachineMeters;
        let data = params.data;
        let request = requestTypes.post;
        let tableSettings = params.tableSettings;
        let successEvent = params.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            request: request,
            settingsObject: tableSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //machines remove meter
    on(events.machines.removeMeter, function (params) {
        let route = apiRoutes.machines.removeMeter;
        let data = params.data;
        let request = requestTypes.post;
        let tableSettings = params.tableSettings;
        let successEvent = params.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            request: request,
            settingsObject: tableSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //machines save meter
    on(events.machines.saveMachineMeters, function (params) {
        let route = apiRoutes.machines.saveMachineMeters;
        let data = params.data;
        let request = requestTypes.post;
        let tableSettings = params.tableSettings;
        let successEvent = params.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            request: request,
            settingsObject: tableSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //machines show meters
    on(events.machines.showMachineMeters, function (params) {
        let route = apiRoutes.machines.showMachineMeters;
        let data = params.data;
        let request = requestTypes.post;
        let tableSettings = params.tableSettings;
        let successEvent = params.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            request: request,
            settingsObject: tableSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //machines edit machine
    on(events.machines.editMachine, function (params) {
        let route = apiRoutes.machines.editMachine;
        let data = params.data;
        let request = requestTypes.post;
        let tableSettings = params.tableSettings;
        let successEvent = params.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            request: request,
            settingsObject: tableSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //machines save machine
    on(events.machines.saveMachine, function (params) {
        let route = events.machines.saveMachine;
        let data = params.data;
        let request = requestTypes.post;
        let tableSettings = params.tableSettings;
        let successEvent = params.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            request: request,
            settingsObject: tableSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //machines remove machine
    on(events.machines.removeMachineFromCasino, function (params) {
        let route = apiRoutes.machines.removeMachineFromCasino;
        let data = params.data;
        let request = requestTypes.post;
        let tableSettings = params.tableSettings;
        let successEvent = params.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            data: data,
            request: request,
            settingsObject: tableSettings,
            successEvent: successEvent,
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