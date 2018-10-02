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

    // transfering sessionStorage from one tab to another

    function sessionStorage_transfer(event) {
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
            let data = JSON.parse(event.newValue);
            for (let key in data) {
                sessionStorage.setItem(key, data[key]);
            }
        }
        trigger('application/login');
    }

    // Listening for changes to localStorage
    if (window.addEventListener) {
        window.addEventListener("storage", sessionStorage_transfer, false);
    } else {
        window.attachEvent("onstorage", sessionStorage_transfer);
    }

    // Asking other tabs for session storage (this is ONLY to trigger event)
    if (!sessionStorage.length) {
        localStorage.setItem('getSessionStorage', 'foobar');
        localStorage.removeItem('getSessionStorage', 'foobar');
    }

    trigger('application/login');

})();