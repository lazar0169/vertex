const sidebar = (function () {
    let arrayList = Object.keys(data);
    let menu = $$('#sidebar');
    let sidebarHeader = $$('#sidebar-name');
    let linkWrapper = $$('#sidebar-link');
    let listMenu = $$('.list-management');
    let expandButton = $$('#icon-expand');
    let navigation = $$('#sidebar-navigation');
    let back = $$('#back-button');
    let chosenLink = $$('#chosen-link');
    let listWrapper = $$('#navigation-content');
    let linkList = $$('.link-list');
    let globalSearch = $$('#icon-search');
    let globalList = $$('.lists');
    let logoWrapper = $$('#sidebar-logo');
    let listName = $$('.list-name');
    let teamName = $$('#team-name');
    let appName = $$('#head-name');

    // variable to check sidebar, if isExpand = true sidebar is max size, else sidebar is collapsed
    let isExpand = true;

    window.addEventListener('load', () => {
        makeMenu();
    });
    expandButton.addEventListener('click', () => {
        expand();
    });

    back.addEventListener('click', () => {
        navigation.classList.remove('expand');
        navigation.classList.add('hide');


    });

    globalSearch.addEventListener('click', () => {
        chosenLink.innerHTML = 'Search';
        makeLinks();
        navigation.classList.add('expand');
        navigation.classList.remove('hide');

    });

    function makeMenu() {
        for (let count of arrayList) {
            linkWrapper.innerHTML += `<div class="list-management" data-id="${count}"><span class="mdi mdi-magnify"></span><div class="list-name">${count}</div></div>`;
        }
        for (let list of listMenu) {
            list.addEventListener('click', () => {
                chosenLink.dataset.id = list.dataset.id;
                chosenLink.innerHTML = list.textContent;
                makeLinks(list.dataset.id);
                navigation.classList.add('expand');
                navigation.classList.remove('hide');
            });
        }
    }
    function expand() {
        if (isExpand) {
            menu.classList.add('expand');
            sidebarHeader.classList.add('expand');
            logoWrapper.classList.add('expand');
            teamName.classList.add('expand');
            appName.classList.add('expand');
            globalSearch.classList.add('expand');
            expandButton.classList.add('expand');
            for (let list of listName) {
                list.classList.add('hide');
            }
            for (let list of listMenu) {
                list.classList.add('center');
            }
            isExpand = false;
        }
        else {
            menu.classList.remove('expand');
            sidebarHeader.classList.remove('expand');
            logoWrapper.classList.remove('expand');
            teamName.classList.remove('expand');
            appName.classList.remove('expand');
            globalSearch.classList.remove('expand');
            expandButton.classList.remove('expand');
            for (let list of listName) {
                list.classList.remove('hide');
            }
            for (let list of listMenu) {
                list.classList.remove('center');
            }
            isExpand = true;
        }

    }

    function makeLinks(id) {
        listWrapper.innerHTML = '';
        if (id) {
            for (let count of data[id]) {
                listWrapper.innerHTML += `<a class="link-list" data-id="${count.id}">${count.name}</a>`;
            }

        }
        else {
            for (let list of arrayList) {
                listWrapper.innerHTML += `<div class="lists" data-id=${list}><h3>${list}</h3></div>`;
            }
            for (let list in arrayList) {
                for (let count of data[arrayList[list]]) {
                    globalList[list].innerHTML += `<a class="link-list" data-id="${count.id}">${count.name}</a>`;
                }
            }
        }
        for (let link of linkList) {
            link.addEventListener('click', () => {
                alert(`ja imam id = ${link.dataset.id}, i trebam prikazati tabelu za ${link.textContent} i da vratim menu`);
                navigation.classList.remove('expand');
                navigation.classList.add('hide');
            });
        }
    }

})();
