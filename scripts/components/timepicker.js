let timepicker = function () {
    // Initialize all date pickers
    on('load', function () {
        for (let picker of $$('.timepicker')) {
            dropdownNew.generateNew({ optionValue: hours, element: picker });
            // dropdownNew.generateNew({ optionValue: minutes, element: picker })
            // picker.appendChild(dropdown.generate(hours));
            picker.appendChild(dropdownNew.generateNew({ optionValue: minutes }));
        }
    });
}();