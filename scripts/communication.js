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
            removeMachineFromCasino: 'communicate/machines/remove',
            machineInfo: 'communicate/machine-info'
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

    function success(xhr, callbackEvent, additionalData) {
        console.log('callback event',callbackEvent);
        console.log('communication success:',additionalData);
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
            trigger(callbackEvent, { data: data, additionalData: additionalData });
        }
    }

    function error(xhr, errorEventCallback) {
        //try to parse error as JSON
        let errorResponse = tryParseJSON(xhr.responseText);
        if (errorResponse === 'undefined') {
            errorResponse = xhr.responseText;
        }
        //ToDo: refactor to send xhr only
        let errorData = { 'message': errorResponse, 'xhr': xhr };
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

    /*---------------------------------------- EVENTS ----------------------------------------*/

    //create and send xhr
    on('communicate/createAndSendXhr', function (params) {
        let xhr = createRequest(params.route, params.requestType, params.data, params.successEvent, params.errorEvent, params.additionalData);
        xhr = setDefaultHeaders(xhr);
        xhr = setAuthHeader(xhr);
        send(xhr);
    });

    //pagination event
    on('communicate/pagination', function (params) {
        let event = params.event;
        let dataForApi = params.data;
        trigger(event, { data: dataForApi, tableSettings: params.tableSettings, callbackEvent: params.callbackEvent });
    });

    //generate events
    on('communicate/category', function (params) {
        trigger(`communicate/${params.category.toLowerCase()}`);
    });

    /*--------------------------------- AUTHORIZATION EVENTS ---------------------------------*/

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
        events: events,
        requestTypes: requestTypes,
        handleError: handleError,
        sendRequest: sendRequest
    }

})();