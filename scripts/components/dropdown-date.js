const dropdownDate = (function () {
    //index of single select 
    let indexDsId = 0;
    //date select array
    let dateSelectArray = [];
    // let global variable for select date
    let activeSelectId;
    //indicate custom option
    let pickCustom = false;
    //generate single dropdown
    function generate(dataSelect, element) {
        if (element) {
            removeChildren(element);
        }
        // wrapper select
        let select = document.createElement('div');
        select.dataset.selectId = indexDsId;
        select.classList.add('default-date-select');
        select.id = `ds-${indexDsId}`;
        //selected option
        let selected = document.createElement('div');
        selected.innerHTML = dataSelect[0];
        selected.title = selected.innerHTML;
        selected.dataset.value = dataSelect[0];
        selected.classList.add('element-table-filters');
        //wrapper options group
        let optionGroupWrapper = document.createElement('div');
        optionGroupWrapper.classList.add('hidden');
        optionGroupWrapper.classList.add('option-select-date');
        let optionGroup = document.createElement('div');
        optionGroup.classList.add('overflow-y');
        let customDate = document.createElement('div');

        customDate.innerHTML = `<div id="date-from-${indexDsId}" class="choose-date-time">
                                <div data-translation-key="DateFrom">Date from:</div>
                                <input id="datepicker-from-${indexDsId}" type="text" class="datepicker" readonly>                                
                                </div>
                                <div id="time-from-${indexDsId}" class="choose-date-time">
                                <div data-translation-key="TimeFrom">Time from:</div>
                                <div class="timepicker"></div>                            
                                </div>
                                <div id="date-to-${indexDsId}" class="choose-date-time">
                                <div data-translation-key="DateTo">Date to:</div>
                                <input id="datepicker-to-${indexDsId}" type="text" class="datepicker" readonly>                                
                                </div>
                                <div id="time-to-${indexDsId}" class="choose-date-time">
                                <div data-translation-key="TimeTo">Time to:</div>
                                <div class="timepicker"></div>                                
                                </div>`

        let buttonsCustomDate = document.createElement('div');
        buttonsCustomDate.classList.add('custom-date-buttons-wrapper');
        buttonsCustomDate.classList.add('button-wrapper');
        buttonsCustomDate.classList.add('center');

        let applyCustom = document.createElement('button');

        applyCustom.classList.add('secundarybutton');
        applyCustom.innerHTML = 'Apply';
        applyCustom.addEventListener('click', function () {
            trigger(`apply-custom-date`, { selectId: select.dataset.selectId, target: applyCustom });
        });

        let cancelCustom = document.createElement('a');
        cancelCustom.classList.add('button-link');
        cancelCustom.innerHTML = 'Cancel';
        cancelCustom.addEventListener('click', function () {
            trigger(`cancel-custom-date`, { selectId: select.dataset.selectId, target: applyCustom });
        });

        buttonsCustomDate.appendChild(applyCustom);
        buttonsCustomDate.appendChild(cancelCustom);
        customDate.appendChild(buttonsCustomDate);

        customDate.classList.add('hidden');
        for (let element of dataSelect) {
            //option with functionality
            let option = document.createElement('div');
            option.classList.add('single-option');
            option.innerHTML = element;
            option.title = option.innerHTML;
            option.dataset.value = element;
            option.dataset.translationKey = element;
            optionGroup.appendChild(option);
            option.addEventListener('click', function (e) {
                e.preventDefault();
                if (option.dataset.value === 'Custom') {
                    customDate.classList.toggle('hidden');
                    pickCustom = !pickCustom;
                    delete applyCustom.dataset.value;
                }
                else {
                    selected.innerHTML = option.innerHTML;
                    selected.title = selected.innerHTML;
                    selected.dataset.value = option.dataset.value;
                    customDate.classList.add('hidden');
                    pickCustom = false;
                }
            });
        }
        optionGroupWrapper.appendChild(optionGroup);
        optionGroupWrapper.appendChild(customDate);
        select.appendChild(selected);
        select.appendChild(optionGroupWrapper);

        indexDsId++;
        dateSelectArray.push(select.id);
        if (element) {
            element.appendChild(select);
            return element;
        }
        return select;
    }
    window.addEventListener('click', function (e) {
        e.preventDefault();
        let advanceTableFilterIsOpen = false;
        let found = false;
        let current = e.target;
        while (current) {
            for (let selectId of dateSelectArray) {
                if (current.id === selectId) {
                    found = true;
                    if (current.id != activeSelectId && activeSelectId) {
                        $$(`.active-date-select`)[0].children[1].children[1].classList.add('hidden');
                        $$(`.active-date-select`)[0].children[1].classList.add('hidden');
                        $$('.active-date-select')[0].classList.toggle('active-date-select');
                        pickCustom = false;
                    }
                    activeSelectId = selectId;
                }
            }
            //this is for advance filters
            if (current && current.classList && current.classList.contains('advance-filter-active')) {
                advanceTableFilterIsOpen = true;
                break;
            }
            current = current.parentNode;
        }
        //TODO PITAJ LAZARA DA ISPRAVI BAG
        if (found && !pickCustom && e.target.dataset && e.target.dataset.value !== 'Custom' || e.target.parentNode && e.target.parentNode.id === activeSelectId || found && pickCustom && e.target.dataset && e.target.dataset.value === 'Apply custom date') {
            $$(`#${activeSelectId}`).children[1].children[1].classList.add('hidden');
            $$(`#${activeSelectId}`).children[1].classList.toggle('hidden');
            $$(`#${activeSelectId}`).classList.toggle('active-date-select');
            if (!$$(`#${activeSelectId}`).classList.contains('active-date-select')) {
                activeSelectId = !activeSelectId;
            }
            pickCustom = false;
        }
        else if (found && pickCustom || e.target.classList && e.target.classList.contains('pika-select') || found && e.target.dataset && e.target.dataset.value === 'Custom' || e.target.classList && e.target.classList.contains('is-disabled') || e.target.classList && e.target.classList.contains('is-empty')) {
            $$(`#${activeSelectId}`).classList.add('active-date-select');
            $$(`#${activeSelectId}`).children[1].classList.remove('hidden');
        }
        else {
            if (activeSelectId) {
                $$(`.active-date-select`)[0].children[1].children[1].classList.add('hidden');
                $$(`.active-date-select`)[0].children[1].classList.add('hidden');
                $$('.active-date-select')[0].classList.toggle('active-date-select');
                activeSelectId = false;
                pickCustom = false;
            }
        }
        //this is for advance filters
        if (advanceTableFilterIsOpen || e.target.classList && e.target.classList.contains('pika-select') || e.target.classList && e.target.classList.contains('is-disabled') || e.target.classList && e.target.classList.contains('is-empty')) {
            $$('.advance-filter-active')[0].children[1].classList.remove('hidden');
            if (e.target.parentNode && e.target.parentNode.classList.contains('apply-advance-filter')) {
                $$('.advance-filter-active')[0].children[1].classList.add('hidden');
                $$('.advance-filter-active')[0].classList.remove('advance-filter-active')
            }
        }
        else {
            if ($$('.advance-filter-active')[0]) {
                $$('.advance-filter-active')[0].children[1].classList.add('hidden');
                $$('.advance-filter-active')[0].classList.remove('advance-filter-active')
            }
        }
    });
    return {
        generate
    };
})();