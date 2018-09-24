let communication = (function() {

    const requestTypes = {
        get: "GET",
        post: "POST"
    }

    const apiUrl = "https://jsonplaceholder.typicode.com/";

    function createRequest(route, requestType, data, callabackEvent) {
        let xhr;
        if(requestType === 'GET') {
            xhr = createGetRequest(route);
        }
        else if (requestType === 'POST') {
            xhr = createPostRequest(route, data);
        }
        console.log('xhr: ', xhr);
        xhr.onreadystatechange = function(e){
            if (xhr.readyState == 4 && xhr.status == 200) {
                success(xhr, callabackEvent);
            }
            else if (xhr.status >= 400) {
                error(xhr, callabackEvent);
            }
        }
        return xhr;
    }

    function createGetRequest(route, data) {
        let xhr = new XMLHttpRequest();
        console.log('xhr get', xhr);
        xhr.open('GET', apiUrl+route,true);
        console.log('xhr get', xhr);
        return xhr;
    }

    function createPostRequest(route, data) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", apiUrl+route, true);
        //TODO: see if it works like this
        console.log('Before assignment: ', xhr.customData);
        xhr.customData = data;
        console.log('After assignment: ',xhr.customData);
        return xhr;
   }

   function send(xhr) {
        if (typeof  xhr.customData !== 'undefined') {
            return xhr.send(xhr.customData);
        }
        console.log('xhr in send:', xhr);
       return xhr.send();
   }

    //default callbacks
    function success(xhr, callbackEvent) {
        console.log('response:', xhr);
        //Here we decode data
        let data = "";
        //let dataString = "";
        //data = JSON.parse(dataString);
        //Here we take token and save it into local storage
        console.log('callback event:', callbackEvent);
        if (typeof callbackEvent !== "undefined" && callbackEvent !== null) {
            trigger(callbackEvent, {data: data});
        }
    }

    function error(xhr, callback) {
        //callback(xhr.error);
        //prepare error data
        let data = "";
        console.error(xhr.responseText);
        if (typeof callback !== 'undefined') {
            trigger(callback,{data:data});
        }
    }

    //helper functions
    function setDefaultHeaders(xhr) {
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader("Accept", "application/json");
        return xhr;
    }

    function setAuthHeader(xhr) {
        let token = "";
        //Here we get token from localhost
        xhr.setRequestHeader("Authorization", "bearer " + token);
    }


    //events for casino
    on('communicate/casino-info', function (params) {
        //let casinoId = params.casinoId;
        let callbackEventName = params.callbackEvent;
        let route = "todos/1";
        let data = typeof params.data === "undefined" ? null : params.data;
        let xhr = createRequest(route, requestTypes.get, data, callbackEventName);
        xhr = setDefaultHeaders(xhr);
        console.log('xhr after setting default headers: ', xhr);
        //xhr = setAuthHeader(xhr);
        send(xhr);
    });


    // trigger('communicate/casino-info', {data:{"testParam":"test"}, callbackEvent: "casino/display-casino-info/"});


    //events for jackpot



    //events for tickets



    //events for AFT



    //events for machines
    on('communicate/machine-info', function (param) {
        let machineId = params.machineId;
        let callbackEventName = params.callbackEvent;
        let route = "machine/"+machineId;
        let data = typeof params.data === "undefined" ? null : params.data;
        let xhr = createRequest(route,requestTypes.get,data,callbackEventName);
        xhr = setDefaultHeaders(xhr);
        xhr = setAuthHeader(xhr);
        send(xhr);
    });


    //events for reports



    //events for users



    //events for service


})();