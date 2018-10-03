let application = (function () {

    function generateMenu() {
        let decodedToken = decodeToken(sessionStorage.token);
        let endpoint = decodedToken.endpoint;
        let menu = JSON.parse(endpoint);
        trigger('sidebar/menu/generate', {menuData: menu});
        // console.log(menu['Casinos'].Value[0]);
        // trigger('template/render', {templateElementSelector:'#casino-template', model: menu['Casinos'].Value[0]})
    }

    function checkCurrentUser() {
        if (window.location.pathname.indexOf("login") < 0) {
            if (typeof sessionStorage.token != 'undefined' && sessionStorage.token != null) {
                generateMenu();
            }
            else {
                window.location.pathname = "/login";
            }
        }
    }

    window.addEventListener('load', function () {
        //ToDo: Fix timeout hotfix
        setTimeout(checkCurrentUser, 500);
    });


})();