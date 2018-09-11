let router = (function(){

    let routes = new Map();
    routes.set('casino', {
        path: '/casino',
        id: '#page-casino'
        });
    routes.set('jackpot', {
        path: '/jackpot',
        id: '#page-jackpot'
    });
    routes.set('tickets', {
        path: '/tickets',
        id: '#page-tickets'
    });
    routes.set('AFT', {
        path: '/AFT',
        id: '#page-AFT'
    });
    routes.set('machines',{
        path: '/machines',
        id: '#page-machines'
    });
    routes.set('reports',{
        path: '/reports',
        id: '#page-reports'
    });
    routes.set('users',{
        path: '/users',
        id: '#page-users'
    });
    routes.set('service',{
        path: '/service',
        id: '#page-service'
    });
    routes.set('home',{
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

    function getPageElementFromName(pageName) {
        return $$(routes.get(pageName).id);
    }

    function getActivePageElement() {
        let active =  $$('.active');
        if (active.length > 0) {
            return active[0];
        }
        return null;
    }

    function makePageActive(pageName) {
        getPageElementFromName(pageName).classList.add('active');
    }

    function hideActivePage() {
        getActivePageElement().classList.remove('active');
    }

    function showPage(pageName) {
        makePageActive(pageName);
    }

    function changePage(pageName) {
        hideActivePage();
        showPage(pageName);
    }

    //function that takes string and makes a RegExp object
    function buildRegExp(path) {
        let regExPath = path;
        let pattern = /{(.*?)}/gi;

        while (match = pattern.exec(path)) {
            let paramString = match[1],
                [paramName, paramType] = paramString.split(":");

            params[paramsCounter].name = paramName;
            params[paramsCounter].type = paramType;

            let regExPart;
            switch (paramType) {
                case "integer":
                    regExPart = "(\\d+)";
                    break;
                case "string":
                    regExPart = "([A-Za-z0-9-._]+)";
            }

            let stringToReplaceInOriginalPath = "{" + paramName + ":" + paramType + "}";
            regExPath = regExPath.replace(stringToReplaceInOriginalPath, regExPart);
        }

        if (pattern.exec(path)) {
            paramsCounter++;
            params.push({
                name: "",
                type: ""
            });
        }

        regExPath = regExPath.replace(/\//g, "\\/") + "$";

        let regExPathObj = new RegExp(regExPath);
        return regExPathObj;
    }

    //function that checks if string matches give RegExp object
    function matchRegExp(url, regExpObj) {
        let match = url.match(regExpObj);
        return match !== null;
    }

    //function that adds regular expressions to all of the pages
    function addRegExpToPages() {
        routes.forEach(function(current) {
            current.regexp = buildRegExp(current.path);
            return current;
        });
    }

    //gets page name from url and checks if it is valid regexp
    function getPageNameFromUrl(url) {
        let route = null;
        routes.forEach(function(value, key, map) {
           if (matchRegExp(url, value.regexp)){
               route =  key;
               //ToDo: break foreach loop here if we can
               return false;
           }
        });
        return route;
    }

    function init() {
        addRegExpToPages();
        getPageNameFromUrl('/jackpot');
        showPage('jackpot');
        changePage('casino');
    }

    //events
    on('router/change/page', function(param) {
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

    init();

/*   function bindNavigationLinkClickHandlers(className) {
        //pokupiti sve na osnovu klase
        //napraviti sta se desi kada se klikne
    }

    on('router-bind-navigation-click-handler',function() {
        bindNavigationLinkClickHandlers();
    });*/

    trigger('router/change/page', {pageName: "casino"});
    trigger('router/change/page', {url: "/casino"});

})();