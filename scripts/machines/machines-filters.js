const machinesFilter = (function () {
    let machinesFiltersVendors = $$('#machine-filters-vendors');
    let machinesFiltersStatus = $$('#machine-filters-status');
    let machinesFilterMachineNumber = $$('#machine-filters-number-machines');


    machinesFiltersVendors.appendChild(multiDropdown.generate(machinesVendors));
    machinesFiltersStatus.appendChild(multiDropdown.generate(machinesStatus));
    machinesFilterMachineNumber.appendChild(dropdown.generate(machinesNumber));

})();