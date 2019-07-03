const jackpotDetailsBar = (function () {
    let jackpotDetailsBarWrapper = $$('#jackpot-edit-details-wrapper')

    $$('#black-area').addEventListener('click', function () {
        jackpotDetailsBarWrapper.classList.add('collapse');
    });

    //select all checkboxes in jackpot details
    $$('#jackpot-edit-details-conditions-header').children[1].onclick = function () {
        for (let checkbox of $$('#jackpot-edit-details-conditions-checkbox').children) {
            if (!checkbox.classList.contains('not-clickable')) {
                checkboxChangeState.checkboxIsChecked(checkbox.getElementsByClassName('form-checkbox')[0].children[0], true);
            }
        }
    }

})();