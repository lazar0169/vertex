const jackpotFilter = (function () {
    let advanceTableFilter = $$('#jackpot-advance-table-filter');
    let jackpotMachinesNumbers = $$('#jackpot-machines-number');
    let addJackpot = $$('#jackpot-add-jackpot').children[0];
    let jackpotChooseMachine = $$('#choose-machines-jackpot-wrapper');
    let chooseMachinesFilterWrapper = $$('#choose-machines-jackpot-content-filters');
    let chooseMachinesVendor = $$('#choose-machines-jackpot-content-filters-vendor');
    let chooseMachinesType = $$('#choose-machines-jackpot-content-filters-type');
    let chooseMachinesCasinos = $$('#choose-machines-jackpot-content-filters-casinos');
    let inputChecked;
    //for input name
    let filterCount = 0;

    // let jackpotAddMachineVendor = $$('#jackpot-add-machines-filter-vendor').children[0];
    // let jackpotAddMachineVendorList = $$('#jackpot-add-machines-filter-vendor').children[1];
    // let jackpotAddMachineType = $$('#jackpot-add-machines-filter-type').children[0];
    // let jackpotAddMachineTypeList = $$('#jackpot-add-machines-filter-type').children[1];
    // let jackpotAddButton = $$('#jackpot-add-machines-buttons').children[0];
    let jackpotBackButton = $$('#choose-machines-jackpot-buttons').children[0].children[0];
    let jackpotSaveButton = $$('#choose-machines-jackpot-buttons').children[0].children[1];
    // let jackpotAddAllMachines = $$('#jackpot-add-machines-filter').children[0];

    jackpotMachinesNumbers.appendChild(dropdown.generate(machinesNumber));

    advanceTableFilter.addEventListener('click', function () {
        advanceTableFilter.classList.toggle('jackpot-advance-active');
    });
    addJackpot.addEventListener('click', function () {
        $$('#black-area').classList.add('show');
        jackpotChooseMachine.classList.toggle('hidden');
    });

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
                                    <i id='proba' class="form-icon" data-elementId = "${element.City}"></i>
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
                    }
                    else {
                        if (inputChecked.length === 0) {
                            option.children[0].classList.remove('is-checked-city');
                        }
                        else {
                            option.children[0].classList.add('is-checked-city');
                        }
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
                            }
                            else {
                                if (inputChecked.length === 0) {
                                    city.children[0].classList.remove('is-checked-city');
                                }
                                else {
                                    city.children[0].classList.add('is-checked-city');
                                }
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
                    for (let check of city.parentNode.children[1].children) {
                        check.children[0].children[0].checked = true;
                    }
                }
                else {
                    city.classList.remove('is-checked-city');
                    for (let check of city.parentNode.children[1].children) {
                        check.children[0].children[0].checked = false;
                    }
                }
            });
        }
    });

    jackpotBackButton.addEventListener('click', function () {
        trigger('show/app');
    });
    jackpotSaveButton.addEventListener('click', function () {
        alert('Save machines for jackpot')
    });


    on('show/app', function () {
        jackpotChooseMachine.classList.add('hidden');
    });
})();