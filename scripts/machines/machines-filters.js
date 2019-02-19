const machinesFilter = (function () {
    let machinesFiltersVendors = $$('#machine-filters-vendors');
    let machinesFiltersStatus = $$('#machine-filters-status');
    let machinesFilterMachineNumber = $$('#machine-filters-number-machines');

    dropdown.generate({ optionValue: machinesNumber, element: machinesFilterMachineNumber });
    dropdown.generate({ optionValue: machinesVendors, element: machinesFiltersVendors, type: 'multi' });
    dropdown.generate({ optionValue: machinesStatus, element: machinesFiltersStatus, type: 'multi' })
})();