let preloader = (function () {

    let preloaderElement = $$('#preloader');

    function showPreloader() {
        preloaderElement.classList.remove('hide');
        preloaderElement.classList.remove('fade-out');

    }

    function hidePreloader() {
        preloaderElement.classList.remove('fade-in');
        preloaderElement.classList.add('fade-out');
    }

    on('preloader/show', function () {
        showPreloader();
    });

    on('preloader/hide', function () {
        let element = $$('#preloader');
        element.removeEventListener("webkittransitionEnd", onTransitionEnd, false);
        element.removeEventListener("transitionend", onTransitionEnd, false);
        element.removeEventListener("otransitionend", onTransitionEnd, false);
        element.removeEventListener("MSAnimationEnd", onTransitionEnd, false);

        element.addEventListener("webkittransitionEnd", onTransitionEnd, false);
        element.addEventListener("transitionend", onTransitionEnd, false);
        element.addEventListener("otransitionend", onTransitionEnd, false);
        element.addEventListener("MSAnimationEnd", onTransitionEnd, false);
        hidePreloader();
    })

    function init(element) {

    }

    function onTransitionEnd(e) {
        let element = e.target;
        element.classList.add('hide');
        element.removeEventListener("webkittransitionEnd", onTransitionEnd, false);
        element.removeEventListener("transitionend", onTransitionEnd, false);
        element.removeEventListener("otransitionend", onTransitionEnd, false);
        element.removeEventListener("MSAnimationEnd", onTransitionEnd, false);
    }

    init(preloaderElement);

})();