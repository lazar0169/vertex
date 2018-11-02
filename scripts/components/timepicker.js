let timepicker = function () {
    // Initialize all date pickers
    on('load', function () {
        for (let picker of $$('.timepicker')) {

            picker.appendChild(dropdown.generate(hour));
            picker.appendChild(dropdown.generate(minutes));
        }
    });

}();