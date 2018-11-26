const aft = (function () {
    on('aft/activated', function (params) {

        setTimeout(function () {
            trigger('preloader/hide');
        }, 2000);


        let aftId = params.params[0].value;
        console.log('Aft page ID (from params): ', aftId);

        selectTab('aft-tabs-transaction');
        selectInfoContent('aft-tabs-transaction');

        let tableSettings = {};
        tableSettings.pageSelectorId = '#page-aft';
        tableSettings.forceRemoveHeaders = true;
        tableSettings.tableContainerSelector = '#table-container-aft';
        tableSettings.filterContainerSelector = '#aft-advance-table-filter-active';
        tableSettings.stickyRow = true;
        tableSettings.stickyColumn = false;
        tableSettings.dataEvent = 'communicate/aft/getTransactions';
        tableSettings.id = '';
        tableSettings.endpointId = aftId;

        table.init(tableSettings);
        aftFilter.initFilters(tableSettings);

        let addTransactionButton = $$('#page-aft').getElementsByClassName('aft-add-transaction')[0];

        addTransactionButton.addEventListener('click', function(){
           trigger('communicate/aft/addTransaction');
        });


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