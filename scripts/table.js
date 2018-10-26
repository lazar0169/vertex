let table = (function () {

    let rows = [];

    function hoverRow(elements, highlight = false) {
        for (let element of document.getElementsByClassName(elements)) {
            element.classList[highlight ? "add" : "remove"]('hover');
        }
    }

    function generateTable(tableSettings) {

        //proverim da li settings.tableCDontainerSelector ima js objekat vezan za njega
        //ako nema objekat znaci da ne postoji tabela
        //attach-ujem objekat za kontejner tabele
        //proverim da li ima html za headere vec u html-u
        //ako ima html za hedere pitam da li treba da obrisem headere
        //ako ih brisem samo generisem novu tabelu sa svime
        //ako ih ne brisem generisem samo ostatak tabele
        //ako nema html hedere generisem skroz celu novu tabelu sa svime
        //ako ima objekat znaci da tabela vec postoji
        //pitamo da li treba da brisemo hedere
        //ako treba da obrisemo hedere onda unesemo sve nove podatke u celu tabelu
        //ako ne treba da obrisemo hedere popunimo ostale delove tabele sa novim podacima

        let colsCount;
        let tbody;
        let head;

        let tableContainerElement = $$(tableSettings.tableContainerSelector);
        if (tableContainerElement.tableSettings === undefined) { //nema objekat, ne postoji tabela
            tableContainerElement.tableSettings = tableSettings;
            if (tableContainerElement.firstElementChild === null) { //ne postoje hederi u html-u
                colsCount = Object.keys(tableSettings.tableData[0]).length;
                tbody = document.createElement('div');
                tbody.className = 'tbody';

                for (let col = 0; col < colsCount; col++) {
                    head = document.createElement('div');
                    head.innerHTML = Object.keys(tableSettings.tableData[0])[col];
                    head.className = 'head cell';
                    tbody.appendChild(head);
                }
                tableContainerElement.appendChild(tbody);
            } //ovime smo izgenerisali hedere
            else {
                tbody = $$('.tbody')[0];
                colsCount = tbody.childElementCount;
            }
            tbody.style.gridTemplateColumns = `repeat(${colsCount}, 1fr)`;
            tbody.style.gridTemplateRows = `repeat(${tableSettings.tableData.length}, 1fr)`;
            // u svakom slucaju generisemo i popunjavamo sve ostalo postojali hederi ili ne
            for (let row = 0; row < tableSettings.tableData.length; row++) {
                let rowId = Math.round(Math.random() * Number.MAX_SAFE_INTEGER);
                while (rows.includes(rowId)) {
                    rowId = Math.round(Math.random() * Number.MAX_SAFE_INTEGER);
                }
                rows.push(rowId);
                for (let col = 0; col < colsCount; col++) {
                    let cell = document.createElement('div');
                    cell.innerHTML = tableSettings.tableData[row][Object.keys(tableSettings.tableData[row])[col]];
                    cell.className = col === 0 ? 'first cell' : 'cell';
                    cell.classList.add(`row-${rowId}`);
                    cell.addEventListener('mouseover', function () {
                        hoverRow(`row-${rowId}`, true);
                    }, {passive: false});
                    cell.addEventListener('mouseout', function () {
                        hoverRow(`row-${rowId}`, false);
                    }, {passive: false});
                    tbody.appendChild(cell);
                }
            }
        }
        else { //tabela vec postoji
            tbody = $$('.tbody')[0];
            colsCount = Object.keys(tableSettings.tableNewData[0]).length;
            if (tableSettings.forceRemoveHeaders === true) { //da li treba da prepisemo hedere
                //prepisivanje podataka
                for (let col = 0; col < colsCount; col++) {
                    head = tbody.childNodes[col];
                    alert(head);
                    head.innerHTML = Object.keys(tableSettings.tableNewData[0])[col];
                }
            }
            tbody.style.gridTemplateColumns = `repeat(${colsCount}, 1fr)`;
            tbody.style.gridTemplateRows = `repeat(${tableSettings.tableNewData.length}, 1fr)`;

            //u svakom slucaju prepisujemo sve ostale podatke
          /*  for (let row = 0; row < tableSettings.tableNewData.length; row++) {
                let rowId = 0/!*izvuces rowId*!/;
                while (rows.includes(rowId)) {
                    rowId = 0/!*izvuces row id*!/;
                }
                rows.push(rowId);
                for (let col = 0; col < colsCount; col++) {
                    alert($$('#' + rowId)[1]);
                    let cell = $$('#' + rowId)[col+1];
                    cell.innerHTML = tableSettings.tableNewData[row][Object.keys(tableSettings.tableNewData[row])[col]];
                    cell.className = col === 0 ? 'first cell' : 'cell';
                    cell.classList.add(`row-${rowId}`);
                    cell.addEventListener('mouseover', function () {
                        hoverRow(`row-${rowId}`, true);
                    }, {passive: false});
                    cell.addEventListener('mouseout', function () {
                        hoverRow(`row-${rowId}`, false);
                    }, {passive: false});
                }
            }*/
        }
        tableSettings.tableContainerElement.className = tableSettings.sticky ? 'table sticky' : 'table';
    }

    return {
        generateTable: generateTable
    };

})();