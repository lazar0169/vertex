let router = (function () {

    let routes = new Map();

    routes.set('casino/edit', {
        page: 'casino/edit',
        id: '#page-casino-edit',
        path: '/casino/edit/{casinoId:integer}'
    });

    routes.set('casino/name', {
        page: 'casino/name',
        id: '#page-casino-add',
        path: '/casino/{casinoName:string}/player/{playerId:integer}'
    });
    routes.set('casino/name/player', {
        page: 'casino/name/player',
        id: '#page-casino-add',
        path: '/casino/{casinoId:integer}/player/{playerId:integer}'
    });
    routes.set('home', {
        page: 'home',
        id: '#page-home',
        path: '/'
    });

    routes.set('casino', {
        page: 'casino',
        id: '#page-casino',
        path: '/casino'
    });
    routes.set('jackpot', {
        page: 'jackpot',
        id: '#page-jackpot',
        path: '/jackpot'
    });
    routes.set('tickets', {
        page: 'tickets',
        id: '#page-tickets',
        path: '/tickets'
    });
    routes.set('AFT', {
        page: 'AFT',
        id: '#page-AFT',
        path: '/AFT'
    });
    routes.set('machines', {
        page: 'machines',
        id: '#page-machines',
        path: '/machines'
    });
    routes.set('reports', {
        page: 'reports',
        id: '#page-reports',
        path: '/reports'
    });
    routes.set('users', {
        page: 'users',
        id: '#page-users',
        path: '/users'
    });
    routes.set('service', {
        page: 'service',
        id: '#page-service',
        path: '/service'
    });

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
            console.error('Selected page does not have page element');
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

    function changePage(pageName, addStateToHistory) {


        if (pageName === null || pageName === undefined) {
            pageName = 'home';
        }
        if (typeof addStateToHistory === 'undefined') {
            addStateToHistory = true;
        }

        let currentRoute = routes.get(pageName);
        let currentUrl = window.location.pathname;
        let params = getParamsFromUrl(currentUrl, currentRoute);


        if (addStateToHistory) {
            pushToHistoryStack(routes.get(pageName),params);
        }
        hideActivePage();
        showPage(pageName);



        let eventName = 'page-'+pageName+'-activated';
        //trigger load event of selected page
        //event name convention page-PAGENAME-activated
        trigger(eventName,{'params':params});



    }

    function createUrl(route,params) {
        let url = route.path;
        for (let i = 0;i<params.length;i++) {
            var param = params[i];
            var paramString =  "{" + param.name +":" + param.type +"}";

            url = url.replace(paramString,param.value);
        }
        return url;
    }

    function buildParamRegex(paramType) {

        switch (paramType) {
            case "integer":
                return "(\\d+)";
            case "string":
                return "([A-Za-z0-9-._]+)";
            default:
                return "([A-Za-z0-9-._]+)";
        }
    }

    function buildRegExpFromPagePath(route) {
        let regExpPath = route.path;
        let paramPattern = /{(.*?)}/gi; //bilo sta izmedju {} zagrada

        let paramsArray = regExpPath.match(paramPattern);

        route.params = [];

        if (paramsArray !== null) {

            paramsArray.forEach(function (element) {
                element = element.replace("{", "").replace("}", "");

                let paramArray = element.split(":");
                route.params.push({
                    name: paramArray[0],
                    type: paramArray[1]
                });

                let regExpPart = buildParamRegex(paramArray[1]);

                let stringToReplaceInOriginalPath = "{" + paramArray[0] + ":" + paramArray[1] + "}";
                regExpPath = regExpPath.replace(stringToReplaceInOriginalPath, regExpPart);

            });
        }
        regExpPath += "$";
        route.regexp = new RegExp(regExpPath);
    }

    function getParamValue(paramType, value) {
        switch (paramType) {
            case "integer":
                return parseInt(value);
            case "string":
                return value;
            default:
                return value;
        }

    }

    function validateParam(paramType, value) {
        let regExp = null;
        switch (paramType) {
            case "integer":
                regExp = new RegExp("^(\\d+)$");
                break;
            case "string":
                regExp = new RegExp("^([A-Za-z0-9-._]+)$");
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

        if (typeof route === 'undefined') {
            let page = getPageNameFromUrl(url);
            route = routes.get(page);
        }

        let params = url.match(route.regexp);

        if (params != null) {

            let currentParams = route.params.slice(0);

            for (let i = 1; i <= params.length - 1; i++) {
                let paramValue = params[i];
                let paramType = currentParams[i - 1].type;
                if (validateParam(paramType, paramValue)) {
                    currentParams[i - 1].value = getParamValue(paramType, paramValue);
                }
                else {
                    console.error('Param type is not correct');
                    return false;
                }
            }
            return currentParams;
        }
        return [];
    }


    function matchRegExp(url, regExpObj) {
        let match = url.match(regExpObj);
        return match !== null;
    }

    function addRegExpToPages() {
        routes.forEach(function (element) {
            //element.regexp = buildRegExpFromPagePath(element);
            buildRegExpFromPagePath(element);
            //return element;
        });
    }

    function getPageNameFromUrl(url) {
        let pageName = null;


        routes.forEach(function (value, key) {

            if (matchRegExp(url, value.regexp)) {
                pageName = key;
            }
        });
        return pageName;
    }

    function bindNavigationLinkHandlers() {
        let navigationElements = $$('.element-navigation-link');
        for (let i = 0; i < navigationElements.length; i++) {
            let navigationElement = navigationElements[i];
            bindNavigationLinkHandler(navigationElement);
        }
    }

    function bindNavigationLinkHandler(element) {
        element.removeEventListener('click', handleLinkClick);
        element.addEventListener('click', handleLinkClick);
    }

    function handleLinkClick(e) {
        e.preventDefault();
        let url = e.target.getAttribute('href');
        let pageName = getPageNameFromUrl(url);
        changePage(pageName);
    }

    function pushToHistoryStack(route,params) {
        let currentState = window.history.state;

        let currentUrl = createUrl(route,params);

        let previousUrl = false;


        if (currentState !== null) {
            previousUrl = typeof currentState.activeUrl !== "undefined" && currentState.activeUrl !== null ? currentState.activeUrl : false;
        }

        let pageChanged =  !previousUrl || (previousUrl && previousUrl !== currentUrl);

        if (pageChanged) {
            route.activeUrl = currentUrl;
            window.history.pushState(route, null, currentUrl);
        }
    }

    function init() {
        addRegExpToPages();

        let path = window.location.href;
        let pageName = getPageNameFromUrl(path);
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
    window.onpopstate = function (event) {
        event.preventDefault();
        event.stopPropagation();
        if (typeof event.state.page !== 'undefined') {
            let previousPage = event.state.page;
            changePage(previousPage, false);
        }
    };

    on('router/change/page', function (param) {
        let pageName = null;
        if (param.pageName) {
            pageName = param.pageName;
        }
        else if (param.url) {
            pageName = getPageNameFromUrl(param.url);
        }
        changePage(pageName);
        if (typeof param.callbackEvent !== "undefined") {
            trigger(param.callbackEvent, param);
        }
    });

    on('router/bind-handlers/navigation-links', function () {
        bindNavigationLinkHandlers();
    });

    init();

})();