let router = (function () {

    let routes = new Map();
    routes.set('home', {
        page: 'home',
        path: '/',
        id: '#page-home'
    });
    routes.set('casino/edit', {
        page: 'casino/edit',
        path: '/casino/{casinoId:integer}',
        id: '#page-casino-edit'
    });
    routes.set('casino', {
        page: 'casino',
        path: '/casino',
        id: '#page-casino'
    });
    routes.set('jackpot', {
        page: 'jackpot',
        path: '/jackpot',
        id: '#page-jackpot',
    });
    routes.set('tickets', {
        page: 'tickets',
        path: '/tickets',
        id: '#page-tickets'
    });
    routes.set('AFT', {
        page: 'AFT',
        path: '/AFT',
        id: '#page-AFT'
    });
    routes.set('machines', {
        page: 'machines',
        path: '/machines',
        id: '#page-machines'
    });
    routes.set('reports', {
        page: 'reports',
        path: '/reports',
        id: '#page-reports'
    });
    routes.set('users', {
        path: '/users',
        id: '#page-users',
        page: 'users'
    });
    routes.set('service', {
        page: 'service',
        path: '/service',
        id: '#page-service'
    });

    let match,
        paramsCounter = 0,
        params = [
            {
                name: "",
                type: ""
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
            pageName = "home";
        }
        if (typeof addStateToHistory === 'undefined') {
            addStateToHistory = true;
        }
        if (addStateToHistory) {
            pushToHistoryStack(routes.get(pageName));
        }
        hideActivePage();
        showPage(pageName);

        //vraca novo stanje
        //url se promenio nakon show page;
        console.log(window.location);

        return routes.get(pageName);
        //da vrati parametre iz URL-a
    }


    function buildRegExp(path) {
        let regExpPath = path;
        let pattern = /{(.*?)}/gi;

        while (match = pattern.exec(path)) {
            let paramString = match[1],
                [paramName, paramType] = paramString.split(":");

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
        }

        if (pattern.exec(path)) {
            paramsCounter++;
            params.push({
                name: "",
                type: ""
            });
        }

        regExpPath = regExpPath.replace(/\//g, "\\/") + "$";

        let regExpPathObj = new RegExp(regExpPath);
        return regExpPathObj;
    }

    function matchRegExp(url, regExpObj) {
        let match = url.match(regExpObj);
        return match !== null;
    }

    function addRegExpToPages() {
        routes.forEach(function (element) {
            element.regexp = buildRegExp(element.path);
            return element;
        });
    }

    function getPageNameFromUrl(url) {
        let route = null;
        routes.forEach(function (value, key, map) {
            if (matchRegExp(url, value.regexp)) {
                route = key;
            }
        });
        return route;
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
        let path = window.location.href;
        let pageName = getPageNameFromUrl(path);
        let route = routes.get(pageName);
        if (route != null) {
            showPage(route.page);
            pushToHistoryStack(route);
        }
        else {
            console.error('Page not found!');
            let homeRoute = routes.get('home');
            changePage(homeRoute.page);
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