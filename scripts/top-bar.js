let topBar = (function () {
    let topBarPath = $$('#top-bar').children[0];
    let openUserProfile = $$('#top-bar-logout-user');
    let userProfile = $$('#user-profile');
    let previousTopBar;

    if(sessionStorage.token) {
        openUserProfile.innerHTML = decodeToken(sessionStorage.token).preferred_username;
    }
    function showTopBar(value) {
        if (value.category && value.casino) {
            topBarPath.children[1].innerHTML = `${value.category}/${value.casino}`;
        }
        else {
            topBarPath.children[1].innerHTML = `${value.category}`;
        }
        let currentTopBar = $$(`#top-bar-${value.category.toLowerCase()}`);
        if (previousTopBar) {
            previousTopBar.classList.add('hidden');
        }
        if (currentTopBar) {
            currentTopBar.classList.remove('hidden');
            previousTopBar = currentTopBar;
        }
    }
    function showProfile() {
        $$('#black-area').classList.add('show');
        userProfile.classList.toggle('hidden');
    }
    openUserProfile.addEventListener('click', function () {
        showProfile();
    });

    on('show/app', function () {
        userProfile.classList.add('hidden');
    });

    on('topBar/category', function (data) {
        showTopBar(data);
    });

})();