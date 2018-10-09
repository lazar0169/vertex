const clearFilterDropdown = (function () {
    function clearAllDropdown(div) {
        for (let element of div.getElementsByClassName('default-select')) {
            element.children[0].innerHTML = '-';
            element.children[0].title = element.children[0].innerHTML;
            element.children[0].dataset.items = JSON.stringify(element.children[0].innerHTML);
            if (element.children[1].classList.contains('multiple-group')) {
                for (let check of element.children[1].children) {
                    check.children[0].children[0].checked = false;
                }
            }
        }
    }

    on('clear/dropdown/filter', function(data){
        clearAllDropdown(data.data)
    });
})();