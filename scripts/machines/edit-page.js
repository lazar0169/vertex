const editMachine = (function () {

    let machineEditVendor = $$('#machine-edit-vendor');
    let machineEditType = $$('#machine-edit-type');
    let machineEditSerialSelect = $$('#machine-edit-serial-select');
    let backMachineEdit = $$('#machine-edit-back');
    let machineEditMode = $$('#machine-edit-mode');

    machineEditVendor.appendChild(multiDropdown.generate(machinesVendors));
    machineEditType.appendChild(multiDropdown.generate(machinesType));
    machineEditSerialSelect.appendChild(dropdown.generate(machinesSerial));
    backMachineEdit.addEventListener('click', function () {
        machineEditMode.classList.add('collapse');
    });
})();