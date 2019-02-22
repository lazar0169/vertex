const machinesFilter = (function () {
    let machinesFiltersVendors = $$('#machine-filters-vendors');
    let machinesFiltersStatus = $$('#machine-filters-status');
    let machinesFilterMachineNumber = $$('#machine-filters-number-machines');

    dropdown.generate({ optionValue: machinesNumber, parent: machinesFilterMachineNumber });
    dropdown.generate({ optionValue: machinesVendors, parent: machinesFiltersVendors, type: 'multi' });
    dropdown.generate({ optionValue: machinesStatus, parent: machinesFiltersStatus, type: 'multi' })
})();