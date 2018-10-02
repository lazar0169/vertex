function $$(selector) {
    switch (selector[0]) {
        case '.':
            return document.getElementsByClassName(selector.substring(1));
        case '#':
            return document.getElementById(selector.substring(1));
        default:
            return document.getElementsByTagName(selector);
    }
}


function validateEncodedToken(accessToken) {
    let base64regex = new RegExp('^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$');
    console.log('accessToken', accessToken);
    console.log(typeof accessToken);
    let match;
    match = accessToken.match(/\./g);
    console.log('match', match);
    if (match.length === 2) {
        let accessTokenSplit = accessToken.split('.')[1];
        console.log('accessTokenSplit', accessTokenSplit);
        if (atob(accessTokenSplit)) {
            return true;
        }
        else return false;
    }
    console.error('Encoded token is not valid!');
    return false;
}

function decodeToken(encodedToken) {
    let encodedTokenJSON = JSON.parse(encodedToken);
    let accessToken = encodedTokenJSON.access_token;
    if (validateEncodedToken(accessToken)){
        let decodedToken = JSON.parse(atob(accessToken.split('.')[1]));
        console.log('decodedToken', decodedToken);
        return decodedToken;
    }
    console.error('Could not decode token!');
}

//add and remove class

const isAndroid = navigator.userAgent.toLowerCase().indexOf('android') > -1;
const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isChrome = !!window.chrome && (!!window.chrome.webstore || isMobile);
const isFirefox = typeof InstallTrigger !== 'undefined';
const isEdge = /Edge\/\d./i.test(navigator.userAgent);
const isIe = !!navigator.userAgent.match(/Trident.*rv\:11\./);
const isSafari = navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
const isOpera = !!window.opera || navigator.userAgent.indexOf('Opera') >= 0;

