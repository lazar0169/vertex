const multiDropdown = (function () {
    //index of multiselect 
    let indexMsId = 0;
    //single select array
    let multiSelectArray = [];
    // generate multi dropdown
    function generate(dataSelect) {
        //array of chosen options
        let array;
        //initial select form data
        let noSelected = dataSelect.shift();
        //wrapper select
        let select = document.createElement('div');
        select.dataset.selectId = `ms-${indexMsId}`;
        select.classList.add('default-select');
        select.id = `ms-${indexMsId}`;
        //selected options
        let selected = document.createElement('div');
        selected.innerHTML = noSelected.Name;
        selected.dataset.items = JSON.stringify(selected.innerHTML);
        selected.title = selected.innerHTML;
        //wrapper options group
        let optionGroup = document.createElement('div');
        optionGroup.classList.add('hidden');
        optionGroup.classList.add('multiple-group');
        for (let element of dataSelect) {
            //option with functionality
            let option = document.createElement('div');
            option.title = element.Name;
            option.innerHTML = `<label class="form-checkbox" >
                                                <input type="checkbox" dataset.elementId=${element.Id}>
                                                <i class="form-icon" ></i> <div>${element.Name}</div>
                                            </label>`;
            optionGroup.appendChild(option);
            optionGroup.classList.add('overflow-y');
            option.addEventListener('click', function (e) {
                e.preventDefault();
                if (option.children[0].children[0].checked == false) {
                    if (selected.innerHTML === '-') {
                        selected.innerHTML = option.children[0].children[2].innerHTML;
                    }
                    else {
                        selected.innerHTML += `, ${option.children[0].children[2].innerHTML}`;
                    }
                    array.push(option.children[0].children[2].innerHTML);
                    option.children[0].children[0].checked = true;
                }
                else {
                    let i = 0;
                    for (let elem of array) {
                        if (elem === option.children[0].children[2].innerHTML) {
                            array.splice(i, 1);
                        }
                        i++
                    }
                    selected.innerHTML = array;
                    option.children[0].children[0].checked = false;
                    if (selected.innerHTML === '') {
                        selected.innerHTML = noSelected.Name;
                    }
                }
                selected.title = selected.innerHTML;
                selected.dataset.items = JSON.stringify(selected.innerHTML)
            });
        }
        select.appendChild(selected);
        select.appendChild(optionGroup);

        selected.addEventListener('click', function () {
            if (selected.innerHTML === noSelected.Name) {
                array = [];
            }
        });
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