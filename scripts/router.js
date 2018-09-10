let router = (function(){

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
    ];

    let match,
        paramsCounter = 0,
        params = [
            {
                name: "",
                type: ""
            }
        ];

    function makePageActive(pageName) {
        console.log('makePageActive ime stranice koje smo dobili: ',pageName);
        let pageElement;
        for (let i = 0; i < pages.length; i++) {
            // console.log('i', i);
            // console.log(pages[i]);
            // console.log(pages[i].name);
            if (pages[i].name === pageName) {
                console.log('nasli smo isto ime u nasim stranicama');
                console.log('id za tu stranicu: ',pages[i].id);
                console.log('stranica element: ', $$(pages[i].id));
                pageElement = $$(pages[i].id);
                pageElement.classList.add('active');
                console.log('aktivan element', pageElement);
            }
        }
    }

    function hideActivePage(activePageName) {
        for (let i = 0; i < pages.length; i++) {
            if (pages[i].name === activePageName) {
                $$(pages[i].id).classList.remove('active');
            }
        }
    }

    function showPage(pageName) {
        makePageActive(pageName);
    }

    function changePage(currentPageName, nextPageName) {
        hideActivePage(currentPageName);
        showPage(nextPageName);
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


    //function that checks if url is a regular expression
    function isMatchingRoute(url, regExpObj) {
        let match = url.match(regExpObj);
        return match !== null;
    };


    function addRegExpToPages() {
        pages.map(function(current) {
            current.regexp = buildRegExp(current.path);
            return current;
        });
    }


    function getPageNameFromUrl(url) {
        addRegExpToPages();
        let pageName;
        // console.log('url', url);
        let routeExists, isRoute;
        for (let i = 0; i < pages.length; i++) {
            // console.log([i]+' pages', pages);
            // console.log('pages length', pages.length);
            // console.log('pages['+[i]+']', pages[i]);
            if (isMatchingRoute(url, pages[i].regexp)) {
                isRoute = true;
                pageName = pages[i].name;
                routeExists = true;
                // console.log('page name', pageName);
                return pageName;
            }
        }
        return pageName;
        // console.log('page name after for loop', pageName);
        if (!isRoute) {
            alert("Error! Ruta se ne poklapa sa regularnim izrazom.");
        }
        else if (!routeExists) {
            alert("Error! Ruta ne postoji.");
        }
    }

    // console.log('window url', window.location.href);

    showPage(getPageNameFromUrl(window.location.href));
    // showPage('casino');

    // changePage(getPageNameFromUrl(window.location.href));
    // changePage('casino', 'jackpot');


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
on('router-change-page',function() {
    changePage(activePage,params);
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