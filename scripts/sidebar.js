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
    let mainContent = $$('#main-content');
    // variables to check sidebar, if isExpand = true sidebar is max size, else sidebar is collapsed, isExpandNav is like isExpand
    let isExpanded = true;
    // variables for selected list and link, default category is 1st category from data  and default link is 1st link from 1st category
    let categorySelectedId = Object.keys(data)[0];
    let linkSelectedId = `link-${data[categorySelectedId]['value'][0]['id']}`;
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
                //test, need remove this lines when table for machines is finish
                $$('#details-bar').classList.remove('collapse');
                blackArea.classList.add('show');
            },
            expand: function () {
                sidebarMenu.classList.remove('collapse');
                mainContent.classList.remove('expand');
                //test, need remove this lines when table for machines is finish
                $$('#details-bar').classList.add('collapse');
                blackArea.classList.remove('show');
                $$('#edit-mode').classList.add('collapse');

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

    window.addEventListener('load', function () {
        generateMenu(data);
        generateLinks(categorySelectedId);
        selectCategory(categorySelectedId);
        chosenLink.innerHTML = data[categorySelectedId].category;

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

    on('show/app', function () {
        navigation.hide();
    });

    globalSearch.addEventListener('click', function () {
        chosenLink.innerHTML = 'Search';
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
            tempFragment.innerHTML = `<div class='center'>
                                        <div id="${category}" class="list-management center">
                                            <span class="mdi mdi-${icons[Object.keys(data).indexOf(category)]} custom-tooltip center"></span>
                                            <div class="list-name">${data[category].category}</div>
                                        </div>
                                        <span class="tooltip-text hidden">${data[category].category}</span>
                                    </div>`;
            tempFragment.childNodes[0].addEventListener('click', function () {
                categorySelectedId = category;
                searchCategory = category;
                generateLinks(category);
                chosenLink.innerHTML = data[category].category;
                searchLink.focus();
                navigation.show();
            });
            fragment.appendChild(tempFragment.childNodes[0]);
        }
        listWrapper.appendChild(fragment);
    }

    // generate links when you click on list from menu, and set click listener
    function generateLinks(category) {
        let fragment = document.createDocumentFragment();
        linkWrapper.innerHTML = '';
        generateLinksData(!category || data[category] ? data : category);
        function generateLinksData(tempData) {
            if (searchCategory) { // if searchCategory is not undefined, this function generates links based on it
                for (let categoryValue of tempData[searchCategory].value) {
                    let tempFragment = document.createElement('a');
                    tempFragment.id = `link-${categoryValue.id}`;
                    tempFragment.classList = 'link-list';
                    tempFragment.innerHTML = categoryValue.name;
                    tempFragment.addEventListener('click', function () {
                        linkSelectedId = `link-${categoryValue.id}`;
                        selectCategory(searchCategory);
                        selectLink(linkSelectedId);
                        navigation.hide();
                        let temp = categoryValue;
                        temp.categoryName = tempData[searchCategory].category
                        temp.category = searchCategory;
                        recentSearch(temp);
                    });
                    fragment.appendChild(tempFragment);
                }
            } else { //if searchCategory is undefined, function generates links based on object 
                for (let category in tempData) {
                    if (tempData[category].value.length !== 0) {
                        let tempCategory = document.createElement('div');
                        tempCategory.className = 'lists center';
                        if (category !== 'search') { //if category isn't 'search', lists have header
                            tempCategory.innerHTML = `<div>${tempData[category].category}</div>`;
                        }
                        for (let value of tempData[category].value) {
                            let tempValue = document.createElement('a');
                            tempValue.classList = 'link-list';
                            tempValue.id = `link-${value.id}`;
                            tempValue.innerHTML = `${value.name} (${category})`;
                            if (category === 'search') {// if category is 'search', link has name and category name in brakets 
                                tempValue.innerHTML = `${value.name} (${value.categoryName})`;
                            } else {
                                tempValue.innerHTML = value.name;
                            }
                            tempValue.addEventListener('click', function () {
                                searchCategory = categorySelectedId;
                                linkSelectedId = `link-${value.id}`;
                                let entry = value;
                                if (category === 'search') {// if category is 'search' category, categorySelectedId take category value from object
                                    categorySelectedId = value.category;
                                } else { //if category isn't 'search' category, variable entry will be populated with  category and categoryName
                                    entry.category = category;
                                    entry.categoryName = tempData[category].category
                                    categorySelectedId = category;
                                }
                                recentSearch(entry);
                                selectCategory(categorySelectedId);
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

    // highlight chosen category
    function selectCategory(category) {
        if (category !== 'search') {
            if (previousCategorySelected) {
                previousCategorySelected.classList.remove('list-active');
            }
            let listSelected = $$(`#${category}`);
            listSelected.classList.add('list-active');
            previousCategorySelected = listSelected;
        }
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
                    arrayResult[i] = value;
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

    // function to remember last search in localStorage
    function recentSearch(valueLink) {
        recent = JSON.parse(localStorage.getItem('recentSearch'));
        let recentArray = recent ? recent.search.value : [];
        let index = recentArray.findIndex((item) => item.id === valueLink.id);
        if (index !== -1) {
            recentArray.splice(index, 1);
        }
        recentArray.unshift(valueLink);
        let object = {};
        object['search'] = {
            'category': 'Recent search',
            'value': recentArray
        };
        localStorage.setItem('recentSearch', JSON.stringify(object));
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
                    arrayResult[i] = value;
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

    // function to remember last search in localStorage
    function recentSearch(valueLink) {
        recent = JSON.parse(localStorage.getItem('recentSearch'));
        let recentArray = recent ? recent.search.value : [];
        let index = recentArray.findIndex((item) => item.id === valueLink.id);
        if (index !== -1) {
            recentArray.splice(index, 1);
        }
        recentArray.unshift(valueLink);
        let object = {};
        object['search'] = {
            'category': 'Recent search',
            'value': recentArray
        };
        localStorage.setItem('recentSearch', JSON.stringify(object));
    }
})();