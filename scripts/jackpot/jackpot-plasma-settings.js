const jackpotPlasmaSettings = (function () {
    let jackpotPlasmaSettingsBackground = $$('#jackpot-plasma-general-settings-background');
    let jackpotPlasmaGeneralCheckbox = $$('.jackpot-plasma-general-checkbox');
    let jackpotPlasmaWinCheckbox = $$('.jackpot-plasma-win-checkbox');
    let jackpotPlasmaGeneralSettingsHousing = $$('#jackpot-plasma-general-settings-housing');
    let infoLineText = $$('#jackpot-plasma-general-settings-infoline-text').children[0];
    let applyInfoLineText = $$('#jackpot-plasma-general-settings-infoline-text').children[1];

    jackpotPlasmaSettingsBackground.appendChild(dropdown.generate(pictureName));
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
        y: 730,
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
    function drawPlasmaPicture(div, imgId) {
        let canvas = div;
        let ctx = canvas.getContext("2d");
        let img = imgId;
        ctx.drawImage(img, 0, 0, 1400, 800);
    }


    function drawJackpotLabel(imgId, coordinate, text) {
        let canvas = $$('#jackpot-plasma-settings-animations-picture').children[0].children[0];
        let ctx = canvas.getContext("2d");
        let img = $$(imgId);
        let txt = text;
        ctx.fillStyle = 'white';
        ctx.font = `bold ${coordinate.h - 5}px roboto`;
        ctx.drawImage(img, coordinate.x, coordinate.y, coordinate.w, coordinate.h);
        ctx.fillText(txt, coordinate.x + coordinate.w / 2 - (ctx.measureText(txt).width / 2), coordinate.y + coordinate.h * 7 / 8);

    }

    function drawWinningJackpotLabel(imgId, coordinate, text) {
        let canvas = $$('#jackpot-plasma-settings-animations-picture').children[1].children[0];
        let ctx = canvas.getContext("2d");
        let img = $$(imgId);
        let txt = text;
        ctx.fillStyle = 'white';
        ctx.font = `bold ${coordinate.h - 5}px roboto`;
        ctx.drawImage(img, coordinate.x, coordinate.y, coordinate.w, coordinate.h);
        ctx.fillText(txt, coordinate.x + coordinate.w / 2 - (ctx.measureText(txt).width / 2), coordinate.y + coordinate.h * 7 / 8);
    }
    function drawJackpotInfoLine(coordinate, text) {
        let canvas = $$('#jackpot-plasma-settings-animations-picture').children[0].children[0];
        let ctx = canvas.getContext("2d");
        ctx.clearRect(coordinate.x, coordinate.y, coordinate.w, coordinate.h);
        ctx.fillStyle = 'black';
        ctx.fillRect(coordinate.x, coordinate.y, coordinate.w, coordinate.h);
        let txt = text;
        ctx.fillStyle = 'white';
        ctx.font = `bold ${coordinate.h - 5}px roboto`;
        ctx.fillText(txt, coordinate.x + coordinate.w / 2 - (ctx.measureText(txt).width / 2), coordinate.y + coordinate.h * 7 / 8);
    }

    function callDrawJackpotLabelAll() {
        for (let count = 1; count < 5; count++) {
            switch (count) {
                case 1:
                    drawJackpotLabel('#top-label-plasma-background', topLabelCoordinate1, 'First');
                    drawJackpotLabel('#housing-label-plasma-background', housingCoordinate1, '10000.00');
                    drawJackpotLabel('#left-label-plasma-background', leftLabelCoordinate1, '1');
                    drawJackpotLabel('#bottom-label-plasma-background', bottomLabelCoordinate1, 'Gold');
                    break;
                case 2:
                    drawJackpotLabel('#top-label-plasma-background', topLabelCoordinate2, 'Second');
                    drawJackpotLabel('#housing-label-plasma-background', housingCoordinate2, '5000.00');
                    drawJackpotLabel('#left-label-plasma-background', leftLabelCoordinate2, '2');
                    drawJackpotLabel('#bottom-label-plasma-background', bottomLabelCoordinate2, 'Silver');
                    break;
                case 3:
                    drawJackpotLabel('#top-label-plasma-background', topLabelCoordinate3, 'Third');
                    drawJackpotLabel('#housing-label-plasma-background', housingCoordinate3, '1000.00');
                    drawJackpotLabel('#left-label-plasma-background', leftLabelCoordinate3, '3');
                    drawJackpotLabel('#bottom-label-plasma-background', bottomLabelCoordinate3, 'Bronse');
                    break;
                case 4:
                    drawJackpotLabel('#top-label-plasma-background', topLabelCoordinate4, 'Fourth');
                    drawJackpotLabel('#housing-label-plasma-background', housingCoordinate4, '500.00');
                    drawJackpotLabel('#left-label-plasma-background', leftLabelCoordinate4, '4');
                    drawJackpotLabel('#bottom-label-plasma-background', bottomLabelCoordinate4, 'Diamond');
                    break;
            }
        }
    }
    function callDrawJackpotLabelOnGeneralCheck(checkedLabel) {
        switch (checkedLabel) {
            case 'top-label-plasma-background':
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
            case 'left-label-plasma-background':
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
            case 'housing-label-plasma-background':
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
            case 'bottom-label-plasma-background':
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
        }
    }

    function callDrawJackpotLabelOnWinCheck(checkedLabel) {
        switch (checkedLabel) {
            case 'top-label-plasma-background':
                drawWinningJackpotLabel(`#${checkedLabel}`, topLabelCoordinateWin, 'Winning');
                break;
            case 'left-label-plasma-background':
                drawWinningJackpotLabel(`#${checkedLabel}`, leftLabelCoordinateWin, '1');
                break;
            case 'bottom-label-plasma-background':
                drawWinningJackpotLabel(`#${checkedLabel}`, bottomLabelCoordinateWin, 'FAZI');
                break;
        }
    }

    applyInfoLineText.addEventListener('click', function () {
        if ($$('#jackpot-plasma-general-settings-infoline').children[0].children[0].checked) {
            drawJackpotInfoLine(infoLineCoordinate, infoLineText.value);
        }
        else {
            alert('Enable box "Info Line"')
        }
    });


    window.addEventListener('load', function () {
        drawPlasmaPicture($$('#jackpot-plasma-settings-animations-picture').children[0].children[0], $$('#new-york-landscape-plasma-background'));
        drawPlasmaPicture($$('#jackpot-plasma-settings-animations-picture').children[1].children[0], $$('#new-york-winning-plasma-background'));
        callDrawJackpotLabelAll();
        drawWinningJackpotLabel('#top-label-plasma-background', topLabelCoordinateWin, 'Winning');
        drawWinningJackpotLabel('#housing-label-plasma-background', housingCoordinateWin, '500.00');
        drawWinningJackpotLabel('#left-label-plasma-background', leftLabelCoordinateWin, '1');
        drawWinningJackpotLabel('#bottom-label-plasma-background', bottomLabelCoordinateWin, 'FAZI');

        for (let check of jackpotPlasmaGeneralCheckbox) {
            check.addEventListener('click', function (e) {
                e.preventDefault();
                if (check.children[0].children[0].checked) {
                    check.children[0].children[0].checked = false;
                }
                else {
                    check.children[0].children[0].checked = true;
                }
                if (!jackpotPlasmaGeneralSettingsHousing.children[0].children[0].checked) {
                    drawPlasmaPicture($$('#jackpot-plasma-settings-animations-picture').children[0].children[0], $$('#new-york-landscape-plasma-background'));
                    return;
                }
                drawPlasmaPicture($$('#jackpot-plasma-settings-animations-picture').children[0].children[0], $$('#new-york-landscape-plasma-background'));
                for (let isChecked of jackpotPlasmaGeneralCheckbox) {
                    if (isChecked.children[0].children[0].checked) {
                        callDrawJackpotLabelOnGeneralCheck(isChecked.dataset.name);
                    }
                }
            });
        }
        for (let check of jackpotPlasmaWinCheckbox) {
            check.addEventListener('click', function (e) {
                e.preventDefault();
                if (check.children[0].children[0].checked) {
                    check.children[0].children[0].checked = false;
                }
                else {
                    check.children[0].children[0].checked = true;
                }
                drawPlasmaPicture($$('#jackpot-plasma-settings-animations-picture').children[1].children[0], $$('#new-york-winning-plasma-background'));
                drawWinningJackpotLabel('#housing-label-plasma-background', housingCoordinateWin, '500.00');
                for (let isChecked of jackpotPlasmaWinCheckbox) {
                    if (isChecked.children[0].children[0].checked) {
                        callDrawJackpotLabelOnWinCheck(isChecked.dataset.name);
                    }
                }
            });
        }
    });
})();