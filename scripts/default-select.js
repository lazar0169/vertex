let proba = $$('#proba');
let nekiniz = ['selektuje', 'samo', 'jedan', 'element'];

let proba2 = $$('#proba2');
let nekiniz2 = ['proba2', 'as', 'afsaf', 'asdas', 'asdsad', 'fdfg'];

let proba3 = $$('#proba3');
let nekiniz3 = ['proba3', 'proba2', 'proba3'];

let proba4 = $$('#proba4');
let nekiniz4 = ['proba4', 'prsadf', 'p'];

let proba5 = $$('#proba5');
let nekiniz5 = ['proba5', 'prsadf5', 'p5'];

let proba6 = $$('#proba6');
let nekiniz6 = ['proba6', 'prsadf6', 'p6'];


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
    let showChosenElements = document.createElement('div');

    let fragment = document.createDocumentFragment();
    let tempFragmentHead = document.createElement('div');
    showChosenElements.innerHTML = '-';

    tempFragmentHead.style.display = 'inline-flex';
    tempFragmentHead.addEventListener('click', function () {
        tempFragmentBody.classList.toggle('hidden');
    });

    let tempFragmentBody = document.createElement('div');
    tempFragmentBody.classList.add('hidden');


    for (let element of dataSelect) {
        let bodyElement = document.createElement('div');
        bodyElement.innerHTML = `<label class="form-checkbox" >
                                            <input type="checkbox">
                                            <i class="form-icon" ></i> <div>${element}</div>
                                        </label>`;
        tempFragmentBody.appendChild(bodyElement);
        tempFragmentBody.classList.add('overflow-y');

        bodyElement.addEventListener('click', function (e) {
            e.preventDefault();
            if (bodyElement.children[0].children[0].checked == false) {
                if (!clicked) {
                    showChosenElements.innerHTML = bodyElement.children[0].children[2].textContent;
                    tempFragmentHead.appendChild(showChosenElements);
                    clicked = true;
                }
                else {
                    showChosenElements.textContent += `,${bodyElement.children[0].children[2].textContent}`;
                }
                bodyElement.children[0].children[0].checked = true;

            }
            else {
                var array = showChosenElements.textContent.split(",");
                let index = 0;
                for (let elem of array) {
                    if (elem == bodyElement.children[0].children[2].textContent) {
                        array.splice(index, 1);
                    }
                    else {
                        index++;
                    }
                }
                showChosenElements.textContent = array.join(',')
                bodyElement.children[0].children[0].checked = false;
                if (showChosenElements.textContent === '') {
                    showChosenElements.innerHTML = '-';
                    clicked = false;
                }
            }
        });
    }
    tempFragmentHead.appendChild(showChosenElements);
    fragment.appendChild(tempFragmentHead);
    fragment.appendChild(tempFragmentBody);
    div.onmouseleave = function () {
        div.children[1].classList.add('hidden');
    }
    return fragment;
}


// funkcija za selektovanje jednog podatka
function singleSelect(div, dataSelect) {
    let showChosenElements = document.createElement('div');

    let fragment = document.createDocumentFragment();
    let tempFragmentHead = document.createElement('div');
    showChosenElements.innerHTML = dataSelect[0];


    tempFragmentHead.style.display = 'inline-flex';
    tempFragmentHead.addEventListener('click', function () {
        tempFragmentBody.classList.toggle('hidden');
    });

    let tempFragmentBody = document.createElement('div');
    tempFragmentBody.classList.add('hidden');


    for (let element of dataSelect) {
        let bodyElement = document.createElement('div');
        bodyElement.innerHTML = `<div>${element}</div>`;
        tempFragmentBody.appendChild(bodyElement);
        tempFragmentBody.classList.add('overflow-y');

        bodyElement.addEventListener('click', function (e) {
            e.preventDefault();
            showChosenElements.innerHTML = bodyElement.children[0].textContent;
            tempFragmentHead.appendChild(showChosenElements);
            tempFragmentBody.classList.add('hidden');
        });
    }
    tempFragmentHead.appendChild(showChosenElements);
    fragment.appendChild(tempFragmentHead);
    fragment.appendChild(tempFragmentBody);
    div.onmouseleave = function () {
        div.children[1].classList.add('hidden');
    }
    return fragment;
}