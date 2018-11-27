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
    let match = accessToken.match(/\./g);
    if (match.length === 2) {
        let accessTokenSplit = accessToken.split('.')[1];
        if (atob(accessTokenSplit)) {
            return true;
        } else return false;
    }
    console.error('Encoded token is not valid!');
    return false;
}

function decodeToken(encodedToken) {
    if(encodedToken === undefined) {
        console.error('Token does not exist!');
    }
    else if (encodedToken !== null || encodedToken !== undefined) {
        let encodedTokenJSON = JSON.parse(encodedToken);
        let accessToken = encodedTokenJSON.access_token;
        if (validateEncodedToken(accessToken)) {
            let decodedToken = JSON.parse(atob(accessToken.split('.')[1]));
            return decodedToken;
        }
        console.error('Could not decode token!');
    } else {
        console.error('Token does not exist!');
    }
}

//ToDo:Lazar - Da li je ok da ovo bude ovde - koristim je vec u 2 modula za sad
//returns value from an object base on select string -> path='account.createdAt' -> object = user:{account:{createdAt:10/10/2010}}
//call getProperty("account.createdAt",user);
function getProperty(path, object) {
    return path.split('.').reduce(function (prev, curr) {
        return prev ? prev[curr] : null
    }, object || self);
}

//removes all children except firs one
function removeChildren(element) {
    while (element.childElementCount > 1) {
        element.removeChild(element.lastChild);
    }
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

