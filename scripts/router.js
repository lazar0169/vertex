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
        var active =  $$('.active'); //TODO dodaj nacin da se handle-uje kad postoji vise elemenata sa klasom 'active'
        if (active.length > 0) {
            return active[0];
        }
        return null;
    }

    function makePageActive(pageName) {
        getPageElementFromName(pageName).classList.add('active');
    }

    function hideActivePage() {
        console.log(getActivePageElement());
        getActivePageElement().classList.remove('active'); //nece ako postoji vise stranica koje su active
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
    on('router/change/page',function() {
        let route = null;
        if (params.pageName) {
            route = getPageElementFromName(params.pageName);
        }
        else if (params.url) {
            route = getPageNameFromUrl(params.url);
        }
        if (route == null) {
            console.error('that route does not exist');
        }
        else {
            changePage(route.name);
        }
    });

    init();

 /*   function bindNavigationLinkClickHandlers(className) {
        //pokupiti sve na osnovu klase
        //napraviti sta se desi kada se klikne
    }

    on('router-bind-navigation-click-handler',function() {
        bindNavigationLinkClickHandlers();
    });

    on('router/change/page',function(data) {
        console.log('4', data.page);
        changePage(data.page);
    });

    trigger('router-change-page',{page:'page-machines'});*/

})();













/*
const routesEnum = { "casino": "page-casino"};


function bindNavigationLinkClickHandlers() {
    //pokupis sve na osnovu klase
    //napravis sta se desi kad kliknes
}

on('router-bind-navigation-click-handler',function() {
    bindNavigationLinkClickHandlers();
});

function changePage(activePage,params) {

}
*/

/*window.addEventListener('popstate', function(e){console.log('url changed')});
console.log("ulazi u funkciju");
*/

/*checkURLchange();

window.onhashchange = funcRef;

window.onhashchange = function () {alert("nesto"); console.log("nesto isto");};*/

/*
    window.addEventListener("beforeunload", function (event) {
        // Most browsers.
        event.preventDefault();

        // Chrome/Chromium based browsers still need this one.
        event.returnValue = "\o/";
        console.log(event, location);
        alert(window.location);

    });
*/



//object literal that contains page-name: id pairs
/*    const pages = {
        casino: {
            path: '/casino',
            id: '#page-casino'
        },
        jackpot: {
            path: '/jackpot',
            id: '#page-jackpot'
        },
        tickets: {
            path: '/tickets',
            id: '#page-tickets'
        },
        AFT: {
            path: '/AFT',
            id: '#page-AFT'
        },
        machines: {
            path: '/machines',
            id: '#page-machines'
        },
        reports: {
            path: '/reports',
            id: '#page-reports'
        },
        users: {
            path: '/users',
            id: '#page-users'
        },
        service: {
            path: '/service',
            id: '#page-service'
        }
    };*/




/*    function getKeyByValue(object, val) {
        console.log('object', object);
        console.log('val', val);
        object.forEach(function(value, key, map) {
            console.log('map', map);
            console.log('value', value);
            console.log('val', val);
            console.log('key', key);
            console.log('map.value', map[);
            console.log('value.val', value.val);
            console.log('map[key].val', map[key]);
            if (map[key].val){
                console.log('MATCH', key);
                return key;
            }
        });
    }*/


/*
    //ToDo: ovo se ne koristi
    let pages = [
        {
            name: 'casino',
            path: '/casino',
            id: '#page-casino'
        },
        {
            name: 'jackpot',
            path: '/jackpot',
            id: '#page-jackpot'
        },
        {
            name: 'tickets',
            path: '/tickets',
            id: '#page-tickets'
        },
        {
            name: 'AFT',
            path: '/AFT',
            id: '#page-AFT'
        },
        {
            name: 'machines',
            path: '/machines',
            id: '#page-machines'
        },
        {
            name: 'reports',
            path: '/reports',
            id: '#page-reports'
        },
        {
            name: 'users',
            path: '/users',
            id: '#page-users'
        },
        {
            name: 'service',
            path: '/service',
            id: '#page-service'
        },
        {
            name: 'home',
            path: '/',
            id: '#page-home'
        }
    ];*/


/*
function getKeyByValue(routes, value) {
    let key = routes.keys(routes).find(key => routes[key] === value);
    console.log(key);
    return key;

    function isMatch(val, key, routes) {
        if (routes[key].value == val) {
            return key;
        }
    }

    routes.foreach(isMatch(value, key, routes));
}
*/