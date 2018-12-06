const aft = (function () {
    on('aft/activated', function (params) {

        setTimeout(function () {
            trigger('preloader/hide');
        }, 2000);

        let aftId = params.params[0].value;


        selectTab('aft-tabs-transaction');
        selectInfoContent('aft-tabs-transaction');

        let tableSettings = {};
        tableSettings.pageSelectorId = '#page-aft';
        tableSettings.tableContainerSelector = '#table-container-aft';
        tableSettings.filterContainerSelector = '#aft-advance-table-filter-active';
        tableSettings.dataEvent = 'communicate/aft/getTransactions';
        tableSettings.updateTableEvent = 'table/update';
        tableSettings.prepareDataEvent = 'communicate/aft/data/prepare';
        tableSettings.sortActiveColumn = 'createdby';
        tableSettings.endpointId = aftId;
        tableSettings.id = '';
        tableSettings.forceRemoveHeaders = true;
        tableSettings.stickyRow = true;
        tableSettings.stickyColumn = false;
        tableSettings.filtersInitialized = false;


//todo see best way to forward endpoint id

        /*function setEndpointId(tableSettings){
            let endpointIdInputElements = $$(tableSettings.pageSelectorId).getElementsByClassName('endpointId');
            console.log('endpoint id input elements', endpointIdInputElements);
            let endpointIdInputElementsArray = Array.prototype.slice.call(endpointIdInputElements);
            console.log('endpoint id input elements array', endpointIdInputElementsArray);
            endpointIdInputElementsArray.forEach(function(endpointIdElement){
                console.log('endpoint id input elements element', endpointIdElement);
                endpointIdElement.dataset.value = aftId;
                console.log('endpoint elem dataset value', endpointIdElement.dataset.value);
            });
        }

        setEndpointId(tableSettings);*/

        table.init(tableSettings); //initializing table, filters and page size

        let addTransactionButton = $$('#page-aft').getElementsByClassName('aft-add-transaction')[0];

        addTransactionButton.addEventListener('click', function () {
            let data =
                {
                    'EndpointId': aftId,
                    'EndpointName': '',
                    'Gmcid': 1565666846,
                    'MachineName': '',
                    'Type': 0,
                    'CashableAmount': 13800,
                    'PromoAmount': 13800,
                    'ExpirationInDays': 7
                };
            trigger('communicate/aft/addTransaction', {data: data, tableSettings: tableSettings});
        });

        on('aft/addTransaction', function () {

        });

        trigger('aft/tab/transaction', {tableSettings: tableSettings});
        trigger('aft/tab/notification', {tableSettings: tableSettings});

    });
})();