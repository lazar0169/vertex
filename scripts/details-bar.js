const detailsBar = (function () {
    let detailsBar = $$('#details-bar');
    let closeDetailsBar = $$('#machine-close-details-bar');
    let blackArea = $$('#black-area');
    let tabs = $$('.tabs');
    let editCurrentMachine = $$('#edit-current-machine');
    let editMode = $$('#machine-edit-mode');

    let previousTabSelected;
    let previousInfoContSelected;

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
    let editMachine = function () {
        return {
            hide: function () {
                editMode.classList.add('collapse');
            },
            show: function () {
                editMode.classList.remove('collapse');
                details.hide();
            }
        };
    }();

    editCurrentMachine.addEventListener('click', function () {
        editMachine.show();
    });

    window.addEventListener('load', function () {
        setTabListener();
        selectTab('machine-details-tab');
        selectInfoContent('machine-details-tab')
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
                selectInfoContent(tab.id)
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
    //shows content for selected tab
    function selectInfoContent(name) {
        if (previousInfoContSelected) {
            previousInfoContSelected.classList.remove('active-content');
            previousInfoContSelected.classList.add('hidden');

        }
        let infoContSelected = $$(`#${name}-info`);
        if (infoContSelected) {
            infoContSelected.classList.remove('hidden');
            infoContSelected.classList.add('active-content');
            previousInfoContSelected = infoContSelected;
        }
    }
})();