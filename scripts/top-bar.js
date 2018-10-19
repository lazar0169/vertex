let topBar = (function () {
    let topBarPath = $$("#top-bar").children[0];
    let openUserProfile = $$("#top-bar-logout-user");
    let userProfile = $$('#user-info-profile');
    let previousTopBar;

    function showTopBar(value) {
        topBarPath.children[1].innerHTML = `${value.category}/${value.casino}`;
        let currentTopBar = $$(`#top-bar-${value.category}`);
        if (previousTopBar) {
            previousTopBar.classList.add('hidden');
        }
        currentTopBar.classList.remove('hidden');
        previousTopBar = currentTopBar;
    }
    function showProfile() {
        $$('#black-area').classList.add('show');
        userProfile.classList.remove('collapse');
    }

    openUserProfile.addEventListener('click', function () {
        showProfile();
    });




    on('show/app', function () {
        userProfile.classList.add('collapse');
    });





    on('topBar/category', function (data) {
        showTopBar(data);
    });

})();