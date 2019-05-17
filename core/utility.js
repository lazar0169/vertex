//Set up element.closest to work in IE
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector ||
        Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
    Element.prototype.closest = function (s) {
        var el = this;
        if (!document.documentElement.contains(el)) return null;
        do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}

function isEmpty(value) {
    return value === undefined || value === null;
}

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

function collapseElement(element) {
    let sectionHeight = element.scrollHeight;
    let elementTransition = element.style.transition;
    element.style.transition = '';
    requestAnimationFrame(function () {
        element.style.height = sectionHeight + 'px';
        element.style.transition = elementTransition;
        requestAnimationFrame(function () {
            element.style.height = 0 + 'px';
        });
    });
}

function expandElement(element) {
    let sectionHeight = element.scrollHeight;
    if (sectionHeight !== 0) {
        element.style.height = sectionHeight + 'px';
    }
    element.addEventListener("webkittransitionEnd", expandTransitionEnd, false);
    element.addEventListener("transitionend", expandTransitionEnd, false);
    element.addEventListener("otransitionend", expandTransitionEnd, false);
    element.addEventListener("MSAnimationEnd", expandTransitionEnd, false);
}
//remove fixed height on elements after they are expanded
function expandTransitionEnd(e) {
    let target = e.target;
    let targetedHeight = target.style.height;
    if (targetedHeight !== '0px') {
        target.style.height = 'auto';
        target.removeEventListener("webkittransitionEnd", expandTransitionEnd, false);
        target.removeEventListener("transitionend", expandTransitionEnd, false);
        target.removeEventListener("otransitionend", expandTransitionEnd, false);
        target.removeEventListener("MSAnimationEnd", expandTransitionEnd, false);
    }
}

function keepAbsoluteChildInParent(parent, child, offset) {
    if (offset === undefined) {
        offset = 10;
    }

    let childHeight = child.offsetHeight;
    let childWidth = child.offsetWidth;

    let parentRect = parent.getBoundingClientRect();
    let childRect = child.getBoundingClientRect();


    if (childRect.left < parentRect.left) {
        child.style.left = parentRect.left + offset + 'px';
    }
    if (childRect.right > parentRect.right) {
        child.style.left = parentRect.right - childWidth - offset + 'px';
    }
    if (childRect.top < parentRect.top) {
        child.style.top = parentRect.top + offset + 'px';
    }
    if (childRect.bottom > parentRect.bottom) {
        child.style.top = parentRect.bottom - childHeight - offset + 'px';
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

function isFunction(functionName) {
    return functionName && {}.toString.call(functionName) === '[object Function]';
}

function isString(variableName) {
    return Object.prototype.toString.call(variableName) === "[object String]"
}

function isNode(variable) {
    return (
        typeof Node === "object" ? variable instanceof Node :
            variable && typeof variable === "object" && typeof variable.nodeType === "number" && typeof variable.nodeName === "string"
    );
}

function compareObjects() {
    let i, l, leftChain, rightChain;

    function compare2Objects(x, y) {
        let p;
        if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
            return true;
        }
        if (x === y) {
            return true;
        }
        if ((typeof x === 'function' && typeof y === 'function') ||
            (x instanceof Date && y instanceof Date) ||
            (x instanceof RegExp && y instanceof RegExp) ||
            (x instanceof String && y instanceof String) ||
            (x instanceof Number && y instanceof Number)) {
            return x.toString() === y.toString();
        }
        if (!(x instanceof Object && y instanceof Object)) {
            return false;
        }
        if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
            return false;
        }
        if (x.constructor !== y.constructor) {
            return false;
        }
        if (x.prototype !== y.prototype) {
            return false;
        }
        if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
            return false;
        }
        for (p in y) {
            if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                return false;
            } else if (typeof y[p] !== typeof x[p]) {
                return false;
            }
        }
        for (p in x) {
            if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                return false;
            } else if (typeof y[p] !== typeof x[p]) {
                return false;
            }

            switch (typeof (x[p])) {
                case 'object':
                case 'function':
                    leftChain.push(x);
                    rightChain.push(y);
                    if (!compare2Objects(x[p], y[p])) {
                        return false;
                    }
                    leftChain.pop();
                    rightChain.pop();
                    break;
                default:
                    if (x[p] !== y[p]) {
                        return false;
                    }
                    break;
            }
        }
        return true;
    }

    if (arguments.length < 1) {
        console.error('need at least two objects to compare');
        return true;
    }
    for (i = 1, l = arguments.length; i < l; i++) {
        leftChain = [];
        rightChain = [];
        if (!compare2Objects(arguments[0], arguments[i])) {
            return false;
        }
    }
    return true;
}

function isElement(variable) {
    return (
        typeof HTMLElement === "object" ? variable instanceof HTMLElement : //DOM2
            variable && typeof variable === "object" && variable !== null && variable.nodeType === 1 && typeof variable.nodeName === "string"
    );
}

function decodeToken(encodedToken) {
    if (encodedToken === undefined) {
        console.error('Token does not exist!');
    } else if (encodedToken !== null || encodedToken !== undefined) {
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
    if (path === undefined) {
        return '';
    }
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
function formatTimeData(timeData) {
    if (timeData) {
        return timeData.replace(/-/g, '/').replace('T', ' ').replace(/\..*/, '');
    }
}

//formats number 2000.53 into 2,000.53
function formatFloatValue(amount) {
    //let decimalCount = config.decimalCount;
    // let decimal = config.decimalSeparator;
    // let thousands = config.thousandSeparator;
    // try {
    //     decimalCount = Math.abs(decimalCount);
    //     decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    //     const negativeSign = amount < 0 ? "-" : "";

    //     let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
    //     let j = (i.length > 3) ? i.length % 3 : 0;

    //     return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    // } catch (e) {
    //     console.error(e);
    // }
    const negativeSign = amount < 0 ? "-" : "";
    let vrednost = Number(amount.toString().replace(/,/g, '').replace(/\./g, '')) / 100;
    console.log(amount)
    // console.log(vrednost.toLocaleString('de-De', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    if (config.decimalSeparator === ',') {
        return negativeSign + vrednost.toLocaleString('de-De', { minimumFractionDigits: config.decimalCount, maximumFractionDigits: config.decimalCount })
    }
    else {
        return negativeSign + vrednost.toLocaleString('en', { minimumFractionDigits: config.decimalCount, maximumFractionDigits: config.decimalCount })
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

