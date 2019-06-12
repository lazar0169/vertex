const highchart = (function () {

    // let maxHeight = 285;
    // let minHeight = 15;


    function drawHighchart(data) {
        let nameSpace = 'http://www.w3.org/2000/svg';
        let polygon = document.createElementNS(nameSpace, 'polygon');
        let parent = data.parent;
        parent.classList.add('chart-wrapper')

        // let textYBottom;
        // let textXTop;

        // let textVertical = document.createElement('div');
        // textVertical.classList.add('chart-vertical-text');

        // textVertical.innerHTML = `<div>100</div> <div>0</div>`
        // parent.appendChild(textVertical);

        // let textHorizontal = document.createElement('div');
        // textHorizontal.classList.add('chart-horizontal-text');

        // textHorizontal.innerHTML = `<div>pocetak</div> <div>kraj</div>`
        // parent.appendChild(textHorizontal);

        let numOfDotsX = data.dotsX;
        let numOfDotsY = data.dotsY;
        let svg = document.createElementNS(nameSpace, 'svg');
        svg.classList.add('chart')
        svg.setAttributeNS(null, 'width', '600px');
        svg.setAttributeNS(null, 'height', '300px');
        svg.setAttributeNS(null, 'transform', 'scale(1,-1)')
        let horizontalSpace = 600 / numOfDotsX;
        let verticalSpace = 300 / numOfDotsY;
        let mouseDown;
        let selectedDot;
        let selectedPolygon;

        let polylineArray = [];
        let dotArray = [];

        for (let i = 0; i <= numOfDotsX; i++) {
            let dot = document.createElementNS(nameSpace, 'circle');

            for (let verticalLine = 0; verticalLine <= numOfDotsX; verticalLine++) {
                let verticalPolyline = document.createElementNS(nameSpace, 'polyline');
                verticalPolyline.classList.add('chart-vertical-polyline');
                let verticalPolylinePoints = `${i * horizontalSpace},0  ${i * horizontalSpace},300`

                verticalPolyline.setAttributeNS(null, 'points', verticalPolylinePoints);
                svg.appendChild(verticalPolyline);
            }

            for (let i = 0; i <= numOfDotsY; i++) {
                let horizontalPolyline = document.createElementNS(nameSpace, 'polyline');
                horizontalPolyline.classList.add('chart-horizontal-polyline');
                let horizontalPolylinePoints = `0,${i * verticalSpace}  600,${i * verticalSpace}`

                horizontalPolyline.setAttributeNS(null, 'points', horizontalPolylinePoints);
                svg.appendChild(horizontalPolyline);
            }

            dot.classList.add('chart-dot');
            dot.classList.add(`chart-dot-${i}`);
            dot.setAttributeNS(null, 'cx', `${horizontalSpace * i}`);
            dot.setAttributeNS(null, 'cy', '150');
            dot.dataset.value = i;
            dot.innerHTML = `<title>${dot.getAttribute('cy') / 3} %</title>`;
            dotArray.push(dot);
            polylineArray.push([horizontalSpace * i, 150]);

            dot.onmousedown = function (down) {
                mouseDown = true;
                selectedDot = dot;
                selectedPolygon = dot.parentNode.getElementsByClassName('chart-polygon')[0];
            }
            parent.onmouseup = function (up) {
                mouseDown = false;
                selectedDot = false;
                selectedPolygon = false;
            }
            svg.onmousemove = function (move) {
                if (mouseDown && selectedDot && selectedPolygon) {
                    // if (maxHeight > move.offsetY && minHeight < move.offsetY) {
                    let newCY = selectedDot.getAttribute('cy')
                    newCY = move.offsetY;
                    if (newCY <= 300 && newCY >= 0 && move.toElement.parentNode.classList.contains('chart') || move.toElement.classList.contains('chart')) {
                        selectedDot.setAttributeNS(null, 'cy', newCY);
                        selectedDot.innerHTML = `<title>${Math.floor(selectedDot.getAttribute('cy') / 3)} %</title>`;
                        changePolylinePoint(polyline, selectedDot, selectedPolygon);
                    }
                    else {
                        mouseDown = false;
                        selectedDot = false;
                        selectedPolygon = false;
                    }
                }
            }
        }
        polygon.classList.add('chart-polygon');
        let polygonPoints = [...polylineArray];
        polygonPoints.push([600, 0], [0, 0])
        polygon.setAttributeNS(null, 'points', polygonPoints)
        svg.appendChild(polygon)

        let polyline = document.createElementNS(nameSpace, 'polyline');
        polyline.classList.add('chart-polyline');
        let polylinePoints = '';
        for (let point of polylineArray) {
            polylinePoints += `${point} `;
        }
        polyline.setAttributeNS(null, 'points', polylinePoints);
        svg.appendChild(polyline);

        for (let dot of dotArray) {
            svg.appendChild(dot);
        }
        parent.appendChild(svg);
        setLinearPointData(polylinePoints, parent);


        parent.get = function () {
            return parent.settings;
        }

    }

    function changePolylinePoint(polyline, dot, polygon) {
        let pointsArray = polyline.getAttribute('points').split(' ');

        let newPoint = `${dot.getAttribute('cx')},${dot.getAttribute('cy')}`
        let polylinePoints = '';

        pointsArray[dot.dataset.value] = newPoint;
        for (let point of Object.values(pointsArray)) {
            if (point != "")
                polylinePoints += `${point} `;
        }
        changePolygonPoint(polylinePoints, polygon)
        polyline.setAttributeNS(null, 'points', polylinePoints)
    }
    function changePolygonPoint(polyline, polygon) {
        let polylinePoints = polyline + `600,0 0,0`
        polygon.setAttributeNS(null, 'points', polylinePoints);
        setLinearPointData(polyline, polygon.parentNode.parentNode);
    }

    function setLinearPointData(polyline, chartWrapper) {
        let pointsArray = polyline.split(' ');
        let pointAndPercentArray = [];
        let pointCounter = 0;
        for (let point of Object.values(pointsArray)) {
            if (point != "") {
                pointAndPercentArray.push({ 'X': pointCounter, Y: Math.floor((point.split(',')[1] / 3)) });
                pointCounter++;
            }
        }
        chartWrapper.settings = pointAndPercentArray;
    }

    return {
        drawHighchart
    }

})();