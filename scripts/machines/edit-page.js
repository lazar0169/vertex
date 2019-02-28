const editMachine = (function () {
    let machineEditVendor = $$('#machine-edit-vendor');
    let machineEditType = $$('#machine-edit-type');
    let machineEditSerialSelect = $$('#machine-edit-serial-select');
    let backMachineEdit = $$('#machine-edit-back');
    let machineEditMode = $$('#machine-edit-mode');

    dropdown.generate({ values: machinesVendors, parent: machineEditVendor, type: 'multi' });
    dropdown.generate({ values: machinesType, parent: machineEditType, type: 'multi' });
    dropdown.generate({ values: machinesSerial, parent: machineEditSerialSelect });

    backMachineEdit.addEventListener('click', function () {
        machineEditMode.classList.add('collapse');
    });
})();