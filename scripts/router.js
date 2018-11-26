let router = (function () {

    //Map object with routes

    let routes = new Map();
/*    routes.set('aft', {
        page: 'aft',
        id: '#page-aft',
        path: '/aft'
    });*/
    routes.set('aft', {
        page: 'aft',
        id: '#page-aft',
        path: '/aft/{aftId:integer}'
    });
    routes.set('casinos/list', {
        page: 'casinos/list',
        id: '#page-casinos-add',
        path: '/casinos/{casinoId:integer}/player/{playerId:integer}'
    });
    routes.set('casinos', {
        page: 'casinos',
        id: '#page-casinos',
        path: '/casinos/{casinoId:integer}'
    });
    routes.set('casinos/add', {
        page: 'casinos/add',
        id: '#page-casinos-add',
        path: '/casinos/{casinoName:string}/player/{playerId:integer}'
    });
    routes.set('jackpots', {
        page: 'jackpots',
        id: '#page-jackpots',
        path: '/jackpots'
    });
    routes.set('jackpots', {
        page: 'jackpots',
        id: '#page-jackpots',
        path: '/jackpots/{jackpotId:integer}'
    });
    routes.set('tickets', {
        page: 'tickets',
        id: '#page-tickets',
        path: '/tickets'
    });
    routes.set('tickets', {
        page: 'tickets',
        id: '#page-tickets',
        path: '/tickets/{ticketId:integer}'
    });
    routes.set('home', {
        page: 'home',
        id: '#page-home',
        path: '/home'
    });
    routes.set('machines', {
        page: 'machines',
        id: '#page-machines',
        path: '/machines'
    });
    routes.set('machines', {
        page: 'machines',
        id: '#page-machines',
        path: '/machines/{machinesId:integer}'
    });

    //Functions for displaying page

    function getElementFromPageName(pageName) {
        return $$(routes.get(pageName).id);
    }

    function getActiveElement() {
        let activeElements = $$('.active');
        if (activeElements.length > 0) {
            return activeElements[0];
        }
        return null;
    }

    function makePageActive(pageName) {
        let pageElement = getElementFromPageName(pageName);
        if (pageElement != null) {
            pageElement.classList.add('active');
        }
        else {
            console.error('Selected page does not exist!');
        }
    }

    function hideActivePage() {
        if (getActiveElement() != null) {
            getActiveElement().classList.remove('active');
        }
    }

    function showPage(pageName) {
        makePageActive(pageName);
    }

    function changePage(pageName, addStateToHistory, url) {
        application.checkCurrentUser();
        hideActivePage();
        if (pageName === null || pageName === undefined) {
            pageName = 'home';
        }
        if (typeof addStateToHistory === 'undefined') {
            addStateToHistory = true;
        }
        let currentRoute = routes.get(pageName);
        let currentUrl;
        if (typeof url !== 'undefined') {
            currentUrl = url;
        } else {
            currentUrl = window.location.pathname;
        }
        let params = getParamsFromUrl(currentUrl, currentRoute);
        if (addStateToHistory) {
            pushToHistoryStack(routes.get(pageName), params);
        }
        hideActivePage();
        showPage(pageName);
        let eventName = pageName + "/activated";
        console.log('Change page - name of the event to be triggered: ', eventName);
        //Trigger load event of selected page
        trigger(eventName, {'params': params});
        //Event name convention: page-PAGENAME-activated
        //ToDo: Trigerovati event sidebar-a da oznaci koji je podmeni aktivan
    }


    //Functions for working with regular expressions

    function buildRegExpFromRoute(route) {
        let regExpPath = route.path,
            paramPattern = /{(.*?)}/gi;
        let paramsArray = regExpPath.match(paramPattern);
        route.params = [];
        if (paramsArray !== null) {
            paramsArray.forEach(function (element) {
                element = element.replace('{', '').replace('}', '');
                let paramArray = element.split(':');
                route.params.push({
                    name: paramArray[0],
                    type: paramArray[1]
                });
                let regExpPart = buildParamRegex(paramArray[1]);
                let stringToReplaceInOriginalPath = '{' + paramArray[0] + ':' + paramArray[1] + '}';
                regExpPath = regExpPath.replace(stringToReplaceInOriginalPath, regExpPart);
            });
        }
        regExpPath += '$';
        route.regexp = new RegExp(regExpPath);
    }

    function addRegExpToPages() {
        routes.forEach(function (element) {
            buildRegExpFromRoute(element);
        });
    }

    function matchUrlAndRegExp(url, regExpObj) {
        let match = url.match(regExpObj);
        return match !== null;
    }

    function getPageNameFromUrl(url) {
        let pageName = null;
        routes.forEach(function (value, key) {
            if (matchUrlAndRegExp(url, value.regexp)) {
                pageName = key;
            }
        });
        return pageName;
    }


    //Functions for working with parameters

    function createUrlFromRouteAndParams(route, params) {
        let url = route.path;
        for (let i = 0; i < params.length; i++) {
            let param = params[i];
            let paramString = '{' + param.name + ':' + param.type + '}';
            url = url.replace(paramString, param.value);
        }
        return url;
    }

    function buildParamRegex(paramType) {
        switch (paramType) {
            case 'integer':
                return '(\\d+)';
            case 'string':
                return '([A-Za-z0-9-._]+)';
            default:
                return '([A-Za-z0-9-._]+)';
        }
    }

    function getParamValue(paramType, value) {
        switch (paramType) {
            case 'integer':
                return parseInt(value);
            case 'string':
                return value;
            default:
                return value;
        }
    }

    function validateParam(paramType, value) {
        let regExp = null;
        switch (paramType) {
            case 'integer':
                regExp = new RegExp('^(\\d+)$');
                break;
            case 'string':
                regExp = new RegExp('^([A-Za-z0-9-._]+)$');
                break;
            default:
                regExp = null;
                break;
        }
        if (regExp === null) {
            return false;
        }
        return regExp.test(value);
    }

    function getParamsFromUrl(url, route) {
        if (typeof route === typeof undefined) {
            let page = getPageNameFromUrl(url);
            route = routes.get(page);
        }
        let params = url.match(route.regexp);
        if (params != null) {
            let currentParams = route.params.slice(0);
            for (let i = 1; i <= params.length - 1; i++) {
                let paramValue = params[i],
                    paramType = currentParams[i - 1].type;
                if (validateParam(paramType, paramValue)) {
                    currentParams[i - 1].value = getParamValue(paramType, paramValue);
                }
                else {
                    console.error('Param type is not correct!');
                    return false;
                }
            }
            return currentParams;
        }
        return [];
    }

    //Function for manipulating history stack
    function pushToHistoryStack(route, params) {
        let currentState = window.history.state,
            currentUrl = createUrlFromRouteAndParams(route, params),
            previousUrl = false;
        if (currentState !== null) {
            previousUrl = typeof currentState.activeUrl !== typeof undefined && currentState.activeUrl !== null ? currentState.activeUrl : false;
        }
        let pageChanged = !previousUrl || (previousUrl && previousUrl !== currentUrl);
        if (pageChanged) {
            route.activeUrl = currentUrl;
            //avoid state duplication on clicking back
            window.history.pushState(route, null, currentUrl);
        }
    }


    //Functions for handling links

    function bindNavigationLinkHandler(element) {
        element.removeEventListener('click', handleLinkClick);
        element.addEventListener('click', handleLinkClick);
    }

    function bindNavigationLinkHandlers() {
        let navigationElements = $$('.element-navigation-link');
        for (let i = 0; i < navigationElements.length; i++) {
            let navigationElement = navigationElements[i];
            bindNavigationLinkHandler(navigationElement);
        }
    }

    function handleLinkClick(e) {
        e.preventDefault();
        let url = e.target.getAttribute('href');
        let pageName = getPageNameFromUrl(url);
        changePage(pageName, true, url);
    }


    //Function for initialization
    function init() {
        addRegExpToPages();
        let path = window.location.pathname;
        let pageName = getPageNameFromUrl(path);
        console.log('page name', pageName);
        if (pageName != null) {
            changePage(pageName);
        }
        else {
            console.error('Page not found!');
            changePage('home');
        }
        bindNavigationLinkHandlers();
    }


    //events

    //clicking back
    window.addEventListener('popstate', function (event) {
        event.preventDefault();
        event.stopPropagation();
        if (event.state === null && window.history.length > 0) {
            history.back();
            return;
        }
        if (typeof event.state.page !== typeof undefined) {
            let previousPage = event.state.page;
            changePage(previousPage, false);
        }
    });

    on('router/change/page', function (param) {
        let pageName = null;
        if (param.pageName) {
            pageName = param.pageName;
        }
        else if (param.url) {
            pageName = getPageNameFromUrl(param.url);
        }
        changePage(pageName);
        if (typeof param.callbackEvent !== undefined) {
            trigger(param.callbackEvent, param);
        }
    });

    on('router/bind-handlers/navigation-links', function () {
        bindNavigationLinkHandlers();
    });

    init();

})();