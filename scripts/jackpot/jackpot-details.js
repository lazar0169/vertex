const jackpotDetailsBar = (function () {
    let jackpotDetailsBarWrapper = $$('#jackpot-edit-details-wrapper')

    $$('#black-area').addEventListener('click', function () {
        jackpotDetailsBarWrapper.classList.add('collapse');
        jackpotDetailsBarWrapper.getElementsByClassName('jackpot-details-search-machines')[0].classList.add('hidden');
    });

    //select all checkboxes in jackpot details
    $$('#jackpot-edit-details-conditions-header').children[1].onclick = function () {
        for (let checkbox of $$('#jackpot-edit-details-conditions-checkbox').children) {
            if (!checkbox.classList.contains('not-clickable')) {
                checkboxChangeState.checkboxIsChecked(checkbox.getElementsByClassName('form-checkbox')[0].children[0], true);
            }
        }
    }

    //chosen machine click
    $$('#jackpot-details-chosen-machine').onclick = function (e) {
        e.target.parentNode.children[1].classList.toggle("hidden");
    }

    //delete jackpot
    jackpotDetailsBarWrapper.getElementsByClassName('button-wrapper jackpot-details-buttons-wrapper')[0].children[0].onclick = function () {
        let data = {}
        //todo setuj pravu vrednost endpointa
        data.EndpointId = 5;
        data.Id = jackpotDetailsBarWrapper.settings.Id;
        trigger(communication.events.jackpots.removeJackpot, data);
    }

    jackpotDetailsBarWrapper.getElementsByClassName('button-wrapper jackpot-details-buttons-wrapper')[0].children[1].onclick = function () {
        let data = {}
        //todo setuj pravu vrednost endpointa
        data.EndpointId = 5;
        data.Id = jackpotDetailsBarWrapper.settings.Id;
        data.IgnoreList = [];
        for (let checkbox of $$('#jackpot-edit-details-conditions-checkbox').children) {
            if (!checkbox.classList.contains('not-clickable') && checkboxChangeState.getCheckboxState(checkbox)) {
                data.IgnoreList.push(parseInt(checkbox.dataset.id));

            }
        }
        //todo procitati izabranu masinu iz chooseMachineForAssingJackpot
        data.SelectedMachineId = -1;
        trigger(communication.events.jackpots.setIgnoreRestrictions, data);
    }

})();