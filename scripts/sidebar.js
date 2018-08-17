const sidebar = (function () {
    let arrayList = Object.keys(data);
    let sidebarMenu = $$('#sidebar')
    let listWrapper = $$('#sidebar-list');
    let listMenu = $$('.list-management');
    let collapseButton = $$('#icon-collapse');
    let navigationMenu = $$('#navigation-sidebar');
    let back = $$('#back-to-menu');
    let chosenLink = $$('#chosen-link');
    let linkWrapper = $$('#navigation-content');
    let linkList = $$('.link-list');
    let globalSearch = $$('#global-search');
    let globalList = $$('.lists');
    let listSelected = $$('.list-active');
    let linkSelected = $$('.link-active');
    let search = $$('#search-link');
    let blackArea = $$('#black-area');
    let mainWrapper = $$('#main-content');
    // variable to check sidebar, if isExpand = true sidebar is max size, else sidebar is collapsed, isExpandNav is like iscollapse
    let isExpand = true;
    let isExpandNav = true;
    //variable for list id and link id
    let listId;
    let linkId;
    window.addEventListener('load', function () {
        generateMenu();
    });
    collapseButton.addEventListener('click', function () {
        collapse('sidebar');
        collapseMain();
    });
    back.addEventListener('click', function () {
        collapse('navigation');
    });
    globalSearch.addEventListener('click', function () {
        generateLink();
        collapse('navigation');
        search.focus();
    });
    blackArea.addEventListener('click', function () {
        collapse('navigation');
    });
    // generate menu lists from data, and set click listener  
    function generateMenu() {
        let fragment = document.createDocumentFragment();
        for (let count in arrayList) {
            let tempFragment = document.createElement('div');
            tempFragment.innerHTML = `<div class='center'><div class="list-management tooltip center" data-id="${arrayList[count]}">
                <span class="mdi mdi-magnify icon-tooltip center"></span>
                <div class="list-name">${data[arrayList[count]].list}</div>
                </div>
                <span class="tooltip-text hide">${data[arrayList[count]].list}</span></div>`;
            tempFragment.childNodes[0].addEventListener('click', function () {
                generateLink(listMenu[count].dataset.id);
                chosenLink.dataset.id = listMenu[count].dataset.id;
                chosenLink.innerHTML = data[arrayList[count]].list;
                search.focus();
            });
            fragment.appendChild(tempFragment.childNodes[0]);
        }
        listWrapper.appendChild(fragment);
    }
    // function for collapse sidebar, show or hide navigation
    function collapse(container) {
        switch (container) {
            case 'sidebar':
                sidebarMenu.classList[isExpand ? 'add' : 'remove']('collapse');
                isExpand = !isExpand;
                break;
            case 'navigation':
                navigationMenu.classList[isExpandNav ? 'add' : 'remove']('collapse');
                blackArea.classList[isExpandNav ? 'add' : 'remove']('show');
                isExpandNav = !isExpandNav;
                break;
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
                linkWrapper.innerHTML = '';
                for (let count in data[id].value) {
                    let tempFragment = document.createElement('a');
                    tempFragment.innerHTML = `<a class="link-list" data-id="${data[id]['value'][count].id}">${data[id]['value'][count].name}</a>`;
                    tempFragment.childNodes[0].addEventListener('click', function () {
                        linkId = linkList[count].dataset.id;
                        selectList(id);
                        collapse('navigation');
                    });
                    fragment.appendChild(tempFragment.childNodes[0]);
                }
                linkWrapper.appendChild(fragment);
                if (linkId) {
                    selectLink(linkId);
                }
                collapse('navigation');
            }
        }
        else {
            chosenLink.innerHTML = 'Search';
            chosenLink.dataset.id = 'globalSearch';
            linkWrapper.innerHTML = '';
            for (let list of arrayList) {
                let tempFragment = document.createElement('div');
                tempFragment.innerHTML = `<div class="lists center" data-id=${list}><h4>${data[list].list}</h4></div>`;
                fragment.appendChild(tempFragment.childNodes[0]);
            }
            linkWrapper.appendChild(fragment);
            for (let list in arrayList) {
                for (let count of data[arrayList[list]]['value']) {
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

        for (let list of listMenu) {

            list.classList[String(list.dataset.id) === String(id) ? 'add' : 'remove']('list-active');
        }
    }
    // highlight chosen link
    function selectLink(id) {


        for (let link of linkList) {

            link.classList[Number(link.dataset.id) === Number(id) ? 'add' : 'remove']('link-active');



        }

    }

    function collapseMain() {
        mainWrapper.classList[isExpandNav ? 'add' : 'remove']('expand');
    }
})();