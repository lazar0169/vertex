const malfunctionsDetails = (function () {

    on('malfunctions-details/machines-history', function (params) {

        let tableRow = params.target.parentNode.getElementsByClassName('hover');
        console.log(tableRow)

    });


})();