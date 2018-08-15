const mainContent = (function () {
    let mainWrapper = $$('#main-content');

    function collapseMain(data) {
        if (data) {
            mainWrapper.classList.remove('expand');
        }
        else {
            mainWrapper.classList.add('expand');
        }
    }

    on('sidebar/collapse', function (data) {
        collapseMain(data.data);
    });

})();