let login = (function () {

    on('login/success', function (e) {
        //ToDo funkcija za smestanje u local storage
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

    trigger('communicate/login', {data: {'UserName': 'Nikola',"Password": "Nikola1!"}, successEvent: 'login/success', errorEvent: "login/error"});

})();


