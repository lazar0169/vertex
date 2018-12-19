let application = (function  () {

    function generateMenu() {
        let menu = getMenu();
        trigger('sidebar/menu/generate', {menuData: menu});
    }

    function getMenu() {
        let decodedToken = decodeToken(sessionStorage.token);
        let endpoint = decodedToken.endpoint;
        let menu = JSON.parse(endpoint);
        return menu;
    }

    function checkCurrentUser() {
        if (window.location.pathname.indexOf("login") < 0) {
            if (typeof sessionStorage.token !== typeof undefined && sessionStorage.token != null) {
                generateMenu();
            }
            else {
                sessionStorage.clear();
                window.location.pathname = "/login";
            }
        }
    }

    window.addEventListener('load', function () {
        //ToDo: Fix timeout hotfix
        checkCurrentUser();
/*        setTimeout(checkCurrentUser, 500);*/
    });

    return {
        checkCurrentUser: checkCurrentUser
    }

})();