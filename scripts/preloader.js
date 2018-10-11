let preloader = (function () {

    let preloaderElement = $$('#preloader');

    function showPreloader() {
        preloaderElement.classList.remove('hide');
    }

    function hidePreloader() {
        preloaderElement.classList.add('hide');
    }

    on('preloader/show', function () {
        showPreloader();
    });

    on('preloader/hide', function () {
        hidePreloader();
    })

})();