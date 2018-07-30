const sidebar = (function () {
    let arrayList = Object.keys(data);
    let menu = $$('#sidebar');
    let linkWrapper = $$('#sidebar-link');
    let listMenu = $$('.list-management');
    let collapseButton = $$('#icon-collapse');
    let navigation = $$('#sidebar-local');
    let back = $$('#back-to-menu');
    let chosenLink = $$('#chosen-link');
    let listWrapper = $$('#navigation-content');
    let linkList = $$('.link-list');
    let globalSearch = $$('#global-search');
    let globalList = $$('.lists');
    let listSelected = $$('.list-active');
    let linkSelected = $$('.link-active');
    // variable to check sidebar, if isExpand = true sidebar is max size, else sidebar is collapsed, isExpandNav is like iscollapse
    let isExpand = true;
    let isExpandNav = true;
    window.addEventListener('load', () => {
        generateMenu();
    });
    collapseButton.addEventListener('click', () => {
        collapse('sidebar');
    });
    back.addEventListener('click', () => {
        collapse();
    });
    globalSearch.addEventListener('click', () => {
        chosenLink.innerHTML = 'Search';
        generateLink();
        collapse();
    });
    function generateMenu() {
        let fragment = document.createDocumentFragment();
        for (let count in arrayList) {
            let tempFragment = document.createElement('div');
            tempFragment.innerHTML = `<div class="list-management tooltip" data-id="${arrayList[count]}">
                <span class="mdi mdi-magnify icon-tooltip"></span>
                <div class="list-name">${arrayList[count]}</div>
                <span class="tooltip-text">${arrayList[count]}</span></div>`;
            tempFragment.childNodes[0].addEventListener('click', function () {
                if (listSelected[0]) {
                    listSelected[0].classList.remove('list-active');
                }
                // alert(listMenu[count].dataset.id);
                listMenu[count].classList.add('list-active');
                generateLink(listMenu[count].dataset.id);
                chosenLink.dataset.id = listMenu[count].dataset.id;
                chosenLink.innerHTML = chosenLink.dataset.id;
            });
            fragment.appendChild(tempFragment.childNodes[0]);
        }
        linkWrapper.appendChild(fragment);
    }
    function collapse(container) {
        if (String(container) === 'sidebar') {
            if (isExpand) {
                menu.classList.add('collapse');
            }
            else {
                menu.classList.remove('collapse');
            }
            isExpand = !isExpand;
        }
        else {
            if (isExpandNav) {
                navigation.classList.add('show');
                navigation.classList.remove('hide');
            }
            else {
                navigation.classList.add('hide');
                navigation.classList.remove('show');
            }
            isExpandNav = !isExpandNav;
        }
    }
    function generateLink(id) {
        let fragment = document.createDocumentFragment();
        if (id) {
            if (id === chosenLink.dataset.id) {
                collapse();
            }
            else {
                listWrapper.innerHTML = '';
                for (let count in data[id]) {
                    let tempFragment = document.createElement('a');
                    tempFragment.innerHTML = `<a class="link-list" data-id="${data[id][count].id}">${data[id][count].name}</a>`;
                    tempFragment.childNodes[0].addEventListener('click', function () {
                        if (linkSelected[0]) {
                            linkSelected[0].classList.remove('link-active');
                        }
                        linkList[count].classList.add('link-active');
                        //alert(`ja imam id = ${linkList[count].dataset.id}, i trebam prikazati tabelu za ${linkList[count].textContent} i da vratim menu`);
                        collapse();
                    });
                    fragment.appendChild(tempFragment.childNodes[0]);
                }
                listWrapper.appendChild(fragment);
                collapse();

            }

        }
        else {
            listWrapper.innerHTML = '';
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
                        //alert(`ja imam id = ${linkList[list].dataset.id}, i trebam prikazati tabelu za ${linkList[list].textContent} i da vratim menu`);
                        collapse();
                    });
                    fragment.appendChild(tempFragment.childNodes[0]);
                }
                globalList[list].appendChild(fragment);
            }
        }
    }
})();