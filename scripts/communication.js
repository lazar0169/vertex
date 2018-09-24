let communication = (function() {

    //private functions
    //get request
    function communication(url, requestType, data){
        const http = new XMLHttpRequest();
        const url='https://jsonplaceholder.typicode.com/posts';
        http .open("GET", url);
        http .send();
        http .onreadystatechange=(e)=>{
            console.log(Http.responseText)
        }
    }


    //events for casino
    on('communicate/casino', function (param) {
        let templateElementSelector = param.templateElementSelector;
        let model = param.model;
        if (typeof param.callbackEvent !== 'undefined') {
            render(templateElementSelector, model, param.callbackEvent);
        }
        else {
            render(templateElementSelector, model);
        }
    });


    //events for jackpot



    //events for tickets



    //events for AFT



    //events for machines



    //events for reports



    //events for users



    //events for service


})();