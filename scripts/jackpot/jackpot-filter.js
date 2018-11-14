const jackpotFilter = (function () {
    let advanceTableFilter = $$('#jackpot-advance-table-filter');
    let jackpotMachinesNumbers = $$('#jackpot-machines-number');
    let addJackpot = $$('#jackpot-add-jackpot').children[0];
    let jackpotChooseMachine = $$('#choose-machines-jackpot-wrapper');
    let chooseMachinesFilterWrapper = $$('#choose-machines-jackpot-content-filters');
    let chooseMachinesVendor = $$('#choose-machines-jackpot-content-filters-vendor');
    let chooseMachinesType = $$('#choose-machines-jackpot-content-filters-type');
    let chooseMachinesCasinos = $$('#choose-machines-jackpot-content-filters-casinos');


    // let jackpotAddMachineVendor = $$('#jackpot-add-machines-filter-vendor').children[0];
    // let jackpotAddMachineVendorList = $$('#jackpot-add-machines-filter-vendor').children[1];
    // let jackpotAddMachineType = $$('#jackpot-add-machines-filter-type').children[0];
    // let jackpotAddMachineTypeList = $$('#jackpot-add-machines-filter-type').children[1];
    // let jackpotAddButton = $$('#jackpot-add-machines-buttons').children[0];
    // let jackpotBackButton = $$('#jackpot-add-machines-buttons').children[1];
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
        for (let element of data) {
            if (element.Name !== '-') {
                let option = document.createElement('div');
                option.title = element.Name;
                option.dataset.value = element.Name;
                option.innerHTML = `<label class="form-checkbox" >
                                                    <input type="checkbox">
                                                    <i class="form-icon" data-elementId = "${element.Name}"></i> <div>${element.Name}</div>
                                                </label>`;
                wrapperOption.appendChild(option);
            }
        }
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

        for (let element of data.Value) {
            if (!cityArray.includes(element.City)) {
                let option = document.createElement('div');
                option.title = element.City;
                option.dataset.value = element.City;
                option.id = `city-${element.City}-option`
                option.innerHTML = `<div> <label class="form-checkbox" >
                                    <input type="checkbox">
                                    <i class="form-icon" data-elementId = "${element.City}"></i> <div class="city-option">${element.City}</div>
                                    </label> </div>`;
                let newOptionWrapper = document.createElement('div');
                newOptionWrapper.classList.add('hidden');
                let newOption = document.createElement('div');
                newOption.title = element.Name;
                newOption.dataset.value = element.Name;
                newOption.innerHTML = `<label class="form-checkbox" >
                                    <input type="checkbox">
                                    <i class="form-icon" data-elementId = "${element.Name}"></i> <div>${element.Name}</div>
                                    </label>`;


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
                                            <input type="checkbox">
                                            <i class="form-icon" data-elementId = "${element.Name}"></i> <div>${element.Name}</div>
                                            </label>`;
                        city.children[1].appendChild(newOption);
                    }
                }
            }
        }
        return wrapperOption
    }
    for (let city of $$('.city-option')) {
        city.addEventListener('click', function () {
            city.parentNode.parentNode.parentNode.children[1].classList.toggle('hidden')
        });
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
    for (let element of chooseMachinesFilterWrapper.children) {
        element.children[0].addEventListener('click', function () {
            activeFilter(element);
        });
    }



    // jackpotAddMachineVendor.addEventListener('click', function () {
    //     jackpotAddMachineVendorList.classList.toggle('hidden');
    // });
    // jackpotAddMachineType.addEventListener('click', function () {
    //     jackpotAddMachineTypeList.classList.toggle('hidden');
    // });
    // jackpotAddButton.addEventListener('click', function () {
    //     alert('Add jackpot');
    // });
    // jackpotAddAllMachines.addEventListener('click', function () {
    //     alert('Add all machines');
    // });
    // jackpotBackButton.addEventListener('click', function () {
    //     trigger('show/app');
    // });

    on('show/app', function () {
        jackpotChooseMachine.classList.add('hidden');
    });
})();