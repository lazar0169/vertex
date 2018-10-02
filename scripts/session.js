let session = (function () {

    const keys = {
        authToken: "token"
    }

    on('session/token/save', function (e) {
        if (typeof(Storage) !== "undefined") {
            sessionStorage.clear();
            let encodedToken = e.encodedToken;
            let encodedTokenJSON = JSON.stringify(encodedToken);

            sessionStorage.setItem(keys.authToken, encodedTokenJSON);
            return sessionStorage;
        } else {
            console.error('Sorry! No Web Storage support...');
        }
    });

    on('session/login/success', function (e) {
        trigger('session/token/save', {encodedToken: e.encodedToken});
        sessionStorage.setItem('status', 'loggedIn');
        let storage = sessionStorage;
    });

    on('session/logout/', function () {
        sessionStorage.clear();
        window.location.href = '/login';
    });

    on('session/login/error', function (e) {
        sessionStorage.clear();
        let errorMessage = e.message;
        alert('Invalid username / password. Please try again!');
    });


    // transfers sessionStorage from one tab to another
    // transfers sessionStorage from one tab to another
    var sessionStorage_transfer = function (event) {
        if (!event) {
            event = window.event;
        } // ie suq
        if (!event.newValue) return;          // do nothing if no value to work with
        if (event.key == 'getSessionStorage') {
            // another tab asked for the sessionStorage -> send it
            localStorage.setItem('sessionStorage', JSON.stringify(sessionStorage));
            // the other tab should now have it, so we're done with it.
            localStorage.removeItem('sessionStorage'); // <- could do short timeout as well.
        } else if (event.key == 'sessionStorage' && !sessionStorage.length) {
            // another tab sent data <- get it
            var data = JSON.parse(event.newValue);
            for (var key in data) {
                sessionStorage.setItem(key, data[key]);
            }
        }
        isLoggedIn();
    };

// listen for changes to localStorage
    if (window.addEventListener) {
        window.addEventListener("storage", sessionStorage_transfer, false);
    } else {
        window.attachEvent("onstorage", sessionStorage_transfer);
    }
    ;


// Ask other tabs for session storage (this is ONLY to trigger event)
    if (!sessionStorage.length) {
        localStorage.setItem('getSessionStorage', 'foobar');
        localStorage.removeItem('getSessionStorage', 'foobar');
    }
    ;


    function isLoggedIn() {
        if (window.location.pathname.indexOf("login") < 0) {
            console.log('Checking if the user is logged in.');
            console.log(sessionStorage.token);
            if (typeof sessionStorage.token != 'undefined' && sessionStorage.token != null) {
                //decode tokend and check if it is valid
                // decodeToken(sessionStorage.token);
                console.log('The user is logged in.');
            }
            else {
                window.location.pathname = "/login";
            }
        }
    }

    setTimeout(isLoggedIn, 500);

})();