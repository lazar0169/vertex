let login = (function () {


    let submitButtonElementName = '.form-submit';
    let usernameFieldName = '.username-input';
    let passwordFieldName = '.pass-input';

    function submit() {
        let submitButtonElement = $$(submitButtonElementName)[0];
        console.log('submitButtonElement', submitButtonElement);
        submitButtonElement.addEventListener('click', function(e){
            e.preventDefault();
            console.log('We clicked!');
            let usernameField = $$(usernameFieldName);
            let passwordField = $$(passwordFieldName);
            let usernameValue = usernameField.value;
            let passwordValue = passwordField.value;
            trigger('communicate/login', {data: {'UserName': usernameValue, "Password": passwordValue}, successEvent: 'login/success', errorEvent: "login/error"});
        });
    }

    submit();

    on('login/success', function (e) {
        //ToDo funkcija za smestanje u local storage
        console.log('We are in login/sucess');
        trigger('session/token/save', {encodedToken: e.data});
        let token = JSON.parse(localStorage.token);
        let endpoint = JSON.parse(token.endpoint);
    });

    on('login/error', function (e) {
        console.log('login error');
        let errorData = e.data;
        let errorText = errorData.error;
        console.log('errorText', errorText);
    });






})();


