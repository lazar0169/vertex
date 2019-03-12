const malfunctionsDetails = (function () {
    let closeMalfunctionsDetails = $$('#close-malfunction-details');
    const malfunctionsDetailsTableId = 'table-container-malfunctions-details';
    let malfunctionChangeStateButton = $$('#malfunction-details-change-state-button').children[0];
    let malfunctionSaveButton = $$('#malfunctions-details-save-button').children[0];
    let malfunctionMachineHistoryGeneralInfo = $$('#malfunctions-details-history').getElementsByClassName("malfunction-machine-general-info")[0];
    let malfunctionMachineChangeStateGeneralInfo = $$('#malfunctions-details-change-state').getElementsByClassName("malfunction-machine-general-info")[0];

    let malfunctionChangeState = $$('#malfunctions-details-change-state');

    let malfunctionsDetailsTable = null;

    on('malfunctions-details/machines-history', function (params) {
        malfunctionMachineHistoryGeneralInfo.children[0].className = '';
        malfunctionMachineHistoryGeneralInfo.children[0].classList.add('malfunction-details-info-flag');
        malfunctionMachineHistoryGeneralInfo.children[0].classList.add(`malfunction-details-info-flag-color-${params.EntryData.FlagList[0]}`);
        malfunctionMachineHistoryGeneralInfo.children[1].innerHTML = `${params.EntryData.Casino}, ${params.EntryData.Machine}, ${params.EntryData.Type}`;

        malfunctionMachineChangeStateGeneralInfo.children[0].className = '';
        malfunctionMachineChangeStateGeneralInfo.children[0].classList.add('malfunction-details-info-flag');
        malfunctionMachineChangeStateGeneralInfo.children[0].classList.add(`malfunction-details-info-flag-color-${params.EntryData.FlagList[0]}`);
        malfunctionMachineChangeStateGeneralInfo.children[1].innerHTML = `${params.EntryData.Casino}, ${params.EntryData.Machine}, ${params.EntryData.Type}`;

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
        let malfunctionsDetailsStatus = $$('#malfunction-details-change-status');
        let malfunctionsDetailsProblemType = $$('#malfunction-details-change-type');
        if (malfunctionsDetailsStatus.children[1]) {
            malfunctionsDetailsStatus.children[1].reset();
        }
        if (malfunctionsDetailsProblemType.children[1]) {
            malfunctionsDetailsProblemType.children[1].reset();
            malfunctionsDetailsProblemType.classList.add('hidden');
        }
        $$('#malfunction-details-textarea').children[0].value = '';

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
            EndpointId: 0,
            Id: parseInt($$('#malfunction-details-table').dataset.id),
            Status: parseInt($$("#malfunction-details-change-status").children[1].get()),
            ResolvedType: $$("#malfunction-details-change-type").children[1].get() === 'null' ? -1 : parseInt($$("#malfunction-details-change-type").children[1].get()),
            Description: $$('#malfunction-details-textarea').children[0].value
        }
        trigger(communication.events.malfunctions.changeMalfunctionState, { data })
    })
})();