let jackpotControlActiveTime = (function () {

    let viewBackground = $$('#add-new-jackpot-control-active-time-settings-jackpot-active-background-buttons').children[0];
    let applyTime = $$('#add-new-jackpot-jackpot-time-interval-dropdown-buttons').children[0];
    let addConditionsForWinningJackpotButton = $$('#add-conditions-for-winning-jackpot-button').children[0];

    dropdown.generate({ values: daysInWeek, parent: $$('#add-new-jackpot-time-interval-dropdown-days'), name: "DaysinWeek" });
    highchart.drawHighchart({ parent: $$('#add-new-jackpot-time-interval-chart'), dotsX: 10, dotsY: 10, name: 'LinearFunction' });

    addConditionsForWinningJackpotButton.onclick = function (e) {

        if (checkValidationField($$('#winning-conditions-end-interval-custom-value').parentNode)) {

            let dataElements = e.target.parentNode.parentNode.parentNode.getElementsByClassName('element-form-data');
            let showingData = {}
            let settingsData = {}
            for (let element of dataElements) {
                let name = element.name ? element.name : element.children[0].dataset.name;
                let showingValue = element.classList.contains('default-select') ? element.children[0].dataset.value : element.value;
                let settingsValue = element.classList.contains('default-select') ? element.get() : element.dataset.value;
                showingData[name] = showingValue;
                settingsData[name] = settingsValue;
            }

            let conditionWrapper = document.createElement('div');
            conditionWrapper.settings = settingsData;

            conditionWrapper.innerHTML = `<div class="display-flex control-active-time-interval-wrapper"> 
                <a class="center button-link" onclick = "trigger('removeElement', parentNode)">x</a>
                <div class="center">${settingsData.CounterWinnerConditionList === '2' ? showingData.JackpotList : showingData.CounterWinnerConditionList} ${settingsData.CountTypeWinnerConditionList === '0' ? '' : showingData.CountTypeWinnerConditionList} ${showingData.OperatorWinnerConditionList} ${showingData.Number}<div>
            </div>`

            $$(`#${e.target.dataset.target}`).appendChild(conditionWrapper);

            jackpots.clearAddJackpotInput(e.target.parentNode.parentNode);
            $$('#proba4omotac').classList.add('not-clickable');

        }
    }

    for (let picker of $$('#add-new-jackpot-content-control-active-time').getElementsByClassName('timepicker')) {
        let clonedHours = [...hours]
        clonedHours.shift();
        let clonedMinutes = [...minutes]
        clonedMinutes.shift();
        picker.appendChild(dropdown.generate({ values: clonedHours, name: `hours${picker.dataset.value}` }));
        picker.appendChild(dropdown.generate({ values: clonedMinutes, name: `minutes${picker.dataset.value}` }));
    }

    $$('#add-new-jackpot-time-interval-dropdown').children[0].onclick = function () {
        $$('#add-new-jackpot-time-interval-dropdown').children[1].classList.toggle('hidden');
    }

    checkboxChangeState.radioClick($$('#add-new-jackpot-time-interval-winning-conditions'));

    for (let radioElement of $$('#add-new-jackpot-time-interval-winning-conditions').children) {
        radioElement.addEventListener('click', function () {
            if (radioElement.dataset.value === '1') {
                $$('#winning-conditions-only-at-the-end-of-interval').classList.remove('hidden');
            } else {
                $$('#winning-conditions-only-at-the-end-of-interval').classList.add('hidden');
                $$('#winning-conditions-only-at-the-end-of-interval-custom').classList.add('hidden');
                checkboxChangeState.checkboxIsChecked($$('#winning-conditions-only-at-the-end-of-interval').children[0].getElementsByClassName('form-input')[0], true);

            }
        });
    }

    checkboxChangeState.radioClick($$('#winning-conditions-only-at-the-end-of-interval'));

    for (let radioElement of $$('#winning-conditions-only-at-the-end-of-interval').children) {
        radioElement.addEventListener('click', function () {
            if (radioElement.dataset.value === '2') {
                $$('#winning-conditions-only-at-the-end-of-interval-custom').classList.remove('hidden');
            } else {
                $$('#winning-conditions-only-at-the-end-of-interval-custom').classList.add('hidden');
            }
        });
    }

    checkboxChangeState.radioClick($$('#winning-conditions-added-by-custom-radio-buttons'));

    checkboxChangeState.checkboxClick($$('#add-new-jackpot-control-active-time-settings-jackpot-active-background-checkbox'));
    checkboxChangeState.checkboxClick($$('#add-new-jackpot-control-active-time-settings-jackpot-active-adding-values-checkbox'));

    viewBackground.onclick = function () {
        let src = $$('#add-new-jackpot-control-active-time-settings-jackpot-active-background-dropdown').children[1].get();
        $$('#show-image-container').children[0].src = src;
        $$('#black-area').classList.add('show');
        $$('#show-image-container').classList.remove('hidden');
    }

    applyTime.onclick = function (e) {

        let dropdowns = e.target.parentNode.parentNode.getElementsByClassName('element-form-data');
        let showingData = {}
        let settingsData = {}
        for (let dd of dropdowns) {
            showingData[dd.children[0].dataset.name] = dd.children[0].dataset.value;
            settingsData[dd.children[0].dataset.name] = dd.get();
        }

        let timeWrapper = document.createElement('div');
        timeWrapper.settings = settingsData;

        timeWrapper.innerHTML = `<div class="display-flex control-active-time-interval-wrapper"> 
            <a class="center button-link" onclick = "trigger('removeElement', parentNode)">x</a>
            <div class="center">${showingData.hoursFrom.slice(0, 2)}:${showingData.minutesFrom.slice(0, 2)} - ${showingData.hoursTo.slice(0, 2)}:${showingData.minutesTo.slice(0, 2)} ${showingData.DaysinWeek}<div>
        </div>`

        $$(`#${e.target.dataset.target}`).appendChild(timeWrapper);
        $$('#add-new-jackpot-time-interval-dropdown').children[1].classList.add('hidden');
        for (let dd of dropdowns) {
            dd.reset();
        }
    }

    on('removeElement', function (wrapper) {
        wrapper.remove();
    });

    $$('#black-area').addEventListener('click', function () {
        $$('#show-image-container').classList.add('hidden');
    });
})();