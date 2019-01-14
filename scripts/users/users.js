const users = (function () {
    let addNewUserButtonWrapper = $$('#users-add-new-user-button');
    let usersNumber = $$('#users-number');
    let addNewUserWrapper = $$('#users-add-new-user');
    let addNewUserButtonsWrapper = $$('#add-new-user-buttons-wrapper');
    trigger('preloader/hide');

    usersNumber.appendChild(dropdown.generate(machinesNumber));

    addNewUserButtonWrapper.children[0].addEventListener('click', function () {
        // alert('otvori formu za dodavanje novog korisnika');
        addNewUserButtonWrapper.children[0].classList.add('add-new-user-active');
        addNewUserWrapper.classList.remove('hidden');

    });

    // cancel button
    addNewUserButtonsWrapper.children[1].addEventListener('click', function () {
        addNewUserButtonWrapper.children[0].classList.remove('add-new-user-active');
        addNewUserWrapper.classList.add('hidden');
    });

    trigger('users/generate-role', { role: roleData })
})();