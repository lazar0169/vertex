const jackpotGrowthpattern = (function () {
    let growsPatternTabs = $$('#jackpot-growth-pattern-tabs');
    let tabContent = $$('.jackpot-pattern-tab-content');
    let jackpotControlGrowthPeriodByDays = $$('#jackpot-control-growth-period').children[0];
    let jackpotControlGrowthPeriodByHours = $$('#jackpot-control-growth-period').children[1];
    let addNewGrowthField = $$('#jackpot-grows-automatically-content').getElementsByClassName('secundarybutton');
    let valueLimitCheckbox = $$('#jackpot-growth-pattern-value-limit-checkbox').parentNode;
    let choseMachines = $$('#add-new-jackpot-grows-by-bet-choose-machines-buttons').children[0];
    let jackpotGrowsDiscreetlyRadioButtonsWrapper = $$('#jackpot-grows-discreetly-radio-buttons');
    let jackpotGrowsPatternCustomRadio = jackpotGrowsDiscreetlyRadioButtonsWrapper.children;
    let jackpotGrowsCustomRadioButtonsWrapper = $$("#custom-radio-buttons");


    highchart.drawHighchart({ parent: $$('#jackpot-growth-pattern-grows-by-bet-chart'), dotsX: 10, dotsY: 10, name: 'MinMaxFunction' })


    // let customInputs = $$('#custom-input-wrapper').getElementsByTagName('input');
    // for (let input of customInputs) {
    //     validation.init(input, {});
    //     if (input.dataset.type === 'float') {
    //         currencyInput.generate(input, {});
    //     }
    // }
    // let tournamentInputs = $$('#tournament-input-wrapper').getElementsByTagName('input')
    // for (let input of tournamentInputs) {
    //     validation.init(input, {});
    // }
    // let rainInputs = $$('#rain-input-wrapper').getElementsByTagName('input')
    // for (let input of rainInputs) {
    //     validation.init(input, {});
    // }

    checkboxChangeState.radioClick(jackpotGrowsCustomRadioButtonsWrapper);

    let addLevelDiscreetlyConditionButton = $$('#custom-add-level-condition-button').children[0];
    addLevelDiscreetlyConditionButton.onclick = function (e) {
        if (checkValidationField(e.target.parentNode.parentNode)) {
            addConditionLevel(e.target.dataset.value, e.target);
            clearInputsFields(e.target.parentNode.parentNode.parentNode);
        }

    }

    let addLevelDiscreetlyTournamentButton = $$('#tournament-add-level-button').children[0];
    addLevelDiscreetlyTournamentButton.onclick = function (e) {
        if (checkValidationField(e.target.parentNode.parentNode.parentNode)) {
            createLevel(e.target.dataset.value);
            clearInputsFields(e.target.parentNode.parentNode.parentNode);
        }
    }

    let addLevelDiscreetlyRainButton = $$('#rain-add-level-button').children[0];
    addLevelDiscreetlyRainButton.onclick = function (e) {
        if (checkValidationField(e.target.parentNode.parentNode.parentNode)) {
            createLevel(e.target.dataset.value);
            clearInputsFields(e.target.parentNode.parentNode.parentNode);
        }
    }

    let addLevelDiscreetlyCustomButton = $$('#custom-add-level-button').children[0];
    addLevelDiscreetlyCustomButton.onclick = function (e) {
        if (checkValidationField(e.target.parentNode.parentNode.children[0])) {
            createLevel(e.target.dataset.value);
            clearInputsFields(e.target.parentNode.parentNode.parentNode);
        }
    }

    function editExistLevel(inputsWrapper, levelWrapper) {
        let data = levelWrapper.settings;
        let addLevelButton = inputsWrapper.getElementsByClassName('secundarybutton')[0];
        addLevelButton.classList.add('hidden');
        let editLevelButton = inputsWrapper.getElementsByClassName('secundarybutton')[1];
        editLevelButton.classList.remove('hidden');

        editLevelButton.onclick = function (e) {
            let newData = prepareDataForLevel(e.target.dataset.value);
            let str;
            newData.CountTypeList ? str = newData.CountTypeList.name : str = $$(`.element-jackpot-condition-text-${jackpotGrowsDiscreetlyRadioButtonsWrapper.settings.radioName}`)[0].innerHTML
            levelWrapper.getElementsByClassName('element-level-name')[0].innerHTML = newData.LevelName;
            levelWrapper.getElementsByClassName('element-level-value')[0].innerHTML = newData.LevelValue;
            levelWrapper.getElementsByClassName('element-level-conditions')[0].innerHTML = `${newData.LevelOutcome.name}: ${str} ${newData.Operator.name} ${newData.Value}`

            levelWrapper.settings = newData;

            clearInputsFields(e.target.parentNode.parentNode.parentNode);
            addLevelButton.classList.remove('hidden');
            editLevelButton.classList.add('hidden');
        }

        let inputsFields = inputsWrapper.getElementsByClassName('element-form-data');

        for (let input of inputsFields) {
            let inputName = input.name === undefined ? input.children[0].dataset.name : input.name;

            switch (input.dataset.type) {
                case 'single-select':
                    input.set(data[inputName].id);
                    break;

                case 'radio':
                    if (input.parentNode.dataset.value == data.Condition) {
                        input.checked = true;
                    }
                    break;

                default:
                    input.value = data[inputName]
                    break;

            }
        }
    }

    function clearInputsFields(inputsWrapper) {
        let inputsFields = inputsWrapper.getElementsByClassName('element-form-data');

        for (let input of inputsFields) {
            switch (input.dataset.type) {
                case 'single-select':
                    input.reset();
                    break;

                case 'radio':

                    break;

                default:
                    input.value = ''
                    break;

            }
        }
    }

    function prepareDataForLevel(id) {
        let inputWrapper;
        if (typeof id === 'string') {
            inputWrapper = $$(`#${id}`);
        } else {
            inputWrapper = id;
        }
        let data = {};
        // if(inputWrapper === $$('#'))
        for (let input of inputWrapper.getElementsByClassName('element-form-data')) {

            switch (input.dataset.type) {
                case 'single-select':
                    data[input.children[0].dataset.name] = {
                        name: input.children[0].dataset.value,
                        id: input.children[0].dataset.id
                    }
                    break;
                default:
                    data[input.name ? input.name : ''] = input.value ? input.value : "";
                    break;
            }


        }

        if (inputWrapper === $$('#custom-input-wrapper')) {
            data.CustomLevelConditions = [];
            data.CustomLevelConditionsText = [];
            for (let levelCondition of $$('#custom-level-conditions-wrapper').children) {
                data.CustomLevelConditions.push(levelCondition.settings);
                data.CustomLevelConditionsText += `${levelCondition.children[1].innerHTML}<br>`;

            }
        }
        return data;
    }

    function addConditionLevel(conditionsWrapperId, inputsWrapperId) {
        let conditionArray = [];
        let conditionsWrapper = $$(`#${conditionsWrapperId}`);


        let data = prepareDataForLevel(inputsWrapperId.parentNode.parentNode);
        console.log(data)

        let singleConditonWrapper = document.createElement('div');
        singleConditonWrapper.classList.add('single-condition-wrapper');

        singleConditonWrapper.settings = data;

        let removeConditionLevel = document.createElement('a')
        removeConditionLevel.innerHTML = 'X';
        removeConditionLevel.onclick = function (e) {
            e.target.parentNode.remove();
        }
        removeConditionLevel.classList.add('remove-condition-level');
        removeConditionLevel.classList.add('center');
        removeConditionLevel.classList.add('button-link');

        singleConditonWrapper.appendChild(removeConditionLevel);

        let levelTextWrapper = document.createElement('div');;

        levelTextWrapper.innerHTML = `${data.LevelOutcome.name} : ${data.CountTypeList.name} ${data.Operator.name} ${data.Value}`

        singleConditonWrapper.appendChild(levelTextWrapper);

        conditionsWrapper.appendChild(singleConditonWrapper);

        // else {
        //     trigger('notifications/show', {
        //         message: localization.translateMessage('Value is empty!!!'),
        //         type: notifications.messageTypes.error,
        //     });
        //     for (let input of inputsWrapperId.parentNode.parentNode.getElementsByTagName('input')) {
        //         console.log(input.vertexValidation.validate())

        //     }
        // }




    }

    function createLevel(id) {

        let inputWrapper = $$(`#${id}`);
        let levelExistWrapper = inputWrapper.parentNode.getElementsByClassName('jackpot-level-exist-wrapper')[0];

        let levelArray = []
        for (let level of levelExistWrapper.children) {
            levelArray.push(level.settings)
        }

        let data = prepareDataForLevel(id);

        if (data.CustomConditions) {
            data.Condition = checkboxChangeState.getRadioState(jackpotGrowsCustomRadioButtonsWrapper);
        }

        if (data.LevelName && data.LevelValue && data.Operator && data.LevelOutcome && data.Value && levelExistWrapper.children.length < 4) {

            for (let level of levelArray) {
                if (data.LevelName === level.LevelName && data.LevelValue === level.LevelValue) {
                    trigger('notifications/show', {
                        message: localization.translateMessage('Level exists!!!'),
                        type: notifications.messageTypes.error,
                    });

                    return;
                }
            }

            let levelWrapper = document.createElement('div');

            if (data.CustomLevelConditions) {
                if (data.CustomLevelConditions.length === 0) {
                    trigger('notifications/show', {
                        message: localization.translateMessage('Empty condition!!!'),
                        type: notifications.messageTypes.error,
                    });
                } else {
                    levelWrapper.settings = data;
                    levelWrapper.innerHTML = `
                <div>
                    <div>Level name:</div> 
                    <div class="element-level-name">${data.LevelName}</div>
                </div>
                <div>
                    <div>Level value:</div> 
                    <div class="element-level-value">${data.LevelValue}</div>
                </div>
                <div>
                    <div>Level conditions:</div> 
                    <div class="element-level-conditions">${data.CustomLevelConditionsText}</div>
                </div>
                `
                }
            } else {
                levelWrapper.settings = data;
                let str;
                str = $$(`.element-jackpot-condition-text-${jackpotGrowsDiscreetlyRadioButtonsWrapper.settings.radioName}`)[0].innerHTML;
                levelWrapper.innerHTML = `<div>
                    <div>Level name:</div> 
                    <div class="element-level-name">${data.LevelName}</div>
                </div>
                <div>
                    <div>Level value:</div> 
                    <div class="element-level-value">${data.LevelValue}</div>
                </div>
                <div>
                    <div>Level conditions:</div> 
                    <div class="element-level-conditions">${data.LevelOutcome.name}: ${str} ${data.Operator.name} ${data.Value}</div>
                </div>
                `
            }
            let editCloseLevelWrapper = document.createElement('div');
            editCloseLevelWrapper.classList.add('edit-close-level-wrapper')

            let levelClose = document.createElement('div');
            levelClose.innerHTML = 'X';
            levelClose.classList.add('level-close-button');
            levelClose.classList.add('color-red');
            levelClose.classList.add('center');


            levelClose.onclick = function () {
                levelWrapper.remove();
            }

            let levelEdit = document.createElement('div');
            levelEdit.innerHTML = 'Edit';
            levelEdit.classList.add('level-edit-button');
            levelEdit.classList.add('center');

            levelEdit.onclick = function (e) {
                // alert("ucitaj u polja trenutne vrednosti!");
                editExistLevel(e.target.parentNode.parentNode.parentNode.parentNode, e.target.parentNode.parentNode)
            }

            editCloseLevelWrapper.appendChild(levelClose);
            editCloseLevelWrapper.appendChild(levelEdit);


            levelWrapper.appendChild(editCloseLevelWrapper);
            levelExistWrapper.appendChild(levelWrapper);
        }
    }

    for (let radio of jackpotGrowsPatternCustomRadio) {
        radio.onclick = function () {
            jackpotGrowsDiscreetlyRadioButtonsWrapper.settings = {
                'radioName': radio.dataset.name
            }
            for (let content of $$(".jackpot-grows-discreetly-type-contents")) {
                content.classList.add('hidden');

                if (content.dataset.value === radio.children[0].dataset.value) {
                    content.classList.remove('hidden');
                }
            }
        }
    }

    checkboxChangeState.radioClick(jackpotGrowsDiscreetlyRadioButtonsWrapper);

    choseMachines.onclick = function () {
        jackpotChooseParticipatingMachines.showHideChooseMachine.show();
    }
    //days
    bindGridButton(addNewGrowthField[0]);
    //hours
    bindGridButton(addNewGrowthField[1]);

    checkboxChangeState.checkboxClick(valueLimitCheckbox);

    jackpotControlGrowthPeriodByDays.onclick = function (e) {
        jackpotControlGrowthPeriodByHours.classList.remove('tab-active');
        jackpotControlGrowthPeriodByDays.classList.add('tab-active');
        $$(`#${jackpotControlGrowthPeriodByDays.dataset.value}`).classList.remove('hidden');
        $$(`#${jackpotControlGrowthPeriodByHours.dataset.value}`).classList.add('hidden');
    }
    jackpotControlGrowthPeriodByHours.onclick = function () {
        jackpotControlGrowthPeriodByDays.classList.remove('tab-active');
        jackpotControlGrowthPeriodByHours.classList.add('tab-active');
        $$(`#${jackpotControlGrowthPeriodByHours.dataset.value}`).classList.remove('hidden');
        $$(`#${jackpotControlGrowthPeriodByDays.dataset.value}`).classList.add('hidden');
    }

    for (let tab of growsPatternTabs.children) {
        tab.onclick = function () {
            for (let tab of growsPatternTabs.children) {
                tab.classList.remove('pattern-active');
                tab.classList.add('pattern-not-active');
            }
            for (let content of tabContent) {
                if (tab.dataset.value === content.id) {
                    content.classList.toggle('hidden');
                    if (content.classList.contains('hidden')) {
                        tab.classList.remove('pattern-active');
                        for (let tab of growsPatternTabs.children) {
                            tab.classList.remove('pattern-not-active');
                        }
                        growsPatternTabs.classList.remove('border-bottom');

                    } else {
                        if (!$$('#table-container-jackpots').getElementsByClassName('table-element-no-data')[0].classList.contains('hidden')) {
                            for (let radio of $$('#jackpot-grows-discreetly-radio-buttons').children) {
                                if (radio.dataset.name === 'rain') {
                                    radio.classList.add('hidden')
                                }
                            }
                        }

                        tab.classList.add('pattern-active');
                        tab.classList.remove('pattern-not-active');
                        growsPatternTabs.classList.add('border-bottom');
                    }
                    showValueLimitButton(tab);
                }
                else {
                    content.classList.add('hidden');
                }
            }
        }
    }
    function showValueLimitButton(tab) {
        if (tab.dataset.value !== 'jackpot-grows-discreetly') {
            if (tab.classList.contains('pattern-active')) {
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
                newField.classList.add('grid-3-columns');
                newField.innerHTML = `<div>
                                <input name="NumOfDays" class="form-input element-form-data" data-type="int" type="text"
                                placeholder="Dani/sati">
                            </div>
                            <div>
                                <input name="Percent" class="form-input element-form-data" data-type="string" type="text"
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