let timepicker = function () {
    // Initialize all date pickers
    on('load', function () {
        for (let picker of $$('.timepicker')) {
            dropdown.generate({ optionValue: hours, parent: picker });
            picker.appendChild(dropdown.generate({ optionValue: minutes }));
        }
    });
}();