let login = (function () {

    on('login/success', function (e) {
        console.log(e);
    });

    on('login/error', function (e) {
        console.log('login error');
        let errorData = e.data;
        let errorText = errorData.data.error;
        console.log('errorText', errorText);
    });

    trigger('communicate/login', {data: {'UserName': 'Nikola',"Password": "Nikola1!"}, successEvent: 'login/success', errorEvent: "login/error"});

})();


