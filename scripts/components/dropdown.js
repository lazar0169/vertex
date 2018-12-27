const dropdown = (function () {
    //index of single select 
    let indexSsId = 0;
    //single select array
    let singleSelectArray = [];

    function select(element, selectedValue) {
        if (!element || !selectedValue) {
            return false;
        }
        let options = element.getElementsByClassName("single-option");
        let hasOption = Array.prototype.slice.call(options).filter(function (option) {
            return option.dataset.value === selectedValue;
        });
        if (hasOption.length === 0) {
            return false;
        } else {
            let elementTableFilter = element.getElementsByClassName("element-table-filters")[0];
            elementTableFilter.dataset.value = selectedValue;
            elementTableFilter.title = selectedValue;
            elementTableFilter.innerText = selectedValue;
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
                    singleSelectArray.splice(i, 1);
                    break;
                }
                i++;
            }
            removeChildren(element);
        }




        // wrapper select
        let select = document.createElement('div');
        if (existsId) {
            select.id = indexSsId;
        }
        else {
            select.id = `ss-${indexSsId}`;
            indexSsId++;
        }
        select.classList.add('default-select');
        select.classList.add('element-form-data');
        select.dataset.type = 'single-select';

        if (name !== undefined && name !== null) {
            select.dataset.name = name;
        }

        //selected option
        let selected = document.createElement('div');
        if (typeof dataSelect[0] === 'object') {
            selected.innerHTML = dataSelect[0].Name;
            selected.dataset.value = dataSelect[0].Name;
            if (dataSelect[0].LongId !== undefined && dataSelect[0].LongId !== null) {
                selected.dataset.valueLongId = dataSelect[0].LongId;
                select.dataset.nameLongId = 'Gmcid';
            }
        }
        else {
            selected.innerHTML = dataSelect[0];
            selected.dataset.value = dataSelect[0];
        }
        selected.title = selected.innerHTML;
        selected.classList.add('element-table-filters');
        selected.addEventListener('click', function () {
            optionGroup.classList.toggle('hidden');
            select.classList.toggle('active-single-select');
        });
        //wrapper options group
        let optionGroup = document.createElement('div');
        optionGroup.classList.add('hidden');
        optionGroup.classList.add('overflow-y');
        for (let element of dataSelect) {
            let option = document.createElement('div');
            option.classList.add('single-option');
            if (typeof element === 'object') {
                option.innerHTML = element.Name;
                option.dataset.value = element.Name;
                option.dataset.translationKey = element.Name;
                if (element.LongId !== undefined && element.LongId !== null) {
                    option.dataset.valueLongId = element.LongId;
                }
            }
            else {
                option.innerHTML = element;
                option.dataset.value = element;
                option.dataset.translationKey = element;

            }
            //option with functionality
            option.title = option.innerHTML;
            optionGroup.appendChild(option);

            option.addEventListener('click', function (e) {
                e.preventDefault();
                selected.innerHTML = option.innerHTML;
                selected.title = selected.innerHTML;
                selected.dataset.value = option.dataset.value;
                selected.dataset.valueLongId = option.dataset.valueLongId;
                select.classList.remove('active-single-select');
                optionGroup.classList.add('hidden');
            });
        }
        select.appendChild(selected);
        select.appendChild(optionGroup);

        indexSsId++;
        singleSelectArray.push(select.id);

        if (element) {
            element.appendChild(select);
            return element;
        }
        return select;
    }

    //TODO THIS PART GENERATES MULTIPLE ERRORS
    window.addEventListener('click', function (e) {
        e.preventDefault();
        for (let selectId of singleSelectArray) {
            if (e.target.parentNode !== null && $$(`#${selectId}`) !== null) {
                if (e.target.parentNode.id !== selectId) {
                    $$(`#${selectId}`).classList.remove('active-single-select');
                    $$(`#${selectId}`).children[1].classList.add('hidden');
                }
            }
        }
    });

    return {
        generate,
        select
    };
})();