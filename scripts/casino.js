let casino = (function () {

    on('casino/activated', function () {
        setTimeout(function () {
            trigger('preloader/hide');
        }, 2000);
    });

    on('casino/add', function (e) {
        let model = e.model;
        trigger('template/render', {
            model: model,
            templateElementSelector: "#casino-template",
            callbackEvent: 'casino/load'
        });
    });

    on('casino/load', function (e) {
        let element = e.element;
        //Multiple ways to place HTML element inside HTML document:
        //$$('.casino-list')[0].innerHTML = element.innerHTML;
        $$('.casino-list')[0].appendChild(element);
    });

    on('casino/display-casino-info/', function (e) {

    });

    on('casino/display-casino-info/error', function (e) {
        data = e.data;
        alert('An error occured.');
    });

})();