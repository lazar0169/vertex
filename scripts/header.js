const header = (function () {
    let listId = $$('#list-id');
    let headerWrapper = $$('#header-wrapper');


    function addListName(name, casino) {
        listId.dataset.id = `${name}-${casino}`;
        if (name === 'machines') {
            listId.innerHTML = `${name} / ${casino} / ovde / putanja / dalje / sta je sve / izabrano`;
            headerWrapper.classList.add('show-machine');

        }
        else {
            headerWrapper.classList.remove('show-machine');
            listId.innerHTML = `${name} - ${casino}`;
        }
    }

    $$('#welcome').children[0].addEventListener('click', function () {
        if ($$('#welcome').classList.contains('show-logout')) {
            $$('#welcome').classList.remove('show-logout');
        }
        else {
            $$('#welcome').classList.add('show-logout');
        }
    });

    $$('#logout').addEventListener('click', function () {
        $$('#welcome').classList.remove('show-logout');
        $$('#username').innerHTML = '';
        $$('#content').innerHTML = '';
        $$('#header-wrapper').innerHTML = '';
    });

    on('sidebar/chosenList', function (list) {
        addListName(list.list, list.casino);
    });
})();