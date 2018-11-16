const aft = (function () {
    on('aft/activated', function () {

        setTimeout(function () {
            trigger('preloader/hide');
        }, 2000);


        let tableSettings = {};
        tableSettings.forceRemoveHeaders = true;
        tableSettings.tableContainerSelector = '#table-container-aft';
        tableSettings.stickyRow = true;
        tableSettings.stickyColumn = true;
        tableSettings.dataEvent = 'communicate/aft';
        tableSettings.id = '';

        table.init(tableSettings);

        /*TESTING*/
        // table.generateTableContent(tableSettings);
        // trigger('communicate/table/data', {tableSettings: tableSettings, callbackEvent: 'table/generate/new-data'});
        // trigger('table/generate/new-data', {tableSettings: tableSettings, newTableData: newTestData});
        // trigger('table/generate/new-data', {tableSettings: tableSettings, newTableData: newTestData2});
        // trigger('table/generate/new-data', {tableSettings: tableSettings, newTableData: newTestData3});
    });
})();