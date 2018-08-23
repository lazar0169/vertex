const sidebar = (function () {
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
    let listSelectedId = Object.keys(data)[0];
    let linkSelectedId = `link-${data[listSelectedId]['value'][0]['id']}`;
    let previousListSelected;
    let previousLinkSelected;
    //variable for search, searchCategory is used to check which category is active, 
    //if you click on general search it will be set to false in other case it will be set like list
    let searchCategory;

    window.addEventListener('load', function () {
        generateMenu(data);
        generateLinks(listSelectedId);
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
        chosenLink.innerHTML = 'Search';
        searchCategory = undefined;
        generateLinks(searchCategory);
        collapse('navigation');
        searchLink.focus();
    });

    blackArea.addEventListener('click', function () {
        collapse('navigation');
    });

    searchLink.addEventListener('keyup', function (event) {
        if (event.keyCode) {
            let termin = searchLink.value.toUpperCase();
            if (termin) {
                let result = search(termin, searchCategory);
                generateLinks(result);
            }
            else {
                generateLinks(listSelectedId);
            }
        }
    });

    // generate menu lists from data, and set click listener  
    function generateMenu(data) {
        let fragment = document.createDocumentFragment();
        let iconNo = 0;
        for (let category in data) {
            let tempFragment = document.createElement('div');
            tempFragment.innerHTML = `<div class='center'><div id="${category}" class="list-management tooltip center">
                <span class="mdi mdi-${icons[iconNo]} icon-tooltip center"></span>
                <div class="list-name">${data[category].category}</div>
                </div>
                <span class="tooltip-text hide">${data[category].category}</span></div>`;
            tempFragment.childNodes[0].addEventListener('click', function () {
                listSelectedId = category;
                searchCategory = listSelectedId;
                generateLinks(listSelectedId);
                chosenLink.innerHTML = data[category].category;
                searchLink.focus();
                collapse('navigation');

            });
            iconNo++;
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
    function generateLinks(category) {
        let fragment = document.createDocumentFragment();
        linkWrapper.innerHTML = '';

        if (!category || data[category]) {
            generateLinksData(data);
        }
        else {
            generateLinksData(category);
        }

        function generateLinksData(tempData) {
            if (searchCategory) {
                for (let categoryValue of tempData[searchCategory].value) {
                    let tempFragment = document.createElement('a');
                    tempFragment.id = `link-${categoryValue.id}`;
                    tempFragment.classList = 'link-list';
                    tempFragment.innerHTML = categoryValue.name;
                    tempFragment.addEventListener('click', function () {
                        linkSelectedId = `link-${categoryValue.id}`;
                        selectList(category);
                        selectLink(linkSelectedId);
                        collapse('navigation');
                    });
                    fragment.appendChild(tempFragment);
                }
            }
            else {
                for (let category in tempData) {
                    let tempCategory = document.createElement('div');
                    tempCategory.className = 'lists center';
                    tempCategory.innerHTML = `<h4>${tempData[category].category}</h4>`;
                    for (let value of tempData[category].value) {
                        let tempValue = document.createElement('a');
                        tempValue.classList = 'link-list';
                        tempValue.id = `link-${value.id}`;
                        tempValue.innerHTML = value.name;
                        tempValue.addEventListener('click', function () {
                            listSelectedId = category;
                            searchCategory = listSelectedId;
                            linkSelectedId = `link-${value.id}`;
                            generateLinks(listSelectedId);
                            selectList(listSelectedId);
                            collapse('navigation');
                        });
                        tempCategory.appendChild(tempValue);
                    }
                    fragment.appendChild(tempCategory);
                }
            }
        }
        linkWrapper.appendChild(fragment);
        selectLink(linkSelectedId);
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

    //data search
    function search(termin, category) {
        let newData = {};
        if (category) {
            newData[category] = search(termin, category);
        }
        else {

            for (let category in data) {
                newData[category] = search(termin, category);
            }
        }
        return newData;

        function search(termin, category) {
            let i = 0;
            let arrayResult = [];
            for (let value of data[category].value) {
                let valueName = value.name.toUpperCase();
                let valueCity = value.city.toUpperCase();
                let index = valueName.indexOf(termin);
                let index1 = valueName.indexOf(` ${termin}`);
                let index2 = valueCity.indexOf(termin);
                let index3 = valueCity.indexOf(` ${termin}`)
                if (index === 0 ||
                    index1 !== -1 ||
                    index2 === 0 ||
                    index3 !== -1) {
                    arrayResult[i] = { 'id': value.id, 'name': value.name, 'city': value.city };
                    i++;
                }
            }
            let newObject = {
                'category': data[category].category,
                'value': arrayResult
            };
            return newObject;
        }
    }
})();