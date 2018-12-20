const malfunctions = (function () {
    let addMalfunctionMsg = $$('#malfunctions-add-message');

    let malfunctionsMachinesNumbers = $$('#malfunctions-number')
    trigger('preloader/hide');

    malfunctionsMachinesNumbers.appendChild(dropdown.generate(machinesNumber));

    addMalfunctionMsg.children[0].addEventListener('keyup', function () {
        if (addMalfunctionMsg.children[0].value) {
            addMalfunctionMsg.children[1].classList.remove('hidden')
        }
        else {
            addMalfunctionMsg.children[1].classList.add('hidden')
        }
    });
    addMalfunctionMsg.children[1].addEventListener('click', function () {
        addMalfunctionMsg.children[0].value = "";
        addMalfunctionMsg.children[1].classList.add('hidden');
    });




})();