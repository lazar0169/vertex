let login = (function () {

    on('login/success', function (e) {
        //ToDo funkcija za smestanje u local storage
        console.log(e);
        trigger('session/token/save', {encodedToken: e.data});
        console.log(localStorage);
        let token = JSON.parse(localStorage.token);
        console.log('token', token);
        let endpoint = JSON.parse(token.endpoint);
        console.log('endpoint', endpoint);
    });

    on('login/error', function (e) {
        console.log('login error');
        let errorData = e.data;
        let errorText = errorData.error;
        console.log('errorText', errorText);
    });

    trigger('communicate/login', {data: {'UserName': 'Nikola',"Password": "Nikola1!"}, successEvent: 'login/success', errorEvent: "login/error"});

})();


