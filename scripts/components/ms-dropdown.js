const multiDropdown = (function () {
    //index of multiselect 
    let indexMsId = 0;
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
        //selected options
        let selected = document.createElement('div');
        selected.innerHTML = noSelected;
        selected.dataset.items = JSON.stringify(selected.innerHTML);
        selected.title = selected.innerHTML;
        //wrapper options group
        let optionGroup = document.createElement('div');
        optionGroup.classList.add('hidden');
        optionGroup.classList.add('multiple-group');
        for (let element of dataSelect) {
            //option with functionality
            let option = document.createElement('div');
            option.title = element;
            option.innerHTML = `<label class="form-checkbox" >
                                                <input type="checkbox">
                                                <i class="form-icon" ></i> <div>${element}</div>
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
                        selected.innerHTML = noSelected;
                    }
                }
                selected.title = selected.innerHTML;
                selected.dataset.items = JSON.stringify(selected.innerHTML)
            });
        }
        select.appendChild(selected);
        select.appendChild(optionGroup);

        selected.addEventListener('click', function () {
            if (selected.innerHTML === noSelected) {
                array = [];
            }
            select.classList.toggle('active-select');
            optionGroup.classList.toggle('hidden');
        });

        window.addEventListener('click', function (e) {
            e.stopPropagation();
            if (e.target.parentNode.dataset.selectId !== select.dataset.selectId && e.target.parentNode.parentNode.dataset.selectId !== select.dataset.selectId) {
                optionGroup.classList.add('hidden');
                select.classList.remove('active-select');
            }
        });
        indexMsId++;
        dataSelect.unshift(noSelected);
        return select;
    }
    return {
        generate
    };
})();