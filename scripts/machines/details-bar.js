const detailsBar = (function () {
    let detailsBar = $$('#details-bar');
    let closeDetailsBar = $$('#machine-close-details-bar');
    let blackArea = $$('#black-area');
    let editCurrentMachine = $$('#edit-current-machine');
    let editMode = $$('#machine-edit-mode');

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

   
   
})();