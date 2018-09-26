const keys = {
    authToken : "token"
}

on('session/token/save', function(e) {
    if (typeof(Storage) !== "undefined") {
        let successData = e.encodedToken;
        let decodedToken = decodeToken(successData);
        localStorage.setItem(keys.authToken, JSON.stringify(decodedToken));
        console.log('local storage', localStorage);
        return localStorage;
    } else {
        console.error('Sorry! No Web Storage support...');
    }
});