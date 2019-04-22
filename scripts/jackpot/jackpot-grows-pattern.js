const jackpotGrowthpattern = (function () {
    let growspatternButtons = $$('#jackpot-growth-pattern-buttons').children;
    let buttonsContent = $$('.jackpot-pattern-buttons-content');
    let jackpotControlGrowthPeriodByDays = $$('#jackpot-control-growth-period').children[0];
    let jackpotControlGrowthPeriodByHours = $$('#jackpot-control-growth-period').children[1];
    let addNewGrowthField = $$('#jackpot-grows-automatically-content').getElementsByClassName('secundarybutton');
    let valueLimitCheckbox = $$('#testproba1').parentNode;
    let choseMachines = $$('#add-new-jackpot-grows-by-bet-choose-machines-buttons').children[0];

    choseMachines.onclick = function () {
        jackpotChooseParticipatingMachines.showHideChooseMachine.show();
    }

    bindGridButton(addNewGrowthField[0]);

    checkboxChangeState.checkboxClick(valueLimitCheckbox);

    jackpotControlGrowthPeriodByDays.onclick = function () {
        jackpotControlGrowthPeriodByHours.classList.remove('tab-active');
        jackpotControlGrowthPeriodByDays.classList.add('tab-active');
    }
    jackpotControlGrowthPeriodByHours.onclick = function () {
        jackpotControlGrowthPeriodByDays.classList.remove('tab-active');
        jackpotControlGrowthPeriodByHours.classList.add('tab-active');
    }


    for (let button of growspatternButtons) {
        button.onclick = function () {
            for (let button of growspatternButtons) {
                button.classList.remove('pattern-active')
            }
            for (let content of buttonsContent) {
                if (button.dataset.value === content.id) {
                    content.classList.toggle('hidden');
                    if (content.classList.contains('hidden')) {
                        button.classList.remove('pattern-active');
                    } else {
                        button.classList.add('pattern-active');
                    }
                    showValueLimitButton(button);
                }
                else {
                    content.classList.add('hidden');
                }
            }
        }
    }
    function showValueLimitButton(button) {
        if (button.dataset.value !== 'jackpot-grows-discreetly') {
            if (button.classList.contains('pattern-active')) {
                $$("#jackpot-value-limit-wrapper").classList.remove('hidden');
            }
            else {
                $$("#jackpot-value-limit-wrapper").classList.add('hidden');
            }
        }
        else {
            $$("#jackpot-value-limit-wrapper").classList.add('hidden');
        }
    }

    function bindGridButton(button) {
        button.onclick = function () {
            if (button.dataset.value === 'add-new-field') {
                button.dataset.value = 'delete-field';
                button.innerHTML = 'Delete';
                let newField = document.createElement('div');
                newField.classList.add('grid-3-columns')
                newField.innerHTML = `<div>
                                <input name="rednibroj1" class="form-input element-form-data" data-type="string" type="text"
                                placeholder="Dani/sati">
                            </div>
                            <div>
                                <input name="rednibroj1" class="form-input element-form-data" data-type="string" type="text"
                                placeholder="Procenat">
                            </div>
                            <div>
                                <button class="secundarybutton" data-value="add-new-field">Add</button>
                            </div>`
                button.parentNode.parentNode.parentNode.appendChild(newField);
                bindGridButton(newField.children[2].children[0]);
            } else {
                button.parentNode.parentNode.remove()
            }



        }


    }
})();