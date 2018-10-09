const multiDropdown = (function () {

    let proba2 = $$('#aft-advance-table-filter-finished');
    let nekiniz2 = ['-', 'proba2222222222222222222222222222222222222', 'as', 'afsaf', 'asdas', 'asdsad', 'fdfg'];

    let proba3 = $$('#aft-advance-table-filter-jackpot');
    let nekiniz3 = ['-', 'proba3', 'proba2', 'proba123'];

    let proba4 = $$('#aft-advance-table-filter-type');
    let nekiniz4 = ['-', 'proba4', 'prsadf', 'p'];

    let proba5 = $$('#aft-advance-table-filter-status');
    let nekiniz5 = ['-', 'proba5', 'prsadf5', 'p5'];

    let proba6 = $$('#aft-advance-table-filter-column');
    let nekiniz6 = ['-', 'proba6', 'prsadf6', 'p6'];

    window.addEventListener('load', function () {
        proba2.appendChild(multiselect(nekiniz2));
        proba3.appendChild(multiselect(nekiniz3));
        proba4.appendChild(multiselect(nekiniz4));
        proba5.appendChild(multiselect(nekiniz5));
        proba6.appendChild(multiselect(nekiniz6));
    });

    // funkcija za visestruko selektovanje
    let indexMsId = 0;
    function multiselect(dataSelect) {
        let array;
        let noSelected = dataSelect.shift()
        let select = document.createElement('div');

        select.dataset.selectId = `ms-${indexMsId}`;
        select.classList.add('default-select');
        let selected = document.createElement('div');
        selected.innerHTML = noSelected;
        selected.dataset.items = JSON.stringify(selected.innerHTML);
        selected.title = selected.innerHTML;
        let optionGroup = document.createElement('div');
        optionGroup.classList.add('hidden');
        optionGroup.classList.add('multiple-group');
        for (let element of dataSelect) {
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
            optionGroup.classList.toggle('hidden');
        });

        window.addEventListener('click', function (e) {
            e.stopPropagation();
            if (e.target.parentNode.dataset.selectId !== select.dataset.selectId && e.target.parentNode.parentNode.dataset.selectId !== select.dataset.selectId) {
                optionGroup.classList.add('hidden');
            }
        });
        indexMsId++;
        return select;
    }
})();