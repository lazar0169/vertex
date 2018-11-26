let aftTabEnableTransaction = (function () {

    //elements
    // let enableTransaction = $$('#aft-enable-transaction-check');
    let chashableHandlplayLimit = $$('#chashable-handplay-limit');
    let chashableTransactionLimit = $$('#chashable-limit');
    let promoHandplayTransactionLimit = $$('#promo-handplay-limit');
    let promoTransactionLimit = $$('#promo-limit');


    $$('#aft-tabs-enable-transaction').addEventListener('click', function () {
        trigger('communicate/aft/getNotificationSettings', {data: {EndpointId: 2}, tableSettings: null});
    });

    on('aft/tab/transactions/init', function (params) {
        alert('Aft tab transaction init success!');
        console.log('Params in aft tab transactions init: ', params);
        let transactionData = params.data.Data;
        //todo HANDLE TABLE SETTINGS !!!
        console.log('transaction data', transactionData);
        console.log(transactionData[0]);
        chashableHandlplayLimit.value = transactionData.CashableTransactionCreatedLimitForNotification;
        chashableTransactionLimit.value = transactionData.CashableTransactionPayedLimitForNotification;
        promoHandplayTransactionLimit.value = transactionData.PromoTransactionCreatedLimitForNotification;
        promoTransactionLimit.value = transactionData.PromoTransactionPayedLimitForNotification;
    });
})();