let ticketsSmsSettings = (function () {
    // let formSettingsSmsSettings = {};
    // formSettingsSmsSettings.formContainerSelector = '#tickets-sms-settings-tab-info';
    // formSettingsSmsSettings.getData = communication.events.tickets.showSmsSettings;
    // formSettingsSmsSettings.submitEvent = communication.events.tickets.saveSmsSettings;

    // formSettingsSmsSettings.afterDisplayData = function (formSettings, data) {
    //     let enableSMS = data.Data.EnableSms === true;
    //     let enableEmail = data.Data.EnableEmail === true;

    //     if (enableSMS || enableEmail) {
    //         $$('#tickets-enable-sms-mode').parentNode.vertexToggle.check();
    //     }
    //     else {
    //         $$('#tickets-enable-sms-mode').parentNode.vertexToggle.uncheck();
    //     }
    // };
    // formSettingsSmsSettings.beforeSubmit = function (formSettings, data) {
    //     console.log('data to be sent', data);
    //     //if emails or phone first field is empty arrays has always one element with value of empty string
    //     if ($$('#tickets-enable-sms-mode').parentNode.vertexToggle.getState()) {
    //         if (data.Emails[data.Emails.length - 1] === '') {
    //             data.Emails.pop();
    //         }
    //         if (data.PhoneNumbers[data.PhoneNumbers.length - 1] === '') {
    //             data.PhoneNumbers.pop();
    //         }
    //         data.EnableEmail = data.Emails.length > 0;
    //         data.EnableSMS = data.PhoneNumbers.length > 0;
    //     }
    //     else {
    //         data.EnableEmail = false;
    //         data.EnableSMS = false;
    //         data.PhoneNumbers = [];
    //         data.Emails = [];
    //     }
    //     return data;
    // };

    let maxRademption = $$('#tickets-sms-settings-max-redemption');
    let maxIssuance = $$('#tickets-sms-settings-max-issuance');
    let mobileNumber = $$('#tickets-sms-settings-send-mobile');
    validation.init(mobileNumber.children[0], {});
    let mail = $$('#tickets-sms-settings-send-email');
    let addAnotherMobileButton = $$('#tickets-sms-settings-another-phone');
    let addAnotherMailButton = $$('#tickets-sms-settings-another-email')
    let ticketSmsTabInfo = $$('#tickets-sms-settings-tab-info')

    on('tickets/tab/smsSettings', function (params) {
        deleteInputElements({ parent: ticketSmsTabInfo, class: 'element-form-phone-number' });
        deleteInputElements({ parent: ticketSmsTabInfo, class: 'element-form-email' });
        fillInput(params.data.Data)

        // formSettingsSmsSettings.endpointId = params.endpointId;
        // trigger('form/init', {formSettings: formSettingsSmsSettings});
        // trigger('form/getData', {formSettings: formSettingsSmsSettings});
    });
    function deleteInputElements(elements) {
        if (elements.byButton) {
            let parent = elements.parent.parentNode;
            parent.removeChild(elements.parent);
            if (parent.childElementCount <= 3) {
                parent.getElementsByClassName('button-link')[0].classList.add('visibility-hidden');
            }
        }
        else {
            let classElemenents = elements.parent.getElementsByClassName(elements.class);
            let numbOfElements = classElemenents.length
            for (let i = 0; i < numbOfElements; i++) {
                if (classElemenents.length > 1) {
                    classElemenents[0].remove();
                }
            }
        }

    }

    function fillInput(params) {
        console.log(params)
        currencyInput.generate(maxRademption.children[1]);
        maxRademption.children[1].value = formatFloatValue(params.RedeemedTicketLimitForNotification / 100);

        currencyInput.generate(maxIssuance.children[1]);
        maxIssuance.children[1].value = formatFloatValue(params.SoldTicketLimitForNotification / 100);


        validation.init(mobileNumber.children[0].children[1].children[0], {});
        mobileNumber.children[0].children[1].children[0].value = params.PhoneNumbers[0];


        if (params.PhoneNumbers.length > 1) {
            for (let i = 1; i < params.PhoneNumbers.length; i++) {
                mobileNumber.children[0].children[1].children[1].classList.remove('visibility-hidden');
                let newMobile = document.createElement('div');
                newMobile.classList.add('element-form-phone-number');
                newMobile.innerHTML = `<input maxlength="20" name="PhoneNumberList" class="form-input element-form-data" data-type="array"
            type="text" id="notification-mobile-phone-number" placeholder="xxx-xxx-xxxx" value=${params.PhoneNumbers[i]}>
            <a class="action-delete-form-element button-link element-multilanguage"
            data-translation-key="Delete">
            Delete
            </a>`;
                mobileNumber.children[0].insertBefore(newMobile, addAnotherMobileButton);
                validation.init(newMobile.children[0], {})
            }

        }
        validation.init(mail.children[0].children[1].children[0], {});
        mail.children[0].children[1].children[0].value = params.Emails[0];
        if (params.Emails.length > 1) {
            for (let i = 1; i < params.Emails.length; i++) {
                mail.children[0].children[1].children[1].classList.remove('visibility-hidden');
                let newEmail = document.createElement('div');
                newEmail.classList.add('element-form-email');
                newEmail.innerHTML = ` <input maxlength="50" name="EmailList" class="form-input element-form-data element-multilanguage"
            data-type="array" type="text" email="true" data-translation-key="Your Email" value=${params.Emails[i]}>
            <a class="action-delete-form-element button-link element-multilanguage"
            data-translation-key="Delete">
            Delete
            </a>`;
                mail.children[0].insertBefore(newEmail, addAnotherMailButton);
                validation.init(newEmail.children[0], {})
            }
        }
        let deleteButton = ticketSmsTabInfo.getElementsByClassName('action-delete-form-element');
        for (let button of deleteButton) {
            bindDeleteButton(button);
        }
    }

    function bindDeleteButton(button) {

        button.addEventListener('click', function () {
            deleteInputElements({ parent: button.parentNode, byButton: true });
        });

    }
    addAnotherMobileButton.addEventListener('click', function () {
        if (!addAnotherMobileButton.previousElementSibling.children[0].value) {
            console.log('moje resenje za prazno')
        }
        else {
            addInputElement({ parent: addAnotherMobileButton });

        }
    })

    function addInputElement(element) {
        let newMobile = document.createElement('div');
        newMobile.classList.add('element-form-phone-number');
        newMobile.innerHTML = `<input maxlength="20" name="PhoneNumberList" class="form-input element-form-data" data-type="array"
        type="text" placeholder="xxx-xxx-xxxx" value=''>
        <a class="action-delete-form-element button-link element-multilanguage"
        data-translation-key="Delete">
        Delete
        </a>`;
        mobileNumber.children[0].insertBefore(newMobile, element.parent);
        bindDeleteButton(newMobile.children[1]);
    }

    // function emptyInput(element) {
    //     let newMessage = document.createElement('div');
    //     newMessage.classList.add('vertex-error-container');
    //     newMessage.innerHTML = localization.translateMessage('TheFieldIsRequired');
    //     element.append(newMessage);
    // }

})();