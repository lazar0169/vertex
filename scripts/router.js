let router = (function () {

    let routes = new Map();
    routes.set('home', {
        page: 'home',
        id: '#page-home',
        path: '/'
    });
    routes.set('casino/edit', {
        page: 'casino/edit',
        id: '#page-casino-edit',
        path: '/casino/edit/{casinoId:integer}'
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

    let paramsCounter = -1,
        params = [
            {
                name: '',
                type: '',
                regexp: '',
                value: ''
            }
        ];

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
        getElementFromPageName(pageName).classList.add('active');
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
        if (addStateToHistory) {
            pushToHistoryStack(routes.get(pageName));
        }
        hideActivePage();
        showPage(pageName);

        let currentUrl = window.location.href;

        console.log('window location current href', currentUrl);
        console.log('params', params);
        let paramValue = getParamsFromUrl(currentUrl);
        return paramValue;
    }

    function buildRegExpFromPagePath(path) {
        let regExpPath = path,
            pattern = /{(.*?)}/gi, //bilo sta izmedju {} zagrada
            paramStringMatch = pattern.exec(regExpPath);
        if (paramStringMatch) {
            paramsCounter++;
            let [paramName, paramType] = paramStringMatch[1].split(":");
            params[paramsCounter].name = paramName;
            params[paramsCounter].type = paramType;
            let regExpPart;
            switch (paramType) {
                case "integer":
                    regExpPart = "(\\d+)";
                    break;
                case "string":
                    regExpPart = "([A-Za-z0-9-._]+)";
            }
            let stringToReplaceInOriginalPath = "{" + paramName + ":" + paramType + "}";
            regExpPath = regExpPath.replace(stringToReplaceInOriginalPath, regExpPart);
            params[paramsCounter].regexp = regExpPath;
            params.push({
                name: '',
                type: '',
                regexp: '',
                value: ''
            });
        }
        regExpPath = regExpPath.replace(/\//g, "\\/") + "$";
        let regExpPathObj = new RegExp(regExpPath);
        return regExpPathObj;
    }


    function getParamsFromUrl(url) {
        let value;
        for (let i = 0; i < params.length; i++) {
            if (url.match(params[i].regexp)) {
                params[i].value = 'cao';
                value = 'cao';
            }
        }
        routes.forEach(function (element) {
            for (let k = 0; k < params.length; k++) {
                if (element.regexp === params[k].regexp) {
                    element.params = params[k];
                }
            }
            return element;
        });
        console.log(routes);
        console.log(value);
        return value;
    }


    function matchRegExp(url, regExpObj) {
        let match = url.match(regExpObj);
        return match !== null;
    }

    function addRegExpToPages() {
        routes.forEach(function (element) {
            element.regexp = buildRegExpFromPagePath(element.path);
            return element;
        });
    }

/*    function getParamValue(currentUrl) {
        console.log('usli smo u get param value');
        let pageName = getPageNameFromUrl(currentUrl);
        console.log('page name get param value', pageName);
        let pageNameRegexp = routes.get(pageName).regexp;
        console.log('pageNameRegexp', pageNameRegexp);
        // console.log('regExpUrl u get param value', regExpUrl);
        for (let i = 0; i < params.length; i++) {
            if (pageNameRegexp === params[i].regexp) {
                console.log('ovde treba da izvucemo parametar');
            }
        }
    }*/

    function getPageNameFromUrl(url) {
        let pageName = null;
        routes.forEach(function (value, key, map) {
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

    function pushToHistoryStack(route) {
        let currentState = window.history.state;
        if (currentState == null || currentState.page !== route.page) {
            window.history.pushState(route, null, route.path);
        }
    }

    function init() {
        addRegExpToPages();
        console.log('routes pri initu: ', routes);
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
            trigger(param.callbackEvent,param);
        }
    });

    on('router/bind-handlers/navigation-links', function () {
        bindNavigationLinkHandlers();
    });

    init();

})();