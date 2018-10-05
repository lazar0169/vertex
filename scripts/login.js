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
        trigger('notifications/success');
        if (sessionStorage.token || sessionStorage.token !== undefined) {
            window.location.pathname = '/home';
        }
        else {
            trigger('notifications/error');
        }
    });

    on('login/error', function (e) {
        trigger('session/login/error', {message: e.message});
        let messageParse = JSON.parse(e.message);
        if (messageParse.MessageCode === '22') {
            trigger('notifications/error/username-password');
        } else {
            trigger('notifications/error');
        }
    });

})();