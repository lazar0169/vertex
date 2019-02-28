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
    function generate(data) {
        let values = data.values;
        let parent = data.parent
        if (parent) {
            removeChildren(parent);
        }
        // wrapper select
        let select = document.createElement('div');
        select.dataset.selectId = indexDsId;
        select.classList.add('default-date-select');
        select.id = `ds-${indexDsId}`;
        //selected option
        let selected = document.createElement('div');

        selected.innerHTML = `<div></div>
                              <span class="closed-arrow">&#9660;</span>`;
        select.appendChild(selected);
        selected.children[0].innerHTML = values[0].Name;
        selected.title = selected.children[0].innerHTML;
        selected.dataset.id = values[0].Id !== -1 ? values[0].Id : null;
        selected.dataset.value = values[0].Name;
        selected.classList.add('element-table-filters');
        selected.classList.add('center');
        selected.classList.add('opened-closed-wrapper');
        if (data.name) {
            selected.dataset.name = data.name;
        }
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
        let setDatePicker = customDate.getElementsByClassName('datepicker');

        for (let picker of setDatePicker) {
            picker.dataset.value = new Date().toISOString().split('T')[0];
            picker.value = new Date().toISOString().split('T')[0];
        }


        customDate.classList.add('hidden');
        for (let element of values) {
            //option with functionality
            let option = document.createElement('div');
            option.classList.add('single-option');
            option.innerHTML = element.Name;
            option.title = option.innerHTML;
            option.dataset.value = element.Name;
            option.dataset.id = element.Id !== -1 ? element.Id : null;
            option.dataset.translationKey = element.Name ? element.Name : element.name;;
            optionGroup.appendChild(option);
            option.addEventListener('click', function (e) {
                e.preventDefault();
                selected.dataset.id = option.dataset.id;
                if (option.dataset.value === 'Custom') {
                    customDate.classList.toggle('hidden');
                    if (customDate.classList.contains('hidden')) {
                        selected.dataset.id = optionGroup.children[0].dataset.id;
                        selected.dataset.value = optionGroup.children[0].dataset.value;
                        selected.children[0].innerHTML = optionGroup.children[0].innerHTML;
                    }
                    pickCustom = !pickCustom;
                    delete applyCustom.dataset.value;
                }
                else {
                    selected.children[0].innerHTML = option.innerHTML;
                    selected.title = selected.children[0].innerHTML;
                    selected.dataset.value = option.dataset.value;
                    customDate.classList.add('hidden');
                    pickCustom = false;
                }
            });
        }
        optionGroupWrapper.appendChild(optionGroup);
        optionGroupWrapper.appendChild(customDate);
        if (customDate.getElementsByClassName('timepicker').length !== 0) {
            for (let picker of customDate.getElementsByClassName('timepicker')) {
                dropdown.generate({ values: hours, parent: picker });
                picker.appendChild(dropdown.generate({ values: minutes }));
            }
        }

        select.appendChild(selected);
        select.appendChild(optionGroupWrapper);

        indexDsId++;
        dateSelectArray.push(select.id);
        datepicker.generate({ dropdownDate: select })


        select.get = function () {
            let dateFromTo = selected.dataset.value.split(', ');
            let selectedId = selected.dataset.id
            if (dateFromTo.length < 2) {
                dateFromTo = [null, null];
            }
            let dateFrom = dateFromTo[0];
            let dateTo = dateFromTo[1];
            return {
                dateFrom,
                dateTo,
                selectedId
            }
        }
        select.reset = function () {
            selected.dataset.id = values[0].Id !== -1 ? values[0].Id : null;
            selected.dataset.value = values[0].Name;
            selected.children[0].innerHTML = localization.translateMessage(values[0].Name);
            selected.title = selected.children[0].innerHTML;
            return selected;
        }

        select.set = function (params) {
            for (let option of optionGroup.children) {
                if (params === option.dataset.id && option.dataset.value !== 'Custom') {
                    selected.dataset.id = params;
                    selected.dataset.value = option.dataset.value;
                    selected.children[0].innerHTML = option.innerHTML;
                    selected.title = selected.children[0].innerHTML;
                }
            }
            return selected;
        }



        if (parent) {
            parent.appendChild(select);
            return parent;
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
                        $$('.active-date-select')[0].children[0].children[1].classList.remove('opened-arrow');
                        $$('.active-date-select')[0].classList.remove('active-date-select');
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

        if (found && !pickCustom && e.target.dataset && e.target.dataset.value !== 'Custom' || e.target.parentNode && e.target.parentNode.id === activeSelectId || found && pickCustom && e.target.dataset && e.target.dataset.value === 'Apply custom date') {
            $$(`#${activeSelectId}`).children[1].children[1].classList.add('hidden');
            $$(`#${activeSelectId}`).children[1].classList.toggle('hidden');
            $$(`#${activeSelectId}`).classList.toggle('active-date-select');
            $$(`#${activeSelectId}`).children[0].children[1].classList.toggle('opened-arrow');
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
                $$(`.active-date-select`)[0].children[0].children[1].classList.remove('opened-arrow');
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
                $$('.advance-filter-active')[0].classList.remove('advance-filter-active');
            }
        }
        else {
            if ($$('.advance-filter-active')[0]) {
                $$('.advance-filter-active')[0].children[1].classList.add('hidden');
                $$('.advance-filter-active')[0].children[0].children[1].classList.remove('opened-arrow')
                $$('.advance-filter-active')[0].classList.remove('advance-filter-active');
            }
        }
        //this is for table search
        if (e.target.classList && e.target.classList.contains('advance-filter-tabele-search')) {

            if ($$('.advance-filter-tabele-search-active')[0]) {
                $$('.advance-filter-tabele-search-active')[0].children[0].classList.add('hidden');
                $$('.advance-filter-tabele-search-active')[0].classList.remove('advance-filter-tabele-search-active');
            }

            e.target.children[0].classList.remove('hidden');
            e.target.classList.add('advance-filter-tabele-search-active');
            e.target.children[0].children[0].focus();
        }

        else if ($$('.advance-filter-tabele-search-active')[0] && document.activeElement.classList && !document.activeElement.classList.contains('search')) {
            $$('.advance-filter-tabele-search-active')[0].children[0].classList.add('hidden');
            $$('.advance-filter-tabele-search-active')[0].classList.remove('advance-filter-tabele-search-active');
        }

        //this is for logout
        if (e.target.id && e.target.id === 'top-bar-logout') {
            trigger('opened-arrow', { div: $$('#top-bar-logout-user') });
            $$('#top-bar-logout').classList.toggle('logout-is-opened');
            $$('#top-bar-logout-dropdown-menu').classList.toggle('hidden');
        }
        else {
            $$('#top-bar-logout-user').children[1].classList.remove('opened-arrow');
            $$('#top-bar-logout').classList.remove('logout-is-opened');
            $$('#top-bar-logout-dropdown-menu').classList.add('hidden');
        }

        //this is for malfunction details
        if (e.target.classList && e.target.classList.contains('table-item') && JSON.parse(sessionStorage.categoryAndLink).category === 'Malfunctions') {
            $$('#malfunctions-details').classList.remove('collapse');
            $$('#black-area').classList.add('show');
            trigger('malfunctions-details/machines-history', { target: e.target });
        }
    });
    return {
        generate
    };
})();