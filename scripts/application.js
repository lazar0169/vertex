let application = (function(){

    function isLoggedIn() {
        if (window.location.pathname.indexOf("login") < 0) {
            if (typeof sessionStorage.token != 'undefined' && sessionStorage.token != null) {
                let decodedToken = decodeToken(sessionStorage.token);
                let endpoint = decodedToken.endpoint;
                alert('JUHUUU');
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