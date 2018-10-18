let topBar = (function () {
    let previousTopBar;

    function showTopBar(value) {
        let currentTopBar = $$(`#top-bar-${value.category}`);
        if (previousTopBar) {
            previousTopBar.classList.add('hidden');
        }
        currentTopBar.children[2].innerHTML = `/${value.casino}`;
        currentTopBar.classList.remove('hidden');
        previousTopBar = currentTopBar;
    }

    on('topBar/category', function (data) {
        showTopBar(data);
    });

})();