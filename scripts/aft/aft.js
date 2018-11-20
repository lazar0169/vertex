const aft = (function () {
    on('aft/activated', function () {

        setTimeout(function () {
            trigger('preloader/hide');
        }, 2000);


        let tableSettings = {};
        tableSettings.forceRemoveHeaders = true;
        tableSettings.tableContainerSelector = '#table-container-aft';
        tableSettings.filterContainerSelector = '#aft-advance-table-filter-active';
        tableSettings.stickyRow = true;
        tableSettings.stickyColumn = false;
        tableSettings.dataEvent = 'communicate/aft';
        tableSettings.id = '';


        table.init(tableSettings);


        let filtersContainer = $$(tableSettings.filterContainerSelector);
        console.log('apply filters button');
        let applyButton = filtersContainer.getElementsByClassName('aft-filters-apply')[0];
        console.log('apply filters button', applyButton);

        if (applyButton !== undefined) {
            applyButton.addEventListener('click', function () {
                trigger('table/filters/apply', {tableSettings: tableSettings});
                console.log('Table settings after clicking Apply button: ', tableSettings);
            });
        }

        //todo potential structural changes
        /* aft module calls table.init
        table.init triggers communicate/aft
        communicate/aft triggers communicate/createAndSendXhr
        communicate/createAndSendXhr triggers table/update
        table/update updates table with data from API
        */

        //todo fix how to send tableSettings object through callbacks

        /*TESTING*/
        // table.generateTableContent(tableSettings);
        // trigger('communicate/table/data', {tableSettings: tableSettings, callbackEvent: 'table/generate/new-data'});
        // trigger('table/generate/new-data', {tableSettings: tableSettings, newTableData: newTestData});
        // trigger('table/generate/new-data', {tableSettings: tableSettings, newTableData: newTestData2});
        // trigger('table/generate/new-data', {tableSettings: tableSettings, newTableData: newTestData3});
    });
})();