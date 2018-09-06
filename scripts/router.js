let router = (function(){

   // window.addEventListener('popstate', function(e){console.log('url changed')});

    // checkURLchange();
    //
    // window.onhashchange = funcRef;

    // window.onhashchange = function () {alert("nesto"); console.log("nesto isto");};

    window.addEventListener("beforeunload", function (event) {
        // Most browsers.
        event.preventDefault();

        // Chrome/Chromium based browsers still need this one.
        event.returnValue = "\o/";
        console.log(event, location);
    });

    //beforeunload ne mozemo da znamo na koju stranu ce da ide

})();


