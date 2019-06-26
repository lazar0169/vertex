

let jackpotControlActiveTime = (function () {

    let viewBackground = $$('#add-new-jackpot-control-active-time-settings-jackpot-active-background-buttons').children[0];
    let applyTime = $$('#add-new-jackpot-jackpot-time-interval-dropdown-buttons').children[0];

    dropdown.generate({ values: daysInWeek, parent: $$('#add-new-jackpot-time-interval-dropdown-days'), name: "DaysinWeek" });
    highchart.drawHighchart({ parent: $$('#add-new-jackpot-time-interval-chart'), dotsX: 10, dotsY: 10, name: 'LinearFunction' });

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
            <a class="center button-link" onclick = "trigger('jackpotRemoveTimeInterval', parentNode)">x</a>
            <div class="center">${showingData.hoursFrom.slice(0, 2)}:${showingData.minutesFrom.slice(0, 2)} - ${showingData.hoursTo.slice(0, 2)}:${showingData.minutesTo.slice(0, 2)} ${showingData.DaysinWeek}<div>
        </div>`

        $$(`#${e.target.dataset.target}`).appendChild(timeWrapper);
        $$('#add-new-jackpot-time-interval-dropdown').children[1].classList.add('hidden');
        for (let dd of dropdowns) {
            dd.reset();
        }
    }

    on('jackpotRemoveTimeInterval', function (wrapper) {
        wrapper.remove();
    });

    $$('#black-area').addEventListener('click', function () {
        $$('#show-image-container').classList.add('hidden');
    });
})();