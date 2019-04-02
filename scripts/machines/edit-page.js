const editMachine = (function () {
    let machineEditVendor = $$('#machine-edit-vendor');
    let machineEditType = $$('#machine-edit-type');
    let machineEditSerialSelect = $$('#machine-edit-serial-select');
    let backMachineEdit = $$('#machine-edit-back');
    let machineEditMode = $$('#machine-edit-mode');

    let machineSerialNumber = $$('#machine-edit-serial').children[0];
    let machineOrdinalNumber = $$('#machine-edit-id').children[0];
    let machineName = $$('#machine-edit-name').children[0];

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



    on('machines/details-edit-machine', function (params) {
        let data = params.data.Data;



        machineSerialNumber.value = 'stize u service';
        machineOrdinalNumber.value = data.OrdinalNumber;
        machineName.value = data.MachineName;
        maxTicketPrinting.value = formatFloatValue(data.MaximumValueForTicketPrinting / 100);
        meterValue.value = formatFloatValue(data.NotificationValueLimit / 100);
        maxValueTransaction.value = formatFloatValue(data.MaximumValueForTransaction / 100);

        for (let radio of speedType.getElementsByClassName('form-radio')) {
            if (radio.dataset.value === data.SpeedType) {
                checkboxChangeState.checkboxIsChecked(radio.children[0], true);
                break;
            }
        }

        checkboxChangeState.checkboxIsChecked(allowPromoTicket.children[0].children[0], data.AllowedPromoTickets);
        checkboxChangeState.checkboxIsChecked(enableAftTransaction.children[0].children[0], data.AllowedTransaction);

        console.log(checkboxChangeState.getCheckboxState(allowPromoTicket))
        console.log(checkboxChangeState.getRadioState(speedType))
       
        // let dropdownVendors;
        // let dropdownType;
        // let dropdownSerial;

        // if (dropdownVendors) {
        //     dropdownVendors.remove();
        // }
        // dropdownVendors = dropdown.generate({ values: data.VendorList, parent: machineEditVendor, type: 'single' });

        // if (dropdownType) {
        //     dropdownType.remove();
        // }
        // dropdownType = dropdown.generate({ values: data.TypeList, parent: machineEditType, type: 'single' });

        // if (dropdownSerial) {
        //     dropdownSerial.remove();
        // }
        // dropdownSerial = dropdown.generate({ values: data.MachineCodeList, parent: machineEditSerialSelect });

    });

    removeMachineFromCasino.onclick = function () {
        let EntryData = detailsBar.prepareData();
        let data = {};
        data.successAction = 'machines/remove-machine-from-casino'
        trigger(communication.events.machines.removeMachineFromCasino, { data, EntryData });
        machineEditMode.classList.add('collapse');
        trigger('')


    }
    
    on('machines/remove-machine-from-casino', function (params) {
        trigger('notifications/show', {
            message: localization.translateMessage(params.data.MessageCode),
            type: params.data.MessageType,
        });

        //masina posalje da je izbrisana a jos postoji u bazi pa je ukloni nakon nekog vremena
        setTimeout(() => {
            let filters = machines.prepareMachinesFilters();
            trigger(communication.events.machines.previewMachines, { data: filters });
        }, 7000);
    });

    dropdown.generate({ values: machinesVendors, parent: machineEditVendor, type: 'multi' });
    dropdown.generate({ values: machinesType, parent: machineEditType, type: 'multi' });
    dropdown.generate({ values: machinesSerial, parent: machineEditSerialSelect });

    backMachineEdit.addEventListener('click', function () {
        machineEditMode.classList.add('collapse');
    });
})();