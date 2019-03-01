const jackpots = (function () {

    on('jackpots/activated', function (params) {
        setTimeout(function () {
            trigger('preloader/hide');
        }, 2000);
        selectTab('jackpot-tab');
        selectInfoContent('jackpot-tab');
    });

})();