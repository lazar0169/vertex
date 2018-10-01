let proba = $$('#proba');
let nekiniz = [1, 'nesto', 3, 5, 4, 7];

let proba2 = $$('#proba2');
let nekiniz2 = ['niz2', 'as', 'afsaf', 'asdas', 'asdsad', 'fdfg'];

let proba3 = $$('#proba3');
let nekiniz3 = ['proba', 'proba2', 'proba3'];

window.addEventListener('load', function () {
    proba.appendChild(multiselect(nekiniz));
    proba2.appendChild(multiselect(nekiniz2));
    proba3.appendChild(multiselect(nekiniz3));
});

// funkcija za visestruko selektovanje
function multiselect(dataSelect) {

    let fragment = document.createDocumentFragment();
    let tempFragmentHead = document.createElement('div');
    tempFragmentHead.innerHTML = 'click me';
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
            if (bodyElement.children[0].children[0].checked == false) {
                let temp = document.createElement('div');
                temp.innerHTML = bodyElement.children[0].children[2].textContent;
                temp.dataset.id = bodyElement.children[0].children[2].textContent;
                if (tempFragmentHead.textContent === 'click me') {
                    tempFragmentHead.textContent = '';
                }
                tempFragmentHead.appendChild(temp);
                bodyElement.children[0].children[0].checked = true;

            }
            else {
                for (let element = 0; element < tempFragmentHead.childElementCount; element++) {
                    if (bodyElement.children[0].children[2].textContent == tempFragmentHead.children[element].dataset.id) {
                        tempFragmentHead.children[element].remove();
                        break;
                    }
                }
                bodyElement.children[0].children[0].checked = false;
                if (!tempFragmentHead.textContent) {
                    tempFragmentHead.textContent = 'click me';
                }
            }
        });
    }

    fragment.appendChild(tempFragmentHead);
    fragment.appendChild(tempFragmentBody);
    return fragment;
}

