let preloader = (function () {

    let preloaderElement = $$('#preloader');

    function showPreloader() {
        preloaderElement.classList.remove('hide');
    }

    function hidePreloader() {
        preloaderElement.classList.add('fade-out');
        setTimeout(function(){
            preloaderElement.classList.add('hide');
        }, 1000);
    }

    on('preloader/show', function () {
        showPreloader();
    });

    on('preloader/hide', function () {
        hidePreloader();
    })

})();