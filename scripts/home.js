let home = (function () {

    on('home/activated', function () {
        setTimeout(function () {
            trigger('preloader/hide');
        }, 3000);

    });

})();