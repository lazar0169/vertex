const dropdownDate = (function () {
    //index of single select 
    let indexDsId = 0;
    //date select array
    let dateSelectArray = [];
    // let global variable for select date
    let activeSelectId;
    //indicate custom option
    let pickCustom = false;
    //generate single dropdown
    function generate(dataSelect) {
        // wrapper select
        let select = document.createElement('div');
        select.dataset.selectId = `ds-${indexDsId}`;
        select.classList.add('default-date-select');
        select.id = `ds-${indexDsId}`;
        //selected option
        let selected = document.createElement('div');
        selected.innerHTML = dataSelect[0];
        selected.title = selected.innerHTML;
        selected.dataset.items = JSON.stringify(selected.innerHTML);
        //wrapper options group
        let optionGroupWrapper = document.createElement('div');
        optionGroupWrapper.classList.add('hidden');
        optionGroupWrapper.classList.add('option-select-date');
        let optionGroup = document.createElement('div');
        optionGroup.classList.add('overflow-y');
        let customDate = document.createElement('div');

        customDate.innerHTML = `<div id="date-from-${indexDsId}" class="choose-date-time">
                                <div>Date from:</div>
                                <input type="text" class="datepicker" readonly>                                
                                </div>
                                <div id="time-from-${indexDsId}" class="choose-date-time">
                                <div>Time from:</div>
                                <div class="timepicker"></div>                            
                                </div>
                                <div id="date-to-${indexDsId}" class="choose-date-time">
                                <div>Date to:</div>
                                <input type="text" class="datepicker" readonly>                                
                                </div>
                                <div id="time-to-${indexDsId}" class="choose-date-time">
                                <div>Time to:</div>
                                <div class="timepicker"></div>                                
                                </div>
                                <div class="custom-date-buttons-wrapper center">
                                <button class="btn btn-success">Apply</button>
                                <button class="btn btn-cancel">Cancel</button>
                                </div>
                                `
        customDate.classList.add('hidden');
        for (let element of dataSelect) {
            //option with functionality
            let option = document.createElement('div');
            option.classList.add('single-option');
            option.innerHTML = element;
            option.title = option.innerHTML;
            optionGroup.appendChild(option);
            option.addEventListener('click', function (e) {
                e.preventDefault();
                if (option.innerHTML === 'Custom') {
                    customDate.classList.toggle('hidden');
                    pickCustom = !pickCustom;
                }
                else {
                    selected.innerHTML = option.innerHTML;
                    selected.title = selected.innerHTML;
                    selected.dataset.items = JSON.stringify(selected.innerHTML);
                    customDate.classList.add('hidden');
                    pickCustom = false;
                }
            });
        }
        optionGroupWrapper.appendChild(optionGroup);
        optionGroupWrapper.appendChild(customDate);
        select.appendChild(selected);
        select.appendChild(optionGroupWrapper);

        indexDsId++;
        dateSelectArray.push(select.id);
        return select;
    }
    window.addEventListener('click', function (e) {
        e.stopPropagation();
        let found = false;
        let current = e.target;
        while (current) {
            if (found) {
                break;
            }
            for (let selectId of dateSelectArray) {
                if (current.id === selectId) {
                    found = true;
                    if (current.id != activeSelectId && activeSelectId) {
                        $$(`.active-date-select`)[0].children[1].children[1].classList.add('hidden');
                        $$(`.active-date-select`)[0].children[1].classList.add('hidden');
                        $$('.active-date-select')[0].classList.toggle('active-date-select');
                    }
                    activeSelectId = selectId;
                    break;
                }
            }
            current = current.parentNode;
        }
        if (found && !pickCustom && e.target.innerHTML != 'Custom') {
            $$(`#${activeSelectId}`).classList.toggle('active-date-select');
            $$(`#${activeSelectId}`).children[1].classList.toggle('hidden');
            if (!$$(`#${activeSelectId}`).classList.contains('active-date-select')) {
                activeSelectId = !activeSelectId;
            }
        }
        else if (found && pickCustom || e.target.classList.contains('pika-select') || e.target.innerHTML === 'Custom') {
            $$(`#${activeSelectId}`).classList.add('active-date-select');
            $$(`#${activeSelectId}`).children[1].classList.remove('hidden');
        }
        else {
            if (activeSelectId) {
                $$(`.active-date-select`)[0].children[1].children[1].classList.add('hidden');
                $$(`.active-date-select`)[0].children[1].classList.add('hidden');
                $$('.active-date-select')[0].classList.toggle('active-date-select');
                activeSelectId = false;
            }
        }
    });
    return {
        generate
    };
})();