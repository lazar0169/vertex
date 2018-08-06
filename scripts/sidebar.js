const sidebar = (function () {
    let arrayList = Object.keys(data);
    let sidebarWrapper = $$('#sidebar-wrapper');
    let linkWrapper = $$('#sidebar-link');
    let listMenu = $$('.list-management');
    let collapseButton = $$('#icon-collapse');
    let navigation = $$('#sidebar-hidden');
    let back = $$('#back-to-menu');
    let chosenLink = $$('#chosen-link');
    let listWrapper = $$('#navigation-content');
    let linkList = $$('.link-list');
    let globalSearch = $$('#global-search');
    let globalList = $$('.lists');
    let listSelected = $$('.list-active');
    let linkSelected = $$('.link-active');
    let header = $$('#header-wrapper');
    let contentWrapper = $$('#content');
    let navigationWrapper = $$('.opacity');
    let machineWrapper = $$('#machine-wrapper');
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
        collapse('navigation');
    });
    globalSearch.addEventListener('click', () => {
        generateLink();
        collapse('navigation');
    });
    // generate menu lists from data, and set click listener  
    function generateMenu() {
        let fragment = document.createDocumentFragment();
        for (let count in arrayList) {
            let tempFragment = document.createElement('div');
            tempFragment.innerHTML = `<div class='center'><div class="list-management tooltip center" data-id="${arrayList[count]}">
                <span class="mdi mdi-magnify icon-tooltip center"></span>
                <div class="list-name">${arrayList[count]}</div>
                </div>
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
    // function for collapse sidebar, show or hide navigation, and expand other section  
    function collapse(container) {
        switch (container) {

            case 'sidebar':
                if (isExpand) {
                    sidebarWrapper.classList.add('collapse');
                    header.classList.add('expand');
                    contentWrapper.classList.add('expand');
                }
                else {
                    sidebarWrapper.classList.remove('collapse');
                    header.classList.remove('expand');
                    contentWrapper.classList.remove('expand');
                }
                isExpand = !isExpand;
                break;

            case 'navigation':
                if (isExpandNav) {
                    navigation.classList.add('show');
                    navigation.classList.remove('hide');
                    navigationWrapper[0].classList.add('show');
                }
                else {
                    navigation.classList.add('hide');
                    navigation.classList.remove('show');
                    navigationWrapper[0].classList.remove('show');
                }
                isExpandNav = !isExpandNav;


        }


    }
    // generate links when you click on list from menu, and set click listener
    function generateLink(id) {
        let fragment = document.createDocumentFragment();
        if (id) {
            if (String(id) === String(chosenLink.dataset.id)) {
                selectLink(linkId);
                collapse('navigation');
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
                        collapse('navigation');
                        proba();

                    });
                    fragment.appendChild(tempFragment.childNodes[0]);
                }
                listWrapper.appendChild(fragment);
                if (linkId) {
                    selectLink(linkId);
                }
                collapse('navigation');
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
                    tempFragment.innerHTML = `<a class="link-list" data-id="${count.id}">${count.name}</a>`;

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
            selectLink(linkId);
        }
    }
    // highlight chosen list
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
    // highlight chosen link
    function selectLink(id) {
        if (id) {
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

    }
    //ovo je proba na dole
    let machineTab = $$('.machine-tab');
    for (let tab of machineTab) {
        tab.addEventListener('click', function () {
            let machineTabActive = $$('.machine-tab-active');
            if (machineTabActive[0]) {
                machineTabActive[0].classList.remove('machine-tab-active');
            }
            tab.classList.add('machine-tab-active');
        });
    }
    function proba() {
        machineWrapper.classList.add('show');
    }
    $$('#machine-close').addEventListener('click', function () {
        machineClose();
    });
    function machineClose() {
        machineWrapper.classList.remove('show');

    }
    // $$('.checkSlide')[0].addEventListener('click', function () {
    //     isChecked();
    // });
    // function isChecked() {
    //     if ($$('.checkSlide')[0].checked) {
    //         alert('cekiran sam');
    //     }
    //     else {
    //         alert('nisam cekiran');
    //     }
    // }
})();