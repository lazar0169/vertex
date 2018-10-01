let session = (function(){

    const keys = {
        authToken : "token"
    }

    on('session/token/save', function(e) {
        if (typeof(Storage) !== "undefined") {
            sessionStorage.clear();
            sessionStorage.setItem(keys.authToken, e.encodedToken);
            console.log('session storage', sessionStorage);
            return sessionStorage;
        } else {
            console.error('Sorry! No Web Storage support...');
        }
    });


    on('session/login/success', function(e){
        trigger('session/token/save', {encodedToken: e.encodedToken});
        sessionStorage.setItem('status', 'loggedIn');
    });

    on('session/logout/', function(){
        sessionStorage.clear();
        window.location.href = '/login';
    });

    on('session/login/error', function(e){
        sessionStorage.clear();
        let errorMessage = e.message;
        console.log(errorMessage);
        alert('Invalid username / password. Please try again!');
    });



    // window.onload
// takav event ce da se handluje
})();