const multiDropdown = (function () {
    //index of multiselect 
    let indexMsId = 0;
    //multiselect array
    let multiSelectArray = [];

    // generate multi dropdown

    function select(element, selectedValues) {
        if (!element || !selectedValues) {
            return false;
        }
        let titles = [];
        let values = [];
        let multipleGroup = element.getElementsByClassName("multiple-group")[0];
        let options = multipleGroup.children;
        Array.prototype.slice.call(options).forEach(function (option) {
            option.click();
        });
        return element;
    }

    function generate(dataSelect, element) {
        let existsId;
        if (element && element.children[1]) {
            let i = 0;
            for (let ms of multiSelectArray) {
                if (ms === element.children[1].id) {
                    existsId = element.children[1].id;
                    multiSelectArray.splice(i, 1);
                    break;
                }
                i++;
            }
            removeChildren(element);
        }
        //array of chosen options
        let array = [];
        let arrayInner = [];
        //initial select form data
        let noSelectedData = dataSelect.shift();

        //wrapper select
        let select = document.createElement('div');
        select.classList.add('default-select');
        select.classList.add('default-multiselect-select');


        if (existsId) {
            select.id = existsId;
        } else {
            select.id = `ms-${indexMsId}`;
            indexMsId++;
        }

        //selected options
        let selected = document.createElement('div');
        selected.innerHTML = `<div></div><span class="closed-arrow">&#9660;</span>`;
        select.appendChild(selected);

        // display no select
        let noSelected = {};
        if (noSelectedData.parsed === true) {
            selected.children[0].innerHTML = noSelectedData.name;
            noSelected.Name = noSelectedData.name;
            if (noSelectedData.value !== undefined) {
                noSelected.Value = noSelectedData.value === null ? 'null' : noSelectedData.value;
                selected.dataset.value = noSelectedData.value;
            } else {
                selected.children[0].innerHTML = noSelectedData.name;
                noSelected.Value = noSelectedData.name;
            }
        } else {
            selected.children[0].innerHTML = noSelectedData.Name;

            if (noSelectedData.Value === '-' || noSelectedData.Value === 'null' || !noSelected.Value) {
                selected.dataset.value = null;
            }
            else {
                selected.dataset.value = noSelectedData.Name;
            }
            noSelected.Name = noSelectedData.Name;
            //set null as string as dataset values are always converted to string
            noSelected.Value = 'null';
        }
        selected.title = selected.children[0].innerHTML;
        selected.classList.add('element-table-filters');
        selected.classList.add('center');
        selected.classList.add('opened-closed-wrapper');
        //wrapper options group
        let optionGroup = document.createElement('div');
        optionGroup.classList.add('hidden');
        optionGroup.classList.add('multiple-group');
        for (let element of dataSelect) {
            //option with functionality
            let option = document.createElement('div');
            let item = {
                name: null,
                value: null
            };

            //ToDo: find better solution for element.parsed

            if (typeof element === 'object' && element.parsed !== undefined && element.parsed === true) {
                if (element.name !== undefined) {
                    item.name = localization.translateMessage(element.name);
                }
                if (element.value !== undefined) {
                    item.value = element.value;
                } else {
                    item.value = item.name;
                }
            } else {
                item.value = element.Name;
                item.name = localization.translateMessage(element.Name);
            }

            option.dataset.value = item.value;

            let label = document.createElement('label');
            label.classList.add('form-checkbox');
            let checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            let icon = document.createElement('icon');
            icon.classList.add('form-icon');
            icon.dataset.elementId = item.value;
            let text = document.createElement('div');
            text.innerHTML = localization.translateMessage(item.name, text);

            label.appendChild(checkbox);
            label.appendChild(icon);
            label.appendChild(text);
            option.appendChild(label);
            option.title = item.name;
            //option.title = option.children[0].children[2].innerHTML;

            optionGroup.appendChild(option);
            optionGroup.classList.add('overflow-y');
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
                        selected.children[0].innerHTML = noSelected.Name;
                        array.push('null');
                        arrayInner.push(noSelected.Name);
                    }
                }

                selected.title = selected.children[0].innerHTML;
                selected.dataset.value = array;
            });
        }

        select.appendChild(optionGroup);


        dataSelect.unshift(noSelected);
        multiSelectArray.push(select.id);
        if (element) {
            element.appendChild(select);
            return element;
        }
        return select;
    }

    window.addEventListener('click', function (e) {
        e.preventDefault();
        for (let selectId of multiSelectArray) {
            if (e.target.parentNode && e.target.parentNode.id === selectId) {
                $$(`#${selectId}`).classList.toggle('active-multi-select');
                trigger('opened-arrow', { div: $$(`#${selectId}`).children[0] });
                $$(`#${selectId}`).children[1].classList.toggle('hidden');
                $$(`#${selectId}`).parentNode.children[0].classList.add('dropdown-is-active');
            } else {
                if (e.target.parentNode && e.target.parentNode.parentNode && e.target.parentNode.parentNode.id === selectId) {
                    $$(`#${selectId}`).classList.add('active-multi-select');
                    $$(`#${selectId}`).children[1].classList.remove('hidden');
                } else {
                    $$(`#${selectId}`).classList.remove('active-multi-select');
                    $$(`#${selectId}`).children[0].children[1].classList.remove('opened-arrow');
                    $$(`#${selectId}`).children[1].classList.add('hidden');
                    if ($$(`#${selectId}`).children[0].dataset.value === '-') {
                        $$(`#${selectId}`).parentNode.children[0].classList.remove('dropdown-is-active');
                    }
                }
            }
        }
    });

    return {
        generate,
        select
    };
})
    ();