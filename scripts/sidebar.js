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
    // variables to check sidebar, if isExpand = true sidebar is max size, else sidebar is collapsed, isExpandNav is like isExpand
    let isExpand = true;
    let isExpandNav = true;
    // variables for selected list and link
    let listSelectedId = Object.keys(data)[0];
    let linkSelectedId = `link-${data[listSelectedId]['value'][0]['id']}`;
    let previousListSelected;
    let previousLinkSelected;
    //variables for search, searchCategory is used to check which category is active, 
    //if you click on general search it will be set to false in other case it will be set like list
    let searchCategory;
    // variables for recent search, storageArray contains ids of links, sessionStorageObject contains values of links,
    // storageCounter counts elements in storageArray, valueArray contains values of picked links
    let storageArray = [];
    let sessionStorageObject = {};
    let sessionStorageObjectProba = {};
    let storageCounter = 0;
    let valueArray = [];



    window.addEventListener('load', function () {
        sessionStorageObjectProba = JSON.parse(sessionStorage.getItem('key'));
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
        sessionStorageObjectProba = JSON.parse(sessionStorage.getItem('key'));
        if (sessionStorageObjectProba) {
            generateLinks(sessionStorageObjectProba);
        }
        else {

            generateLinks(searchCategory);

            //alert(sessionStorageObject);
        }
        collapse('navigation');
        searchLink.focus();
    });

    blackArea.addEventListener('click', function () {
        collapse('navigation');
    });

    searchLink.addEventListener('keyup', function (event) {
        if (event.keyCode) {
            let results = searchCategory;
            if (searchLink.value !== '') {
                results = search(searchLink.value.toLowerCase(), searchCategory);
            }
            else if (Object.keys(sessionStorageObject).length !== 0) {
                results = sessionStorageObject;
            }
            generateLinks(results);

        }
    });

    // generate menu lists from data, and set click listener  
    function generateMenu(data) {
        let fragment = document.createDocumentFragment();
        for (let category in data) {
            let tempFragment = document.createElement('div');
            tempFragment.innerHTML = `<div class='center'>
                                        <div id="${category}" class="list-management tooltip center">
                                            <span class="mdi mdi-${icons[Object.keys(data).indexOf(category)]} icon-tooltip center"></span>
                                            <div class="list-name">${data[category].category}</div>
                                        </div>
                                        <span class="tooltip-text hide">${data[category].category}</span>
                                    </div>`;
            tempFragment.childNodes[0].addEventListener('click', function () {
                listSelectedId = category;
                searchCategory = category;
                generateLinks(category);
                chosenLink.innerHTML = data[category].category;
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
    function generateLinks(category) {

        let fragment = document.createDocumentFragment();
        linkWrapper.innerHTML = '';

        generateLinksData(!category || data[category] ? data : category);

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
            } else {

                for (let category in tempData) {
                    if (tempData[category].value.length !== 0) {
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
                                selectList(listSelectedId);
                                collapse('navigation');

                                storageSessionArray(value);
                                if (category === 'search') {
                                    generateLinks(sessionStorageObject);
                                }
                                else {
                                    generateLinks(listSelectedId);
                                }

                            });
                            tempCategory.appendChild(tempValue);
                        }
                        fragment.appendChild(tempCategory);
                    }

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
        if (category !== 'search') {


            if (previousListSelected) {
                previousListSelected.classList.remove('list-active');
            }
            let listSelected = $$(`#${category}`);
            listSelected.classList.add('list-active');
            previousListSelected = listSelected;
        }
    }

    function collapseMain() {
        mainWrapper.classList[isExpandNav ? 'add' : 'remove']('expand');
    }

    //data search
    function search(termin, category) {
        let newData = {};
        if (category) {
            newData[category] = search(termin, category);
        } else {
            for (let category in data) {
                newData[category] = search(termin, category);
            }
        }
        return newData;

        function search(termin, category) {
            let i = 0;
            let arrayResult = [];
            for (let value of data[category].value) {
                let valueName = value.name.toLowerCase();
                let valueCity = value.city.toLowerCase();
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



    function storageSessionArray(valueLink) {

        if (!valueArray.some((value) => value.id === valueLink.id)) {
            valueArray.push(valueLink);
        }
        else {
            for (let val = valueArray.length - 1; val >= 0; val--) {
                if (valueLink.id == valueArray[val].id) {
                    for (let j = val; j < valueArray.length; j++)
                        valueArray[j] = valueArray[j + 1];
                }
            }
            valueArray[valueArray.length - 1] = valueLink;
        }

        sessionStorageObject['search'] = {
            'category': 'Recent search',
            'value': valueArray
        };
        let proba = JSON.stringify(sessionStorageObject);
        sessionStorage.setItem('key', proba);
    }
})();