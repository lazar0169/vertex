const malfunctions = (function () {
    let addMalfunctionMsg = $$('#malfunctions-add-message');


    /*********************----Module Events------*********************/
    on('malfunctions/activated', function (params) {

        let malfunctionsId = 0;

        // selectTab();
        // selectInfoContent();

        let tableSettings = {};
        tableSettings.pageSelectorId = '#page-malfunctions';
        tableSettings.tableContainerSelector = '#table-container-malfunctions';
        tableSettings.filtersContainerSelector = '#malfunctions-filter';
        tableSettings.getDataEvent = communication.events.malfunctions.getMalfunctions;
        tableSettings.filterDataEvent = communication.events.malfunctions.previewMalfunctions;
        tableSettings.updateEvent = 'table/update';
        tableSettings.processRemoteData = communication.events.malfunctions.parseRemoteData;
        tableSettings.endpointId = malfunctionsId;
        tableSettings.id = '';
        tableSettings.stickyRow = true;
        tableSettings.onDrawRowCell = 'malfunctions/table/drawCell';
        table.init(tableSettings); //initializing table, filters and page size

        on('malfunctions/table/drawCell', function (params) {
            onDrawTableCell(params.key, params.value, params.element, params.position, params.rowData);
        });
    });

    function onDrawTableCell(column, cellContent, cell, position, entryData) {
        if (column === 'flag') {
            if (cellContent !== undefined) {
                cell.classList.add('row-flag-' + cellContent.toString().trim());
            }
            cell.classList.add('cell-flag');
            cell.innerHTML = '';
        } else if (column === 'createdBy') {
            cell.classList.add('flex-column');
            cell.classList.add('justify-content-start');
            cell.classList.add('align-items-start');
            cell.innerHTML = `<time class='table-time'>${entryData.data.createdTime}</time><label>${entryData.rowData.createdBy}</label>`;
        }
        //ToDo: isPayoutPossible property ne postoji kod malfunciona
        if (entryData.data.isPayoutPossible === true) {
            cell.classList.add('clickable');
        }

    }

    let malfunctionsMachinesNumbers = $$('#malfunctions-number');

    //trigger('preloader/hide');

    dropdownNew.generateNew({ optionValue: machinesNumber, element: malfunctionsMachinesNumbers })

    // dropdown.generate(machinesNumber, malfunctionsMachinesNumbers);

    addMalfunctionMsg.children[0].addEventListener('keyup', function () {
        if (addMalfunctionMsg.children[0].value) {
            addMalfunctionMsg.children[1].classList.remove('hidden')
        }
        else {
            addMalfunctionMsg.children[1].classList.add('hidden')
        }
    });
    addMalfunctionMsg.children[1].addEventListener('click', function () {
        addMalfunctionMsg.children[0].value = "";
        addMalfunctionMsg.children[1].classList.add('hidden');
    });
})();