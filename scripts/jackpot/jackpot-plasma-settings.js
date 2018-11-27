const jackpotPlasmaSettings = (function () {
    let jackpotPlasmaSettingsBackground = $$('#jackpot-plasma-general-settings-background');
    jackpotPlasmaSettingsBackground.appendChild(dropdown.generate(pictureName));
    //first
    let topLabelCoordinate1 = {
        x: 520,
        y: 60,
        w: 320,
        h: 35
    }
    let bottomLabelCoordinate1 = {
        x: 520,
        y: 195,
        w: 320,
        h: 35
    }
    let leftLabelCoordinate1 = {
        x: 395,
        y: 120,
        w: 50,
        h: 50
    }

    let housingCoordinate1 = {
        x: 420,
        y: 95,
        w: 520,
        h: 100
    }
    //second
    let topLabelCoordinate2 = {
        x: 540,
        y: 255,
        w: 280,
        h: 30
    }
    let bottomLabelCoordinate2 = {
        x: 540,
        y: 375,
        w: 280,
        h: 30
    }
    let leftLabelCoordinate2 = {
        x: 423,
        y: 308,
        w: 45,
        h: 45
    }

    let housingCoordinate2 = {
        x: 450,
        y: 285,
        w: 460,
        h: 90
    }
    //third
    let topLabelCoordinate3 = {
        x: 555,
        y: 441,
        w: 250,
        h: 30
    }
    let bottomLabelCoordinate3 = {
        x: 555,
        y: 556,
        w: 250,
        h: 30
    }
    let leftLabelCoordinate3 = {
        x: 450,
        y: 491,
        w: 40,
        h: 40
    }

    let housingCoordinate3 = {
        x: 470,
        y: 471,
        w: 420,
        h: 85
    }
    //fourth
    let topLabelCoordinate4 = {
        x: 565,
        y: 618,
        w: 230,
        h: 25
    }
    let bottomLabelCoordinate4 = {
        x: 565,
        y: 718,
        w: 230,
        h: 25
    }
    let leftLabelCoordinate4 = {
        x: 473,
        y: 661,
        w: 35,
        h: 35
    }

    let housingCoordinate4 = {
        x: 490,
        y: 643,
        w: 380,
        h: 75
    }
    // winning jackpot
    let topLabelCoordinateWin = {
        x: 384,
        y: 399,
        w: 591,
        h: 61
    }
    let bottomLabelCoordinateWin = {
        x: 384,
        y: 652,
        w: 591,
        h: 61
    }
    let leftLabelCoordinateWin = {
        x: 166,
        y: 526,
        w: 77,
        h: 77
    }

    let housingCoordinateWin = {
        x: 204,
        y: 460,
        w: 951,
        h: 192
    }
    function drawPlasmaPicture(div, imgId) {
        let canvas = div;
        let ctx = canvas.getContext("2d");
        let img = imgId;
        ctx.drawImage(img, 0, 0, 1359, 767);
    }


    function drawJackpotLabel(imgId, coordinate) {
        let canvas = $$('#jackpot-plasma-settings-animations').children[0].children[0];
        let ctx = canvas.getContext("2d");
        let img = $$(imgId);
        ctx.drawImage(img, coordinate.x, coordinate.y, coordinate.w, coordinate.h);
    }

    function drawWinningJackpotLabel(imgId, coordinate) {
        let canvas = $$('#jackpot-plasma-settings-animations').children[1].children[0];
        let ctx = canvas.getContext("2d");
        let img = $$(imgId);
        ctx.drawImage(img, coordinate.x, coordinate.y, coordinate.w, coordinate.h);
    }

    function callDrawJackpotLabel() {
        for (let count = 1; count < 5; count++) {

            switch (count) {
                case 1:
                    drawJackpotLabel('#top-label-plasma-background', topLabelCoordinate1);
                    drawJackpotLabel('#housing-label-plasma-background', housingCoordinate1);
                    drawJackpotLabel('#left-label-plasma-background', leftLabelCoordinate1);
                    drawJackpotLabel('#bottom-label-plasma-background', bottomLabelCoordinate1);
                    break;
                case 2:
                    drawJackpotLabel('#top-label-plasma-background', topLabelCoordinate2);
                    drawJackpotLabel('#housing-label-plasma-background', housingCoordinate2);
                    drawJackpotLabel('#left-label-plasma-background', leftLabelCoordinate2);
                    drawJackpotLabel('#bottom-label-plasma-background', bottomLabelCoordinate2);
                    break;
                case 3:
                    drawJackpotLabel('#top-label-plasma-background', topLabelCoordinate3);
                    drawJackpotLabel('#housing-label-plasma-background', housingCoordinate3);
                    drawJackpotLabel('#left-label-plasma-background', leftLabelCoordinate3);
                    drawJackpotLabel('#bottom-label-plasma-background', bottomLabelCoordinate3);
                    break;
                case 4:
                    drawJackpotLabel('#top-label-plasma-background', topLabelCoordinate4);
                    drawJackpotLabel('#housing-label-plasma-background', housingCoordinate4);
                    drawJackpotLabel('#left-label-plasma-background', leftLabelCoordinate4);
                    drawJackpotLabel('#bottom-label-plasma-background', bottomLabelCoordinate4);
                    break;
            }
        }
    }
    window.addEventListener('load', function () {
        drawPlasmaPicture($$('#jackpot-plasma-settings-animations').children[0].children[0], $$('#new-york-landscape-plasma-background'));
        drawPlasmaPicture($$('#jackpot-plasma-settings-animations').children[1].children[0], $$('#new-york-winning-plasma-background'));
        callDrawJackpotLabel();
        drawWinningJackpotLabel('#top-label-plasma-background', topLabelCoordinateWin);
        drawWinningJackpotLabel('#housing-label-plasma-background', housingCoordinateWin);
        drawWinningJackpotLabel('#left-label-plasma-background', leftLabelCoordinateWin);
        drawWinningJackpotLabel('#bottom-label-plasma-background', bottomLabelCoordinateWin);

    });






})();