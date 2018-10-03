let application = (function(){


    function generateMenu(endpoint) {
        let menu = endpoint;
        let menuJSON = JSON.parse(menu);
        console.log(menuJSON);
        trigger('sidebar/menu/generate', {menuData: menuJSON});
    }

    function checkCurrentUser() {
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


    window.addEventListener('load', function () {
        //ToDo: Fix timeout hotfix
        setTimeout(checkCurrentUser, 500);
        //generateMenu(menuData);

    });


})();