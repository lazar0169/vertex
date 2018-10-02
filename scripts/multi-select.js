let proba = $$('#proba');
let nekiniz = ['proba1', 1, 'nesto', 3, 5, 4, 7];

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
    proba.appendChild(multiselect(nekiniz));
    proba2.appendChild(multiselect(nekiniz2));
    proba3.appendChild(multiselect(nekiniz3));
    proba4.appendChild(multiselect(nekiniz4));
    proba5.appendChild(multiselect(nekiniz5));
    proba6.appendChild(multiselect(nekiniz6));
});

// funkcija za visestruko selektovanje
function multiselect(dataSelect) {
    let clicked = false;
    let showChosenElements = document.createElement('div');

    let fragment = document.createDocumentFragment();
    let tempFragmentHead = document.createElement('div');
    let headInitialContent = document.createElement('div');
    headInitialContent.innerHTML = '-';

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

        bodyElement.addEventListener('click', function (e) {
            e.preventDefault();
            showChosenElements.classList.remove('hidden');
            if (bodyElement.children[0].children[0].checked == false) {
                if (!clicked) {
                    showChosenElements.innerHTML = bodyElement.children[0].children[2].textContent;
                    headInitialContent.classList.add('hidden');
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
                    showChosenElements.classList.add('hidden');
                    headInitialContent.classList.remove('hidden');
                    clicked = false;
                }
            }
        });
    }
    tempFragmentHead.appendChild(headInitialContent);
    fragment.appendChild(tempFragmentHead);
    fragment.appendChild(tempFragmentBody);
    return fragment;
}