const jackpotGrowthPattern = (function () {
    let growsPatternTabs = $$('#jackpot-growth-pattern-tabs');
    let tabContent = $$('.jackpot-pattern-tab-content');
    let jackpotControlGrowthPeriodByDays = $$('#jackpot-control-growth-period').children[0];
    let jackpotControlGrowthPeriodByHours = $$('#jackpot-control-growth-period').children[1];
    let addNewGrowthField = $$('#jackpot-grows-automatically-content').getElementsByClassName('secundarybutton');
    let valueLimitCheckbox = $$('#jackpot-growth-pattern-value-limit-checkbox').parentNode;
    let chooseMachinesGrowsByBet = $$('#add-new-jackpot-grows-by-bet-choose-machines-buttons').children[0];
    let removeMachinesGrowsByBet = $$('#add-new-jackpot-grows-by-bet-choose-machines-buttons').children[1];
    let chooseMachinesGrowsDiscreetlyRain = $$('#add-new-jackpot-grows-discreetly-rain-choose-machines-buttons').children[0];
    let removeMachinesGrowsDiscreetlyRain = $$('#add-new-jackpot-grows-discreetly-rain-choose-machines-buttons').children[1];
    let chooseMachinesGrowsDiscreetlyTournament = $$('#add-new-jackpot-grows-discreetly-tournament-choose-machines-buttons').children[0];
    let removeMachinesGrowsDiscreetlyTournament = $$('#add-new-jackpot-grows-discreetly-tournament-choose-machines-buttons').children[1];
    let chooseMachinesGrowsDiscreetlyCustom = $$('#add-new-jackpot-grows-discreetly-custom-choose-machines-buttons').children[0];
    let removeMachinesGrowsDiscreetlyCustom = $$('#add-new-jackpot-grows-discreetly-custom-choose-machines-buttons').children[1];
    let jackpotGrowsDiscreetlyRadioButtonsWrapper = $$('#jackpot-grows-discreetly-radio-buttons');
    let jackpotGrowsPatternCustomRadio = jackpotGrowsDiscreetlyRadioButtonsWrapper.children;
    let jackpotGrowsCustomRadioButtonsWrapper = $$("#jackpot-grows-discreetly-custom-radio-buttons");
    const CountTypeList = {
        '1': 'Exists',
        '2': 'Every',
        '3': 'Last',
        '4': 'Count',
        '5': 'Sum'
    }
    highchart.drawHighchart({ parent: $$('#jackpot-growth-pattern-grows-by-bet-chart'), dotsX: 10, dotsY: 10, name: 'MinMaxFunction' });
    checkboxChangeState.radioClick(jackpotGrowsCustomRadioButtonsWrapper);
    let addLevelDiscreetlyCustomConditionButton = $$('#custom-add-level-condition-button').children[0];
    addLevelDiscreetlyCustomConditionButton.onclick = function (e) {
        if (checkValidationField(e.target.parentNode.parentNode)) {
            addConditionLevel(e.target.dataset.value, e.target);
            clearInputsFields(e.target.parentNode.parentNode);
            $$('#custom-dropdown-jackpot-wrapper').classList.add('hidden');
        }
    }
    let addLevelDiscreetlyTournamentButton = $$('#tournament-add-level-button').children[0];
    addLevelDiscreetlyTournamentButton.onclick = function (e) {
        if (checkValidationField(e.target.parentNode.parentNode.parentNode)) {
            createLevel(e.target.dataset.value);
            clearInputsFields(e.target.parentNode.parentNode.parentNode);
            $$('#tournament-dropdown-jackpot-wrapper').classList.add('hidden');
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
            clearCustomConditions($$('#custom-level-conditions-wrapper'));
        }
    }
    function editExistLevel(inputsWrapper, levelWrapper) {
        let data = levelWrapper.settings;
        let addLevelButton = inputsWrapper.getElementsByClassName('element-add-button')[0];
        addLevelButton.classList.add('hidden');
        let editLevelButton = inputsWrapper.getElementsByClassName('element-edit-button')[0];
        editLevelButton.classList.remove('hidden');
        editLevelButton.onclick = function (e) {
            let newData = prepareDataForLevel(e.target.dataset.value);
            let str;
            str = CountTypeList[newData.CountTypeList];
            levelWrapper.getElementsByClassName('element-level-name')[0].innerHTML = newData.LevelName;
            levelWrapper.getElementsByClassName('element-level-value')[0].innerHTML = formatFloatValue(newData.LevelValue);
            if (newData.CustomLevelConditions) {
                levelWrapper.getElementsByClassName('element-level-conditions')[0].innerHTML = newData.CustomLevelConditionsText;
            } else {
                levelWrapper.getElementsByClassName('element-level-conditions')[0].innerHTML = `${newData.LevelOutcome.id === '2' ? newData.JackpotList.name : newData.LevelOutcome.name}: ${str} ${newData.Operator.name} ${formatFloatValue(newData.Value)}`
            }
            levelWrapper.settings = newData;
            clearInputsFields(e.target.parentNode.parentNode.parentNode);
            if (checkboxChangeState.getRadioState($$('#jackpot-grows-discreetly-radio-buttons')) === '3') {
                $$('#custom-level-conditions-wrapper').innerHTML = '';
            }
            addLevelButton.classList.remove('hidden');
            editLevelButton.classList.add('hidden');
        }
        if (checkboxChangeState.getRadioState($$('#jackpot-grows-discreetly-radio-buttons')) === '3') {
            for (let input of $$('#custom-input-wrapper').children[0].getElementsByClassName('element-form-data')) {
                let inputName = input.name === undefined ? input.children[0].dataset.name : input.name;
                fillInputElementWithData(input, data)
            }
            $$('#custom-level-conditions-wrapper').innerHTML = '';
            for (let condition of data.CustomLevelConditions) {
                addConditionLevel('custom-level-conditions-wrapper', '', condition)
            }
        } else {
            let inputsFields = inputsWrapper.getElementsByClassName('element-form-data');
            for (let input of inputsFields) {
                fillInputElementWithData(input, data)
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
                    checkboxChangeState.checkboxIsChecked(input.getElementsByClassName('form-radio')[0].children[0], true);
                    break;
                default:
                    input.value = ''
            }
        }
    }
    function clearCustomConditions(wrapper) {
        wrapper.innerHTML = ''
    }
    function prepareDataForLevel(id) {
        let inputWrapper;
        if (typeof id === 'string') {
            inputWrapper = $$(`#${id}`);
        } else {
            inputWrapper = id;
        }
        let data = {};
        for (let input of inputWrapper.getElementsByClassName('element-form-data')) {
            switch (input.dataset.type) {
                case 'single-select':
                    data[input.children[0].dataset.name] = {
                        name: input.children[0].dataset.value,
                        id: input.children[0].dataset.id
                    }
                    break;
                case 'float':
                    data[input.name ? input.name : ''] = parseInt(input.dataset.value);
                    break;
                case 'radio':
                    data[input.dataset.name] = checkboxChangeState.getRadioState(input);
                    break
                default:
                    data[input.name ? input.name : ''] = input.value ? input.value : "";
                    break;
            }
        }
        if (inputWrapper.parentNode === $$('#custom-input-wrapper')) {
            let ddCustomJackpot = $$('#custom-dropdown-jackpot').getElementsByClassName('element-form-data')[0].children[0]
            data[ddCustomJackpot.dataset.name] = $$('#custom-dropdown-jackpot-wrapper').classList.contains('not-clickable') ? null : {
                name: ddCustomJackpot.dataset.value,
                id: ddCustomJackpot.dataset.id
            }
            return data;
        }
        else if (inputWrapper === $$('#custom-input-wrapper')) {
            data.CustomLevelConditions = [];
            data.CustomLevelConditionsText = [];
            for (let levelCondition of $$('#custom-level-conditions-wrapper').children) {
                data.CustomLevelConditions.push(levelCondition.settings);
                data.CustomLevelConditionsText += `${levelCondition.children[1].innerHTML}<br>`;
            }
        } else {
            data.CountTypeList = $$(`#jackpot-grows-discreetly-${jackpotGrowsDiscreetlyRadioButtonsWrapper.settings.radioName}-content`).children[0].children[1].children[1].dataset.id;
        }
        return data;
    }
    function addConditionLevel(conditionsWrapperId, inputsWrapperId, params) {
        let conditionArray = [];
        let conditionsWrapper = $$(`#${conditionsWrapperId}`);
        let data;
        if (params) {
            data = params
        } else {
            data = prepareDataForLevel(inputsWrapperId.parentNode.parentNode);
        }
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
        levelTextWrapper.innerHTML = `${data.LevelOutcome.id === '2' ? data.JackpotList.name : data.LevelOutcome.name} : ${data.CountTypeList.name} ${data.Operator.name} ${data.Value}`
        singleConditonWrapper.appendChild(levelTextWrapper);
        conditionsWrapper.appendChild(singleConditonWrapper);
    }
    function createLevel(id, dataFromServer) {
        let data;
        if (dataFromServer) {

            for (let levelData of dataFromServer) {
                data = {};
                console.log('podatak stigo sa servera', dataFromServer)
            }

        } else {
            let inputWrapper = $$(`#${id}`);
            let levelExistWrapper = inputWrapper.parentNode.getElementsByClassName('jackpot-level-exist-wrapper')[0];
            let levelArray = []
            for (let level of levelExistWrapper.children) {
                levelArray.push(level.settings)
            }
            data = prepareDataForLevel(id);
            if (data.LevelName && data.LevelValue && data.Operator && levelExistWrapper.children.length < 4) {
                for (let level of levelArray) {
                    if (data.LevelName === level.LevelName && data.LevelValue === level.LevelValue) {
                        trigger('notifications/show', {
                            message: localization.translateMessage('Level exists!!!'),
                            type: notifications.messageTypes.error,
                        });
                        return;
                    }
                }
                levelExistWrapper.appendChild(generateLevel());

            }
        }
        function generateLevel() {

            let levelWrapper = document.createElement('div');
            if (data.CustomLevelConditions) {
                if (data.CustomLevelConditions.length === 0) {
                    trigger('notifications/show', {
                        message: localization.translateMessage('Empty condition!!!'),
                        type: notifications.messageTypes.error,
                    });
                } else {
                    levelWrapper.settings = data;
                    levelWrapper.innerHTML = `<div>
                <div>Level name:</div> 
                <div class="element-level-name">${data.LevelName}</div>
            </div>
            <div>
                <div>Level value:</div> 
                <div class="element-level-value">${formatFloatValue(data.LevelValue)}</div>
            </div>
            <div>
                <div>Level conditions:</div> 
                <div class="element-level-conditions">${data.CustomLevelConditionsText}</div>
            </div>`
                }
            } else {
                levelWrapper.settings = data;
                let str;
                let conditionText = data.LevelOutcome ? data.LevelOutcome.id === '2' ? data.JackpotList.name : data.LevelOutcome.name : data.JackpotList.name;
                str = CountTypeList[data.CountTypeList];
                levelWrapper.innerHTML = `<div>
                <div>Level name:</div> 
                <div class="element-level-name">${data.LevelName}</div>
            </div>
            <div>
                <div>Level value:</div> 
                <div class="element-level-value">${formatFloatValue(data.LevelValue)}</div>
            </div>
            <div>
                <div>Level conditions:</div> 
                <div class="element-level-conditions">${conditionText}: ${str} ${data.Operator.name} ${data.Value}</div>
            </div>`
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
                editExistLevel(e.target.parentNode.parentNode.parentNode.parentNode, e.target.parentNode.parentNode)
            }
            editCloseLevelWrapper.appendChild(levelClose);
            editCloseLevelWrapper.appendChild(levelEdit);
            levelWrapper.appendChild(editCloseLevelWrapper);

            return levelWrapper

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
    chooseMachinesGrowsByBet.onclick = function () {
        generateMachinesForChoosing($$('#add-new-jackpot-wrapper').settings.MachineList, $$('#add-new-jackpot-grows-by-bet-choose-machines-wrapper'))
        jackpotChooseParticipatingMachines.showHideChooseMachine.show();
    }
    removeMachinesGrowsByBet.onclick = function (e) {
        removeChoosedMachines(e)
    }
    chooseMachinesGrowsDiscreetlyRain.onclick = function () {
        generateMachinesForChoosing($$('#add-new-jackpot-wrapper').settings.MachineList, $$('#rain-choose-machines-wrapper'))
        jackpotChooseParticipatingMachines.showHideChooseMachine.show();
    }
    removeMachinesGrowsDiscreetlyRain.onclick = function (e) {
        removeChoosedMachines(e)
    }
    chooseMachinesGrowsDiscreetlyTournament.onclick = function () {
        generateMachinesForChoosing($$('#add-new-jackpot-wrapper').settings.MachineList, $$('#tournament-choose-machines-wrapper'))
        jackpotChooseParticipatingMachines.showHideChooseMachine.show();
    }
    removeMachinesGrowsDiscreetlyTournament.onclick = function (e) {
        removeChoosedMachines(e)
    }
    chooseMachinesGrowsDiscreetlyCustom.onclick = function () {
        generateMachinesForChoosing($$('#add-new-jackpot-wrapper').settings.MachineList, $$('#custom-choose-machines-wrapper'))
        jackpotChooseParticipatingMachines.showHideChooseMachine.show();
    }
    removeMachinesGrowsDiscreetlyCustom.onclick = function (e) {
        removeChoosedMachines(e)
    }
    function removeChoosedMachines(e) {
        let choosingMachinesWrapper = e.target.parentNode.parentNode
        choosingMachinesWrapper.settings = {}
        let numberOfSelectedMachines = choosingMachinesWrapper.settings.selectedMachinesArrayID ? choosingMachinesWrapper.settings.selectedMachinesArrayID.length : '0'
        choosingMachinesWrapper.getElementsByClassName('showing-participating-machines')[0].innerHTML = `${numberOfSelectedMachines}/${$$('#add-new-jackpot-wrapper').settings.MachineList.Items.length}`
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
                        //if table is empty hide rain else show
                        if (!$$('#table-container-jackpots').getElementsByClassName('table-element-no-data')[0].classList.contains('hidden')) {
                            for (let radio of $$('#jackpot-grows-discreetly-radio-buttons').children) {
                                if (radio.dataset.name === 'rain') {
                                    radio.classList.add('hidden')
                                }
                            }
                        } else {
                            for (let radio of $$('#jackpot-grows-discreetly-radio-buttons').children) {
                                if (radio.dataset.name === 'rain') {
                                    radio.classList.remove('hidden')
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
            } else {
                $$("#jackpot-value-limit-wrapper").classList.add('hidden');
            }
        } else {
            $$("#jackpot-value-limit-wrapper").classList.add('hidden');
        }
    }
    function bindGridButton(button) {
        button.onclick = function (e) {
            if (button.dataset.value === 'add-new-field') {
                if (checkValidationField(e.target.parentNode.parentNode)) {
                    button.dataset.value = 'delete-field';
                    button.innerHTML = 'Delete';
                    let newField = document.createElement('div');
                    newField.classList.add('grid-3-columns');
                    let dataName = $$('#jackpot-control-growth-period').getElementsByClassName('tab-active')[0].dataset.name
                    if (dataName === 'days') {
                        newField.innerHTML = `<div>
                                        <input min="1" name="NumOfDay" class="form-input element-form-data input-number-right" data-type="int" type="text"
                                        placeholder="Days">
                                    </div>
                                    <div>
                                        <input min="1" max="99" name="Percent" class="form-input element-form-data input-number-right element-percent" data-type="int" type="text"
                                        placeholder="Percent">
                                    </div>
                                    <div>
                                        <button class="secundarybutton" data-value="add-new-field">Add</button>
                                    </div>`
                    } else {
                        newField.innerHTML = `<div>
                        <input min="1" max="23" name="Time" class="form-input element-form-data input-number-right" data-type="int" type="text"
                        placeholder="Hours">
                    </div>
                    <div>
                        <input min="1" max="99" name="Percent" class="form-input element-form-data input-number-right element-percent" data-type="int" type="text"
                        placeholder="Percent">
                    </div>
                    <div>
                        <button class="secundarybutton" data-value="add-new-field">Add</button>
                    </div>`
                    }
                    button.parentNode.parentNode.parentNode.appendChild(newField);
                    for (let input of newField.getElementsByClassName('element-form-data')) {
                        validation.init(input, {});
                    }
                    bindGridButton(newField.children[2].children[0]);
                } else {
                }
            } else {
                button.parentNode.parentNode.remove()
            }
        }
    }
    return {
        createLevel
    }
})();