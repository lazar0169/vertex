let application = (function(){

    let menu;

    function generateMenu(endpoint) {
        menu = endpoint;
        let menuJSON = JSON.parse(menu);
        console.log(menuJSON);
    }

    function isLoggedIn() {
        if (window.location.pathname.indexOf("login") < 0) {
            if (typeof sessionStorage.token != 'undefined' && sessionStorage.token != null) {
                let decodedToken = decodeToken(sessionStorage.token);
                let endpoint = decodedToken.endpoint;
                generateMenu(endpoint);
            }
            else {
                window.location.pathname = "/login";
            }
        }
    }


    on('application/login', function() {
        setTimeout(isLoggedIn, 500);
    })

})();