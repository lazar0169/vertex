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
        aftFilter.initFilters(tableSettings);


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