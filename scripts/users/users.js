const users = (function () {
    let addNewUserButtonWrapper = $$('#users-add-new-user-button');
    let usersNumber = $$('#users-number');
    let addNewUserWrapper = $$('#users-add-new-user');
    trigger('preloader/hide');

    usersNumber.appendChild(dropdown.generate(machinesNumber));

    addNewUserButtonWrapper.children[0].addEventListener('click', function () {
        // alert('otvori formu za dodavanje novog korisnika');
        addNewUserButtonWrapper.children[0].classList.toggle('add-new-user-active');
        addNewUserWrapper.classList.toggle('hidden');

    });
})();