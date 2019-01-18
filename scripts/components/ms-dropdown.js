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
        console.log(multipleGroup);
        let options = multipleGroup.children;
        Array.prototype.slice.call(options).forEach(function (option) {
            console.log(option);
            option.click();
            /*let checkboxContainer = option.getElementsByClassName("form-checkbox")[0];
            let checkbox = checkboxContainer.getElementsByTagName("input")[0];
            checkbox.checked = false;
            if (selectedValues.indexOf(option.dataset.value) > -1) {
                checkbox.checked = true;
                titles.push(option.title);
                values.push(option.dataset.value);
            }*/
        });
        /*let elementTableFilter = element.getElementsByClassName("element-table-filters")[0];
        elementTableFilter.dataset.value = values.join(',');
        elementTableFilter.title = titles.join(', ');
        elementTableFilter.innerHTML = titles.join(', ');*/

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
        let noSelected = dataSelect.shift();
        //wrapper select
        let select = document.createElement('div');
        select.classList.add('default-select');
        select.classList.add('default-multiselect-select');


        if (existsId) {
            select.id = existsId;
        }
        else {
            select.id = `ms-${indexMsId}`;
            indexMsId++;
        }

        //selected options
        let selected = document.createElement('div');
        selected.innerHTML = `<div></div>
                              <span class="closed-arrow">&#9660;</span>`;
        select.appendChild(selected);
        selected.children[0].innerHTML = noSelected.Name;
        selected.dataset.value = noSelected.Name;
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
            option.dataset.value = element.Name;
            option.innerHTML = `<label class="form-checkbox" >
                                                <input type="checkbox">
                                                <i class="form-icon" data-elementId = "${element.Name}"></i> <div data-translation-key="${element.Name}">${element.Name}</div>
                                            </label>`;
            option.title = option.children[0].children[2].innerHTML;
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
                        array.push(noSelected.Name);
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
            }
            else {
                if (e.target.parentNode && e.target.parentNode.parentNode && e.target.parentNode.parentNode.id === selectId) {
                    $$(`#${selectId}`).classList.add('active-multi-select');
                    $$(`#${selectId}`).children[1].classList.remove('hidden');
                }
                else {
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