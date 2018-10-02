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
    let base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    let dotCounter = 0;
    console.log('accessToken', accessToken);


    let match;


    while (match = regex.exec(accessToken)) {
        dotCounter++;
    }

    while (accessToken.indexOf('.') > -1) {
        dotCounter++;
        alert (dotCounter);
    }
    console.log('dot counter', dotCounter);
    if (dotCounter === 2) {
        let accessTokenSplit = accessToken.split('.')[1];
        console.log('accessTokenSplit', accessTokenSplit);
        if(base64regex.test(accessTokenSplit)){
            console.log('');
        }
    }
    else return false;
}

function decodeToken(encodedToken) {
    //ToDO check if data is valid
    let encodedTokenJSON = JSON.parse(encodedToken);
    let accessToken = encodedTokenJSON.access_token;
    validateEncodedToken(accessToken);
    let decodedToken = JSON.parse(atob(accessToken.split('.')[1]));
    console.log('decodedToken', decodedToken);
    return decodedToken;
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

