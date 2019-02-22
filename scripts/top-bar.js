let topBar = (function () {
    let topBarPath = $$('#top-bar-path');
    let userProfile = $$('#user-profile');
    let previousTopBar;
    let previousIcon;

    if (sessionStorage.token) {
        $$('#top-bar-logout-user').children[0].innerHTML = decodeToken(sessionStorage.token).preferred_username;
    }
    function showTopBar(value) {
        if (value.category && value.casino) {
            topBarPath.children[1].innerHTML = `${value.category}/${value.casino}`;
        }
        else {
            topBarPath.children[1].innerHTML = `${value.category}`;
        }

        let currenIcon = value.icon;
        if (previousIcon) {
            topBarPath.children[0].classList.remove(previousIcon)

        }
        if (currenIcon) {
            topBarPath.children[0].classList.add(currenIcon);
            previousIcon = currenIcon;
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

    on('show/app', function () {
        userProfile.classList.add('hidden');
    });

    on('topBar/category', function (data) {
        showTopBar(data);
    });

})();