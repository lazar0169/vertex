const malfunctionsDetails = (function () {
    let closeMalfunctionsDetails = $$('#close-malfunction-details');
    const malfunctionsDetailsTableId = 'table-container-malfunctions-details';
    let malfunctionChangeStateButton = $$('#malfunction-details-change-state-button').children[0];
    let malfunctionSaveButton = $$('#malfunctions-details-save-button').children[0];




    let malfunctionChangeState = $$('#malfunctions-details-change-state');

    let malfunctionsDetailsTable = null;

    on('malfunctions-details/machines-history', function (params) {
        console.log(params)
        $$('#malfunction-details-table').dataset.endpointId = params.Properties.EndpointId;
        $$('#malfunction-details-table').dataset.id = params.Properties.Id;
        if (malfunctionsDetailsTable !== null) {
            malfunctionsDetailsTable.destroy();
        }
        malfunctionsDetailsTable = table.init({
            id: malfunctionsDetailsTableId,
        },
            { Items: params.Properties.ReportList });
        $$('#malfunction-details-table').appendChild(malfunctionsDetailsTable);
    });

    on('show/app', function () {
        $$('#malfunctions-details').classList.add('collapse');
        malfunctionChangeState.classList.add('hidden');

    });

    window.addEventListener('keyup', function (event) {
        if (event.keyCode == 27) {
            $$('#malfunctions-details').classList.add('collapse');
            malfunctionChangeState.classList.add('hidden');
        }
    });

    closeMalfunctionsDetails.addEventListener('click', function () {
        trigger('show/app');
        malfunctionChangeState.classList.add('hidden');

    });
    malfunctionChangeStateButton.addEventListener('click', function () {
        malfunctionChangeState.classList.remove('hidden');
    });

    malfunctionSaveButton.addEventListener('click', function () {
        let data = {
            EndpointId: parseInt($$('#malfunction-details-table').dataset.endpointId),
            Id: parseInt($$('#malfunction-details-table').dataset.id),
            Status: $$("#malfunction-details-change-status").children[1].get(),
            Type: $$("#malfunction-details-change-type").children[1].get() ,
            Description: $$('#malfunction-details-textarea').children[0].value
        }

        console.log(
            data
        )
        trigger(communication.events.malfunctions.changeMalfunctionState, { data })
    })
})();