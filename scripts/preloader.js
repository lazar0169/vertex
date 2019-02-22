let preloader = (function () {
    function showPreloader() {
        let preloaderElement = $$('#preloader');
        preloaderElement.showCount++;
        preloaderElement.classList.remove('hide');
        preloaderElement.classList.remove('fade-out');
    }

    function hidePreloader() {
        let preloaderElement = $$('#preloader');
        preloaderElement.classList.remove('fade-in');
        preloaderElement.classList.add('fade-out');
    }

    on('preloader/show', function () {
        showPreloader();
    });

    on('preloader/hide', function () {
        //let element = $$('#preloader');
        let preloaderElement = $$('#preloader');
        preloaderElement.showCount--;
        if (preloaderElement.showCount <= 0) {
            preloaderElement.showCount = 0;
            preloaderElement.removeEventListener("webkittransitionEnd", onTransitionEnd, false);
            preloaderElement.removeEventListener("transitionend", onTransitionEnd, false);
            preloaderElement.removeEventListener("otransitionend", onTransitionEnd, false);
            preloaderElement.removeEventListener("MSAnimationEnd", onTransitionEnd, false);

            preloaderElement.addEventListener("webkittransitionEnd", onTransitionEnd, false);
            preloaderElement.addEventListener("transitionend", onTransitionEnd, false);
            preloaderElement.addEventListener("otransitionend", onTransitionEnd, false);
            preloaderElement.addEventListener("MSAnimationEnd", onTransitionEnd, false);
            hidePreloader();
        }
    })

    function init() {
        let preloaderElement = $$('#preloader');
        if (preloaderElement !== null) {
        preloaderElement.showCount = 0;
        }
    }

    function onTransitionEnd(e) {
        let element = e.target;
        element.classList.add('hide');
        element.removeEventListener("webkittransitionEnd", onTransitionEnd, false);
        element.removeEventListener("transitionend", onTransitionEnd, false);
        element.removeEventListener("otransitionend", onTransitionEnd, false);
        element.removeEventListener("MSAnimationEnd", onTransitionEnd, false);
    }

    init();

})();