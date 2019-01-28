const jackpotChooseParticipatingMachines = (function () {
    let chooseMachineJackpot = $$('#choose-machines-jackpot-wrapper');
    let chooseMachinesFilterWrapper = $$('#choose-machines-jackpot-content-filters');
    let chooseMachinesVendor = $$('#choose-machines-jackpot-content-filters-vendor');
    let chooseMachinesType = $$('#choose-machines-jackpot-content-filters-type');
    let chooseMachinesCasinos = $$('#choose-machines-jackpot-content-filters-casinos');
    let addNewJackpot = $$('#add-new-jackpot-wrapper');
    let closeChooseMachineButton = $$('#choose-machines-jackpot-header').children[1];
    let chooseMachines = $$('#add-new-jackpot-choose-machines-buttons').children[0]
    //for input name
    let filterCount = 0;

    let chooseMachineJackpotBackButton = $$('#choose-machines-jackpot-buttons').children[0].children[0];
    let chooseMachineJackpotSaveButton = $$('#choose-machines-jackpot-buttons').children[0].children[1];

    // show/hide chose machine form
    let showHideChooseMachine = function () {
        return {
            hide: function () {
                chooseMachineJackpot.classList.add('hidden');
                blackArea.classList.remove('show');
            },
            show: function () {
                chooseMachineJackpot.classList.remove('hidden');
                blackArea.classList.add('show');
            }
        };
    }();
    //add options for choosing, like a dropdown
    chooseMachinesVendor.appendChild(createJackpotFilter(machinesVendors));
    chooseMachinesType.appendChild(createJackpotFilter(machinesType));
    chooseMachinesCasinos.appendChild(createJackpotFilterCasinos(casinoData));

    //create jackpot filter (by type and vendor)
    function createJackpotFilter(data) {

        let wrapperOption = document.createElement('div');
        wrapperOption.classList.add('hidden');
        wrapperOption.classList.add('overflow-y');
        wrapperOption.innerHTML = `<div title = "All" data-value="All"> <label class="form-checkbox" >
                                    <input type="checkbox">
                                    <i class="form-icon" data-elementId = "All"></i> <div>All</div>
                                    </label> </div>`;

        wrapperOption.children[0].addEventListener('click', function () {
            if (wrapperOption.children[0].children[0].children[0].checked === true) {
                wrapperOption.children[0].children[0].children[0].checked = false;
            }
            else {
                wrapperOption.children[0].children[0].children[0].checked = true;
            }

            if (wrapperOption.children[0].children[0].children[0].checked === true) {
                for (let check of wrapperOption.children) {
                    if (check.dataset.value !== 'All') {
                        check.children[0].children[0].checked = true;
                    }
                }
            }
            else {
                for (let check of wrapperOption.children) {
                    if (check.dataset.value !== 'All') {
                        check.children[0].children[0].checked = false;
                    }
                }
            }
        });
        for (let element of data) {
            if (element.Name !== '-') {
                let option = document.createElement('div');
                option.title = element.Name;
                option.dataset.value = element.Name;
                option.innerHTML = `<label class="form-checkbox" >
                                                    <input type="checkbox" name="is-checked-${filterCount}">
                                                    <i class="form-icon" data-elementId = "${element.Name}"></i> <div>${element.Name}</div>
                                                </label>`;
                wrapperOption.appendChild(option);

                option.addEventListener('click', function () {
                    if (option.children[0].children[0].checked === true) {
                        option.children[0].children[0].checked = false;
                    }
                    else {
                        option.children[0].children[0].checked = true;
                    }

                    let inputChecked = document.querySelectorAll(`input[name=${option.children[0].children[0].name}]:checked`);
                    if (wrapperOption.children.length - 1 === inputChecked.length) {
                        wrapperOption.children[0].children[0].children[0].checked = true;
                    }
                    else {
                        wrapperOption.children[0].children[0].children[0].checked = false;
                    }
                });
            }
        }
        filterCount++
        return wrapperOption;
    }

    //create jackpot filter (by place)
    function createJackpotFilterCasinos(data) {

        let wrapperOptionAndSearch = document.createElement('div');
        wrapperOptionAndSearch.classList.add('hidden');
        wrapperOptionAndSearch.classList.add('background-dark');
        wrapperOptionAndSearch.classList.add('cities-wrapper');

        wrapperOptionAndSearch.innerHTML = `<div class="center">
                                    <input class="element-multilanguage search search-casino" type="text" onfocus="value=''" placeholder="search" data-translation-key="search">
                                    </div>`

        wrapperOptionAndSearch.children[0].children[0].addEventListener('keyup', function (e) {
            let termin = wrapperOptionAndSearch.children[0].children[0].value
            searchCasinosAndCities(wrapperOptionAndSearch, data, termin);
        });



        generateCasinosAndCities(wrapperOptionAndSearch, data);


        return wrapperOptionAndSearch;
    }

    //generating casinos in cities
    function generateCasinosAndCities(div, data) {

        let cityArray = [];
        let checkedCasino;
        let wrapperOption = document.createElement('div');
        wrapperOption.classList.add('overflow-y');

        let allCasinos = document.createElement('div');
        allCasinos.classList.add('option-all')
        allCasinos.addEventListener('click', function () {
            if (allCasinos.children[0].children[0].checked) {
                allCasinos.children[0].children[0].checked = false;
                selectAllCities(allCasinos.parentNode)
            }
            else {
                allCasinos.children[0].children[0].checked = true;
                selectAllCities(allCasinos.parentNode)
            }
        });

        allCasinos.innerHTML = `<label class="form-checkbox" >
                                    <input type="checkbox" name='checkbox-group-all-cities'>
                                    <i class="form-icon" data-elementId = "All"></i> <div>All</div>
                                    </label>`;
        wrapperOption.appendChild(allCasinos)
        allCasinos.dataset.value = 'all';
        allCasinos.title = allCasinos.children[0].children[2].innerHTML;

        for (let element of data.Value) {
            if (element.checked) {
                checkedCasino = 'checked';
            }
            else {
                checkedCasino = '';
            }
            if (!cityArray.includes(element.City)) {
                let optionCity = document.createElement('div');
                optionCity.title = element.City;
                optionCity.dataset.value = element.City;
                optionCity.classList.add('border-bottom-cities');

                optionCity.innerHTML = `<div class="option-city"> <div> <label class="form-checkbox" >
                                    <input type="checkbox" name='checkbox-group-cities'>
                                    <i class="form-icon" data-elementId = "${element.City}"></i>
                                    </label></div> <div class="center opened-closed-wrapper"><div>${element.City}</div>  <span class="closed-arrow">&#9660;</span></div>
                                    </div>`;
                wrapperOption.appendChild(optionCity);

                optionCity.children[0].children[0].addEventListener('click', function () {
                    if (optionCity.children[0].children[0].children[0].children[0].checked) {
                        optionCity.children[0].children[0].children[0].children[0].checked = false;
                        optionCity.children[0].classList.remove('color-white');
                        for (let casino of optionCity.children[1].children) {
                            casino.children[0].children[0].checked = false;
                        }
                        checkGroupCitiesCheckbox(optionCity.parentNode, optionCity.children[0].children[0].children[0].children[0].name)
                    }
                    else {
                        optionCity.children[0].children[0].children[0].children[0].checked = true;
                        optionCity.children[0].classList.add('color-white');
                        for (let casino of optionCity.children[1].children) {
                            casino.children[0].children[0].checked = true;
                        }
                        checkGroupCitiesCheckbox(optionCity.parentNode, optionCity.children[0].children[0].children[0].children[0].name)
                    }
                });

                optionCity.children[0].children[1].addEventListener('click', function () {
                    trigger('opened-arrow', { div: optionCity.children[0].children[1] });
                    optionCity.children[1].classList.toggle('hidden');
                });

                let newOptionCityWrapper = document.createElement('div');
                newOptionCityWrapper.classList.add('hidden');
                newOptionCityWrapper.classList.add('option-casionos-in-city-wrapper');


                newOptionCityWrapper.innerHTML = `<div title=${element.Name} data-value=${element.Name} class="option-casino"> 
                                                 <label class="form-checkbox">
                                                 <input type="checkbox" name="casino-group-${element.City}" ${checkedCasino}>
                                                 <i class="form-icon" data-elementId = "${element.Name}"></i> <div>${element.Name}</div>
                                                 </label> </div>`;

                optionCity.appendChild(newOptionCityWrapper);

                if (checkedCasino) {
                    newOptionCityWrapper.classList.remove('hidden');
                    newOptionCityWrapper.parentNode.children[0].children[1].children[1].classList.add('opened-arrow')
                }

                newOptionCityWrapper.children[0].addEventListener('click', function () {
                    if (newOptionCityWrapper.children[0].children[0].children[0].checked) {
                        newOptionCityWrapper.children[0].children[0].children[0].checked = false;
                        newOptionCityWrapper.parentNode.parentNode.children[0].children[0].children[0].checked = false;
                        checkGroupCasinosCheckbox(newOptionCityWrapper, newOptionCityWrapper.children[0].children[0].children[0].name);
                    }
                    else {
                        newOptionCityWrapper.children[0].children[0].children[0].checked = true;
                        checkGroupCasinosCheckbox(newOptionCityWrapper, newOptionCityWrapper.children[0].children[0].children[0].name);
                    }
                });
                cityArray.push(element.City);
            }
            else {
                for (let city of wrapperOption.children) {
                    if (city.dataset.value === element.City) {
                        let newOption = document.createElement('div');
                        newOption.title = element.Name;
                        newOption.dataset.value = element.Name;
                        newOption.classList.add('option-casino');



                        newOption.innerHTML = `<label class="form-checkbox" >
                                                         <input type="checkbox" name="casino-group-${element.City}" ${checkedCasino}>
                                                         <i class="form-icon" data-elementId = "${element.Name}"></i> <div>${element.Name}</div>
                                                         </label>`;

                        if (checkedCasino) {
                            city.children[1].classList.remove('hidden');
                            city.children[0].children[1].children[1].classList.add('opened-arrow')
                        }
                        newOption.addEventListener('click', function () {
                            if (newOption.children[0].children[0].checked) {
                                newOption.children[0].children[0].checked = false;
                                checkGroupCasinosCheckbox(newOption.parentNode, newOption.children[0].children[0].name);
                            }
                            else {
                                newOption.children[0].children[0].checked = true;

                                checkGroupCasinosCheckbox(newOption.parentNode, newOption.children[0].children[0].name);
                            }
                        });
                        city.children[1].appendChild(newOption);
                    }
                }
            }
        }
        div.appendChild(wrapperOption)
    }

    //search casions in cities
    function searchCasinosAndCities(wrapperOptionAndSearch, data, termin) {
        console.log(data.Value);
        console.log(wrapperOptionAndSearch);
        let i = 0;
        let arrayResult = [];
        for (let value of data.Value) {
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
            'List': data.List,
            'Value': arrayResult
        };
        if (newObject.Value.length === 0) {
            wrapperOptionAndSearch.children[1].innerHTML = 'nema podataka'
        }
        else {
            wrapperOptionAndSearch.children[1].remove();
            generateCasinosAndCities(wrapperOptionAndSearch, newObject)
        }


    }


    function checkGroupCasinosCheckbox(group, groupName) {
        //ovde si stao prosledjujes ime grupe
        let inputChecked = document.querySelectorAll(`input[name=${groupName}]:checked`);
        if (group.children.length === inputChecked.length) {
            group.parentNode.children[0].children[0].children[0].children[0].checked = true;
            group.parentNode.children[0].classList.add('color-white');
            checkGroupCitiesCheckbox(group.parentNode.parentNode, group.parentNode.children[0].children[0].children[0].children[0].name);
        }
        else {
            group.parentNode.children[0].children[0].children[0].children[0].checked = false;
            group.parentNode.children[0].classList.remove('color-white');
            checkGroupCitiesCheckbox(group.parentNode.parentNode, group.parentNode.children[0].children[0].children[0].children[0].name)
        }
    }

    function checkGroupCitiesCheckbox(group, groupName) {
        let inputChecked = document.querySelectorAll(`input[name=${groupName}]:checked`);
        if (group.children.length - 1 === inputChecked.length) {
            group.children[0].children[0].children[0].checked = true;
        }
        else {
            group.children[0].children[0].children[0].checked = false;
        }
    }

    function selectAllCities(div) {
        for (let city of div.children) {
            if (city.dataset.value !== 'all') {
                if (div.children[0].children[0].children[0].checked) {
                    city.children[0].children[0].children[0].children[0].checked = true;
                    city.children[0].classList.add('color-white');
                    for (let casino of city.children[1].children) {
                        casino.children[0].children[0].checked = true;
                    }
                }
                else {
                    city.children[0].children[0].children[0].children[0].checked = false;
                    city.children[0].classList.remove('color-white');
                    for (let casino of city.children[1].children) {
                        casino.children[0].children[0].checked = false;
                    }
                }
            }
        }
    }

    function activeFilter(div) {
        for (let element of chooseMachinesFilterWrapper.children) {
            if (div !== element) {
                element.children[1].classList.add('hidden');
            }
            else {
                element.children[1].classList.toggle('hidden');
            }
        }
    }

    window.addEventListener('load', function () {
        // click listener for all filters (by type, vendor, casino)
        for (let element of chooseMachinesFilterWrapper.children) {
            element.children[0].addEventListener('click', function () {
                activeFilter(element);
            });
        }
    });
    closeChooseMachineButton.addEventListener('click', function () {
        showHideChooseMachine.hide();
    });

    chooseMachineJackpotBackButton.addEventListener('click', function () {
        showHideChooseMachine.hide();
    });
    chooseMachineJackpotSaveButton.addEventListener('click', function () {
        alert('Save machines for jackpot');
        showHideChooseMachine.hide();
    });
    chooseMachines.addEventListener('click', function () {
        showHideChooseMachine.show();
    });
    on('show/app', function () {
        showHideChooseMachine.hide();
    });

    window.addEventListener('keyup', function (event) {
        if (event.keyCode == 27) {
            showHideChooseMachine.hide();
            addNewJackpot.classList.add('hidden');
        }
    });

    return {
        createJackpotFilterCasinos
    };
})();