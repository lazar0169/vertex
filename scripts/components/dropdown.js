const dropdown = (function () {
    //index of single select 
    let indexSsId = 0;
    //single select array
    let singleSelectArray = [];

    function reset(element) {
        let option = getFirstOption(element);
        select(element,option.dataset.value);
    }

    function getFirstOption(element) {
        return element.getElementsByClassName("single-option")[0];
    }

    function select(element, selectedValue) {
        if (isEmpty(element)  || isEmpty(selectedValue)) {
            return false;
        }
        let options = element.getElementsByClassName("single-option");
        let selectedOptions = Array.prototype.slice.call(options).filter(function (option) {
            //unsafe compare here as dataset value is always parsed to string
            // noinspection EqualityComparisonWithCoercionJS
            return option.dataset.value == selectedValue
        });
        if (options.length === 0) {
            return false;
        } else {
            let selectedOption = selectedOptions.pop();
            let elementTableFilter = element.getElementsByClassName("element-table-filters")[0];
            elementTableFilter.dataset.value = selectedOption.dataset.value;
            elementTableFilter.title = selectedOption.getAttribute('title');
            elementTableFilter.children[0].innerText = elementTableFilter.title;
        }
        return element;
    }

    //generate single dropdown
    function generate(dataSelect, element, name) {
        let existsId;
        if (element && element.children[1]) {
            let i = 0;
            for (let ss of singleSelectArray) {
                if (ss === element.children[1].id) {
                    existsId = element.children[1].id;
                    break;
                }
                i++;
            }
            removeChildren(element);
        }
        // wrapper select
        let select = document.createElement('div');
        if (existsId) {
            select.id = existsId;
        } else {
            select.id = `ss-${indexSsId}`;
            indexSsId++;
        }
        select.classList.add('default-select');
        select.classList.add('default-single-select');

        select.classList.add('element-form-data');
        select.dataset.type = 'single-select';

        if (name !== undefined && name !== null) {
            select.dataset.name = name;
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
            trigger('opened-arrow', {div: selected});
            select.classList.toggle('active-single-select');
        });
        //wrapper options group
        let optionGroup = document.createElement('div');
        optionGroup.classList.add('hidden');
        optionGroup.classList.add('overflow-y');
        let items = [];
        for (let element of dataSelect) {
            //ToDo: proveriti da li je longId potreban nakon najnovijih izmena na API-ju [ovo je case kod add transaction]
            let item = {
                name: null,
                value: null,
                longIdValue: null,
            };
            if (typeof element === 'object') {
                if (element.parsed !== undefined && element.parsed === true) {
                    if (element.name !== undefined) {
                        item.name = localization.translateMessage(element.name);
                        if (element.value !== undefined) {
                            item.value = element.value;
                        } else {
                            item.value = item.name;
                        }
                    }
                } else {
                    item.name = localization.translateMessage(element.Name);
                    item.value = element.Name;
                    if (element.LongId !== undefined && element.LongId !== null && element.LongId !== 0) {
                        item.longIdValue = element.LongId;
                    }
                }
            } else {
                item.value = element;
                item.name = localization.translateMessage(element);
            }
            let option = document.createElement('div');
            option.classList.add('single-option');
            option.innerHTML = item.name;
            option.dataset.value = item.value;
            option.dataset.translationKey = item.name;
            if (item.longIdValue !== null) {
                option.dataset.valueLongId = item.longIdValue;
            }

            //option with functionality
            option.title = option.innerHTML;
            optionGroup.appendChild(option);

            option.addEventListener('click', function (e) {
                e.preventDefault();
                selected.children[0].innerHTML = option.innerHTML;
                trigger('opened-arrow', {div: selected});
                selected.title = selected.children[0].innerHTML;
                selected.dataset.value = option.dataset.value;
                selected.dataset.valueLongId = option.dataset.valueLongId;
                select.classList.remove('active-single-select');
                optionGroup.classList.add('hidden');
            });
            items.push(item);
        }
        console.log('element',element);
        console.log('items',items);
        select.appendChild(optionGroup);

        singleSelectArray.push(select.id);

        if (element) {
            element.appendChild(select);
            dropdown.select(element, items[0].value);
            return element;
        }

        return select;
    }

    window.addEventListener('click', function (e) {
        e.preventDefault();
        for (let selectId of singleSelectArray) {
            if (e.target.parentNode !== null && $$(`#${selectId}`) !== null) {
                if (e.target.parentNode.id !== selectId) {
                    $$(`#${selectId}`).classList.remove('active-single-select');
                    $$(`#${selectId}`).children[0].children[1].classList.remove('opened-arrow');
                    $$(`#${selectId}`).children[1].classList.add('hidden');
                }
            }
        }
    });

    return {
        generate,
        select,
        reset
    };
})();