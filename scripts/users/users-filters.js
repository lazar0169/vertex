const usersFilter = (function () {
    let advanceTableFilter = $$('#users-advance-table-filter');
    let advanceTableFilterButton = $$('#users-advance-table-filter').children[0];
    let advanceTableFilterActive = $$('#users-advance-table-filter-active');
    let advanceTableFilterInfobar = $$('#users-advance-table-filter-active-infobar');
    let usersAdvanceApplyFilters = $$('#users-advance-table-filter-apply').children[0];
    let clearAdvanceFilter = $$('#users-advance-table-filter-clear').children[0];
    let clearAdvanceFilterInfobar = $$('#users-advance-table-filter-active-infobar-button').children[0];
    let usersNumber = $$('#users-number');
    let filterUsers = $$('#users-advance-table-filter-users');
    let filterCasinos = $$('#users-advance-table-filter-casinos');
    let filterPrivilegies = $$('#users-advance-table-filter-privilegies');


    dropdown.generate(machinesNumber,usersNumber);
    filterUsers.appendChild(multiDropdown.generate(machinesVendors));
    filterCasinos.appendChild(multiDropdown.generate(machinesStatus));
    filterPrivilegies.appendChild(multiDropdown.generate(machinesType));

    advanceTableFilterButton.addEventListener('click', function () {
        advanceTableFilter.classList.toggle('advance-filter-active');
        trigger('opened-arrow', { div: advanceTableFilter.children[0] });
        advanceTableFilterActive.classList.toggle('hidden');
    });

    usersAdvanceApplyFilters.addEventListener('click', function () {
        trigger('opened-arrow', { div: advanceTableFilter.children[0] });
        trigger('filters/show-selected-filters', { active: advanceTableFilterActive, infobar: advanceTableFilterInfobar });
    });

    clearAdvanceFilter.addEventListener('click', function () {
        trigger('clear/dropdown/filter', { data: advanceTableFilterActive });
        trigger('filters/show-selected-filters', { active: advanceTableFilterActive, infobar: advanceTableFilterInfobar });
    });

    clearAdvanceFilterInfobar.addEventListener('click', function () {
        trigger('clear/dropdown/filter', { data: advanceTableFilterActive });
        trigger('filters/show-selected-filters', { active: advanceTableFilterActive, infobar: advanceTableFilterInfobar });
    });
})();