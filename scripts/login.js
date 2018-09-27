let login = (function () {

    let usernameFieldName = '.username-input';
    let passwordFieldName = '.pass-input';

    //event handlers
    $$('form')[0].addEventListener('submit', function(e){
        e.preventDefault();
        let usernameField = $$(usernameFieldName)[0];
        let passwordField = $$(passwordFieldName)[0];
        let usernameValue = usernameField.value;
        let passwordValue = passwordField.value;
        trigger('communicate/login', {data: {'UserName': usernameValue, "Password": passwordValue}, successEvent: 'login/success', errorEvent: "login/error"});
    });

    //custom event handlers
    on('login/success', function (e) {
        sessionStorage.clear();
        trigger('session/token/save', {encodedToken: e.data});
        let token = JSON.parse(localStorage.token);
        let endpoint = JSON.parse(token.endpoint);
        sessionStorage.setItem('status', 'loggedIn');
        window.location.href = '/home';
        //ToDO redirect
    });

    //ToDo HTACCESS redirection

    on('login/error', function (e) {
        sessionStorage.clear();
        let errorMessage = e.message;
        let errorMessageJson = JSON.parse(errorMessage);
        console.error('Error! Incorrect usrename and / or password.');
    });
})();


