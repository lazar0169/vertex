const userEditProfileModule = (function () {
    let editYourProfile = $$('#user-info-profile-buttons').children[0];
    let logout = $$('#user-info-profile-buttons').children[1];
    let userEditProfile = $$('#user-edit-profile');
    let backUserEditProfile = $$('#user-edit-profile-buttons').children[0];
    let saveUserEditProfile = $$('#user-edit-profile-buttons').children[1];
    let  username = $$('#top-bar-logout-user').innerHTML
   

    $$('#user-info-profile-username').innerHTML = username;
    $$('#user-edit-profile-username').children[1].innerHTML = username;

    editYourProfile.addEventListener('click', function () {
        userEditProfile.classList.remove('hidden');
    });

    logout.addEventListener('click', function () {
        alert('Log out');
        application.checkCurrentUser();
/*        sessionStorage.clear();
        window.location.pathname = "/login";*/
        // trigger('login/logout'); //todo make this trigger work
        trigger('logout');//todo make this trigger work
    });
    backUserEditProfile.addEventListener('click', function () {
        trigger('show/app');
    });
    saveUserEditProfile.addEventListener('click', function () {
        alert('Save changes');
        trigger('show/app');
    });

    on('show/app', function () {
        userEditProfile.classList.add('hidden');
    });
})();