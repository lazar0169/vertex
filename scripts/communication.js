let communication = (function() {

    const requestTypes = {
        get: "GET",
        post: "POST"
    }

    const apiUrl = "http://api.vertex.com/";
    //private functions
    //get request

    function createRequest(route, requestType, data, callabackEvent) {
        let xhr;

        if(requestType === 'GET') {
            xhr = createGetRequest(route);

        }
        else if (requestType === 'POST') {
            xhr = createPostRequest(route,data);

        }
        //handleri su isti i za get i za post
        xhr.onreadystatechange = function(e){ //a function to be called when the readyState property changes
            if (http.readyState == 4 && http.status == 200) { //readyState holds the status of the XMLHttpRequest
                success(xhr,callabackEvent);
            }
            else if (http.status >= 400) {
                error(xhr,callabackEvent);
            }
        }
        return xhr;
    }

    function createGetRequest(route,data) {
        let xhr = new XMLHttpRequest();
        //set url
        //kontaketinraju parametri na url
        //primer:
        // url = google.com/neske a {ime : 1, broj:2}
        //google.com/neske?ime=1&neske=2
        //url = google.com/neske/1/2 drugi case koji nije native
        xhr.open('GET', apiUrl+route,true); //open connection
    }

    function createPostRequest(route,data) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", apiUrl+route, true);
        //???
        console.log('pre dodele: ',xhr.customData);
        xhr.customData = data;
        console.log('posle dodele: ',xhr.customData);
        return xhr;
   }

   function send(xhr) {
        if (typeof  xhr.customData !== 'undefined') {
            return xhr.send(xhr.customData);
        }
       return xhr.send();
   }

    //default callbacks
    function success(xhr,callbackEvent) {
        console.log('response:',xhr);
        //dekodiras podatke
        let data = "";

        //let dataString = "";

        //data = JSON.parse(dataString);

        //uzmes token i zapamtis ga u localstorage
        //
        console.log('callback event:', callbackEvent);
        if (typeof callbackEvent !== "undefined" && callbackEvent !== null) {
            trigger(callbackEvent, {data: data});
        }
    }
    function error(xhr,callback) {
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
        //ovde se cita token iz localhosta
        //http.setRequestHeader("Authorization", "bearer {token}");
        http.setRequestHeader("Authorization", "bearer " + token);
    }

/*
    function communication(url, requestType, data, callback){
        let http = new XMLHttpRequest();
        if(requestType === 'GET') {
            http.open('GET', url); //open connection
            http.send(); //send HTTP message
            http.onreadystatechange = function(e){ //a function to be called when the readyState property changes
                if (http.readyState == 4 && http.status == 200) { //readyState holds the status of the XMLHttpRequest
                    success(xhr,callback);
                }
                else if (http.status >= 400) {
                    error(xhr,callback);
                }
            }
        }
        else if (requestType === 'POST') {
            http.open("POST", url, true);
            http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            http.send(data);
        }
    }*/


/*    on('send') {

    }*/

    //events for casino
    on('communicate/casino-info', function (params) {

        //let casinoId = params.casinoId;
        let callbackEventName = params.callbackEvent;
        let route = "http://www.google.com/";
        let data = typeof params.data === "undefined" ? null : params.data;
        let xhr = createRequest(route,requestTypes.get,data,callbackEventName);
        xhr = setDefaultHeaders(xhr);
        //xhr = setAuthHeader(xhr);
        send(xhr);
    });
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


    let http = new XMLHttpRequest();
    let paramUrl = 'https://www.google.com/';
    let paramRequestType = 'GET';
    let paramData = {};
    let paramCallback = "casino/display-casino-info/";
    // let paramUrl = 'https://jsonplaceholder.typicode.com/posts';
    //trigger('communicate/casino-info', {data:{"testParam":"test"},callbackEvent:"casino/display-casino-info/"});


    //events for jackpot



    //events for tickets



    //events for AFT



    //events for machines



    //events for reports



    //events for users



    //events for service


})();