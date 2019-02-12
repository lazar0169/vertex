const dropdownNew = (function () {
    //index of single select 
    let indexDropdown = 0;
    //type of dropdowns
    let dropdownType = {
        'single': 1,
        'multi': 2,
        "date": 3
    }

    function getValue(element) {
        return element.firstChild.dataset.value;
    }

    //generate single dropdown
    function generateNew(data) {
        let type = data.type;
        if (!type) {
            type = 'single';
        }
        let existsId;
        if (data.element && data.element.children[1]) {
            for (let dd of $$(`.default-${type}-select`)) {
                if (dd.id === data.element.children[1].id) {
                    existsId = data.element.children[1].id;
                    break;
                }
            }
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
                let array = [];
                let arrayInner = [];
                let noSelectedData = data.optionValue.shift();

                selected.children[0].innerHTML = localization.translateMessage(noSelectedData.Name ? noSelectedData.Name : noSelectedData.name);
                selected.dataset.value = null;
                selected.title = selected.children[0].innerHTML;
                if (noSelectedData.LongIdValue) {
                    selected.dataset.LongIdValue = noSelectedData.LongIdValue;
                }
                for (let element of data.optionValue) {
                    //option with functionality
                    let option = document.createElement('div');
                    let item = {
                        Name: null,
                        Value: null,
                        LongIdValue: null
                    };

                    item.Name = localization.translateMessage(element.Name ? element.Name : element.name);
                    if (element.Id) {
                        item.Value = element.Id;
                        if (element.LongId) {
                            item.LongIdValue = element.LongId;
                        }
                    } else {
                        item.Value = null;
                        item.LongIdValue = null;
                    }
                    option.dataset.value = item.Value;

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
                            selected.children[0].innerHTML = arrayInner;
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
                data.optionValue.unshift(noSelectedData);
                break;

            default:
                for (let element of data.optionValue) {
                    let item = {
                        Name: null,
                        Value: null,
                        LongIdValue: null,
                    };
                    if (typeof element === 'object') {
                        item.Name = element.Name;
                        if (element.Id) {
                            item.Value = element.Id;
                        } else {
                            item.Value = null;
                        }
                        if (element.LongIdValue) {
                            item.LongIdValue = element.LongIdValue;
                        }
                    } else {
                        item.Value = element;
                        item.Name = element;
                    }
                    if (!selected.dataset.value) {
                        selected.children[0].innerHTML = localization.translateMessage(item.Name ? item.Name : item.name);
                        selected.dataset.value = item.Value;
                        selected.title = selected.children[0].innerHTML;
                        if (item.LongIdValue) {
                            selected.dataset.LongIdValue = item.LongIdValue;
                        }
                    }
                    let option = document.createElement('div');
                    option.classList.add('single-option');
                    option.innerHTML = localization.translateMessage(item.Name ? item.Name : item.name);
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

        if (data.element) {
            data.element.appendChild(select);
            return data.element;
        }
        return select;
    }

    window.addEventListener('click', function (e) {
        e.preventDefault();
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

    return {
        generateNew,
        getValue
    };
})();