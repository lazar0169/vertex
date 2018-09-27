let login = (function () {


    let submitButtonElementName = '.form-submit';
    let usernameFieldName = '.username-input';
    let passwordFieldName = '.pass-input';


    //event handlers
    let submitButtonElement = $$(submitButtonElementName)[0];
    console.log('submitButtonElement', submitButtonElement);
    $$('form')[0].addEventListener('submit', function(e){
        //ako je forma nevalidna preventuj defaulta
        //let form = $$('form')[0].isValidAbsoluteURL()

        //e.preventDefault();
        console.log('We clicked!');
        let usernameField = $$(usernameFieldName)[0];
        let passwordField = $$(passwordFieldName)[0];
        console.log('usernameField', usernameField);
        console.log('passwordField', passwordField);
        let usernameValue = usernameField.value;
        let passwordValue = passwordField.value;
        console.log('usernameValue', usernameValue);
        console.log('passwordValue', passwordValue);
        if (usernameValue === 'undefined' || passwordValue === 'undefined') {
            alert('Put values inside fields!');
        }
        else {
            trigger('communicate/login', {data: {'UserName': usernameValue, "Password": passwordValue}, successEvent: 'login/success', errorEvent: "login/error"});
        }
    });

    //custom event handlers
    on('login/success', function (e) {
        //ToDo funkcija za smestanje u local storage
        console.log('We are in login/sucess');
        console.log('e.data', e.data);
        trigger('session/token/save', {encodedToken: e.data});
        let token = JSON.parse(localStorage.token);
        let endpoint = JSON.parse(token.endpoint);
        //ToDO redirect
    });

    //ToDo HTACCESS redirection

    on('login/error', function (e) {
        console.log('login error');
        let errorData = e.data;
        let errorText = errorData.error;
        console.log('errorText', errorText);
    });
})();


