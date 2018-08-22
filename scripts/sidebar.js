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
    let newData = {};


    window.addEventListener('load', function () {
        generateMenu();
        generateLink(listSelectedId, data);
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
        activeNavBar = undefined;
        generateLink(activeNavBar, data);
        collapse('navigation');
        searchLink.focus();
    });

    blackArea.addEventListener('click', function () {
        collapse('navigation');
    });
    ////////////////////////////////
    searchLink.addEventListener('keyup', function (event) {
        if (event.keyCode) {
            let termin = searchLink.value.toUpperCase();
            if (termin) {
                search(termin, activeNavBar);
                generateLink(activeNavBar, newData);
            }
            else {
                generateLink(activeNavBar, data);
            }
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
                generateLink(listSelectedId, data);
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
    function generateLink(category, showData) {
        let fragment = document.createDocumentFragment();
        linkWrapper.innerHTML = '';
        if (category) {

            for (let categoryValue of showData[category].value) {
                let tempFragment = document.createElement('a');
                tempFragment.id = `link-${categoryValue.id}`;
                tempFragment.classList = 'link-list';
                tempFragment.innerHTML = categoryValue.name;
                tempFragment.addEventListener('click', function () {
                    linkSelectedId = `link-${categoryValue.id}`;
                    chosenLink.innerHTML = showData[category].category;
                    selectList(category);
                    selectLink(linkSelectedId);
                    collapse('navigation');
                });
                fragment.appendChild(tempFragment);
            }
            linkWrapper.appendChild(fragment);
        }
        else {
            chosenLink.innerHTML = 'Search';

            for (let category in showData) {
                let tempCategory = document.createElement('div');
                tempCategory.className = 'lists center';
                tempCategory.innerHTML = `<h4>${showData[category].category}</h4>`;
                for (let value of showData[category].value) {
                    let tempValue = document.createElement('a');
                    tempValue.classList = 'link-list';
                    tempValue.id = `link-${value.id}`;
                    tempValue.innerHTML = value.name;
                    tempValue.addEventListener('click', function () {
                        listSelectedId = category;
                        linkSelectedId = `link-${value.id}`;
                        generateLink(listSelectedId, data);
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
        activeNavBar = category;
    }

    // highlight chosen link
    function selectLink(name) {
        if (previousLinkSelected) {
            previousLinkSelected.classList.remove('list-active');
        }
        let linkSelected = $$(`#${name}`);
        if (linkSelected) {
            linkSelected.classList.add('list-active');
            previousLinkSelected = linkSelected;
        }
    }

    // highlight chosen list
    function selectList(category) {
        if (previousListSelected) {
            previousListSelected.classList.remove('list-active');
        }
        let listSelected = $$(`#${category}`);
        listSelected.classList.add('list-active');
        previousListSelected = listSelected;
    }

    function collapseMain() {
        mainWrapper.classList[isExpandNav ? 'add' : 'remove']('expand');
    }

    function search(termin, category) {
        let arrayResult = [];
        if (!category) {
            for (let category in data) {
                search(termin, category);
                let newObject = new Object({ 'category': data[category].category, 'value': arrayResult });
                newData[category] = newObject;
            }
        }
        else {
            search(termin, category);
            let newObject = new Object({ 'category': data[category].category, 'value': arrayResult });
            newData[category] = newObject;
        }

        function search(termin, category) {
            let i = 0;
            arrayResult = [];
            for (let value of data[category].value) {
                let valueName = value.name.toUpperCase();
                let valueCity = value.city.toUpperCase();
                let index = valueName.indexOf(termin);
                let index1 = valueName.indexOf(` ${termin}`);
                let index2 = valueCity.indexOf(termin);
                let index3 = valueCity.indexOf(` ${termin}`)
                if (index === 0 || index1 !== -1 || index2 === 0 || index3 !== -1) {
                    arrayResult[i] = { 'id': value.id, 'name': value.name, 'city': value.city };
                    i++;
                }
            }
        }
    }
})();