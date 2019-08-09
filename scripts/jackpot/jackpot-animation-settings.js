const jackpotanimationSettings = (function () {
    let jackpotAnimationSettingsContent = $$('#jackpot-animation-settings-wrapper')
    let jackpotAnimationGeneralCheckbox = $$('.jackpot-animation-general-checkbox');
    let jackpotanimationWinCheckbox = $$('.jackpot-animation-win-checkbox');
    let jackpotanimationGeneralSettingsHousing = $$('#jackpot-animation-general-settings-housing');
    let infoLineWrapper = $$("#jackpot-animation-general-settings-infoline-text");
    let infoLineText = $$('#jackpot-animation-general-settings-infoline-text').children[0];
    let infoLineCheckbox = $$('#jackpot-animation-general-settings-infoline');
    let applyInfoLineText = $$('#jackpot-animation-general-settings-infoline-text').children[1];
    let saveAnimationSettings = $$('#jackpot-animation-settings-buttons').children[0];
    let animationBackgroundDropdown = $$('#jackpot-animation-general-settings-background');
    let animationBackgroundPicture = $$('#new-york-landscape-animation-background');
    saveAnimationSettings.onclick = function () {
        let EntryData = {}
        EntryData = jackpots.getEndpointId();
        EntryData.TimerValue = jackpotAnimationSettingsContent.settings.TimerValue;
        EntryData.ShowTimer = jackpotAnimationSettingsContent.settings.ShowTimer;
        EntryData.JackpotBackgroundList = jackpotAnimationSettingsContent.settings.JackpotBackgroundList;
        EntryData.Background = "https://api.fazigaming.com//Images/Template Images/New York.png"
        EntryData.IsLocal = jackpotAnimationSettingsContent.settings.IsLocal;
        EntryData.InfoLine = infoLineText.value;
        for (let checkbox of jackpotAnimationSettingsContent.getElementsByClassName('form-checkbox')) {
            EntryData[checkbox.parentNode.dataset.name] = checkboxChangeState.getCheckboxState(checkbox.parentNode);
        }
        let data = {}
        data.successAction = 'jackpot/save-jackpot-animation-settings'
        trigger(communication.events.jackpots.setJackpotPlasmaSettings, { data, EntryData });
    }
    on('jackpot/save-jackpot-animation-settings', function (params) {
        trigger('notifications/show', {
            message: localization.translateMessage(params.data.MessageCode),
            type: params.data.MessageType,
        });
    });
    for (let check of jackpotAnimationGeneralCheckbox) {
        let data = {}
        data.checkbox = check;
        data.isChecked = false;
        checkboxChangeState.generateCheckbox(data);
        check.addEventListener('click', function () {
            if (!checkboxChangeState.getCheckboxState(jackpotanimationGeneralSettingsHousing)) {
                drawanimationPicture($$('#jackpot-animation-settings-animations-picture').children[0].children[0], animationBackgroundPicture);
                return;
            }
            drawanimationPicture($$('#jackpot-animation-settings-animations-picture').children[0].children[0], animationBackgroundPicture);
            for (let isChecked of jackpotAnimationGeneralCheckbox) {
                if (checkboxChangeState.getCheckboxState(isChecked)) {
                    callDrawJackpotLabelOnGeneralCheck(isChecked.dataset.name);
                }
            }
        });
    }
    for (let check of jackpotanimationWinCheckbox) {
        let data = {}
        data.checkbox = check;
        data.isChecked = false;
        checkboxChangeState.generateCheckbox(data);
        check.addEventListener('click', function (e) {
            drawanimationPicture($$('#jackpot-animation-settings-animations-picture').children[1].children[0], $$('#new-york-winning-animation-background'));
            drawWinningJackpotLabel('#ShowHousing', housingCoordinateWin, '500.00');
            for (let isChecked of jackpotanimationWinCheckbox) {
                if (checkboxChangeState.getCheckboxState(isChecked)) {
                    callDrawJackpotLabelOnWinCheck(isChecked.dataset.name);
                }
            }
        });
    }
    infoLineCheckbox.addEventListener('click', function (e) {
        if (checkboxChangeState.getCheckboxState(infoLineCheckbox)) {
            drawJackpotInfoLine(infoLineCoordinate, infoLineWrapper.children[0].value);
        }
        else {
            drawJackpotInfoLine(infoLineCoordinate, "");
        }
        infoLineWrapper.classList.toggle('hidden');
    });
    on('jackpot/get-jackpot-animation-settings', function (params) {
        let EntryData = jackpots.getEndpointId()
        let data = {};
        data.successAction = 'jackpot/show-jackpots-animation-settings'
        trigger(communication.events.jackpots.getJackpotPlasmaSettings, { data, EntryData });
    });
    on('jackpot/show-jackpots-animation-settings', function (params) {
        let data = params.data.Data;
        animationBackgroundPicture.src = data.Background;
        animationBackgroundPicture.onload = function () {
            drawanimationPicture($$('#jackpot-animation-settings-animations-picture').children[0].children[0], animationBackgroundPicture);
            for (let check of jackpotAnimationGeneralCheckbox) {
                for (let checkName of Object.keys(data)) {
                    if (checkName === check.dataset.name) {
                        checkboxChangeState.checkboxIsChecked(check.getElementsByClassName('form-checkbox')[0].children[0], params.data.Data[checkName]);
                        callDrawJackpotLabelOnGeneralCheck(checkName)
                        break;
                    }
                }
            }
        }
        drawanimationPicture($$('#jackpot-animation-settings-animations-picture').children[1].children[0], $$('#new-york-winning-animation-background'));
        drawWinningJackpotLabel('#ShowHousing', housingCoordinateWin, '500.00');
        jackpotAnimationSettingsContent.settings = data;
        dropdown.generate({ values: data.JackpotBackgroundList, parent: animationBackgroundDropdown });
        infoLineText.value = data.InfoLine;
        for (let check of jackpotanimationWinCheckbox) {
            for (let checkName of Object.keys(data)) {
                if (checkName === check.dataset.name) {
                    checkboxChangeState.checkboxIsChecked(check.getElementsByClassName('form-checkbox')[0].children[0], params.data.Data[checkName]);
                    callDrawJackpotLabelOnWinCheck(checkName)
                    break;
                }
            }
        }
    });
    //first
    let topLabelCoordinate1 = {
        x: 535,
        y: 50,
        w: 320,
        h: 35
    }
    let bottomLabelCoordinate1 = {
        x: 535,
        y: 185,
        w: 320,
        h: 35
    }
    let leftLabelCoordinate1 = {
        x: 410,
        y: 110,
        w: 50,
        h: 50
    }
    let housingCoordinate1 = {
        x: 435,
        y: 85,
        w: 520,
        h: 100
    }
    //second
    let topLabelCoordinate2 = {
        x: 555,
        y: 245,
        w: 280,
        h: 30
    }
    let bottomLabelCoordinate2 = {
        x: 555,
        y: 365,
        w: 280,
        h: 30
    }
    let leftLabelCoordinate2 = {
        x: 438,
        y: 308,
        w: 45,
        h: 45
    }
    let housingCoordinate2 = {
        x: 465,
        y: 275,
        w: 460,
        h: 90
    }
    //third
    let topLabelCoordinate3 = {
        x: 570,
        y: 420,
        w: 250,
        h: 30
    }
    let bottomLabelCoordinate3 = {
        x: 570,
        y: 535,
        w: 250,
        h: 30
    }
    let leftLabelCoordinate3 = {
        x: 465,
        y: 470,
        w: 40,
        h: 40
    }
    let housingCoordinate3 = {
        x: 485,
        y: 450,
        w: 420,
        h: 85
    }
    //fourth
    let topLabelCoordinate4 = {
        x: 580,
        y: 590,
        w: 230,
        h: 25
    }
    let bottomLabelCoordinate4 = {
        x: 580,
        y: 690,
        w: 230,
        h: 25
    }
    let leftLabelCoordinate4 = {
        x: 488,
        y: 633,
        w: 35,
        h: 35
    }
    let housingCoordinate4 = {
        x: 505,
        y: 615,
        w: 380,
        h: 75
    }
    let infoLineCoordinate = {
        x: 0,
        y: 750,
        w: 1400,
        h: 50
    }
    // winning jackpot
    let topLabelCoordinateWin = {
        x: 400,
        y: 399,
        w: 591,
        h: 61
    }
    let bottomLabelCoordinateWin = {
        x: 400,
        y: 652,
        w: 591,
        h: 61
    }
    let leftLabelCoordinateWin = {
        x: 180,
        y: 526,
        w: 77,
        h: 77
    }
    let housingCoordinateWin = {
        x: 220,
        y: 460,
        w: 951,
        h: 192
    }
    function drawanimationPicture(div, imgId) {
        let canvas = div;
        let ctx = canvas.getContext("2d");
        let img = imgId;
        ctx.drawImage(img, 0, 0, 1400, 800);
    }
    function drawJackpotLabel(imgId, coordinate, text) {
        let canvas = $$('#jackpot-animation-settings-animations-picture').children[0].children[0];
        let ctx = canvas.getContext("2d");
        let img = $$(imgId);
        let txt = text;
        ctx.fillStyle = 'white';
        ctx.font = `bold ${coordinate.h - 5}px Open Sans`;
        ctx.drawImage(img, coordinate.x, coordinate.y, coordinate.w, coordinate.h);
        ctx.fillText(txt, coordinate.x + coordinate.w / 2 - (ctx.measureText(txt).width / 2), coordinate.y + coordinate.h * 7 / 8);
    }
    function drawWinningJackpotLabel(imgId, coordinate, text) {
        let canvas = $$('#jackpot-animation-settings-animations-picture').children[1].children[0];
        let ctx = canvas.getContext("2d");
        let img = $$(imgId);
        let txt = text;
        ctx.fillStyle = 'white';
        ctx.font = `bold ${coordinate.h - 5}px Open Sans`;
        ctx.drawImage(img, coordinate.x, coordinate.y, coordinate.w, coordinate.h);
        ctx.fillText(txt, coordinate.x + coordinate.w / 2 - (ctx.measureText(txt).width / 2), coordinate.y + coordinate.h * 7 / 8);
    }
    function drawJackpotInfoLine(coordinate, text) {
        let canvas = $$('#jackpot-animation-settings-animations-picture').children[0].children[0];
        let ctx = canvas.getContext("2d");
        ctx.clearRect(coordinate.x, coordinate.y, coordinate.w, coordinate.h);
        ctx.fillStyle = 'black';
        ctx.fillRect(coordinate.x, coordinate.y, coordinate.w, coordinate.h);
        let txt = text;
        ctx.fillStyle = 'white';
        ctx.font = `bold ${coordinate.h - 5}px Open Sans`;
        ctx.fillText(txt, coordinate.x + coordinate.w / 2 - (ctx.measureText(txt).width / 2), coordinate.y + coordinate.h * 4 / 5);
    }
    function callDrawJackpotLabelOnGeneralCheck(checkedLabel) {
        switch (checkedLabel) {
            case 'ShowTopLabel':
                for (let count = 1; count < 5; count++) {
                    {
                        switch (count) {
                            case 1:
                                drawJackpotLabel(`#${checkedLabel}`, topLabelCoordinate1, 'First');
                                break;
                            case 2:
                                drawJackpotLabel(`#${checkedLabel}`, topLabelCoordinate2, 'Second');
                                break;
                            case 3:
                                drawJackpotLabel(`#${checkedLabel}`, topLabelCoordinate3, 'Third');
                                break;
                            case 4:
                                drawJackpotLabel(`#${checkedLabel}`, topLabelCoordinate4, 'Fourth');
                                break;
                        }
                    }
                }
                break;
            case 'ShowOrder':
                for (let count = 1; count < 5; count++) {
                    {
                        switch (count) {
                            case 1:
                                drawJackpotLabel(`#${checkedLabel}`, leftLabelCoordinate1, '1');
                                break;
                            case 2:
                                drawJackpotLabel(`#${checkedLabel}`, leftLabelCoordinate2, '2');
                                break;
                            case 3:
                                drawJackpotLabel(`#${checkedLabel}`, leftLabelCoordinate3, '3');
                                break;
                            case 4:
                                drawJackpotLabel(`#${checkedLabel}`, leftLabelCoordinate4, '4');
                                break;
                        }
                    }
                }
                break;
            case 'ShowHousing':
                for (let count = 1; count < 5; count++) {
                    {
                        switch (count) {
                            case 1:
                                drawJackpotLabel(`#${checkedLabel}`, housingCoordinate1, '10000.00');
                                break;
                            case 2:
                                drawJackpotLabel(`#${checkedLabel}`, housingCoordinate2, '5000.00');
                                break;
                            case 3:
                                drawJackpotLabel(`#${checkedLabel}`, housingCoordinate3, '1000.00');
                                break;
                            case 4:
                                drawJackpotLabel(`#${checkedLabel}`, housingCoordinate4, '500.00');
                                break;
                        }
                    }
                }
                break;
            case 'ShowBottomLabel':
                for (let count = 1; count < 5; count++) {
                    {
                        switch (count) {
                            case 1:
                                drawJackpotLabel(`#${checkedLabel}`, bottomLabelCoordinate1, 'Gold');
                                break;
                            case 2:
                                drawJackpotLabel(`#${checkedLabel}`, bottomLabelCoordinate2, 'Silver');
                                break;
                            case 3:
                                drawJackpotLabel(`#${checkedLabel}`, bottomLabelCoordinate3, 'Bronse');
                                break;
                            case 4:
                                drawJackpotLabel(`#${checkedLabel}`, bottomLabelCoordinate4, 'Diamond');
                                break;
                        }
                    }
                }
                break;
            case 'ShowInfoLine':
                drawJackpotInfoLine(infoLineCoordinate, infoLineText.value);
                break;
        }
    }
    function callDrawJackpotLabelOnWinCheck(checkedLabel) {
        switch (checkedLabel) {
            case 'ShowTopLabelWin':
                drawWinningJackpotLabel(`#${checkedLabel.slice(0, -3)}`, topLabelCoordinateWin, 'Winning');
                break;
            case 'ShowOrderWin':
                drawWinningJackpotLabel(`#${checkedLabel.slice(0, -3)}`, leftLabelCoordinateWin, '1');
                break;
            case 'ShowBottomLabelWin':
                drawWinningJackpotLabel(`#${checkedLabel.slice(0, -3)}`, bottomLabelCoordinateWin, 'FAZI');
                break;
        }
    }
    applyInfoLineText.addEventListener('click', function () {
        infoLineText.value = infoLineText.value;
        drawJackpotInfoLine(infoLineCoordinate, infoLineText.value);
    });
})();