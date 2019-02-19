const editMachine = (function () {
    let machineEditVendor = $$('#machine-edit-vendor');
    let machineEditType = $$('#machine-edit-type');
    let machineEditSerialSelect = $$('#machine-edit-serial-select');
    let backMachineEdit = $$('#machine-edit-back');
    let machineEditMode = $$('#machine-edit-mode');

    dropdown.generate({ optionValue: machinesVendors, element: machineEditVendor, type: 'multi' });
    dropdown.generate({ optionValue: machinesType, element: machineEditType, type: 'multi' });
    dropdown.generate({ optionValue: machinesSerial, element: machineEditSerialSelect });

    backMachineEdit.addEventListener('click', function () {
        machineEditMode.classList.add('collapse');
    });
})();