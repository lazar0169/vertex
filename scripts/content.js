const content = (function () {
    let contentWrapper = $$('#content');
    // let tableRows = $$('.rows');
    let tableWrapper = $$('#table-wrapper');

    function setRCMachine() {
        tableWrapper.innerHTML = '';
        // set number of columns
        let gridColumns = Object.keys(dataMachine['machine'][0]);
        tableWrapper.style.gridTemplateColumns = `repeat(${gridColumns.length - 1}, auto)`;
        //set number of rows
        let rowsArray = dataMachine['machine'];
        tableWrapper.style.gridTemplateRows = `repeat(${rowsArray.length + 1}, auto)`;
        //add table-col-desc
        for (let column of gridColumns) {
            if (column !== 'gmicd') {
                tableWrapper.innerHTML += `<div class="columns center table-col-desc" }>${column}</div>`;
            }
            else {
                break;
            }
        }
        //add grid elements
        for (let row in rowsArray) {
            //tableWrapper.innerHTML += '<div class="rows center" }></div>';
            let columnsArray = Object.values(dataMachine['machine'][row]);
            for (let column of columnsArray) {
                if (dataMachine['machine'][row]['gmicd'] !== column) {
                    tableWrapper.innerHTML += `<div class="columns center" }>${column}</div>`;
                }
                else {
                    break;
                }
            }
        }
    }
    on('sidebar/machine', function () {
        setRCMachine();
    });
})();