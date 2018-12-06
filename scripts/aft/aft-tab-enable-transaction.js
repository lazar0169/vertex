let aftTabEnableTransaction = (function () {

    let formSettingsTransaction = {};
    formSettingsTransaction.formContainerSelector = '#aft-tabs-enable-transaction-info';
    formSettingsTransaction.fillEvent = 'communicate/aft/getBasicSettings';
    formSettingsTransaction.submitEvent = 'communicate/aft/saveBasicSettings';
    formSettingsTransaction.validateEvent = '';
    formSettingsTransaction.successEvent = 'form/update';
    formSettingsTransaction.errorEvent = '';
    formSettingsTransaction.prepareDataEvent = '';
    formSettingsTransaction.customFillDataEvent = '';


    on('aft/tab/transaction', function (params) {
        formSettingsTransaction.endpointId = params.tableSettings.endpointId;
        trigger('form/init', {formSettings: formSettingsTransaction});
    });


    let transactionEnableButton = $$('#aft-enable-transaction-check');
    let transactionEnableMode = $$('#aft-enable-transaction-mode');
    let transactionEnableSwitch = transactionEnableButton.getElementsByTagName('input')[0];

    transactionEnableSwitch.addEventListener('click', function () {
        if (transactionEnableSwitch.checked === false) {
            transactionEnableSwitch.checked = false;
            transactionEnableMode.innerHTML = 'No';
        } else {
            transactionEnableSwitch.checked = true;
            transactionEnableMode.innerHTML = 'Yes';
        }
    });


    /*
    //elements
    // let enableTransaction = $$('#aft-enable-transaction-check');
    let chashableHandlpayLimit = $$('#chashable-handplay-limit');
    let chashableTransactionLimit = $$('#chashable-limit');
    let promoHandplayTransactionLimit = $$('#promo-handplay-limit');
    let promoTransactionLimit = $$('#promo-limit');
    let currentTableSettingsObject;
    let saveTransactionButton = $$('#aft-transaction-save').getElementsByClassName('btn-success')[0];
    let transactionEnableButton = $$('#aft-enable-transaction-check');
    let transactionEnableMode = $$('#aft-enable-transaction-mode');
    let transactionEnableSwitch = transactionEnableButton.getElementsByTagName('input')[0];

    function getTransactionData(currentTableSettingsObject) {
        trigger('communicate/aft/getBasicSettings', {
            data: {EndpointId: currentTableSettingsObject.endpointId},
            tableSettings: currentTableSettingsObject
        });
    }

    function displayTransactionData(transactionData) {
        transactionEnableSwitch.checked = transactionData.EnableTransactions;
        if(transactionData.EnableTransactions === true) {
            transactionEnableMode.innerHTML = 'Yes';
        } else {
            transactionEnableMode.innerHTML = 'No';
        }
        chashableHandlpayLimit.value = transactionData.CashableTransactionHandpayLimit;
        chashableTransactionLimit.value = transactionData.CashableTransactionLimit;
        promoHandplayTransactionLimit.value = transactionData.PromoTransactionHandpayLimit;
        promoTransactionLimit.value = transactionData.PromoTransactionLimit;
    }

    function collectAndPrepareTransactionDataForApi() {
        let transactionDataForApi = {
            EndpointId: currentTableSettingsObject.endpointId,
            EnableTransactions: transactionEnableButton.getElementsByTagName('input')[0].checked,
            CashableTransactionLimit: chashableTransactionLimit.value,
            CashableTransactionHandpayLimit: chashableHandlpayLimit.value,
            PromoTransactionLimit: promoHandplayTransactionLimit.value,
            PromoTransactionHandpayLimit: promoTransactionLimit.value
        };
        return transactionDataForApi;
    }

    on('aft/tab/transactions/init', function (params) {
        currentTableSettingsObject = params.tableSettings;
        getTransactionData(currentTableSettingsObject);
    });

    on('aft/tab/transactions/display', function (params) {
        let transactionData = params.data.Data;
        displayTransactionData(transactionData);
    });

    saveTransactionButton.addEventListener('click', function () {
        let dataForApi = collectAndPrepareTransactionDataForApi();
        console.log('Data that we are sending to API in save transactions: ', dataForApi);
        trigger('communicate/aft/saveBasicSettings', {data: dataForApi, tableSettings: currentTableSettingsObject});
    });

    on('aft/tab/transactions/update', function (params) {
        alert('Transactions update!');
    });

    transactionEnableSwitch.addEventListener('click', function(){
        if(transactionEnableSwitch.checked === false) {
            transactionEnableSwitch.checked = false;
            transactionEnableMode.innerHTML = 'No';
        } else {
            transactionEnableSwitch.checked = true;
            transactionEnableMode.innerHTML = 'Yes';
        }

    });*/

})();