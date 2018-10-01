let preloader = (function () {

    let preloader = $$('.preloader')[0];

    function showPreloader() {
        preloader.classList.remove('hidden');
    }

    function hidePreloader() {
        preloader.classList.add('hidden');
    }

    on('preloader/show', function () {
        showPreloader();
    });

    on('preloader/hide', function () {
        hidePreloader();
    })

})();