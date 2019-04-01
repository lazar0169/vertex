let logout = (function(){
    on('logout', function(){
        sessionStorage.clear();
        window.location.pathname = "";
    });
})();