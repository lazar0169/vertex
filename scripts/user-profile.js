const userEditProfileModule = (function () {
    let editYourProfile = $$('#user-info-profile-buttons').children[0];
    let logout = $$('#user-info-profile-buttons').children[1];
    let userEditProfile = $$('#user-edit-profile');
    let backUserEditProfile = $$('#user-edit-profile-buttons').children[0];
    let saveUserEditProfile = $$('#user-edit-profile-buttons').children[1];

    editYourProfile.addEventListener('click', function () {
        userEditProfile.classList.remove('hidden');
    });

    logout.addEventListener('click', function () {
        alert('Log out');
    });
    backUserEditProfile.addEventListener('click', function () {
        trigger('show/app');
    });
    saveUserEditProfile.addEventListener('click', function(){
        alert('Save changes');
        trigger('show/app');
    });

    on('show/app', function () {
        userEditProfile.classList.add('hidden');
    });
})();