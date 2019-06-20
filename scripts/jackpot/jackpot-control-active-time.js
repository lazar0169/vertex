let jackpotControlActiveTime = (function () {

    dropdown.generate({ values: daysInWeek, parent: $$('#add-new-jackpot-time-interval-dropdown-days'), name: "DaysinWeek" });
    highchart.drawHighchart({ parent: $$('#add-new-jackpot-time-interval-chart'), dotsX: 10, dotsY: 10, name: 'LinearFunction' });

    for (let picker of $$('#add-new-jackpot-time-interval-dropdown').getElementsByClassName('timepicker')) {
        picker.appendChild(dropdown.generate({ values: hours }));
        picker.appendChild(dropdown.generate({ values: minutes }));
    }

    $$('#add-new-jackpot-time-interval-dropdown').children[0].onclick = function () {
        $$('#add-new-jackpot-time-interval-dropdown').children[1].classList.toggle('hidden');
    }

    checkboxChangeState.radioClick($$('#add-new-jackpot-time-interval-winning-conditions'));
    checkboxChangeState.checkboxClick($$('#add-new-jackpot-control-active-time-settings-jackpot-active-background-checkbox'));
    checkboxChangeState.checkboxClick($$('#add-new-jackpot-control-active-time-settings-jackpot-active-adding-values-checkbox'));




})();