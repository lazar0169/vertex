const machinesFilter = (function () {
    let machinesFiltersVendors = $$('#machine-filters-vendors');
    let machinesFiltersStatus = $$('#machine-filters-status');
    let machinesFilterMachineNumber = $$('#machine-filters-number-machines');


    dropdownNew.generateNew({ optionValue: machinesNumber, element: machinesFilterMachineNumber });

    dropdownNew.generateNew({ optionValue: machinesVendors, element: machinesFiltersVendors, type: 'multi' });
    dropdownNew.generateNew({ optionValue: machinesStatus, element: machinesFiltersStatus, type: 'multi' })



    // machinesFiltersVendors.appendChild(multiDropdown.generate(machinesVendors));
    // machinesFiltersStatus.appendChild(multiDropdown.generate(machinesStatus));


})();