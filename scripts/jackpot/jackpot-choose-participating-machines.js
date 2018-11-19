const jackpotChooseParticipatingMachines = (function () {
    let chooseMachineJackpot = $$('#choose-machines-jackpot-wrapper');
    let chooseMachinesFilterWrapper = $$('#choose-machines-jackpot-content-filters');
    let chooseMachinesVendor = $$('#choose-machines-jackpot-content-filters-vendor');
    let chooseMachinesType = $$('#choose-machines-jackpot-content-filters-type');
    let chooseMachinesCasinos = $$('#choose-machines-jackpot-content-filters-casinos');
    let addNewJackpot = $$('#add-new-jackpot-wrapper');
    let closeChooseMachineButton = $$('#choose-machines-jackpot-header').children[1];
    let chooseMachines = $$('#add-new-jackpot-choose-machines-buttons').children[0]
    let inputChecked;
    //for input name
    let filterCount = 0;

    let chooseMachineJackpotBackButton = $$('#choose-machines-jackpot-buttons').children[0].children[0];
    let chooseMachineJackpotSaveButton = $$('#choose-machines-jackpot-buttons').children[0].children[1];

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

    chooseMachinesVendor.appendChild(createJackpotFilter(machinesVendors));
    chooseMachinesType.appendChild(createJackpotFilter(machinesType));
    chooseMachinesCasinos.appendChild(createJackpotFilterCasinos(casinoData));

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
                option.addEventListener('click', function () {
                    inputChecked = document.querySelectorAll(`input[name=${option.children[0].children[0].name}]:checked`);
                    if (wrapperOption.children.length - 1 === inputChecked.length) {
                        wrapperOption.children[0].children[0].children[0].checked = true;
                    }
                    else {
                        wrapperOption.children[0].children[0].children[0].checked = false;
                    }
                });
                wrapperOption.appendChild(option);
            }
        }
        filterCount++
        return wrapperOption;
    }
    function createJackpotFilterCasinos(data) {
        let cityArray = [];
        let wrapperOption = document.createElement('div');
        wrapperOption.classList.add('hidden');
        wrapperOption.classList.add('overflow-y');
        wrapperOption.innerHTML = `<div title = "All" data-value="All"> <label class="form-checkbox" >
                                    <input type="checkbox">
                                    <i class="form-icon" data-elementId = "All"></i> <div>All</div>
                                    </label> </div>`;

        wrapperOption.children[0].addEventListener('click', function () {
            if (wrapperOption.children[0].children[0].children[0].checked === true) {
                for (let check of wrapperOption.children) {
                    if (check.dataset.value != 'All') {
                        check.children[0].children[0].children[0].checked = true;
                        check.children[0].classList.add('is-checked-city');
                        for (let checkCasino of check.children[1].children) {
                            checkCasino.children[0].children[0].checked = true;
                        }
                    }
                }
            }
            else {
                for (let check of wrapperOption.children) {
                    if (check.dataset.value != 'All') {
                        check.children[0].children[0].children[0].checked = false;
                        check.children[0].classList.remove('is-checked-city');
                        for (let checkCasino of check.children[1].children) {
                            checkCasino.children[0].children[0].checked = false;
                        }
                    }
                }
            }
        });
        for (let element of data.Value) {
            if (!cityArray.includes(element.City)) {
                let option = document.createElement('div');
                option.title = element.City;
                option.dataset.value = element.City;
                option.id = `city-${element.City}-option`
                option.innerHTML = `<div class="city-option"> <label class="form-checkbox" >
                                    <input type="checkbox">
                                    <i class="form-icon" data-elementId = "${element.City}"></i>
                                    </label> <div>${element.City}</div>
                                    </div>`;
                let newOptionWrapper = document.createElement('div');
                newOptionWrapper.classList.add('hidden');
                let newOption = document.createElement('div');
                newOption.title = element.Name;
                newOption.dataset.value = element.Name;
                newOption.innerHTML = `<label class="form-checkbox" >
                                    <input type="checkbox" name="is-casino-checked-${element.City}">
                                    <i class="form-icon" data-elementId = "${element.Name}"></i> <div>${element.Name}</div>
                                    </label>`;
                newOption.addEventListener('click', function () {
                    inputChecked = document.querySelectorAll(`input[name=is-casino-checked-${element.City}]:checked`);
                    if (newOptionWrapper.children.length === inputChecked.length) {
                        option.children[0].children[0].children[0].checked = true;
                        checkForAllCasinos();
                    }
                    else {
                        if (inputChecked.length === 0) {
                            option.children[0].classList.remove('is-checked-city');

                        }
                        else {
                            option.children[0].classList.add('is-checked-city');
                        }

                        wrapperOption.children[0].children[0].children[0].checked = false;

                        option.children[0].children[0].children[0].checked = false;
                    }
                });
                newOptionWrapper.appendChild(newOption);
                option.appendChild(newOptionWrapper);

                wrapperOption.appendChild(option);
                cityArray.push(element.City);
            }
            else {
                for (let city of wrapperOption.children) {
                    if (city.dataset.value === element.City) {
                        let newOption = document.createElement('div');
                        newOption.title = element.Name;
                        newOption.dataset.value = element.Name;
                        newOption.innerHTML = `<label class="form-checkbox" >
                                            <input type="checkbox" name="is-casino-checked-${element.City}">
                                            <i class="form-icon" data-elementId = "${element.Name}"></i> <div>${element.Name}</div>
                                            </label>`;
                        newOption.addEventListener('click', function () {
                            inputChecked = document.querySelectorAll(`input[name=is-casino-checked-${element.City}]:checked`);
                            if (city.children[1].children.length === inputChecked.length) {
                                city.children[0].children[0].children[0].checked = true;

                                checkForAllCasinos();
                            }
                            else {
                                if (inputChecked.length === 0) {
                                    city.children[0].classList.remove('is-checked-city');
                                }
                                else {
                                    city.children[0].classList.add('is-checked-city');
                                }
                                wrapperOption.children[0].children[0].children[0].checked = false;
                                city.children[0].children[0].children[0].checked = false;
                            }
                        });
                        city.children[1].appendChild(newOption);
                    }
                }
            }
        }
        return wrapperOption
    }

    function checkForAllCasinos() {
        // if checked all city check all
        let count = 0
        for (let checkedCity of chooseMachinesCasinos.children[1].children) {
            if (checkedCity.dataset.value != 'All' && checkedCity.children[0].children[0].children[0].checked) {
                count++
            }
        }
        if (chooseMachinesCasinos.children[1].children.length - 1 === count) {
            chooseMachinesCasinos.children[1].children[0].children[0].children[0].checked = true;
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
        for (let element of chooseMachinesFilterWrapper.children) {
            element.children[0].addEventListener('click', function () {
                activeFilter(element);
            });
        }
        for (let city of $$('.city-option')) {
            city.children[1].addEventListener('click', function () {
                city.parentNode.children[1].classList.toggle('hidden');
            });
            city.children[0].addEventListener('click', function (e) {
                if (city.children[0].children[0].checked) {
                    city.classList.add('is-checked-city');

                    checkForAllCasinos();

                    //check all casinos in city
                    for (let check of city.parentNode.children[1].children) {
                        check.children[0].children[0].checked = true;
                    }
                }
                else {
                    city.classList.remove('is-checked-city');
                    if (city.parentNode.parentNode.children.length - 1 !== $$('.is-checked-city').length) {
                        city.parentNode.parentNode.children[0].children[0].children[0].checked = false;
                    }

                    for (let check of city.parentNode.children[1].children) {
                        check.children[0].children[0].checked = false;
                    }
                }
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
})();