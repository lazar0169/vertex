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

function decodeToken(encodedToken) {
    //ToDO check if data is valid
    let accessToken = encodedToken.access_token;
    let decodedToken = JSON.parse(atob(accessToken.split('.')[1]));
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

