const aftFilters = (function () {
    let advanceTableFilter = $$('#aft-advance-table-filter');
    let advanceTableFilterActive = $$('#aft-advance-table-filter-active');
    let clearAdvanceFilter = $$('#aft-advance-table-filter-clear').children[0];
    let aftAdvanceApplyFilters = $$('#aft-advance-table-filter-apply').children[0];
    let advanceTableFilterInfobar = $$('#aft-advance-table-filter-active-infobar');
    //ToDo Nikola: vidi cemu sluzi ovaj advanceTableFilterInfobar
    let clearAdvanceFilterInfobar = $$('#aft-advance-table-filter-active-infobar-button').children[0];
    let aftAddTransactionButton = $$('#aft-add-transaction').children[0];
    let aftAddTransactionWrapper = $$('#add-transaction-wrapper');
    let transactionTab = $$('#aft-tabs-transaction');
    let closeAddTransaction = $$('#add-transaction-header-element').children[1];
    let dropdownStatus;
    let ddTransactionType;
    let endpointId = null;

    //region event listeners
    aftAdvanceApplyFilters.addEventListener('click', function () {
        trigger('opened-arrow', { div: advanceTableFilter.children[0] });
        filterAftTable();
        trigger('filters/show-selected-filters', { active: advanceTableFilterActive, infobar: advanceTableFilterInfobar });
    });

    //close
    transactionTab.addEventListener('click', function () {
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

    //region module events
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
    on('aft/table/filter', function (params) {
        filterAftTable();
    });
    on('show/app', function () {
        aftAddTransactionWrapper.classList.add('hidden');
    });
    closeAddTransaction.addEventListener('click', function () {
        trigger('show/app');
    });
    //endregion

    //region helper functions
    function filterAftTable() {
        let filters = prepareAftFilters();
        trigger(communication.events.aft.transactions.previewTransactions, { data: filters });
    }

    function removeSelectedFilters() {
        trigger('clear/dropdown/filter', { data: advanceTableFilterActive });
        trigger('filters/show-selected-filters', { active: advanceTableFilterActive, infobar: advanceTableFilterInfobar });
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
        let aftAdvanceTableFilterFinished = $$('#aft-advance-table-filter-finished');
        let aftAdvanceTableFilterJackpot = $$('#aft-advance-table-filter-jackpot');
        let aftAdvanceTableFilterType = $$('#aft-advance-table-filter-type');
        let aftAdvanceTableFilterStatus = $$('#aft-advance-table-filter-status');
        let aftAdvanceTableFilterColumn = $$('#aft-advance-table-filter-column');
        let aftAddTransactionType = $$('#add-transaction-type');
        let aftAddTransactionMachine = $$('#add-transaction-machine');
        let aftAdvanceTableFilterDateRange = $$('#aft-advance-table-filter-date-range');

        dropdownDate.generate({ values: filters.PeriodList, parent: aftAdvanceTableFilterDateRange, name: 'PeriodList' });
        dropdown.generate({ values: filters.MachineNameList, parent: aftAdvanceTableFilterFinished, type: 'multi', name: 'MachineList' })
        dropdown.generate({ values: filters.JackpotNameList, parent: aftAdvanceTableFilterJackpot, type: 'multi' });
        dropdown.generate({ values: filters.TypeList, parent: aftAdvanceTableFilterType, type: 'multi' });

        if (dropdownStatus) {
            dropdownStatus.remove();
        }
        dropdownStatus = dropdown.generate({ values: filters.StatusList, type: 'multi' });
        aftAdvanceTableFilterStatus.appendChild(dropdownStatus);

        //set up columns selection dropdown
        let aftTable = $$('#table-container-aft');
        let columns = [];
        //add no select element
        columns.push({
            Name: '-',
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
        dropdown.generate({ values: columns, parent: aftAdvanceTableFilterColumn, type: 'multi' });

        //transaction type select in add transaction form
        if (ddTransactionType) {
            ddTransactionType.remove();
        }
        ddTransactionType = dropdown.generate({ values: filters.TypeList.slice(1, filters.TypeList.lenght), type: 'single', name: 'Type' });
        aftAddTransactionType.appendChild(ddTransactionType);

        // dropdown.generate({ values: filters.TypeList.slice(1, filters.TypeList.lenght), parent: aftAddTransactionType, type: 'single', name: 'Type' });
        trigger('aft/aft-add-transaction', { dropdown: ddTransactionType });
        //machine select in add transaction form
        dropdown.generate({ values: filters.MachineAddTransactionList, parent: aftAddTransactionMachine, type: 'single', name: 'Gmcid' });
    }

    function showAdvanceTableFilter() {
        advanceTableFilter.classList.toggle('advance-filter-active');
        trigger('opened-arrow', { div: advanceTableFilter.children[0] });
        advanceTableFilterActive.classList.toggle('hidden');
    }

    function prepareAftFilters() {
        let table = $$('#table-container-aft');

        let machineList = $$('#aft-advance-table-filter-finished').children[1].get();
        let jackpotList = $$('#aft-advance-table-filter-jackpot').children[1].get();
        let statusesList = $$('#aft-advance-table-filter-status').children[1].get();
        let typesList = $$('#aft-advance-table-filter-type').children[1].get();

        let filters = {
            'EndpointId': table.settings.endpointId,
            'SelectedPeriod': $$('#aft-advance-table-filter-date-range').children[1].get(),
            'MachineList': machineList === 'null' ? null : machineList.split(','),
            'JackpotList': jackpotList === 'null' ? null : jackpotList.split(','),
            'Status': statusesList === 'null' ? null : statusesList.split(','),
            'Type': typesList === 'null' ? null : typesList.split(','),
        };
        filters = table.getFilters(filters);
        //mark hidden columns
        let visibleColumns = $$('#aft-advance-table-filter-column').children[1].get();
        if (visibleColumns === 'null') {
            visibleColumns = [];
        }
        table.setVisibleColumns(visibleColumns);
        return filters;
    }
    return {
        clearAftFilters,
    }
    //endregion
})();