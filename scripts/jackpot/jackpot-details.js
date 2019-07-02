const jackpotDetailsBar = (function () {
    let jackpotDetailsBarWrapper = $$('#jackpot-edit-details-wrapper')

    $$('#black-area').addEventListener('click', function () {
        jackpotDetailsBarWrapper.classList.add('collapse');
    });

})();