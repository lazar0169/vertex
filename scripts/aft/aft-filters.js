const aftFilters = (function () {
    let advanceTableFilter = $$('#aft-advance-table-filter');
    let advanceTableFilterActive = $$('#aft-advance-table-filter-active');
    let clearAdvanceFilter = $$('#aft-advance-table-filter-clear').children[0];
    let aftAdvanceApplyFilters = $$('#aft-advance-table-filter-apply').children[0];
    let advanceTableFilterInfobar = $$('#aft-advance-table-filter-active-infobar');
    let clearAdvanceFilterInfobar = $$('#aft-advance-table-filter-active-infobar-button').children[0];
    let aftAddTransactionButton = $$('#aft-add-transaction').children[0];
    let aftAddTransactionWrapper = $$('#add-transaction-wrapper');
    let transactionTab = $$('#aft-tabs-transaction');
    let closeAddTransaction = $$('#add-transaction-header-element').children[1];
    let dropdownStatus;
    let dropdownColumn;
    let endpointId = null;

    //display initial filters
    //region event listeners
    aftAdvanceApplyFilters.addEventListener('click', function () {
        trigger('opened-arrow', {div: advanceTableFilter.children[0]});
        filterAftTable();
    });

    //close
    transactionTab.addEventListener('click', function () {
        $$('#black-area').classList.remove('show');
        aftAddTransactionWrapper.classList.add('hidden');
    });
    //show
    aftAddTransactionButton.addEventListener('click', function () {
        $$('#black-area').classList.add('show');
        aftAddTransactionWrapper.classList.remove('hidden');
    });
    // ToDO: treba da postoji jedan jedinstven event
    window.addEventListener('keyup', function (event) {
        if (event.keyCode == 27) {
            aftAddTransactionWrapper.classList.add('hidden');
        }
    });

    clearAdvanceFilter.addEventListener('click', removeSelectedFilters);
    clearAdvanceFilterInfobar.addEventListener('click', clearAftFilters);
    advanceTableFilter.children[0].addEventListener('click', function () {
        showAdvanceTableFilter();
    });
    //endregion
    /*********************----Module Events----************************/
    on('aft/filters/init', function (params) {
        endpointId = params.endpointId;
        getFiltersFromAPI(endpointId);
    });

    on('aft/filters/display', function (params) {
        let apiResponseData = params.data;
        let filters = apiResponseData.Data;
        displayFilters(filters);
    });
    on('aft/filters/pagination', function (params) {
        filterAftTable();

    });
    on('aft/filters/sorting', function () {
        filterAftTable();
    });
    on('aft/filters/pageSize', function (params) {
        let tableSettings = params.tableSettings;
        tableSettings.activePage = 1;
        filterAftTable();
    });
    on('aft/filters/filter-table', function (params) {
        filterAftTable();
    });

    //display initial filters
    /*********************----Helper functions----*********************/

    function filterAftTable() {
        let filters = prepareAftFilters();
        trigger('preloader/show');
        trigger(communication.events.aft.transactions.previewTransactions,{data:filters});
    }

    function removeSelectedFilters() {
        trigger('clear/dropdown/filter', {data: advanceTableFilterActive});
    }

    function clearAftFilters() {
        removeSelectedFilters();
        $$('#table-container-aft').resetFilters();
        filterAftTable();
    }

    function getFiltersFromAPI(endpointId) {
        let data = {
            'EndpointId': endpointId
        };
        let successEvent = 'aft/filters/display';
        trigger(communication.events.aft.transactions.getFilters, {
            data: data,
            successEvent: successEvent,
        });
    }

    function displayFilters(filters) {
        //filter elements
        //let aftAdvanceTableFilterDateRange = $$('#aft-advance-table-filter-date-range');
        let aftAdvanceTableFilterFinished = $$('#aft-advance-table-filter-finished');
        let aftAdvanceTableFilterJackpot = $$('#aft-advance-table-filter-jackpot');
        let aftAdvanceTableFilterType = $$('#aft-advance-table-filter-type');
        let aftAdvanceTableFilterStatus = $$('#aft-advance-table-filter-status');
        let aftAdvanceTableFilterColumn = $$('#aft-advance-table-filter-column');
        let aftAddTransactionType = $$('#add-transaction-type');
        let aftAddTransactionMachine = $$('#add-transaction-machine');

        dropdown.generate({optionValue: filters.MachineNameList, parent: aftAdvanceTableFilterFinished, type: 'multi'});
        dropdown.generate({optionValue: filters.JackpotNameList, parent: aftAdvanceTableFilterJackpot, type: 'multi'});

        dropdown.generate({optionValue: filters.TypeList, parent: aftAdvanceTableFilterType, type: 'multi'});
        if (dropdownStatus) {
            dropdownStatus.remove();
        }
        dropdownStatus = dropdown.generate({optionValue: filters.StatusList, type: 'multi'});
        aftAdvanceTableFilterStatus.appendChild(dropdownStatus);

        //set up columns selection dropdown
        let aftTable = $$('#table-container-aft');

        let columns = [];
        //add no select element
        columns.push({
            Name:'-',
            Id: -1
        });
        for (let columnKey in aftTable.settings.columns) {
            let column = aftTable.settings.columns[columnKey];
            if (column.hideable === true) {
                columns.push({
                    Id: column.column,
                    Name: column.column
                })
            }
        }

        dropdownColumn = dropdown.generate({optionValue: columns, type: 'multi'});
        aftAdvanceTableFilterColumn.appendChild(dropdownColumn);

        dropdown.generate({
            optionValue: filters.TypeList.slice(1, filters.TypeList.lenght),
            parent: aftAddTransactionType,
            type: 'single'
        });
        dropdown.generate({
            optionValue: filters.MachineAddTransactionList,
            parent: aftAddTransactionMachine,
            type: 'single'
        })
    }

    function showAdvanceTableFilter() {
        advanceTableFilter.classList.toggle('advance-filter-active');
        trigger('opened-arrow', {div: advanceTableFilter.children[0]});
        advanceTableFilterActive.classList.toggle('hidden');
    }


    function prepareAftFilters() {
        let table = $$('#table-container-aft');
        let date = $$('#aft-advance-table-filter-date-range').children[1].children[0].dataset.value;
        let dateFrom = null;
        let dateTo = null;
        if (date !== 'null') {
            dateFrom = $$('#aft-advance-table-filter-date-range').children[1].children[0].dataset.value.split(',')[0];
            dateTo = $$('#aft-advance-table-filter-date-range').children[1].children[0].dataset.value.split(',')[1];
        }
        let machineList = $$('#aft-advance-table-filter-finished').children[1].get();
        let jackpotList = $$('#aft-advance-table-filter-jackpot').children[1].get();
        let statusesList = $$('#aft-advance-table-filter-status').children[1].get();
        let typesList = $$('#aft-advance-table-filter-type').children[1].get();

        let filters = {
            'EndpointId': table.settings.endpointId,
            'DateFrom': dateFrom,
            'DateTo': dateTo,
            'MachineList': machineList === 'null' ? null : machineList.split(','),
            'JackpotList': jackpotList === 'null' ? null : jackpotList.split(','),
            'Status': statusesList === 'null' ? null : statusesList.split(','),
            'Type': typesList === 'null' ? null : typesList.split(','),
        };
        console.log('filters in prepareAftFilters',filters);
        filters = table.getFilters(filters);
        //mark hidden columns
        let visibleColumns = $$('#aft-advance-table-filter-column').children[1].get();
        if (visibleColumns === 'null') {
            visibleColumns = [];
        }
        table.setVisibleColumns(visibleColumns);


        return filters;
    }

    on('show/app', function () {
        aftAddTransactionWrapper.classList.add('hidden');
    });

    closeAddTransaction.addEventListener('click', function () {
        trigger('show/app');
    });

})();