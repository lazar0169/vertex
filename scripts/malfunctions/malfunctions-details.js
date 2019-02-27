const malfunctionsDetails = (function () {
    let closeMalfunctionsDetails = $$('#close-malfunction-details');

    on('malfunctions-details/machines-history', function (params) {
        on('show/app', function () {
            $$('#malfunctions-details').classList.add('collapse');

        });
        window.addEventListener('keyup', function (event) {
            if (event.keyCode == 27) {
                $$('#malfunctions-details').classList.add('collapse');
            }
        });
        closeMalfunctionsDetails.addEventListener('click', function () {
            trigger('show/app');

        });

        // let tableRow = params.target.parentNode.getElementsByClassName('hover');
        // console.log(tableRow)

    });


})();