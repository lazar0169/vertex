const sidebar = (function () {
    let arrayList = Object.keys(data);
    let sidebarMenu = $$('#sidebar')
    let listWrapper = $$('#sidebar-list');
    let collapseButton = $$('#icon-collapse');
    let navigationMenu = $$('#navigation-sidebar');
    let back = $$('#back-to-menu');
    let chosenLink = $$('#chosen-link');
    let linkWrapper = $$('#navigation-content');
    let globalSearch = $$('#global-search');
    let searchLink = $$('#search-link');
    let blackArea = $$('#black-area');
    let mainWrapper = $$('#main-content');
    // variable to check sidebar, if isExpand = true sidebar is max size, else sidebar is collapsed, isExpandNav is like isExpand
    let isExpand = true;
    let isExpandNav = true;
    // variable for selected list and link
    let listSelectedId = arrayList[0];
    let linkSelectedId = `link-${data[listSelectedId]['value'][0]['id']}`;
    let previousListSelected;
    let previousLinkSelected;
    //variable for search function
    let activeNavBar;


    window.addEventListener('load', function () {
        generateMenu();
        generateLink(listSelectedId);
        selectList(listSelectedId);
        chosenLink.innerHTML = data[listSelectedId].category;
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
        activeNavBar = undefined;
        collapse('navigation');
        searchLink.focus();
    });

    blackArea.addEventListener('click', function () {
        collapse('navigation');
    });
    ////////////////////////////////
    searchLink.addEventListener('keyup', function (event) {
        if (event.keyCode === 13) {
            search(activeNavBar);
        }
    });



    // generate menu lists from data, and set click listener  
    function generateMenu() {
        let fragment = document.createDocumentFragment();
        for (let count in arrayList) {
            let tempFragment = document.createElement('div');
            tempFragment.innerHTML = `<div class='center'><div id="${arrayList[count]}" class="list-management tooltip center">
                <span class="mdi mdi-${icons[count]} icon-tooltip center"></span>
                <div class="list-name">${data[arrayList[count]].category}</div>
                </div>
                <span class="tooltip-text hide">${data[arrayList[count]].category}</span></div>`;
            tempFragment.childNodes[0].addEventListener('click', function () {
                listSelectedId = arrayList[count];
                generateLink(listSelectedId);
                chosenLink.innerHTML = data[arrayList[count]].category;
                searchLink.focus();
                collapse('navigation');
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
            linkWrapper.innerHTML = '';
            for (let categoryValue of data[id].value) {
                let tempFragment = document.createElement('a');
                tempFragment.id = `link-${categoryValue.id}`;
                tempFragment.classList = 'link-list';
                tempFragment.innerHTML = categoryValue.name;
                tempFragment.addEventListener('click', function () {
                    linkSelectedId = `link-${categoryValue.id}`;
                    chosenLink.innerHTML = data[id].category;
                    selectList(id);
                    selectLink(linkSelectedId);
                    collapse('navigation');
                });
                fragment.appendChild(tempFragment);
            }
            linkWrapper.appendChild(fragment);
        }
        else {
            chosenLink.innerHTML = 'Search';
            linkWrapper.innerHTML = '';
            for (let category in data) {
                let tempCategory = document.createElement('div');
                tempCategory.className = 'lists center';
                tempCategory.innerHTML = `<h4>${data[category].category}</h4>`;
                for (let value of data[category].value) {
                    let tempValue = document.createElement('a');
                    tempValue.classList = 'link-list';
                    tempValue.id = `link-${value.id}`;
                    tempValue.innerHTML = value.name;
                    tempValue.addEventListener('click', function () {
                        listSelectedId = category;
                        linkSelectedId = `link-${value.id}`;
                        generateLink(listSelectedId);
                        selectList(listSelectedId);
                        chosenLink.innerHTML = category.category;
                        collapse('navigation');
                    });
                    tempCategory.appendChild(tempValue);
                }
                fragment.appendChild(tempCategory);
            }
            linkWrapper.appendChild(fragment);
        }
        selectLink(linkSelectedId);
        activeNavBar = id;
    }

    // highlight chosen link
    function selectLink(id) {
        if (previousLinkSelected) {
            previousLinkSelected.classList.remove('list-active');
        }
        let linkSelected = $$(`#${id}`);
        if (linkSelected) {
            linkSelected.classList.add('list-active');
            previousLinkSelected = linkSelected;
        }
    }

    // highlight chosen list
    function selectList(id) {
        if (previousListSelected) {
            previousListSelected.classList.remove('list-active');
        }
        let listSelected = $$(`#${id}`);
        listSelected.classList.add('list-active');
        previousListSelected = listSelected;
    }

    function collapseMain() {
        mainWrapper.classList[isExpandNav ? 'add' : 'remove']('expand');
    }

    function search(id) {
        let filter = searchLink.value.toUpperCase();
        let arrayResult = [];
        let i = 0;
        if (!id) {
            for (let category in data) {
                for (let value of data[category].value) {
                    let valueName = value.name.toUpperCase();
                    let allWords = valueName.split(' ');
                    for (let word of allWords) {
                        let slicedWord = word.slice(0, filter.length);
                        if (slicedWord === filter) {
                            arrayResult[i] = valueName;
                            i++
                        }
                    }
                }
            }
        }
        else {
            for (let value of data[id].value) {
                let valueName = value.name.toUpperCase();
                let allWords = valueName.split(' ');
                for (let word of allWords) {
                    let slicedWord = word.slice(0, filter.length);
                    if (slicedWord === filter) {
                        arrayResult[i] = valueName;
                        i++
                    }
                }
            }
        }
        alert(`rezultati pretrage za ${filter} su:   ${arrayResult}`);

    }
})();
