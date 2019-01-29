let topBar = (function () {
    let topBarPath = $$('#top-bar').children[0];
    let logoutUser = $$('#top-bar-logout-user');
    let logoutDropdown = $$('#top-bar-logout-dropdown-menu');
    let userProfile = $$('#user-profile');
    let previousTopBar;

    if (sessionStorage.token) {
        logoutUser.children[0].innerHTML = decodeToken(sessionStorage.token).preferred_username;
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
        // userProfile.classList.toggle('hidden');
    }
    logoutUser.addEventListener('click', function () {
        trigger('opened-arrow', { div: logoutUser });
        $$('#top-bar-logout').classList.toggle('logout-is-opened');
        logoutDropdown.classList.toggle('hidden');
        // showProfile();
    });

    on('show/app', function () {
        userProfile.classList.add('hidden');
    });

    on('topBar/category', function (data) {
        showTopBar(data);
    });

})();