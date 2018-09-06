const detailsBar = (function () {
    let detailsBar = $$('#details-bar');
    let closeDetailsBar = $$('#close-details-bar');
    let blackArea = $$('#black-area');
    let tabs = $$('.tabs');
    // TODO

    let previousTabSelected;

    let details = function () {
        return {
            hide: function () {
                detailsBar.classList.add('collapse');
                blackArea.classList.remove('show');
            },
            show: function () {
                detailsBar.classList.remove('collapse');
                blackArea.classList.add('show');
            }
        };
    }();

    window.addEventListener('load', function () {
        setTabListener();
        selectTab('details-tab');
    });
    closeDetailsBar.addEventListener('click', function () {
        details.hide();
    });



    window.addEventListener('keyup', function (event) {
        if (event.keyCode == 27) {
            details.hide();
        }
    });

    on('show/app', function () {
        details.hide();
    });

    function setTabListener() {
        for (let tab of tabs) {
            tab.addEventListener('click', function () {
                selectTab(tab.id);
            });
        }
    }

    // highlight chosen tab
    function selectTab(name) {
        if (previousTabSelected) {
            previousTabSelected.classList.remove('tab-active');
        }
        let tabSelected = $$(`#${name}`);
        if (tabSelected) {
            tabSelected.classList.add('tab-active');
            previousTabSelected = tabSelected;
        }
    }



})();