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

        let tableContainerElement = $$(tableSettings.tableContainerSelector);
        console.log('table container element', tableContainerElement);
        console.log('asldfkja lsdfjas ', tableContainerElement.tableSettings);
        if (tableContainerElement.tableSettings === undefined) { //nema objekat, ne postoji tabela
            tableContainerElement.tableSettings = tableSettings;
            console.log('table container element first child', tableContainerElement.firstElementChild);
            if (tableContainerElement.firstElementChild === null) { //ne postoje hederi u html-u
                colsCount = Object.keys(tableSettings.tableData[0]).length;
                tbody = document.createElement('div');
                tbody.style.gridTemplateColumns = `repeat(${colsCount}, 1fr)`;
                tbody.style.gridTemplateRows = `repeat(${tableSettings.tableData.length}, 1fr)`;
                tbody.className = 'tbody';

                for (let col = 0; col < colsCount; col++) {
                    let head = document.createElement('div');
                    head.innerHTML = Object.keys(tableSettings.tableData[0])[col];
                    head.className = 'head cell';
                    tbody.appendChild(head);
                }
            } //ovime smo izgenerisali hedere
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
            console.log('tbody bljsa ', tbody);
        }
        else { //tabela vec postoji
            if (tableSettings.forceRemoveHeaders === true) { //da li treba da prepisemo hedere
                //nekako da prepisemo sve podatke u hederima ili da generisemo novo?
                for (let col = 0; col < colsCount; col++) {
                    head.innerHTML = Object.keys(tableSettings.tableData[0])[col];
                }
            }
            //u svakom slucaju prepisujemo sve ostale podatke

        }
        tableSettings.tableContainerElement.className = tableSettings.sticky ? 'table sticky' : 'table';
        console.log('table container element blah', tableContainerElement);
        tableContainerElement.appendChild(tbody);
    }





    /*
    function checkIfHasTable(pageId, tableContainerId) {
        let hasTable = false;
        let listOfChildren = $$('#' + pageId).childNodes;
        listOfChildren.forEach(function (node) {
            if (node.id === tableContainerId) {
                hasTable = true;
            }
        });
        return hasTable;
    }
*/





    /*
        if (checkIfHasTable(tableSettings.pageId, tableSettings.tableContainerId) === false) {
            tableSettings.tableContainerClassElement.setAttribute('id', tableSettings.tableContainerId);
            colsCount = Object.keys(tableSettings.tableData[0]).length;
            tbody = document.createElement('div');
            tbody.style.gridTemplateColumns = `repeat(${colsCount}, 1fr)`;
            tbody.style.gridTemplateRows = `repeat(${jsonData.length}, 1fr)`;
            tbody.className = 'tbody';

            for (let col = 0; col < colsCount; col++) {
                let head = document.createElement('div');
                head.innerHTML = Object.keys(tableSettings.tableData[0])[col];
                head.className = 'head cell';
                tbody.appendChild(head);
            }
        }
        else if (tableSettings.forceRemoveHeaders === true) {
            tableSettings.tableContainerIdElement.removeChild($$('.tbody')[0]);
        }

        let colsCount;
        let tbody;

        if (tableSettings.forceRemoveHeaders === false) {
            colsCount = Object.keys(tableSettings.tableData[0]).length;
            tbody = document.createElement('div');
            tbody.style.gridTemplateColumns = `repeat(${colsCount}, 1fr)`;
            tbody.style.gridTemplateRows = `repeat(${jsonData.length}, 1fr)`;
            tbody.className = 'tbody';

            for (let col = 0; col < colsCount; col++) {
                let head = document.createElement('div');
                head.innerHTML = Object.keys(tableSettings.tableData[0])[col];
                head.className = 'head cell';
                tbody.appendChild(head);
            }

        } else {
            colsCount = $$('.head').length;
            tbody = $$('.tbody')[0];

            tbody.style.gridTemplateColumns = `repeat(${colsCount}, 1fr)`;
            tbody.style.gridTemplateRows = `repeat(${tableSettings.tableData.length}, 1fr)`;
        }

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
        tableSettings.tableContainerClassElement.className = tableSettings.sticky ? 'table sticky' : 'table';
        return tbody;
    }*/


/*  function generateTableee(jsonData, tableContainerElement, forceRemoveHeaders, id = '', sticky = false) {

      let colsCount;

      if (forceRemoveHeaders === false) {
          colsCount = Object.keys(jsonData[0]).length;
          let tbody = document.createElement('div');
          tbody.style.gridTemplateColumns = `repeat(${colsCount}, 1fr)`;
          tbody.style.gridTemplateRows = `repeat(${jsonData.length}, 1fr)`;
          tbody.className = 'tbody';

          for (let col = 0; col < colsCount; col++) {
              let head = document.createElement('div');
              head.innerHTML = Object.keys(jsonData[0])[col];
              head.className = 'head cell';
              tbody.appendChild(head);
          }
          for (let row = 0; row < jsonData.length; row++) {
              let rowId = Math.round(Math.random() * Number.MAX_SAFE_INTEGER);
              while (rows.includes(rowId)) {
                  rowId = Math.round(Math.random() * Number.MAX_SAFE_INTEGER);
              }
              rows.push(rowId);
              for (let col = 0; col < colsCount; col++) {
                  let cell = document.createElement('div');
                  cell.innerHTML = jsonData[row][Object.keys(jsonData[row])[col]];
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

          function hoverRow(elements, highlight = false) {
              for (let element of document.getElementsByClassName(elements)) {
                  element.classList[highlight ? "add" : "remove"]('hover');
              }
          }

          tableContainerElement.className = sticky ? 'table sticky' : 'table';
          return tbody;
      }

      else {
          colsCount = $$('.head').length;
          let tbody = $$('.tbody')[0];

          tbody.style.gridTemplateColumns = `repeat(${colsCount}, 1fr)`;
          tbody.style.gridTemplateRows = `repeat(${jsonData.length}, 1fr)`;

          for (let row = 0; row < jsonData.length; row++) {
              let rowId = Math.round(Math.random() * Number.MAX_SAFE_INTEGER);
              while (rows.includes(rowId)) {
                  rowId = Math.round(Math.random() * Number.MAX_SAFE_INTEGER);
              }
              rows.push(rowId);
              for (let col = 0; col < colsCount; col++) {
                  let cell = document.createElement('div');
                  cell.innerHTML = jsonData[row][Object.keys(jsonData[row])[col]];
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

          function hoverRow(elements, highlight = false) {
              for (let element of document.getElementsByClassName(elements)) {
                  element.classList[highlight ? "add" : "remove"]('hover');
              }
          }

          tableContainerElement.className = sticky ? 'table sticky' : 'table';
          return tbody;
      }

  }*/

/*
    function displayTable(pageId, tableToDisplay) {
        let listOfChildren = $$(pageId);
        if (table.checkIfHasTable(listOfChildren) === true) {
            //update
            console.log('home already has table');
        }
        else {
            let tableHome = table.generateTable(testTable, 'table-home');
            $$('#page-home').appendChild(tableHome);
        }
    }
*/

return {
    generateTable: generateTable,
    // checkIfHasTable: checkIfHasTable
    // displayTable: displayTable
};

})
();