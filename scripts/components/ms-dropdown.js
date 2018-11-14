const multiDropdown = (function () {
    //index of multiselect 
    let indexMsId = 0;
    //multiselect array
    let multiSelectArray = [];
    // generate multi dropdown
    function generate(dataSelect) {
        //array of chosen options
        let array = [];
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
        //wrapper options group
        let optionGroup = document.createElement('div');
        optionGroup.classList.add('hidden');
        optionGroup.classList.add('multiple-group');
        for (let element of dataSelect) {
            //option with functionality
            let option = document.createElement('div');
            option.title = element.Name;
            option.dataset.value = element.Name;
            option.innerHTML = `<label class="form-checkbox" >
                                                <input type="checkbox">
                                                <i class="form-icon" data-elementId = "${element.Name}"></i> <div>${element.Name}</div>
                                            </label>`;
            optionGroup.appendChild(option);
            optionGroup.classList.add('overflow-y');
            option.addEventListener('click', function (e) {
                e.preventDefault();
                if (option.children[0].children[0].checked === false) {
                    if (selected.innerHTML === '-') {
                        array = [];
                        selected.innerHTML = option.children[0].children[2].innerHTML;
                    }
                    else {
                        selected.innerHTML += `, ${option.children[0].children[2].innerHTML}`;
                    }
                    array.push(option.dataset.value);
                    option.children[0].children[0].checked = true;
                }
                else {
                    let i = 0;
                    for (let elem of array) {
                        if (elem === option.dataset.value) {
                            array.splice(i, 1);
                        }
                        i++
                    }
                    //array sa elementima na eng jeziku
                    selected.innerHTML = array;
                    option.children[0].children[0].checked = false;
                    if (selected.innerHTML === '') {
                        selected.innerHTML = noSelected.Name;
                        array.push(noSelected.Name);
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
        return select;
    }
    window.addEventListener('click', function (e) {
        e.stopPropagation();
        for (let selectId of multiSelectArray) {
            if (e.target.parentNode.id === selectId) {
                $$(`#${selectId}`).classList.toggle('active-multi-select');
                $$(`#${selectId}`).children[1].classList.toggle('hidden');
            }
            else {
                if (e.target.parentNode.parentNode.id === selectId) {
                    $$(`#${selectId}`).classList.add('active-multi-select');
                    $$(`#${selectId}`).children[1].classList.remove('hidden');
                }
                else {
                    $$(`#${selectId}`).classList.remove('active-multi-select');
                    $$(`#${selectId}`).children[1].classList.add('hidden');
                }
            }
        }
    });

    return {
        generate
    };
})();