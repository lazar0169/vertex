const editMachine = (function () {

    let machineTypeEnum = {
        Slow: 0,
        Medium: 1,
        Fast: 2
    }

    let editMachineContent = $$('#machine-edit-content')
    let machineEditVendor = $$('#machine-edit-vendor');
    let machineEditType = $$('#machine-edit-type');
    let machineEditSerialSelect = $$('#machine-edit-serial-select');
    let backMachineEdit = $$('#machine-edit-back');
    let machineEditMode = $$('#machine-edit-mode');
    let machineSerialNumber = $$('#machine-edit-serial').children[1];
    let machineOrdinalNumber = $$('#machine-edit-id').children[1];
    let machineName = $$('#machine-edit-name').children[1];
    let field1 = $$('#machine-integration-parameters-field-1');
    let field2 = $$('#machine-integration-parameters-field-2');
    let field3 = $$('#machine-integration-parameters-field-3');
    let field4 = $$('#machine-integration-parameters-field-4');
    let field5 = $$('#machine-integration-parameters-field-5');

    let maxTicketPrinting = $$('#machine-max-ticket-printing');
    validation.init(maxTicketPrinting, {});
    currencyInput.generate(maxTicketPrinting, {});

    let meterValue = $$('#machine-meter-value-exceeds');
    validation.init(meterValue, {});
    currencyInput.generate(meterValue, {});

    let maxValueTransaction = $$('#machine-max-value-transaction');
    validation.init(maxValueTransaction, {});
    currencyInput.generate(maxValueTransaction, {});

    let speedType = $$('#machine-edit-speed-type');
    checkboxChangeState.radioClick(speedType);

    let allowPromoTicket = $$('#machine-edit-allow-promo-ticket');
    checkboxChangeState.checkboxClick(allowPromoTicket);
    let enableAftTransaction = $$('#machine-edit-enable-aft').children[0];
    checkboxChangeState.checkboxClick(enableAftTransaction);

    let removeMachineFromCasino = $$('#machine-edit-remove');

    let saveEditMachine = $$('#machine-edit-save');

    saveEditMachine.onclick = function () {
        let EntryData = prepareDataForApi();
        let data = {}
        data.successAction = 'machines/save-edited-machine';
        trigger(communication.events.machines.saveMachine, { data, EntryData });
    }
    on('machines/save-edited-machine', function (params) {
        trigger('notifications/show', {
            message: localization.translateMessage(params.data.MessageCode),
            type: params.data.MessageType,
        });
    });

    function prepareDataForApi() {
        let data = detailsBar.prepareData()
        data.ID = editMachineContent.settings.ID;
        data.Name = machineName.value;
        data.EnableTransaction = checkboxChangeState.getCheckboxState(enableAftTransaction);
        data.TransactionLimit = parseInt($$('#machine-edit-enable-aft').children[1].children[1].dataset.value);
        data.Status = '';
        data.MaxAmountForPayoutTicket = parseInt($$('#machine-edit-max-ticket').children[1].dataset.value)
        data.EnableEscrowedPromoTicket = checkboxChangeState.getCheckboxState(allowPromoTicket);
        data.SpeedType = machineTypeEnum[checkboxChangeState.getRadioState(speedType)];
        let typeId = $$('#machine-edit-type').children[1].get();
        data.TypeId = typeId === 'null' ? null : parseInt(typeId);
        data.Type = $$('#machine-edit-type').children[1].children[0].dataset.value;
        data.Vendor = $$('#machine-edit-vendor').children[1].children[0].dataset.value;
        let vendorId = $$('#machine-edit-vendor').children[1].get()
        data.VendorId = vendorId === 'null' ? null : parseInt(vendorId);
        data.OrdinalNumber = parseInt(machineOrdinalNumber.value);
        data.SerialNumber = machineSerialNumber.value;
        data.MeterStepValue = parseInt(meterValue.dataset.value);
        data.MachineCodeName = machineEditSerialSelect.children[1].children[0].dataset.value;
        let machineCode = machineEditSerialSelect.children[1].get()
        data.MachineCode = machineCode === 'null' ? null : parseInt(machineCode);
        data.Field1 = field1.value;
        data.Field2 = field2.value;
        data.Field3 = field3.value;
        data.Field4 = field4.value;
        data.Field5 = field5.value;
        return data;
    }

    on('machines/details-edit-machine', function (params) {
        let data = params.data.Data;
        editMachineContent.settings = data;
        machineSerialNumber.value = data.SerialNumber;
        machineOrdinalNumber.value = data.OrdinalNumber;
        machineName.value = data.MachineName;
        maxTicketPrinting.value = formatFloatValue(data.MaximumValueForTicketPrinting);
        maxTicketPrinting.dataset.value = data.MaximumValueForTicketPrinting;
        meterValue.value = formatFloatValue(data.NotificationValueLimit);
        meterValue.dataset.value = data.NotificationValueLimit;
        maxValueTransaction.value = formatFloatValue(data.MaximumValueForTransaction);
        maxValueTransaction.dataset.value = data.MaximumValueForTransaction
        field1.value = data.Field1;
        field2.value = data.Field2;
        field3.value = data.Field3;
        field4.value = data.Field4;
        field5.value = data.Field5;

        for (let radio of speedType.getElementsByClassName('form-radio')) {
            if (radio.dataset.value === data.SpeedType) {
                checkboxChangeState.checkboxIsChecked(radio.children[0], true);
                break;
            }
        }

        checkboxChangeState.checkboxIsChecked(allowPromoTicket.children[0].children[0], data.AllowedPromoTickets);
        checkboxChangeState.checkboxIsChecked(enableAftTransaction.children[0].children[0], data.AllowedTransaction);

        let dropdownVendors;
        let dropdownType;
        let dropdownSerial;

        if (dropdownVendors) {
            dropdownVendors.remove();
        }
        dropdownVendors = dropdown.generate({ values: data.VendorList, parent: machineEditVendor, type: 'single' });
        dropdownVendors.children[1].set([`${data.VendorId}`])

        if (dropdownType) {
            dropdownType.remove();
        }
        dropdownType = dropdown.generate({ values: data.TypeList, parent: machineEditType, type: 'single' });
        dropdownType.children[1].set([`${data.TypeId}`])

        if (dropdownSerial) {
            dropdownSerial.remove();
        }
        dropdownSerial = dropdown.generate({ values: data.MachineCodeList, parent: machineEditSerialSelect });
        dropdownSerial.children[1].set([`${data.MachineCode}`])
    });

    removeMachineFromCasino.onclick = function () {
        let EntryData = detailsBar.prepareData();
        let data = {};
        data.successAction = 'machines/remove-machine-from-casino'
        trigger(communication.events.machines.removeMachineFromCasino, { data, EntryData });
        machineEditMode.classList.add('collapse');
    }

    on('machines/remove-machine-from-casino', function (params) {
        trigger('notifications/show', {
            message: localization.translateMessage(params.data.MessageCode),
            type: params.data.MessageType,
        });
    });

    backMachineEdit.addEventListener('click', function () {
        machineEditMode.classList.add('collapse');
    });
})();