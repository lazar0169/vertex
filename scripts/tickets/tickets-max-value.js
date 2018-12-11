let ticketsMaxValue = (function () {

    let formSettingsMaxValue = {};
    formSettingsMaxValue.formContainerSelector = '#tickets-max-value-tab-info';
    formSettingsMaxValue.fillEvent = 'communicate/tickets/showMaxValueSettings';
    formSettingsMaxValue.submitEvent = 'communicate/tickets/saveMaxValuesAction';


    on('tickets/tab/maxValue', function (params) {
        formSettingsMaxValue.endpointId = params.tableSettings.endpointId;
        trigger('form/init', {formSettings: formSettingsMaxValue});
        trigger('form/getData', {formSettings: formSettingsMaxValue});
    });

    let smsEnableButton = $$('#tickets-enable-sms-check');
    let smsEnableMode = $$('#tickets-enable-sms-mode');
    let smsEnableSwitch = smsEnableButton.getElementsByTagName('input')[0];
    let emailEnableButton = $$('#tickets-enable-email-check');
    let emailEnableMode = $$('#tickets-enable-email-mode');
    let emailEnableSwitch = emailEnableButton.getElementsByTagName('input')[0];
/*

    smsEnableSwitch.addEventListener('click', function () {
        if (smsEnableSwitch.checked === false) {
            smsEnableSwitch.checked = false;
            smsEnableMode.innerHTML = 'No';
        } else {
            smsEnableSwitch.checked = true;
            smsEnableMode.innerHTML = 'Yes';
        }
    });

    emailEnableSwitch.addEventListener('click', function () {
        if (emailEnableSwitch.checked === false) {
            emailEnableSwitch.checked = false;
            emailEnableMode.innerHTML = 'No';
        } else {
            emailEnableSwitch.checked = true;
            emailEnableMode.innerHTML = 'Yes';
        }
    });
*/

/*    let maxValueSubmitButton = $$(formSettingsMaxValue.formContainerSelector).getElementsByClassName('btn-success')[0];

    maxValueSubmitButton.addEventListener('click', function(){
        trigger('form/submit', {formSettings: formSettingsMaxValue});
    });*/


    /*    let currentTableSettingsObject;
        let ticketsMaxValueTab = $$('#tickets-max-value-tab');
        let ticketsMaxValueMaxRedeemed = $$('#tickets-sms-settings-max-value-max-redeemed').children[1];
        let ticketsMaxValueMaxSell = $$('#tickets-sms-settings-max-value-max-sell').children[1];
        let ticketsMaxValueSaveButton = $$('#tickets-max-value-buttons-wrapper').children[0];

        ticketsMaxValueTab.addEventListener('click', function () {
            selectTab('tickets-max-value-tab');
            selectInfoContent('tickets-max-value-tab');
        });

        function getTicketsMaxValueData(currentTableSettingsObject) {
            trigger('communicate/tickets/showMaxValueSettings', {
                data: {EndpointId: currentTableSettingsObject.endpointId},
                tableSettings: currentTableSettingsObject
            });
        }

        function displayTicketsMaxValueData(ticketsMaxValueData) {
            console.log('Tickets max value data to display: ', ticketsMaxValueData);
            ticketsMaxValueMaxRedeemed.value = ticketsMaxValueData.MaxRedeemAmountForPayed;
            ticketsMaxValueMaxSell.value = ticketsMaxValueData.MaxSellAmountForPayed;
        }

        function collectAndPrepareTicketsMaxValueDataForApi() {
            let ticketsMaxValueDataForApi = {
                EndpointId: currentTableSettingsObject.endpointId,
                MaxRedeemAmountForPayed: ticketsMaxValueMaxRedeemed.value,
                MaxSellAmountForPayed: ticketsMaxValueMaxSell.value,
            };
            return ticketsMaxValueDataForApi;
        }

        on('tickets/tab/maxValue/init', function (params) {
            currentTableSettingsObject = params.tableSettings;
            console.log('Params in tickets tab max value init: ', params);
            getTicketsMaxValueData(currentTableSettingsObject);
        });

        on('tickets/tab/maxValue/display', function (params) {
            console.log('Usli smo u tickets max value display', params);
            let ticketsMaxValueData = params.data.Data;
            displayTicketsMaxValueData(ticketsMaxValueData);
        });

        ticketsMaxValueSaveButton.addEventListener('click', function () {
            let dataForApi = collectAndPrepareTicketsMaxValueDataForApi();
            console.log('Save tickets max value data for api', dataForApi);
            trigger('communicate/tickets/saveMaxValuesAction', {data: dataForApi, tableSettings: currentTableSettingsObject});
        });

        on('tickets/tab/maxValue/update', function (params) {
            alert('Tickets max value update!');
            console.log('Tickets max value', params);
        });*/
})();