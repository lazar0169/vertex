let proba = $$('#aft-advance-table-filter-date-range');
let nekiniz = ['-', 'selektuje', 'samo', 'jedan', 'element'];

let proba2 = $$('#aft-advance-table-filter-finished');
let nekiniz2 = ['-', 'proba2', 'as', 'afsaf', 'asdas', 'asdsad', 'fdfg'];

let proba3 = $$('#aft-advance-table-filter-jackpot');
let nekiniz3 = ['-', 'proba3', 'proba2', 'proba3'];

let proba4 = $$('#aft-advance-table-filter-type');
let nekiniz4 = ['-', 'proba4', 'prsadf', 'p'];

let proba5 = $$('#aft-advance-table-filter-status');
let nekiniz5 = ['-', 'proba5', 'prsadf5', 'p5'];

let proba6 = $$('#aft-advance-table-filter-column');
let nekiniz6 = ['-', 'proba6', 'prsadf6', 'p6'];

window.addEventListener('load', function () {
    proba.appendChild(singleSelect(proba, nekiniz));
    proba2.appendChild(multiselect(proba2, nekiniz2));
    proba3.appendChild(multiselect(proba3, nekiniz3));
    proba4.appendChild(multiselect(proba4, nekiniz4));
    proba5.appendChild(multiselect(proba5, nekiniz5));
    proba6.appendChild(multiselect(proba6, nekiniz6));
});

// funkcija za visestruko selektovanje
function multiselect(div, dataSelect) {
    let clicked = false;
    let noSelected = dataSelect.shift()
    let select = document.createElement('div');
    select.classList.add('default-select');
    let selected = document.createElement('div');
    selected.innerHTML = noSelected;
    selected.addEventListener('click', function () {
        optionGroup.classList.toggle('hidden');
    });
    let optionGroup = document.createElement('div');
    optionGroup.classList.add('hidden');

    for (let element of dataSelect) {
        let option = document.createElement('div');
        option.innerHTML = `<label class="form-checkbox" >
                                            <input type="checkbox">
                                            <i class="form-icon" ></i> <div>${element}</div>
                                        </label>`;
        optionGroup.appendChild(option);
        optionGroup.classList.add('overflow-y');

        option.addEventListener('click', function (e) {
            e.preventDefault();
            if (option.children[0].children[0].checked == false) {
                if (!clicked) {
                    selected.innerHTML = option.children[0].children[2].innerHTML;
                    clicked = true;
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
                    clicked = false;
                }
            }
        });
    }
    select.appendChild(selected);
    select.appendChild(optionGroup);
    div.onmouseleave = function () {
        div.children[1].children[1].classList.add('hidden');
    }
    return select;
}

// funkcija za selektovanje jednog podatka
function singleSelect(div, dataSelect) {
    let select = document.createElement('div');
    select.classList.add('default-select');
    let selected = document.createElement('div');
    selected.innerHTML = dataSelect[0];

    selected.addEventListener('click', function () {
        optionGroup.classList.toggle('hidden');
    });

    let optionGroup = document.createElement('div');
    optionGroup.classList.add('hidden');

    for (let element of dataSelect) {
        let option = document.createElement('div');
        option.innerHTML = element;
        optionGroup.appendChild(option);
        optionGroup.classList.add('overflow-y');

        option.addEventListener('click', function (e) {
            e.preventDefault();
            selected.innerHTML = option.innerHTML;
            optionGroup.classList.add('hidden');
        });
    }
    select.appendChild(selected);
    select.appendChild(optionGroup);
    div.onmouseleave = function () {
        div.children[1].children[1].classList.add('hidden');
    }
    return select;
}