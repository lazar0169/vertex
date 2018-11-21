let communication = (function () {
    let proba2 = $$('#aft-advance-table-filter-finished');
    let proba3 = $$('#aft-advance-table-filter-jackpot');
    let proba4 = $$('#aft-advance-table-filter-type');
    let proba5 = $$('#aft-advance-table-filter-status');
    let proba6 = $$('#aft-advance-table-filter-column');

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

    function success(xhr, callbackEvent, tableSettings) {
        let data = tryParseJSON(xhr.responseText);
        //update token in sessionStorage
        sessionStorage["token"] = JSON.stringify(data.TokenInfo);
        if (typeof callbackEvent !== typeof undefined && callbackEvent !== null) {

            trigger(callbackEvent, {data: data, tableSettings: tableSettings});
        }
    }

    function error(xhr, errorEventCallback) {
        let errorData = {"message": xhr.responseText};
        if (typeof errorEventCallback !== typeof undefined) {
            trigger(errorEventCallback, errorData);
        }
    }

    function createRequest(route, requestType, data, successEvent, errorEvent, tableSettings) {
        let xhr;
        if (requestType === requestTypes.get) {
            xhr = createGetRequest(route);
        }
        else if (requestType === requestTypes.post) {
            xhr = createPostRequest(route, data);
        }
        else if (requestType === requestTypes.delete) {
            xhr = createDeleteRequest(route);
        }
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState === xhrStates.done && xhr.status >= 200 && xhr.status < 300) {
                console.log('communication module data', data);
                success(xhr, successEvent, tableSettings);
            }
            else if (xhr.readyState === xhrStates.done && xhr.status >= 400) {
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
        }
        catch (e) {
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

    // create and send xhr
    on('communicate/createAndSendXhr', function (params) {
        let xhr = createRequest(params.route, params.request, params.data, params.successEvent, params.errorEvent, params.tableSettings);
        xhr = setDefaultHeaders(xhr);
        xhr = setAuthHeader(xhr);
        send(xhr);
    });

    on('jovana/test', function(params) {
        // parse parameters for table
        let tableData = [];
        params.data.Data.Items.forEach(function(item) {
            tableData.push(item.EntryData);
        });
    });


    /*------------------------------------ AFT EVENTS ------------------------------------*/

    on('communicate/aft', function (params) {
        let route = 'api/transactions/';
        let request = requestTypes.post;
        let data = params.data;
        let successEvent = params.callbackEvent;
        let tableSettings = params.tableSettings;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            request: request,
            data: data,
            successEvent: successEvent,
            errorEvent: errorEvent,
            tableSettings: tableSettings
        });

        //todo needs to be deleted
        // trigger('communicate/aft/previewTransactions', {});
        // trigger('communicate/aft/getNotificationSettings', {})
        // trigger('communicate/aft/getBasicSettings', {})
        // trigger('communicate/aft/saveBasicSettings', {})
        // trigger('communicate/aft/saveNotificationSettings', {})
        //trigger('communicate/aft/getFilters', {})
        // trigger('communicate/aft/addTransaction', {})
        // trigger('communicate/aft/cancelTransaction', {}) greska sa serverom 409
        // trigger('communicate/aft/cancelPendingTransaction', {}) greska sa serverom 409
    });

    //data with static values, needs to be dynamic
    //aft preview transactions
    on('communicate/aft/previewTransactions', function (params) {
        let route = 'api/transactions/previewtransactions/';
        let successEvent = 'communicate/test';
        let data = {
            'EndpointId': 2,
            'DateFrom': null,
            'DateTo': null,
            'MachineList': null,
            'JackpotList': null,
            'Status': null,
            'Type': null,
            'BasicData': {
                'Page': 1,
                'PageSize': 10,
                'SortOrder': 0,
                'SortName': 0
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

    //aft get notification settings
    on('communicate/aft/getNotificationSettings', function (params) {
        let route = 'api/transactions/getnotificationsettings';
        let successEvent = 'communicate/test';
        let data = {
            'EndpointId': 2
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

    //aft get basic settings
    on('communicate/aft/getBasicSettings', function (params) {
        let route = 'api/transactions/getbasicsettings/';
        let successEvent = 'communicate/test';
        let data = {
            'EndpointId': 2
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

    //aft save basic settings
    on('communicate/aft/saveBasicSettings', function (params) {
        let route = 'api/transactions/savebasicsettings/';
        let successEvent = 'communicate/test';
        let data = {
            'EndpointId': 2,
            'EnableTransactions': true,
            'CashableTransactionLimit': 123456789,
            'CashableTransactionHandpayLimit': 987654321,
            'PromoTransactionLimit': 123,
            'PromoTransactionHandpayLimit': 321
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

    //aft save notification settings
    on('communicate/aft/saveNotificationSettings', function (params) {
        let route = 'api/transactions/savenotificationsettings/';
        let successEvent = 'communicate/test';
        let data = {
            'EndpointId': 2,
            'EnableNotification': true,
            'CashableTransactionCreatedLimitForNotification': 123456789,
            'CashableTransactionPayedLimitForNotification ': 987654321,
            'PromoTransactionCreatedLimitForNotification ': 123,
            'PromoTransactionPayedLimitForNotification ': 321,
            'EmailList': ['mailAddress@gaga.com'],
            'PhoneNumberList': ['+381111111']
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

    //aft get filters
    on('communicate/aft/getFilters', function (params) {
        let route = 'api/transactions/getfilters';
        let successEvent = 'communicate/testFilter';
        let data = {
            'EndpointId': 2
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

    //aft add transaction
    on('communicate/aft/addTransaction', function (params) {
        let route = 'api/transactions/addtransaction/';
        let successEvent = 'communicate/test';
        let data = {
            'EndpointId': 2,
            'EndpointName': '',
            'Gmcid': 1565666846,
            'MachineName': '',
            'Type': 0,
            'CashableAmount': 13800,
            'PromoAmount': 13800,
            'ExpirationInDays': 7
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

    //aft cancel transaction
    on('communicate/aft/cancelTransaction', function (params) {
        let route = 'api/transactions/canceltransaction/';
        let successEvent = 'communicate/test';
        let data = {
            'EndpointId': 2,
            'EndpointName': '',
            'Gmcid': 1565666846,
            //'JidtString': "32,32,32,32,32,32,32,32,50,34,42,33,90,33,40,32,88,33,65,32"
            'JidtString': "32,32,32,32,32,32,32,32,50,34,42,33,90,33,40,32,88,33,65,32"
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

    //aft cancel pending transaction
    on('communicate/aft/cancelPendingTransaction', function (params) {
        let route = 'api/transactions/cancelpendingtransaction/';
        let successEvent = 'communicate/test';
        let data = {
            'EndpointId': 2,
            'EndpointName': '',
            'Gmcid': 1565666846,
            // 'JidtString': "32,32,32,32,32,32,32,32,50,34,42,33,90,33,40,32,88,33,65,32"
            'JidtString': '33,32'
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

    //events for home
    on('communicate/home/data', function (params) {
        //FORWARD DATA TO API
        //GET DATA FROM API
        let dataFormAPI = {
            activePage: 2,
            lastPage: 6
        };
        trigger(params.callbackEvent, {tableSettings: params.tableSettings, data: dataFormAPI});
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
        console.log('communicate/test params.data', params.data);
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

})();