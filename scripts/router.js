let router = (function () {

    let routes = new Map();
    routes.set('casino', {
        page:'casino',
        path: '/casino',
        id: '#page-casino'
    });
    routes.set('jackpot', {
        page:'jackpot',
        path: '/jackpot',
        id: '#page-jackpot',
    });
    routes.set('tickets', {
        page:'tickets',
        path: '/tickets',
        id: '#page-tickets'
    });
    routes.set('AFT', {
        page:'AFT',
        path: '/AFT',
        id: '#page-AFT'
    });
    routes.set('machines', {
        page:'machines',
        path: '/machines',
        id: '#page-machines'
    });
    routes.set('reports', {
        page:'reports',
        path: '/reports',
        id: '#page-reports'
    });
    routes.set('users', {
        path: '/users',
        id: '#page-users',
        page:'users'
    });
    routes.set('service', {
        page:'service',
        path: '/service',
        id: '#page-service'
    });
    routes.set('home', {
        page: 'home',
        path: '/',
        id: '#page-home'
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

    function changePage(pageName) {
        hideActivePage();
        showPage(pageName);
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
        routes.forEach(function (value, key) {
            if (matchRegExp(url, value.regexp)) {
                route = key;
                //ToDo: break foreach loop here if we can
                return false;
            }
        });
        return route;
    }

    //clicking back
    window.onpopstate = function (event) {
        event.preventDefault();
        if (typeof event.state.page !== 'undefined') {
            let previousPage = event.state.page;
            changePage(previousPage);
        }
    };

    function bindNavigationLinkHandlers() {
        let navigationElements = $$('.element-navigation-link');
        for (let i = 0; i < navigationElements.length; i++) {
            let navigationElement = navigationElements[i];
            bindNavigationLinkHandler(navigationElement);
        }
    }

    function bindNavigationLinkHandler(element) {
        element.addEventListener('click', handleLinkClick);
    }

    function handleLinkClick(e) {
        e.preventDefault();
        let url = e.target.getAttribute('href');
        let pageName = getPageNameFromUrl(url);
        changePage(pageName);
        window.history.pushState(routes.get(pageName), null, url);
    }

    function init() {
        window.history.pushState(routes.get("casino"), null, routes.get("casino").path);
        showPage("casino");
        addRegExpToPages();
        bindNavigationLinkHandlers();
    }

    //events
    on('router/change/page', function (param) {
        let route = null;
        if (param.pageName) {
            route = param.pageName;
        }
        else if (param.url) {
            route = getPageNameFromUrl(param.url);
        }
        if (route == null) {
            console.error('that route does not exist');
        }
        else {
            changePage(route);
        }
    });

    on('router/bind-handlers/navigation-links', function() {
        bindNavigationLinkHandlers();
    });

    init();

    //trigger('router/change/page', {pageName: 'casino'});
    //trigger('router/change/page', {url: '/casino'});
    //trigger('router/bind-handlers/navigation-links');
})();