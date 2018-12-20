const sidebar = (function () {

    let menuData;
    let icons = ['poker-chip', 'currency-usd', 'ticket', 'bank', 'gamepad-variant', 'file-document', 'account', 'wrench'];

    let sidebarMenu = $$('#sidebar');
    let listWrapper = $$('#sidebar-list');
    let collapseButton = $$('#icon-collapse');
    let navigationMenu = $$('#navigation-sidebar');
    let back = $$('#back-to-menu');
    let chosenLink = $$('#chosen-link');
    let linkWrapper = $$('#navigation-content');
    let globalSearch = $$('#global-search');
    let searchLink = $$('#search-link');
    let blackArea = $$('#black-area');
    let mainContent = $$('#main-content');
    let editMode = $$('#machine-edit-mode');
    let tooltipText = $$('#tooltip-text');
    let headName = $$('#head-name').children[0];
    // variables to check sidebar, if isExpand = true sidebar is max size, else sidebar is collapsed, isExpandNav is like isExpand
    let isExpanded = false;
    // variables for selected list and link, default category is 1st category from data  and default link is 1st link from 1st category
    let categorySelectedId;
    let linkSelectedId;
    // let categorySelectedId = Object.keys(menuData)[0];
    //  let linkSelectedId = `link-${menuData[categorySelectedId]['value'][0]['id']}`;
    // variables for remembering last category and link which are picked, and they are used for marking category and link
    let previousCategorySelected;
    let previousLinkSelected;
    //variables for search, searchCategory is used to check which category is active,
    //if you click on general search it will be set to undefined in other case it will be set like list
    //recent is an object, it take value from localStorage
    let searchCategory;
    let recent;

    let sidemenu = function () {
        return {
            collapse: function () {
                sidebarMenu.classList.add('collapse');
                mainContent.classList.add('expand');
                collapseButton.classList.add('hidden');
            },
            expand: function () {
                sidebarMenu.classList.remove('collapse');
                mainContent.classList.remove('expand');
            }
        };
    }();

    let navigation = function () {
        return {
            hide: function () {
                navigationMenu.classList.add('collapse');
                blackArea.classList.remove('show');
            },
            show: function () {
                navigationMenu.classList.remove('collapse');
                blackArea.classList.add('show');
            }
        };
    }();

    window.addEventListener('keyup', function (event) {
        if (event.keyCode == 27) {
            navigation.hide();
        }
    });

    collapseButton.addEventListener('click', function () {
        isExpanded ?
            sidemenu.collapse() :
            sidemenu.expand();
        isExpanded = !isExpanded;
    });

    back.addEventListener('click', function () {
        navigation.hide();
    });

    headName.addEventListener('mouseenter', function () {
        if (sidebarMenu.classList.contains('collapse')) {
            collapseButton.classList.remove('hidden');
        }
    });

    collapseButton.addEventListener('mouseleave', function () {
        if (sidebarMenu.classList.contains('collapse')) {
            collapseButton.classList.add('hidden');
        }
    });




    on('show/app', function () {
        navigation.hide();
    });

    globalSearch.addEventListener('click', function () {
        editMode.classList.add('collapse');
        //ToDo: proveriti ovo:
        chosenLink.innerHTML = localization.translateMessage('Search', chosenLink);

        searchCategory = undefined;
        recent = JSON.parse(localStorage.getItem('recentSearch'));
        generateLinks(recent || searchCategory);
        navigation.show();
        searchLink.focus();
    });

    searchLink.addEventListener('keyup', function (event) {
        let results = searchCategory;
        if (searchLink.value !== '') {
            results = search(searchLink.value.toLowerCase(), searchCategory);
        } else if (results === undefined && recent) {
            results = recent;
        }
        generateLinks(results);
    });

    // generate menu lists from data, and set click listener
    function generateMenu(data) {
        let fragment = document.createDocumentFragment();
        for (let category in data) {
            let tempFragment = document.createElement('div');

            let center = document.createElement('div');
            center.classList.add('center');
            let categoryEl;
            if (data[category].Value.length === 0) {
                categoryEl = document.createElement('a');
                categoryEl.classList.add('element-navigation-link');

            }
            else {
                categoryEl = document.createElement('div');
            }
            categoryEl.setAttribute('id', category);
            categoryEl.classList.add('list-management');
            categoryEl.classList.add('center');




            let span = document.createElement('span');
            let mdiClassName = `mdi-${icons[Object.keys(data).indexOf(category)]}`;
            span.classList.add('mdi');
            span.classList.add(mdiClassName);
            span.classList.add('custom-tooltip');
            span.classList.add('center');

            let listName = document.createElement('div');
            listName.classList.add('list-name');
            listName.innerText = localization.translateMessage(data[category].List, listName);

            categoryEl.appendChild(span);
            categoryEl.appendChild(listName);
            center.appendChild(categoryEl);
            tempFragment.appendChild(center);

            tempFragment.childNodes[0].addEventListener('mouseenter', function () {
                if (sidebarMenu.classList.contains('collapse')) {
                    showTooltip(category);
                }
            });

            tempFragment.childNodes[0].addEventListener('mouseleave', function () {
                if (sidebarMenu.classList.contains('collapse')) {
                    tooltipText.classList.add('hidden');
                }
            });

            tempFragment.childNodes[0].addEventListener('click', function () {

                categorySelectedId = category;
                searchCategory = category;
                editMode.classList.add('collapse');
                if (data[category].Value.length === 0) {
                    alert('ne otvaraj navigaciju')
                }
                else {
                    generateLinks(category);
                    chosenLink.innerHTML = data[category].List;
                    searchLink.focus();
                    navigation.show();
                }

            });
            fragment.appendChild(tempFragment.childNodes[0]);
        }
        listWrapper.appendChild(fragment);
    }

    // generate links when you click on list from menu, and set click listener
    function generateLinks(category) {
        let fragment = document.createDocumentFragment();
        linkWrapper.innerHTML = '';
        generateLinksData(!category || menuData[category] ? menuData : category);

        function generateLinksData(tempData) {
            if (searchCategory) { // if searchCategory is not undefined, this function generates links based on it
                for (let categoryValue of tempData[searchCategory].Value) {
                    let tempFragment = document.createElement('a');
                    tempFragment.id = `link-${categoryValue.Id}`;
                    //element-navigation-link class is needed for functionalities in router
                    tempFragment.classList = 'link-list element-navigation-link';
                    //elements in search mapped to coresponding path
                    tempFragment.href = `/${searchCategory.toLowerCase()}/${categoryValue.Id}`; //ToDo LINK
                    tempFragment.innerHTML = categoryValue.Name;
                    tempFragment.addEventListener('click', function () {
                        linkSelectedId = `link-${categoryValue.Id}`;
                        selectCategory(searchCategory);
                        selectLink(linkSelectedId);
                        // trigger('communicate/category', { category: category }); //todo check if needed
                        trigger('topBar/category', { category: tempData[searchCategory].List, casino: categoryValue.Name });
                        navigation.hide();
                        let temp = categoryValue;
                        temp.categoryName = tempData[searchCategory].List;
                        temp.category = searchCategory;
                        // temp.List = tempData[searchCategory].List;
                        recentSearch(temp);
                    });
                    fragment.appendChild(tempFragment);
                }
            } else { //if searchCategory is undefined, function generates links based on object
                for (let category in tempData) {
                    if (tempData[category].Value.length !== 0) {
                        let tempCategory = document.createElement('div');
                        tempCategory.className = 'lists center';
                        if (category !== 'Search' && tempData[category].List !== undefined) { //if category isn't 'search', lists have header
                            let categoryEl = document.createElement('div');
                            categoryEl.innerHTML = localization.translateMessage(tempData[category].List, categoryEl);
                            tempCategory.appendChild(categoryEl);
                        }
                        for (let value of tempData[category].Value) {
                            let tempValue = document.createElement('a');
                            //element-navigation-link class is needed for functionalities in router
                            tempValue.classList = 'link-list element-navigation-link';
                            //elements in search mapped to coresponding path
                            tempValue.href = `/${category.toLowerCase()}/${value.Id}`;
                            tempValue.id = `link-${value.Id}`;
                            tempValue.innerHTML = `${value.Name} (${category})`;
                            if (category === 'Search') {// if category is 'search', link has name and category name in brakets 
                                tempValue.innerHTML = `${value.Name} (${value.category})`;
                                tempValue.href = `/${value.category.toLowerCase()}/${value.Id}`;
                            } else {
                                tempValue.innerHTML = value.Name;
                            }
                            tempValue.addEventListener('click', function () {
                                searchCategory = categorySelectedId;
                                linkSelectedId = `link-${value.Id}`;
                                let entry = value;
                                if (category === 'Search') {// if category is 'search' category, categorySelectedId take category value from object
                                    categorySelectedId = value.category.charAt(0).toUpperCase() + value.category.slice(1).toLowerCase();
                                } else { //if category isn't 'search' category, variable entry will be populated with  category and categoryName
                                    entry.category = category;
                                    entry.categoryName = tempData[category].List;
                                    // entry.List = tempData[category].List;
                                    categorySelectedId = category;
                                }
                                recentSearch(entry);
                                selectCategory(categorySelectedId);
                                trigger('topBar/category', { category: value.categoryName, casino: value.Name });
                                trigger('communicate/category', { category: categorySelectedId });
                                navigation.hide();
                            });
                            tempCategory.appendChild(tempValue);
                        }
                        fragment.appendChild(tempCategory);
                    }
                }
            }
        }

        linkWrapper.appendChild(fragment);
        //bind handlers to elements that are added dynamically after router init event
        trigger('router/bind-handlers/navigation-links');
        selectLink(linkSelectedId);//ToDO ovde dolazi najverovatnije do greske pri generisanju pravog linka
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

    // highlight chosen category
    function selectCategory(category) {
        if (category !== 'Search') {
            if (previousCategorySelected) {
                previousCategorySelected.classList.remove('list-active');
            }
            let listSelected = $$(`#${category}`);
            if (listSelected !== undefined) {
                listSelected.classList.add('list-active');
                previousCategorySelected = listSelected;
            }
        }
    }

    // function to remember last search in localStorage
    function recentSearch(valueLink) {
        recent = JSON.parse(localStorage.getItem('recentSearch'));
        let recentArray = recent ? recent.Search.Value : [];
        let index = recentArray.findIndex((item) => item.Id === valueLink.Id);
        if (index !== -1) {
            recentArray.splice(index, 1);
        }
        recentArray.unshift(valueLink);
        let object = {};
        object['Search'] = {
            'List': 'Recent search',
            'Value': recentArray
        };
        localStorage.setItem('recentSearch', JSON.stringify(object));
    }

    //data search
    function search(termin, category) {
        let newData = {};
        if (category) {
            newData[category] = search(termin, category);
        } else {
            for (let category in menuData) {
                newData[category] = search(termin, category);
            }
        }
        return newData;

        function search(termin, category) {
            let i = 0;
            let arrayResult = [];
            for (let value of menuData[category].Value) {
                let valueName = value.Name.toLowerCase();
                let valueCity = value.City.toLowerCase();
                let index = valueName.indexOf(termin);
                let index1 = valueName.indexOf(` ${termin}`);
                let index2 = valueCity.indexOf(termin);
                let index3 = valueCity.indexOf(` ${termin}`)
                if (index === 0 ||
                    index1 !== -1 ||
                    index2 === 0 ||
                    index3 !== -1) {
                    arrayResult[i] = value;
                    i++;
                }
            }
            let newObject = {
                'List': menuData[category].List,
                'Value': arrayResult
            };
            return newObject;
        }
    }

    //function for tooltip
    function showTooltip(category) {
        let rect = $$(`#${category}`).getBoundingClientRect();
        tooltipText.style.top = rect.top + rect.height / 4;
        tooltipText.innerHTML = menuData[category].List;
        tooltipText.classList.remove('hidden');
    }

    //test, if you don't need it anymore, remove it
    let isActiveDetailsTest = true;
    let detailsmenutest = function () {
        return {
            collapse: function () {
                //test, if you don't need it anymore, remove it
                $$('#details-bar').classList.remove('collapse');
                blackArea.classList.add('show');
            },
            expand: function () {
                //test, if you don't need it anymore, remove it
                $$('#details-bar').classList.add('collapse');
                blackArea.classList.remove('show');
                editMode.classList.add('collapse');
            }
        };
    }();
    //test, if you don't need it anymore, remove it
    $$('#test-enable-details').addEventListener('click', function () {
        selectTab('machine-details-tab');
        selectInfoContent('machine-details-tab');

        isActiveDetailsTest ?
            detailsmenutest.collapse() :
            detailsmenutest.expand();
    });

    //helper functions
    function initVariables() {
        categorySelectedId = Object.keys(menuData)[0];
        linkSelectedId = `link-${menuData[categorySelectedId]['Value'][0]['Id']}`;
    }

    //events
    on('sidebar/menu/generate', function (e) {
        menuData = e.menuData;
        generateMenu(menuData);
        initVariables();
        generateLinks(categorySelectedId);
        selectCategory(categorySelectedId);
        trigger('topBar/category', { category: categorySelectedId, casino: menuData[categorySelectedId].Value[0].Name });

        chosenLink.innerHTML = menuData[categorySelectedId].List;
    });

})();