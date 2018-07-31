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
    //variable for list id and link id
    let listId;
    let linkId;
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
            if (String(id) === String(chosenLink.dataset.id)) {
                selectLink(linkId);
                collapse();
            }
            else {
                listWrapper.innerHTML = '';
                for (let count in data[id]) {
                    let tempFragment = document.createElement('a');
                    tempFragment.innerHTML = `<a class="link-list" data-id="${data[id][count].id}">${data[id][count].name}</a>`;
                    tempFragment.childNodes[0].addEventListener('click', function () {
                        linkId = linkList[count].dataset.id;
                        selectList(id);
                        //alert(`ja imam id = ${linkList[count].dataset.id}, i trebam prikazati tabelu za ${linkList[count].textContent} i da vratim menu`);
                        collapse();
                    });
                    fragment.appendChild(tempFragment.childNodes[0]);
                }
                listWrapper.appendChild(fragment);
                if (linkId) {
                    selectLink(linkId);
                }
                collapse();
            }
        }
        else {
            chosenLink.innerHTML = 'Search';
            chosenLink.dataset.id = 'globalSearch';
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
                    selectLink(linkId);
                    tempFragment.childNodes[0].addEventListener('click', function () {
                        listId = globalList[list].dataset.id;
                        linkId = count.id;
                        generateLink(listId);
                        selectList(listId);
                        chosenLink.dataset.id = listId;
                        chosenLink.innerHTML = chosenLink.dataset.id;
                        selectLink(linkId);
                        //alert(`ja imam id = ${linkList[list].dataset.id}, i trebam prikazati tabelu za ${linkList[list].textContent} i da vratim menu`);
                    });
                    fragment.appendChild(tempFragment.childNodes[0]);
                }
                globalList[list].appendChild(fragment);
            }
        }
    }
    function selectList(id) {
        if (listSelected[0]) {
            listSelected[0].classList.remove('list-active');
        }
        for (let list of listMenu) {
            if (String(list.dataset.id) === String(id)) {
                list.classList.add('list-active');
                break;
            }
        }
    }
    function selectLink(id) {
        if (linkSelected[0]) {
            linkSelected[0].classList.remove('link-active');
        }
        for (let link of linkList) {
            if (Number(link.dataset.id) === Number(id)) {
                link.classList.add('link-active');
                break;
            }
        }
    }
})();