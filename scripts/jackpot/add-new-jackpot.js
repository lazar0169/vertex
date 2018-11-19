const addNewJackpot = (function () {
    let addNewJackpotControlSettings = $$('.add-new-jackpot-control-settings-info');
    let removeAllMachines = $$('#add-new-jackpot-choose-machines-buttons').children[1];
    let saveNewJackpot = $$("#add-new-jackpot-content-buttons-wrapper").children[0].children[1];
    let clearAllFields = $$("#add-new-jackpot-content-buttons-wrapper").children[0].children[0];

    saveNewJackpot.addEventListener('click', function () {
        alert('Save new Jackpot');
    });

    clearAllFields.addEventListener('click', function () {
        alert('Set all fields to initial value');
    });

    window.addEventListener('load', function () {
        for (let control of addNewJackpotControlSettings) {
            control.addEventListener('click', function () {
                control.parentNode.parentNode.children[1].classList.toggle('hidden');
            });
        }
    });
    removeAllMachines.addEventListener('click', function () {
        alert('Remove all machines');
    })
})();