const sidebar = (function () {
    let arrayList = Object.keys(data);
    let menu = $$('#sidebar');
    let linkWrapper = $$('#sidebar-link');
    let listMenu = $$('.list-management');
    let expandButton = $$('#icon-expand');
    let navigation = $$('#sidebar-local');
    let back = $$('#back-button');
    let chosenLink = $$('#chosen-link');
    let listWrapper = $$('#navigation-content');
    let linkList = $$('.link-list');
    let globalSearch = $$('#global-search');
    let globalList = $$('.lists');
    // variable to check sidebar, if isExpand = true sidebar is max size, else sidebar is collapsed
    let isExpand = true;
    window.addEventListener('load', () => {
        generateMenu();
    });
    expandButton.addEventListener('click', () => {
        expand();
    });
    back.addEventListener('click', () => {
        navigation.classList.add('hide');
        navigation.classList.remove('expand');
    });
    globalSearch.addEventListener('click', () => {
        chosenLink.innerHTML = 'Search';
        generateLink();
        navigation.classList.add('expand');
        navigation.classList.remove('hide');
    });
    function generateMenu() {
        let fragment = document.createDocumentFragment();
        for (let count in arrayList) {
            let tempFragment = document.createElement('div');
            tempFragment.innerHTML = `<div class="list-management" data-id="${arrayList[count]}"><span class="mdi mdi-magnify"></span><div class="list-name">${arrayList[count]}</div></div>`;
            tempFragment.childNodes[0].addEventListener('click', function () {
                alert(listMenu[count].dataset.id);
                chosenLink.dataset.id = listMenu[count].dataset.id;
                chosenLink.innerHTML = listMenu[count].textContent;
                generateLink(listMenu[count].dataset.id);
                navigation.classList.add('expand');
                navigation.classList.remove('hide');
            });
            fragment.appendChild(tempFragment.childNodes[0]);
        }
        linkWrapper.appendChild(fragment);
    }
    function expand() {
        if (isExpand) {
            menu.classList.add('expand');
        }
        else {
            menu.classList.remove('expand');
        }
        isExpand = !isExpand;
    }
    function generateLink(id) {
        listWrapper.innerHTML = '';
        let fragment = document.createDocumentFragment();
        if (id) {
            for (let count in data[id]) {
                let tempFragment = document.createElement('a');
                tempFragment.innerHTML = `<a class="link-list" data-id="${data[id][count].id}">${data[id][count].name}</a>`;
                tempFragment.childNodes[0].addEventListener('click', function () {
                    alert(`ja imam id = ${linkList[count].dataset.id}, i trebam prikazati tabelu za ${linkList[count].textContent} i da vratim menu`);
                    navigation.classList.add('hide');
                    navigation.classList.remove('expand');
                });
                fragment.appendChild(tempFragment.childNodes[0]);
            }
            listWrapper.appendChild(fragment);
        }
        else {
            for (let list of arrayList) {
                let tempFragment = document.createElement('div');
                tempFragment.innerHTML = `<div class="lists" data-id=${list}><h3>${list}</h3></div>`;
                fragment.appendChild(tempFragment.childNodes[0]);
            }
            listWrapper.appendChild(fragment);
            for (let list in arrayList) {
                for (let count of data[arrayList[list]]) {
                    let tempFragment = document.createElement('a');
                    tempFragment.innerHTML += `<a class="link-list" data-id="${count.id}">${count.name}</a>`;
                    tempFragment.childNodes[0].addEventListener('click', function () {
                        alert(`ja imam id = ${linkList[list].dataset.id}, i trebam prikazati tabelu za ${linkList[list].textContent} i da vratim menu`);
                        navigation.classList.add('hide');
                        navigation.classList.remove('expand');
                    });
                    fragment.appendChild(tempFragment.childNodes[0]);
                }
                globalList[list].appendChild(fragment);
            }
        }
    }
})();