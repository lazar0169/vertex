let preloader = (function () {
    let preloaderElement = $$('#preloader');

    function showPreloader() {
        preloaderElement.classList.remove('hide');
        preloaderElement.classList.remove('fade-out');
        preloaderElement.classList.add('fade-in');
    }

    function hidePreloader() {
        preloaderElement.classList.add('fade-out');
        preloaderElement.classList.add('hide');
        preloaderElement.classList.remove('fade-in');

    }

    on('preloader/show', function () {
        showPreloader();
    });

    on('preloader/hide', function () {
        //let element = $$('#preloader');
        // preloaderElement.removeEventListener("webkittransitionEnd", onTransitionEnd, false);
        // preloaderElement.removeEventListener("transitionend", onTransitionEnd, false);
        // preloaderElement.removeEventListener("otransitionend", onTransitionEnd, false);
        // preloaderElement.removeEventListener("MSAnimationEnd", onTransitionEnd, false);

        // preloaderElement.addEventListener("webkittransitionEnd", onTransitionEnd, false);
        // preloaderElement.addEventListener("transitionend", onTransitionEnd, false);
        // preloaderElement.addEventListener("otransitionend", onTransitionEnd, false);
        // preloaderElement.addEventListener("MSAnimationEnd", onTransitionEnd, false);
        hidePreloader();

    })
    function onTransitionEnd(e) {
        let element = e.target;
        element.classList.add('hide');
        element.removeEventListener("webkittransitionEnd", onTransitionEnd, false);
        element.removeEventListener("transitionend", onTransitionEnd, false);
        element.removeEventListener("otransitionend", onTransitionEnd, false);
        element.removeEventListener("MSAnimationEnd", onTransitionEnd, false);
    }



})();