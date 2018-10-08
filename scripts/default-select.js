let proba = $$('#aft-advance-table-filter-date-range');
let nekiniz = ['-', 'selektuje', 'samo', 'jedan', 'element'];

let proba2 = $$('#aft-advance-table-filter-finished');
let nekiniz2 = ['-', 'proba2222222222222222222222222222222222222', 'as', 'afsaf', 'asdas', 'asdsad', 'fdfg'];

let proba3 = $$('#aft-advance-table-filter-jackpot');
let nekiniz3 = ['-', 'proba3', 'proba2', 'proba3'];

let proba4 = $$('#aft-advance-table-filter-type');
let nekiniz4 = ['-', 'proba4', 'prsadf', 'p'];

let proba5 = $$('#aft-advance-table-filter-status');
let nekiniz5 = ['-', 'proba5', 'prsadf5', 'p5'];

let proba6 = $$('#aft-advance-table-filter-column');
let nekiniz6 = ['-', 'proba6', 'prsadf6', 'p6'];

let advanceTableFilterActive = $$('#aft-advance-table-filter-active');

window.addEventListener('load', function () {
    proba.appendChild(singleSelect(nekiniz));
    proba2.appendChild(multiselect(nekiniz2));
    proba3.appendChild(multiselect(nekiniz3));
    proba4.appendChild(multiselect(nekiniz4));
    proba5.appendChild(multiselect(nekiniz5));
    proba6.appendChild(multiselect(nekiniz6));
});

// funkcija za visestruko selektovanje
function multiselect(dataSelect) {
    let noSelected = dataSelect.shift()
    let select = document.createElement('div');
    select.dataset.selectId = Math.round(Math.random() * 1000);
    select.classList.add('default-select');
    let selected = document.createElement('div');
    selected.innerHTML = noSelected;
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
                    selected.innerHTML += `,${option.children[0].children[2].innerHTML}`;
                }
                option.children[0].children[0].checked = true;
            }
            else {
                var array = selected.innerHTML.split(",");
                let index = 0;
                for (let elem of array) {
                    if (elem == option.children[0].children[2].innerHTML) {
                        array.splice(index, 1);
                    }
                    else {
                        index++;
                    }
                }
                selected.innerHTML = array.join(',')

                option.children[0].children[0].checked = false;
                if (selected.innerHTML === '') {
                    selected.innerHTML = noSelected;
                }
            }
            selected.title = selected.innerHTML;
        });
    }
    select.appendChild(selected);
    select.appendChild(optionGroup);
    window.addEventListener('click', function (e) {
        e.stopPropagation();
        if (e.target.parentNode.dataset.selectId === select.dataset.selectId || e.target.parentNode.parentNode.dataset.selectId === select.dataset.selectId) {
            optionGroup.classList.remove('hidden');
        }
        else {
            optionGroup.classList.add('hidden');
        }
    });
    return select;
}

// funkcija za selektovanje jednog podatka
function singleSelect(dataSelect) {
    let select = document.createElement('div');
    select.dataset.selectId = Math.round(Math.random() * 1000);
    select.classList.add('default-select');
    let selected = document.createElement('div');
    selected.innerHTML = dataSelect[0];
    selected.title = selected.innerHTML;
    let optionGroup = document.createElement('div');
    optionGroup.classList.add('hidden');
    for (let element of dataSelect) {
        let option = document.createElement('div');
        option.innerHTML = element;
        option.title = option.innerHTML;
        optionGroup.appendChild(option);
        optionGroup.classList.add('overflow-y');
        option.addEventListener('click', function (e) {
            e.preventDefault();
            selected.innerHTML = option.innerHTML;
            selected.title = selected.innerHTML;
        });
    }
    select.appendChild(selected);
    select.appendChild(optionGroup);
    window.addEventListener('click', function (e) {
        e.stopPropagation();
        if (e.target.parentNode.dataset.selectId === select.dataset.selectId || e.target.parentNode.parentNode.dataset.selectId === select.dataset.selectId) {
            optionGroup.classList.toggle('hidden');
        }
        else {
            optionGroup.classList.add('hidden');
        }
    });
    return select;
}

function clearAllFilter(div) {
    for (let element of div.getElementsByClassName('default-select')) {
        element.children[0].innerHTML = '-';
        element.children[0].title = element.children[0].innerHTML;
        if (element.children[1].classList.contains('multiple-group')) {
            for (let check of element.children[1].children) {
                check.children[0].children[0].checked = false;
            }
        }
    }
}