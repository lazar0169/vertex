let login = (function () {

    let usernameFieldName = '.username-input';
    let passwordFieldName = '.pass-input';

    //event handlers
    $$('form')[0].addEventListener('submit', function (e) {
        e.preventDefault();
        let usernameField = $$(usernameFieldName)[0];
        let passwordField = $$(passwordFieldName)[0];
        let usernameValue = usernameField.value;
        let passwordValue = passwordField.value;
        trigger('communicate/login', {
            data: {'UserName': usernameValue, "Password": passwordValue},
            successEvent: 'login/success',
            errorEvent: "login/error"
        });
    });

    //custom event handlers
    on('login/success', function (e) {
        trigger('session/login/success', {encodedToken: e.data});
        console.log('session storage ', sessionStorage);
        console.log('session storage token ', sessionStorage.token);
        console.log(!sessionStorage.token);
        if (sessionStorage.token || sessionStorage.token !== undefined) {
            window.location.pathname = '/home';
        }
        else {
            console.error('There was an error.');
        }
    });

    on('login/error', function (e) {
        trigger('session/login/error', {message: e.message});
    });


})();