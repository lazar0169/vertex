let aftTabEnableTransaction = (function () {

    //elements
    // let enableTransaction = $$('#aft-enable-transaction-check');
    let chashableHandlplayLimit = $$('#chashable-handplay-limit');
    let chashableTransactionLimit = $$('#chashable-limit');
    let promoHandplayTransactionLimit = $$('#promo-handplay-limit');
    let promoTransactionLimit = $$('#promo-limit');
    let currentTableSettingsObject;

    function getTransactions(currentTableSettingsObject) {
        trigger('communicate/aft/getNotificationSettings', {
            data: {EndpointId: currentTableSettingsObject.endpointId},
            tableSettings: currentTableSettingsObject
        });
    }

    function displayTransactions(transactionData){
        console.log('transaction data', transactionData);
        console.log(transactionData[0]);
        chashableHandlplayLimit.value = transactionData.CashableTransactionCreatedLimitForNotification;
        chashableTransactionLimit.value = transactionData.CashableTransactionPayedLimitForNotification;
        promoHandplayTransactionLimit.value = transactionData.PromoTransactionCreatedLimitForNotification;
        promoTransactionLimit.value = transactionData.PromoTransactionPayedLimitForNotification;
    }

    on('aft/tab/transactions/init', function (params) {
        currentTableSettingsObject = params.tableSettings;
        alert('Aft tab transaction init success!');
        console.log('Params in aft tab transactions init: ', params);
        getTransactions(currentTableSettingsObject);
    });

    on('aft/tab/transactions/display', function(params){
        let transactionData = params.data.Data;
        displayTransactions(transactionData);
    });

})();