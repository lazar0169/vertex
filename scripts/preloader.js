let preloader = (function () {

    let preloaderElement = $$('#preloader');

    function showPreloader() {
        preloaderElement.classList.remove('hidden');
        $$('#sidebar').classList.add('hidden');
        $$('#navigaion-sidebar').classList.add('hidden');
        $$('#tooltip-text').classList.add('hidden');
        $$('#main-content').classList.add('hidden');
        $$('#black-area').classList.add('hidden');
    }

    function hidePreloader() {
        preloaderElement.classList.add('hidden');
        $$('#sidebar').classList.remove('hidden');
        $$('#navigaion-sidebar').classList.remove('hidden');
        $$('#tooltip-text').classList.remove('hidden');
        $$('#main-content').classList.remove('hidden');
        $$('#black-area').classList.remove('hidden');
    }

    on('preloader/show', function () {
        alert('preloader show');
        showPreloader();
    });

    on('preloader/hide', function () {
        hidePreloader();
    })

})();