let ticketsSmsSettings = (function(){
    let ticketsSmsSettingsTab = $$('#tickets-sms-settings-tab');
    let currentTableSettingsObject;
    let ticketsSmsSettingsMaxRedemption = $$('#tickets-sms-settings-max-redemption').children[1];
    let ticketsSmsSettingsMaxIssuance = $$('#tickets-sms-settings-max-issuance').children[1];
    let ticketsSmsSettingsSaveButton = $$('#tickets-sms-settings-buttons-wrapper').children[0];

    ticketsSmsSettingsTab.addEventListener('click', function () {
        selectTab('tickets-sms-settings-tab');
        selectInfoContent('tickets-sms-settings-tab');
    });

    function getTicketsSmsSettingsData(currentTableSettingsObject) {
        trigger('communicate/tickets/showSmsSettings', {
            data: {EndpointId: currentTableSettingsObject.endpointId},
            tableSettings: currentTableSettingsObject
        });
    }

    function displayTicketsSmsSettingsData(ticketsSmsSettingsData) {
        console.log('Tickets sms settings data to display: ', ticketsSmsSettingsData);
        ticketsSmsSettingsMaxRedemption.value = ticketsSmsSettingsData.RedeemedTicketLimitForNotification;
        ticketsSmsSettingsMaxIssuance.value = ticketsSmsSettingsData.SoldTicketLimitForNotification;
    }

    function collectAndPrepareTicketsSmsSettingsDataForApi() {
        let ticketsSmsSettingsDataForApi = {
            EndpointId: currentTableSettingsObject.endpointId,
            EnableSms: true, //todo real data
            EnableEmail: true, //todo real data
            RedeemedTicketLimitForNotification: ticketsSmsSettingsMaxRedemption.value,
            SoldTicketLimitForNotification: ticketsSmsSettingsMaxIssuance.value,
            PhoneNumbers: [''], //todo real data
            Emails: [''], //todo real data
        };
        return ticketsSmsSettingsDataForApi;
    }

    on('tickets/tab/smsSettings/init', function (params) {
        currentTableSettingsObject = params.tableSettings;
        console.log('Params in tickets tab sms settings init: ', params);
        getTicketsSmsSettingsData(currentTableSettingsObject);
    });

    on('tickets/tab/smsSettings/display', function (params) {
        console.log('Usli smo u tickets sms settings display', params);
        let ticketsSmsSettingsData = params.data.Data;
        displayTicketsSmsSettingsData(ticketsSmsSettingsData);
    });

    ticketsSmsSettingsSaveButton.addEventListener('click', function () {
        alert('Save tickets max sms settings button click!');
        let dataForApi = collectAndPrepareTicketsSmsSettingsDataForApi();
        console.log('Save tickets sms settings data for api', dataForApi);
        trigger('communicate/tickets/saveSmsSettings', {data: dataForApi, tableSettings: currentTableSettingsObject});
    });

    on('tickets/tab/smsSettings/update', function (params) {
        alert('Tickets sms settings update!');
        console.log('Tickets sms settings', params);
    });

})();