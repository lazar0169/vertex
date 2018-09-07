let router = (function(){

    function getElement(elementName) {
        let element = document.getElementById(elementName);
        return element;
    }

    function makePageActive(pageName) {
        let pageElement = getElement(pageName);
        pageElement.classList.add('active');
    }

    function hideActivePage(activePageName) {
        let activeElement = getElement(activePageName);
        activeElement.classList.remove('active');
    }

    function showPage(pageName) {
        makePageActive(pageName);
    }

    function changePage(currentPageName, nextPageName) {
        hideActivePage(currentPageName);
        showPage(nextPageName);
    }

    showPage('page-machines');

    changePage('page-machines', 'page-jackpot');

    function bindNavigationLinkClickHandlers(className) {
        //pokupiti sve na osnovu klase
        //napraviti sta se desi kada se klikne
    }

    on('router-bind-navigation-click-handler',function() {
        bindNavigationLinkClickHandlers();
    });

    on('router-change-page',function(e) {
        var params = e.params();
        changePage(e.page);
        changePage('page-machines');
    });

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