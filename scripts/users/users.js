const users = (function () {
    let addNewUserButton = $$('#users-add-new-user-button');
    let addNewUserWrapper = $$('#users-add-new-user');
    let addNewUserActionButtonsWrapper = $$('#add-new-user-buttons-wrapper');
    setTimeout(function () {
        trigger('preloader/hide');
    }, 2000);

    addNewUserButton.children[0].addEventListener('click', function () {
        addNewUserButton.children[0].classList.add('add-new-user-active');
        addNewUserWrapper.classList.remove('hidden');
    });

    // cancel button
    addNewUserActionButtonsWrapper.children[1].addEventListener('click', function () {
        addNewUserButton.children[0].classList.remove('add-new-user-active');
        addNewUserWrapper.classList.add('hidden');
    });

    trigger('users/generate-role', { role: roleData })
})();