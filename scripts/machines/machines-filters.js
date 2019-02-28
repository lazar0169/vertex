const machinesFilter = (function () {
    let machinesFiltersVendors = $$('#machine-filters-vendors');
    let machinesFiltersStatus = $$('#machine-filters-status');
    let machinesFilterMachineNumber = $$('#machine-filters-number-machines');

    dropdown.generate({ values: machinesNumber, parent: machinesFilterMachineNumber });
    dropdown.generate({ values: machinesVendors, parent: machinesFiltersVendors, type: 'multi' });
    dropdown.generate({ values: machinesStatus, parent: machinesFiltersStatus, type: 'multi' })
})();