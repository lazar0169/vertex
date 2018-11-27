let aftTabEnableTransaction = (function () {

    //elements
    // let enableTransaction = $$('#aft-enable-transaction-check');
    let chashableHandlplayLimit = $$('#chashable-handplay-limit');
    let chashableTransactionLimit = $$('#chashable-limit');
    let promoHandplayTransactionLimit = $$('#promo-handplay-limit');
    let promoTransactionLimit = $$('#promo-limit');
    let currentTableSettingsObject;
    let saveTransactionButton = $$('#aft-transaction-save').getElementsByClassName('btn-success')[0];

    function getTransactionData(currentTableSettingsObject) {
        trigger('communicate/aft/getNotificationSettings', {
            data: {EndpointId: currentTableSettingsObject.endpointId},
            tableSettings: currentTableSettingsObject
        });
    }

    function displayTransactionData(transactionData) {
        chashableHandlplayLimit.value = transactionData.CashableTransactionCreatedLimitForNotification;
        chashableTransactionLimit.value = transactionData.CashableTransactionPayedLimitForNotification;
        promoHandplayTransactionLimit.value = transactionData.PromoTransactionCreatedLimitForNotification;
        promoTransactionLimit.value = transactionData.PromoTransactionPayedLimitForNotification;
    }

    function collectAndPrepareTransactionDataForApi() {
        let transactionDataForApi = {
            EndpointId: currentTableSettingsObject.endpointId,
            EnableTransactions: '',
            CashableTransactionLimit: chashableTransactionLimit.value,
            CashableTransactionHandpayLimit: chashableHandlplayLimit.value,
            PromoTransactionLimit: promoHandplayTransactionLimit.value,
            PromoTransactionHandpayLimit: promoTransactionLimit.value
        };
        return transactionDataForApi;
    }

    on('aft/tab/transactions/init', function (params) {
        currentTableSettingsObject = params.tableSettings;
        console.log('Params in aft tab transactions init: ', params);
        getTransactionData(currentTableSettingsObject);
    });

    on('aft/tab/transactions/display', function (params) {
        let transactionData = params.data.Data;
        displayTransactionData(transactionData);
    });

    saveTransactionButton.addEventListener('click', function () {
        alert('button click');
        let dataForApi = collectAndPrepareTransactionDataForApi();
        console.log('data for api', dataForApi);
        trigger('communicate/aft/saveBasicSettings', {data: dataForApi, tableSettings: currentTableSettingsObject});
    });

    on('aft/tab/transactions/update', function(params){
        alert('Transactions update!');
        console.log('transactions data', params);
        //TODO da li ovde pozovem update table??
        trigger('table/update', params);
    });

})();