let communication = (function() {

    //private functions
    //get request
    function communication(url, requestType, data){
        let http = new XMLHttpRequest();
        http.open("GET", url); //open connection
        http.send(); //send HTTP message
        http.onreadystatechange = function(e){ //a function to be called when the readyState property changes
            if (http.readyState == 4 && http.status == 200) { //readyState holds the status of the XMLHttpRequest
                console.log(http.responseText);
            }

        }
    }


    //events for casino
    on('communicate/casino', function (param) {
        let url = param.url;
        communication(url);
    });


    // let paramUrl = 'https://www.google.com/';
    let paramUrl = 'https://jsonplaceholder.typicode.com/posts';
    trigger('communicate/casino', {paramUrl})


    //events for jackpot



    //events for tickets



    //events for AFT



    //events for machines



    //events for reports



    //events for users



    //events for service


})();