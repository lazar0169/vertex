const aftTabContent = (function () {

    /*--------------------------------- ENABLE TRANSACTION ---------------------------------*/

    //elements
    // let enableTransaction = $$('#aft-enable-transaction-check');
    let chashableHandlplayLimit = $$('#chashable-handplay-limit');
    let chashableTransactionLimit = $$('#chashable-limit');
    let promoHandplayTransactionLimit = $$('#promo-handplay-limit');
    let promoTransactionLimit = $$('#promo-limit');
    let currentTableSettingsObject;
    let saveTransactionButton = $$('#aft-transaction-save').getElementsByClassName('btn-success')[0];
    let enableTransactionButton = $$('#aft-enable-transaction-check');

    function getTransactionData(currentTableSettingsObject) {
        trigger('communicate/aft/getBasicSettings', {
            data: {EndpointId: currentTableSettingsObject.endpointId},
            tableSettings: currentTableSettingsObject
        });
    }

    function displayTransactionData(transactionData) {
        enableTransactionButton.getElementsByTagName('input')[0].checked = transactionData.EnableTransactions;
        chashableHandlplayLimit.value = transactionData.CashableTransactionHandpayLimit;
        chashableTransactionLimit.value = transactionData.CashableTransactionLimit;
        promoHandplayTransactionLimit.value = transactionData.PromoTransactionHandpayLimit;
        promoTransactionLimit.value = transactionData.PromoTransactionLimit;
    }

    function collectAndPrepareTransactionDataForApi() {
        let transactionDataForApi = {
            EndpointId: currentTableSettingsObject.endpointId,
            EnableTransactions: enableTransactionButton.getElementsByTagName('input')[0].checked,
            CashableTransactionLimit: chashableTransactionLimit.value,
            CashableTransactionHandpayLimit: chashableHandlplayLimit.value,
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
        alert('Save transactions button click!');
        let dataForApi = collectAndPrepareTransactionDataForApi();
        trigger('communicate/aft/saveBasicSettings', {data: dataForApi, tableSettings: currentTableSettingsObject});
    });

    on('aft/tab/transactions/update', function (params) {
        alert('Transactions update!');
    });

    /*--------------------------------------------------------------------------------------*/


    /*--------------------------------- NOTIFICATION SETTINGS ---------------------------------*/
    let aftNotificationEmail = $$('#aft-notification-send-email');
    let aftAnotherEmail = $$('#aft-notification-another-email');
    let aftNotificationMobile = $$('#aft-notification-send-mobile');
    let aftAnotherMobile = $$('#aft-notification-another-phone');
    let emailCounter = 0;
    let mobileCounter = 0;
    let notificationLimit = $$('#notification-limit');
    let notificationMobileNumber = $$('#notification-mobile-phone-number');
    let notificationEmailAddress = $$('#notification-email-address');
    let notificationSaveButton = $$('#aft-notification-save').getElementsByClassName('btn-success')[0];
    let notificationsEnableButton = $$('#aft-enable-notification-check');


    function getNotificationData(currentTableSettingsObject) {
        trigger('communicate/aft/getNotificationSettings', {
            data: {EndpointId: currentTableSettingsObject.endpointId},
            tableSettings: currentTableSettingsObject
        });
    }

    function displayNotificationData(notificationData) {
        notificationsEnableButton.getElementsByTagName('input')[0].checked = notificationData.EnableTransactions;
        notificationLimit.value = notificationData.CashableTransactionCreatedLimitForNotification;
        notificationMobileNumber.value = notificationData.PhoneNumberList[0];
        notificationEmailAddress.value = notificationData.EmailList[0];
    }

    function collectAndPrepareNotificationDataForApi() {
        let notificationDataForApi = {
            EndpointId: currentTableSettingsObject.endpointId,
            EnableTransactions: notificationsEnableButton.getElementsByTagName('input')[0].checked,
            CashableTransactionCreatedLimitForNotification: 55, //todo insert real data
            CashableTransactionPayedLimitForNotification: 55,
            PromoTransactionCreatedLimitForNotification: 55,
            PromoTransactionPayedLimitForNotification: 55,
            EmailList: '',
            PhoneNumberList: ''
        };
        return notificationDataForApi;
    }

    on('aft/tab/notifications/init', function (params) {
        currentTableSettingsObject = params.tableSettings;
        getNotificationData(currentTableSettingsObject);
    });

    on('aft/tab/notifications/display', function (params) {
        let notificationData = params.data.Data;
        displayNotificationData(notificationData);
    });

    notificationSaveButton.addEventListener('click', function () {
        alert('Save notifications button click!');
        let dataForApi = collectAndPrepareNotificationDataForApi();
        trigger('communicate/aft/saveNotificationSettings', {
            data: dataForApi,
            tableSettings: currentTableSettingsObject
        });
    });

    on('aft/tab/notifications/update', function (params) {
        alert('Notifications update!');
    });

    aftAnotherMobile.addEventListener('click', function () {
        let temp = document.createElement('input');
        temp.placeholder = "Your another mobile number";
        temp.classList = "form-input";
        temp.id = `notification-mobile-phone-number-${mobileCounter}`
        aftNotificationMobile.children[0].appendChild(temp);
        mobileCounter++;
    });

    aftAnotherEmail.addEventListener('click', function () {
        let temp = document.createElement('input');
        temp.placeholder = "Your another email address";
        temp.classList = "form-input";
        temp.id = `notification-email-address-${emailCounter}`
        aftNotificationEmail.children[0].appendChild(temp);
        emailCounter++;
    });


    /*--------------------------------------------------------------------------------------*/
})();