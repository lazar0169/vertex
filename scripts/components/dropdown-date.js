const dropdownDate = (function () {
    //index of single select 
    let indexDsId = 0;
    //indicate custom option
    let pickCustom = false;
    //generate single dropdown
    function generate(dataSelect) {
        // wrapper select
        let select = document.createElement('div');
        select.dataset.selectId = `ds-${indexDsId}`;
        select.classList.add('default-date-select');
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
        window.addEventListener('click', function (e) {
            e.stopPropagation();
            // proveriti ovo e.target.classList.contains('pika-select')
            if (e.target.parentNode.dataset.selectId === select.dataset.selectId) {  
                    optionGroupWrapper.classList.toggle('hidden');
                    select.classList.toggle('active-select');
            }
            else if (!pickCustom) {
                optionGroupWrapper.classList.add('hidden');
                select.classList.remove('active-select');
                customDate.classList.add('hidden');
                pickCustom = false;
            }
            else {
                console.log('aktivan je custom')
            }
        });
        indexDsId++;
        return select;
    }
    return {
        generate
    };
})();