let preloader = (function () {

    let preloaderElement = $$('#preloader');

    function showPreloader() {
        preloaderElement.classList.remove('hidden');
    }

    function hidePreloader() {
        preloaderElement.classList.add('hidden');
    }

    on('preloader/show', function () {
        alert('preloader show triggered');
        showPreloader();
    });

    on('preloader/hide', function () {
        hidePreloader();
    })

})();