let casinoDisplay = (function () {

    // function showingCasinoMachines() {
    //     console.log('radim')
    // }
    on('showingCasinoMachines', function (data) {
        let saldoDetails = data.getElementsByClassName('testProba')[0];
        saldoDetails.classList.remove('hidden');

    });

    on('hideCasinoMachines', function (data) {
        let saldoDetails = data.getElementsByClassName('testProba')[0];
        saldoDetails.classList.add('hidden');

    });

    on('showingCasinoDetails', function (data) {
        let casinoDetails = data.getElementsByClassName('casino-display-details-content')[0];
        casinoDetails.classList.remove('hidden');
    });

    on('hideCasinosDetails', function (data) {
        let casinoDetails = data.getElementsByClassName('casino-display-details-content')[0];
        casinoDetails.classList.add('hidden');
    });

    on('showingCasino', function (data) {
        console.log('kliknuo si na kazino:')
        console.log(data)
    });

    function generateView(data) {
        // let bestMachineList = data.BestMachineList;
        // let worstMachineList = data.WorstMachineList;
        let bestMachineList = [{ "masina1": 100 }, { "masina2": 200 }];
        let worstMachineList = [{ "masina1": 1000 }, { "masina2": 2000 }];
        let casinoWrapper = document.createElement('div');
        casinoWrapper.settings = data;
        casinoWrapper.classList.add('casino-display-table-view');

        if (data.Id === -1) {
            casinoWrapper.innerHTML = `<div class="casino-display-all-wrapper center element-multilanguage" data-translation-key="AllCasinos"> All Casinos
            
        </div>`
        }
        else {
            if (data.Status) {
                casinoWrapper.innerHTML = `<div class="casino-display-name-wrapper" onclick = "trigger('showingCasino', parentNode.settings)">
                <div class="casino-display-status casino-status-${data.Status}"></div>
                <div class="casino-display-name color-white">${data.CasinoName}</div>
                <div class="casino-display-city">${data.City}</div>
                </div>`
            }
            else {
                casinoWrapper.classList.add('casino-closed');
                casinoWrapper.innerHTML = `<div class="casino-display-name-wrapper">
                <div class="casino-display-status casino-status-${data.Status}"></div>
                <div class="casino-display-name">${data.CasinoName}</div>
                <div class="casino-display-city">${data.City}</div>
                </div>`

                casinoWrapper.innerHTML += `<div class="casino-display-saldo-wrapper center" onclick="">${formatFloatValue(data.Saldo)}</div>

                <div class="casino-display-total-in-wrapper">
                <div class="casino-display-total-in align-right element-multilanguage" data-translation-key="TotalIn">total in</div>
                <div class="casino-display-total-in-value align-right">${data.TotalIn}</div>
                </div>

                <div class="casino-display-total-in-cashdesk-wrapper">
                <div class="casino-display-total-in-cashdesk align-right element-multilanguage" data-translation-key="TotalInCashdesk">total in cashdesk</div>
                <div class="casino-display-total-in-cashdesk-value align-right">${data.CashDesk}</div>
                </div>
                
                <div class="casino-display-bills-wrapper">
                <div class="casino-display-bills align-right element-multilanguage" data-translation-key="Bills">bills</div>
                <div class="casino-display-bills-value align-right">${data.MoneyInBills}</div>
                </div>

                <div class="casino-display-last-column"> 
                    <div class="casino-display-players-wrapper casino-offline center">

                        <div class="color-red">OFFLINE</div>
                        <div>${formatTimeData(data.LastOnline)}</div>
                   
                    </div>

                    <div class="casino-display-warning center">!</div>

                    <div class="casino-display-details casino-closed center element-multilanguage" data-translation-key="Details">details</div>
                </div>`
                return casinoWrapper
            }
        }
        casinoWrapper.innerHTML += `
        <div class="casino-display-saldo-wrapper center">
            <div class="color-green center casino-display-saldo-value" onclick = "trigger('showingCasinoMachines', parentNode)">${formatFloatValue(data.Saldo)}</div>

            <div class="testProba hidden"  onmouseleave = "trigger('hideCasinoMachines', parentNode.parentNode)">
                
                <div class="casino-display-details-content-header">
                    <div class="color-white">${localization.translateMessage('Machines')}</div>
                    <div class="casino-display-details-close">
                        <a class="button-link element-multilanguage" data-translation-key="Close" onclick = "trigger('hideCasinoMachines', parentNode.parentNode.parentNode.parentNode)">Close</a>
                    </div>
                    <div class="casino-display-details-city">${data.CasinoName}</div>
                    <div class="color-green">${formatFloatValue(data.Saldo)}</div>
                </div>

                <div class="casino-display-machines-wrapper"></div>

            </div>
        
        </div>

                <div class="casino-display-total-in-wrapper">
                <div class="casino-display-total-in align-right element-multilanguage" data-translation-key="TotalIn">total in</div>
                <div class="casino-display-total-in-value color-white align-right">${data.TotalIn}</div>
                </div>

                <div class="casino-display-total-in-cashdesk-wrapper">
                <div class="casino-display-total-in-cashdesk align-right element-multilanguage" data-translation-key="TotalInCashdesk">total in cashdesk</div>
                <div class="casino-display-total-in-cashdesk-value color-white align-right">${data.CashDesk}</div>
                </div>
                
                <div class="casino-display-bills-wrapper">
                <div class="casino-display-bills align-right element-multilanguage" data-translation-key="Bills">bills</div>
                <div class="casino-display-bills-value color-white align-right">${data.MoneyInBills}</div>
                </div>

                <div class="casino-display-last-column"> 
                    <div class="casino-display-players-wrapper color-white center">
                    <div>&#9924;</div>
                    <div>${data.NumOfActiveMachines}/${data.NumOfMachines}</div>
                    </div>

                    <div class="casino-display-warning center color-white">!</div>

                    <div class="casino-display-details center element-multilanguage" data-translation-key="Details" onclick = "trigger('showingCasinoDetails', parentNode.parentNode)">details</div>

                    <div class='casino-display-details-content hidden'  onmouseleave = "trigger('hideCasinosDetails', parentNode.parentNode)">
                    
                    <div class="casino-display-details-content-header">
                        <div class="color-white">${data.CasinoName}</div>
                        <div class="casino-display-details-close">
                            <a class="button-link element-multilanguage" data-translation-key="Close" onclick = "trigger('hideCasinosDetails', parentNode.parentNode.parentNode.parentNode)">Close</a>
                        </div>
                        <div class="casino-display-details-city">${data.City}</div>
                        <div class="color-green">${formatFloatValue(data.Saldo)}</div>
                    </div>

                    <div class="border-bottom-casino-display-details">
                        <div class="element-multilanguage" data-translation-key="TotalIn">TotalIn</div>
                        <div>${formatFloatValue(data.TotalIn)}</div>
                    </div>
                    <div class="border-bottom-casino-display-details">
                        <div class="element-multilanguage" data-translation-key="TotalOut">TotalOut</div>
                        <div>${formatFloatValue(data.TotalOut)}</div>
                    </div>
                    <div class="border-bottom-casino-display-details">
                        <div class="element-multilanguage" data-translation-key="TotalInCashDesk">TotalInCashDesk</div>
                        <div>${formatFloatValue(data.CashDesk)}</div>
                    </div>
                    <div class="border-bottom-casino-display-details">
                        <div class="element-multilanguage" data-translation-key="CashableTickets">CashableTickets</div>
                        <div>${formatFloatValue(data.CashableTickets)}</div>
                    </div>
                    <div class="border-bottom-casino-display-details">
                        <div class="element-multilanguage" data-translation-key="MoneyInBill">MoneyInBill</div>
                        <div>${formatFloatValue(data.MoneyInBills)}</div>
                    </div>
                    <div class="border-bottom-casino-display-details">
                        <div class="element-multilanguage" data-translation-key="Deposit">Deposit</div>
                        <div>${formatFloatValue(data.Deposit)}</div>
                    </div>
                    <div class="border-bottom-casino-display-details">
                        <div class="element-multilanguage" data-translation-key="Vaults">Vaults</div>
                        <div>${formatFloatValue(data.Vaults)}</div>
                    </div>

                    <div class="casino-display-details-button">
                    <a class="button-link element-multilanguage" data-translation-key="FullDetails">Full details</a>
                    </div>


                    </div>
                </div>`
        return casinoWrapper
    }

    function generateMachinesDetails(data, casino) {
        console.log(data);
        console.log(casino);
        let object;
        object = Object.entries(data.BestMachineList);
        for (let array of Object.entries(data.WorstMachineList)) {
            object.push(array);
        }
        console.log(object)
        // let bestMachineList = data.BestMachineList;
        // let worstMachineList = data.WorstMachineList;
        let machinesWrapper = casino.getElementsByClassName('casino-display-machines-wrapper');

        for (let i = 0; i < object.length; i++) {

            let machine = document.createElement('div');
            machine.classList.add('border-bottom-casino-machines-details');
            machine.innerHTML = ` <div>${object[i][0]}</div>
            <div>${formatFloatValue(object[i][1])}</div>`
            machinesWrapper[0].appendChild(machine);
            if (i < object.length / 2) {
                machine.children[1].classList.add('color-green');
            } else {
                machine.children[1].classList.add('color-red');
            }
        }



    }



    return {
        generateView,
        generateMachinesDetails
    }

})();