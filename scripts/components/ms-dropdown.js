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
        if (element) {
            removeChildren(element);
        }
        //array of chosen options
        let array = [];
        let arrayInner = [];
        //initial select form data
        let noSelected = dataSelect.shift();
        //wrapper select
        let select = document.createElement('div');
        select.dataset.selectId = indexMsId;
        select.classList.add('default-select');
        select.id = `ms-${indexMsId}`;
        //selected options
        let selected = document.createElement('div');
        selected.innerHTML = noSelected.Name;
        selected.dataset.value = noSelected.Name;
        selected.title = selected.innerHTML;
        selected.classList.add('element-table-filters');
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
                    if (selected.innerHTML === '-') {
                        array = [];
                        arrayInner = [];
                        selected.innerHTML = option.children[0].children[2].innerHTML;
                    } else {
                        selected.innerHTML += `, ${option.children[0].children[2].innerHTML}`;
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
                    selected.innerHTML = arrayInner;
                    option.children[0].children[0].checked = false;
                    if (selected.innerHTML === '') {
                        selected.innerHTML = noSelected.Name;
                        array.push(noSelected.Name);
                        arrayInner.push(noSelected.Name);
                    }
                }
                selected.title = selected.innerHTML;
                selected.dataset.value = array;
            });
        }
        select.appendChild(selected);
        select.appendChild(optionGroup);

        indexMsId++;
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