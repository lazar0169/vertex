const userEditProfileModule = (function () {
    let editYourProfile = $$('#top-bar-edit-and-logout-user').children[0];
    let logout = $$('#top-bar-edit-and-logout-user').children[1];
    let userEditProfile = $$('#user-profile');
    let backUserEditProfile = $$('#user-edit-profile-buttons').children[0];
    let saveUserEditProfile = $$('#user-edit-profile-buttons').children[1];






    editYourProfile.addEventListener('click', function () {
        userEditProfile.classList.remove('hidden');
    });

    logout.addEventListener('click', function () {
        // application.checkCurrentUser();
        trigger('logout');//todo make this trigger work
    });
    backUserEditProfile.addEventListener('click', function () {
        trigger('show/app');
    });
    saveUserEditProfile.addEventListener('click', function () {
        //alert('Save changes');
        saveUserEditProfile.classList.add('loading');
        setTimeout(function () {
            saveUserEditProfile.classList.remove('loading');
        }, 4000);


        //trigger('show/app');
    });

    on('show/app', function () {
        userEditProfile.classList.add('hidden');
    });
})();