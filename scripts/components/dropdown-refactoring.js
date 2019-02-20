const dropdown = (function () {
    //index of single select 
    let indexDropdown = 0;
    //type of dropdowns
    let dropdownType = {
        'single': 1,
        'multi': 2
    }

    //generate single dropdown
    function generate(data) {
        let array = [];
        let arrayInner = [];
        let [...optionsArray] = data.optionValue;
        let [firstOption] = data.optionValue;
        let noSelectedData = firstOption;
        let type = data.type;
        if (!type) {
            type = 'single';
        }
        let existsId;
        if (data.element && data.element.children[1]) {
            removeChildren(data.element);
        }
        // wrapper select
        let select = document.createElement('div');
        select.classList.add('default-select');
        select.classList.add(`default-${type}-select`);
        select.classList.add('element-form-data');
        select.dataset.type = `${type}-select`;

        if (existsId) {
            select.id = existsId;
        } else {
            select.id = `${type}-${indexDropdown}`;
            indexDropdown++;
        }
        //selected option
        let selected = document.createElement('div');
        selected.classList.add('center');
        selected.classList.add('opened-closed-wrapper');
        selected.innerHTML = `<div></div><span class="closed-arrow">&#9660;</span>`;
        select.appendChild(selected);
        selected.classList.add('element-table-filters');
        selected.addEventListener('click', function () {
            optionGroup.classList.toggle('hidden');
            trigger('opened-arrow', { div: selected });
            select.classList.toggle(`active-${type}-select`);
        });
        //wrapper options group
        let optionGroup = document.createElement('div');
        optionGroup.classList.add('hidden');
        optionGroup.classList.add('overflow-y');

        switch (dropdownType[type]) {

            case 2:
                selected.children[0].innerHTML = localization.translateMessage(noSelectedData.Name);
                selected.dataset.value = null;
                selected.title = selected.children[0].innerHTML;
                if (noSelectedData.LongIdValue) {
                    selected.dataset.LongIdValue = noSelectedData.LongIdValue;
                }
                for (let element of optionsArray) {
                    //option with functionality
                    let option = document.createElement('div');
                    let item = {
                        Name: element.Name,
                        Value: element.Id || element.Id !== null || element.Id !== undefined ? element.Id : null,
                        LongId: element.LongId || element.LongId !== null || element.LongId !== undefined ? element.LongId : null
                    };
                    option.dataset.value = item.Value;
                    if (option.dataset.value === 'null' || option.dataset.value === '-1') {
                        option.dataset.value = null;
                        option.classList.add('hidden')
                    }
                    let label = document.createElement('label');
                    label.classList.add('form-checkbox');
                    let checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    let icon = document.createElement('icon');
                    icon.classList.add('form-icon');
                    icon.dataset.elementId = item.value;
                    let text = document.createElement('div');
                    text.innerHTML = item.Name;

                    label.appendChild(checkbox);
                    label.appendChild(icon);
                    label.appendChild(text);
                    option.appendChild(label);
                    option.title = item.Name;
                    optionGroup.appendChild(option);

                    option.addEventListener('click', function (e) {
                        e.preventDefault();
                        if (option.children[0].children[0].checked === false) {
                            if (selected.children[0].innerHTML === '-') {
                                array = [];
                                arrayInner = [];
                                selected.children[0].innerHTML = option.children[0].children[2].innerHTML;
                            } else {
                                selected.children[0].innerHTML += `, ${option.children[0].children[2].innerHTML}`;
                            }
                            array.push(option.dataset.value);
                            arrayInner.push(option.children[0].children[2].innerHTML);
                            option.children[0].children[0].checked = true;
                        } else {
                            let i = 0;
                            for (let elem of array) {
                                if (elem === option.dataset.value) {
                                    array.splice(i, 1);
                                    arrayInner.splice(i, 1);
                                }
                                i++
                            }
                            selected.children[0].innerHTML = arrayInner.join(', ');
                            option.children[0].children[0].checked = false;
                            if (selected.children[0].innerHTML === '') {
                                selected.children[0].innerHTML = noSelectedData.Name;
                                array.push('null');
                                arrayInner.push(noSelectedData.Name);
                            }
                        }
                        selected.title = selected.children[0].innerHTML;
                        selected.dataset.value = array;
                    });
                }
                break;

            default:
                for (let element of optionsArray) {
                    let item = {
                        Name: element.Name,
                        Value: element.Id !== -1 ? element.Id : null,
                        LongId: element.longIdValue ? element.Id : null
                    };
                    if (!selected.dataset.value) {
                        selected.children[0].innerHTML = localization.translateMessage(item.Name);
                        selected.dataset.value = item.Value;
                        selected.title = selected.children[0].innerHTML;
                        if (item.LongIdValue) {
                            selected.dataset.LongIdValue = item.LongIdValue;
                        }
                    }
                    let option = document.createElement('div');
                    option.classList.add('single-option');
                    option.innerHTML = localization.translateMessage(item.Name);
                    option.dataset.value = item.Value;
                    if (item.longIdValue) {
                        option.dataset.LongIdValue = item.LongIdValue;
                    }
                    //option with functionality
                    option.title = option.innerHTML;
                    optionGroup.appendChild(option);

                    option.addEventListener('click', function (e) {
                        e.preventDefault();
                        selected.children[0].innerHTML = option.innerHTML;
                        trigger('opened-arrow', { div: selected });
                        selected.title = selected.children[0].innerHTML;
                        selected.dataset.value = option.dataset.value;
                        if (option.dataset.valueLongId) {
                            selected.dataset.valueLongId = option.dataset.valueLongId;
                        }
                        select.classList.remove('active-single-select');
                        optionGroup.classList.add('hidden');
                    });
                }
        }
        select.appendChild(optionGroup);

        select.get = function () {
            return selected.dataset.value;
        }

        select.reset = function () {
            selected.dataset.value = optionsArray[0].Id !== -1 ? optionsArray[0].Id : null;
            selected.children[0].innerHTML = localization.translateMessage(optionsArray[0].Name);
            selected.title = selected.children[0].innerHTML;
            if (dropdownType[type] == 2) {
                for (let check of optionGroup.children) {
                    check.children[0].children[0].checked = false;
                }
            }
            return selected;
        }

        select.set = function (params) {
            selected.dataset.value = params;
            for (let option of optionGroup.children) {
                for (let setId of params) {
                    switch (dropdownType[type]) {
                        case 1:
                            if (setId === option.dataset.value) {
                                selected.firstChild.innerHTML = localization.translateMessage(option.innerHTML);
                                selected.firstChild.title = option.innerHTML;
                            }
                            break;

                        case 2:
                            if (setId === option.dataset.value) {
                                if (selected.firstChild.innerHTML === '-') {
                                    selected.firstChild.innerHTML = option.children[0].children[2].innerHTML;
                                } else {
                                    selected.firstChild.innerHTML += `, ${option.children[0].children[2].innerHTML}`;
                                }
                                array.push(option.dataset.value);
                                arrayInner.push(option.children[0].children[2].innerHTML);
                                selected.title = selected.firstChild.innerHTML;
                                option.children[0].children[0].checked = true;
                            }
                            break;
                    }
                }
            }
            return selected;
        }

        if (data.element) {
            data.element.appendChild(select);
            return data.element;
        }
        return select;
    }

    window.addEventListener('click', function (e) {
        e.preventDefault();
        //this is for single select
        for (let selectId of $$('.default-single-select')) {
            if (e.target.parentNode !== null && $$(`#${selectId.id}`) !== null) {
                if (e.target.parentNode.id !== selectId.id) {
                    $$(`#${selectId.id}`).classList.remove('active-single-select');
                    $$(`#${selectId.id}`).children[0].children[1].classList.remove('opened-arrow');
                    $$(`#${selectId.id}`).children[1].classList.add('hidden');
                }
            }
        }
        // this is for multiselect
        for (let selectId of $$('.default-multi-select')) {
            if (e.target.parentNode && e.target.parentNode.id === selectId.id && $$(`#${selectId.id}`).classList.contains('active-multi-select') || e.target.parentNode && e.target.parentNode.parentNode && e.target.parentNode.parentNode.id === selectId.id && $$(`#${selectId.id}`).classList.contains('active-multi-select')) {
                $$(`#${selectId.id}`).children[1].classList.remove('hidden');
            } else {
                $$(`#${selectId.id}`).classList.remove('active-multi-select');
                $$(`#${selectId.id}`).children[0].children[1].classList.remove('opened-arrow');
                $$(`#${selectId.id}`).children[1].classList.add('hidden');
            }
        }
    });

    function clearAllDropdown(div) {
        for (let element of div.getElementsByClassName('default-select')) {
            element.reset();
        }
    }

    function clearAllDropdownDate(div) {
        for (let element of div.getElementsByClassName('default-date-select')) {
            element.children[0].children[0].innerHTML = '-';
            element.children[0].title = element.children[0].children[0].innerHTML;
            element.children[0].dataset.value = null;
            if (element.children[1].classList.contains('multiple-group')) {
                for (let check of element.children[1].children) {
                    check.children[0].children[0].checked = false;
                }
            }
        }
    }

    on('clear/dropdown/filter', function (data) {
        clearAllDropdown(data.data);
        clearAllDropdownDate(data.data);
    });

    return {
        generate
    }

})();