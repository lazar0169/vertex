const users = (function () {

    on('users/activated', function (params) {
       

    });
    let addNewUserButton = $$('#users-add-new-user-button');
    let addNewUserWrapper = $$('#users-add-new-user');
    let addNewUserActionButtonsWrapper = $$('#add-new-user-buttons-wrapper');
    

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