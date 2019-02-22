let login = (function () {
    let usernameFieldName = '.username-input';
    let passwordFieldName = '.pass-input';

    let welcomeMessage = $$('#welcome-message').children[0];

    window.addEventListener('load', function () {
        changeWelcomeMessage(new Date());
    });

    function changeWelcomeMessage(date) {
        let hours = date.getHours();
        if (hours < 12) {
            welcomeMessage.innerHTML = localization.translateMessage('GoodMorning!');
        }
        else {
            welcomeMessage.innerHTML = localization.translateMessage('GoodAfternoon!');
        }
    }

    //if you are already logged in but want to go to login page
    if (sessionStorage.token || sessionStorage.token !== undefined) {
        window.location.pathname = '/home';
    }
    //event handlers
    $$('form')[0].addEventListener('submit', function (e) {
        e.preventDefault();
        let usernameField = $$(usernameFieldName)[0];
        let passwordField = $$(passwordFieldName)[0];
        let usernameValue = usernameField.value;
        let passwordValue = passwordField.value;
        trigger(communication.events.authorization.login, {
            data: { 'UserName': usernameValue, "Password": passwordValue },
            successEvent: 'login/success',
            errorEvent: 'login/error'
        });
    });

    //custom event handlers
    on('login/success', function (e) {
        trigger('session/login/success', { encodedToken: e.data });
        if (sessionStorage.token || sessionStorage.token !== undefined) {
            window.location.pathname = '/home';
        }
        else {
            trigger('notifications/show');
        }
    });

    on('login/error', function (e) {
        trigger('session/login/error', { message: e.message });
        let messageParse = JSON.parse(e.message);
        let messageCode = messageParse.MessageCode;
        let messageType = messageParse.MessageType;
        let message = localization.translateMessage(messageCode.toString());
        trigger('notifications/show', { message: message, type: messageType });
    });
})();