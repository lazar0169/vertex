let datepicker = function () {
    // Initialize all date pickers
    on('load', function () {

        //ToDo: razmisliti kako srediti ovo
        let ticketsAdvanceTableFiltersPrintDate = $$('#tickets-advance-table-filter-print-date');
        let ticketsAdvanceTableFiltersRedeemDate = $$('#tickets-advance-table-filter-redeem-date');
        let aftAdvanceTableFilterDateRange = $$('#aft-advance-table-filter-date-range');
        dropdownDate.generate(fixedDays, aftAdvanceTableFilterDateRange);
        dropdownDate.generate(fixedDays, ticketsAdvanceTableFiltersPrintDate);
        dropdownDate.generate(fixedDays, ticketsAdvanceTableFiltersRedeemDate);

        for (let picker of $$('.datepicker')) {
            new Pikaday({
                field: picker,
                firstDay: 1,
                minDate: new Date(2010, 1, 31),
                maxDate: new Date(),
                // yearRange: [2000, 2020],
                toString(date, format) {
                    // you should do formatting based on the passed format,
                    // but we will just return 'D.M.YYYY' for simplicity
                    const day = date.getDate();
                    const month = date.getMonth() + 1;
                    const year = date.getFullYear();
                    return `${day}.${month}.${year}`;
                },
                setDefaultDate: true,
                defaultDate: new Date(),
                onSelect: function () {
                    let dateArray = this.toString().split('.');
                    let apiString = `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`;
                    trigger(`set-date-datepicker`, { pickerId: picker.id, date: apiString });
                }
            });
            //set current date
            let dateArray = picker.value.toString().split('.');
            let apiString = `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`;
            trigger(`set-date-datepicker`, { pickerId: picker.id, date: apiString });
        }
    });

}();