let ticketsMaxValue = (function () {
    // let formSettingsMaxValue = {};
    // formSettingsMaxValue.formContainerSelector = '#tickets-max-value-tab-info';
    // formSettingsMaxValue.getData = communication.events.tickets.showMaxValueSettings;
    // formSettingsMaxValue.submitEvent = communication.events.tickets.saveMaxValuesAction;
    let maxRedeemed = $$('#tickets-sms-settings-max-value-max-redeemed');
    let maxSell = $$('#tickets-sms-settings-max-value-max-sell');
    let maxValueTab = $$('#tickets-max-value-tab-info');
    let maxValueSave = $$('#tickets-max-value-buttons-wrapper').children[0];


    on('tickets/tab/maxValue', function (params) {
        // formSettingsMaxValue.endpointId = params.endpointId;
        // trigger('form/init', {formSettings: formSettingsMaxValue});
        // trigger('form/getData', {formSettings: formSettingsMaxValue});
        fillInput(params.data.Data, params.additionalData.EndpointId);
    });

    on('save/max-value', function (params) {
        trigger('notifications/show', {
            message: localization.translateMessage(params.data.MessageCode),
            type: params.data.MessageType,
        });
        console.log(params)
    });

   
    function fillInput(data, endpointId) {
        maxRedeemed.children[1].value = formatFloatValue(data.MaxRedeemAmountForPayed / 100);
        maxRedeemed.children[1].dataset.value = data.MaxRedeemAmountForPayed;
        maxSell.children[1].value = formatFloatValue(data.MaxSellAmountForPayed / 100);
        maxSell.children[1].dataset.value = data.MaxSellAmountForPayed;
        maxValueTab.dataset.endpointId = endpointId;
    }

    maxValueSave.addEventListener('click', function () {
        let data = {
            EndpointId: parseInt(maxValueTab.dataset.endpointId),
            MaxRedeemAmountForPayed: parseInt(maxRedeemed.children[1].dataset.value),
            MaxSellAmountForPayed: parseInt(maxSell.children[1].dataset.value)
        }
        trigger(communication.events.tickets.saveMaxValuesAction, { data });
    });
})();