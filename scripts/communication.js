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

    function success(xhr, callbackEvent) {
        let data = tryParseJSON(xhr.responseText);
        if (typeof callbackEvent !== typeof undefined && callbackEvent !== null) {
            trigger(callbackEvent, {data: data});
        }
    }

    function error(xhr, errorEventCallback) {
        let errorData = {"message": xhr.responseText};
        if (typeof errorEventCallback !== typeof undefined) {
            trigger(errorEventCallback, errorData);
        }
    }

    function createRequest(route, requestType, data, successEvent, errorEvent) {

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
                success(xhr, successEvent);
            }
            else if (xhr.readyState === xhrStates.done && xhr.status >= 400) {
                error(xhr, errorEvent);
            }
        };
        return xhr;
    }

    function send(xhr) {
        if (typeof  xhr.customData !== typeof undefined) {

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
        //ToDo: take token from local storage
        let token = "";
        xhr.setRequestHeader("Authorization", "Bearer " + token);
    }

    function setHeader(xhr, header, value) {
        xhr.setRequestHeader(header, value);
    }


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


    on('communicate/table/data', function (params) {
        let newTableData = {
            data: [
                {
                    "period1": "home",
                    "period2": "home",
                    "period3": "home",
                    "period4": "home",
                    "period5": "home",
                    "period6": "home",
                    "period7": "home",
                    "period8": "home"
                },
                {
                    "period1": "home",
                    "period2": "home",
                    "period3": "home",
                    "period4": "home",
                    "period5": "home",
                    "period6": "home",
                    "period7": "home",
                    "period8": "home"
                },
                {
                    "period1": "home",
                    "period2": "home",
                    "period3": "home",
                    "period4": "home",
                    "period5": "home",
                    "period6": "home",
                    "period7": "home",
                    "period8": "home"
                },
                {
                    "period1": "home",
                    "period2": "home",
                    "period3": "home",
                    "period4": "home",
                    "period5": "home",
                    "period6": "home",
                    "period7": "home",
                    "period8": "home"
                },
                {
                    "period1": "home",
                    "period2": "home",
                    "period3": "home",
                    "period4": "home",
                    "period5": "home",
                    "period6": "home",
                    "period7": "home",
                    "period8": "home"
                },
                {
                    "period1": "home",
                    "period2": "home",
                    "period3": "home",
                    "period4": "home",
                    "period5": "home",
                    "period6": "home",
                    "period7": "home",
                    "period8": "home"
                },
                {
                    "period1": "home",
                    "period2": "home",
                    "period3": "home",
                    "period4": "home",
                    "period5": "home",
                    "period6": "home",
                    "period7": "home",
                    "period8": "home"
                },
                {
                    "period1": "home",
                    "period2": "home",
                    "period3": "home",
                    "period4": "home",
                    "period5": "home",
                    "period6": "home",
                    "period7": "home",
                    "period8": "home"
                },
                {
                    "period1": "home",
                    "period2": "home",
                    "period3": "home",
                    "period4": "home",
                    "period5": "home",
                    "period6": "home",
                    "period7": "home",
                    "period8": "home"
                },
                {
                    "period1": "home",
                    "period2": "home",
                    "period3": "home",
                    "period4": "home",
                    "period5": "home",
                    "period6": "home",
                    "period7": "home",
                    "period8": "home"
                },
                {
                    "period1": "home",
                    "period2": "home",
                    "period3": "home",
                    "period4": "home",
                    "period5": "home",
                    "period6": "home",
                    "period7": "home",
                    "period8": "home"
                },
                {
                    "period1": "home",
                    "period2": "home",
                    "period3": "home",
                    "period4": "home",
                    "period5": "home",
                    "period6": "home",
                    "period7": "home",
                    "period8": "home"
                },
                {
                    "period1": "home",
                    "period2": "home",
                    "period3": "home",
                    "period4": "home",
                    "period5": "home",
                    "period6": "home",
                    "period7": "home",
                    "period8": "home"
                },
                {
                    "period1": "home",
                    "period2": "home",
                    "period3": "home",
                    "period4": "home",
                    "period5": "home",
                    "period6": "home",
                    "period7": "home",
                    "period8": "home"
                }
            ],
            page:2,
            pageCount:5
    }
        trigger(params.callbackEvent, {tableSettings: params.tableSettings, newTableData: newTableData});
    });


    //events for casino
    on('communicate/casino-info', function (params) {
        //let casinoId = params.casinoId;
        let callbackEventName = params.successEvent;
        let route = 'posts/1';
        let data = typeof params.data === typeof undefined ? null : params.data;
        let xhr = createRequest(route, requestTypes.delete, data, callbackEventName);
        xhr = setDefaultHeaders(xhr);
        //xhr = setAuthHeader(xhr);
        send(xhr);
    });


    //events for jackpot


    //events for tickets


    //events for AFT


    //events for machines
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

})();