const editMachine = (function () {
    let machineEditVendor = $$('#machine-edit-vendor');
    let machineEditType = $$('#machine-edit-type');
    let machineEditSerialSelect = $$('#machine-edit-serial-select');
    let backMachineEdit = $$('#machine-edit-back');
    let machineEditMode = $$('#machine-edit-mode');


    on('machines/details-edit-machine', function (params) {
        let data = params.data.Data;
        let dropdownVendors;
        let dropdownType;
        let dropdownSerial;

        if (dropdownVendors) {
            dropdownVendors.remove();
        }
        dropdownVendors = dropdown.generate({ values: data.VendorList, parent: machineEditVendor, type: 'single' });

        if (dropdownType) {
            dropdownType.remove();
        }
        dropdownType = dropdown.generate({ values: data.TypeList, parent: machineEditType, type: 'single' });

        if (dropdownSerial) {
            dropdownSerial.remove();
        }
        dropdownSerial = dropdown.generate({ values: data.MachineCodeList, parent: machineEditSerialSelect });

    });

    // dropdown.generate({ values: machinesVendors, parent: machineEditVendor, type: 'multi' });
    // dropdown.generate({ values: machinesType, parent: machineEditType, type: 'multi' });
    // dropdown.generate({ values: machinesSerial, parent: machineEditSerialSelect });

    backMachineEdit.addEventListener('click', function () {
        machineEditMode.classList.add('collapse');
    });
})();