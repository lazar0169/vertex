let datepicker = function () {
    // Initialize all date pickers
    function generate(data) {
        for (let picker of data.dropdownDate.getElementsByClassName('datepicker')) {
            let datePicker = new Pikaday({
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
                    return `${year}-${month}-${day}`;
                },
                setDefaultDate: true,
                defaultDate: new Date(),
            });

            picker.setToday = function () {
                datePicker.setDate(new Date());
            }
        }
    }
    return {
        generate
    }
}();