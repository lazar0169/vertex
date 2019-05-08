let casinoDisplay = (function () {

    function generateView(data) {
        let casinoWrapper = document.createElement('div');
        casinoWrapper.settings = data;
        casinoWrapper.classList.add('casino-display-table-view');

        // //---------------------Casino Name---------------------------//
        // let nameWrapper = document.createElement('div')
        // nameWrapper.classList.add('casino-display-name-wrapper');

        // let casinoDisplayStatus = document.createElement('div')
        // casinoDisplayStatus.classList.add('casino-display-status');
        // nameWrapper.appendChild(casinoDisplayStatus);

        // let casinoDisplayName = document.createElement('div');
        // casinoDisplayName.classList.add('casino-display-name')
        // casinoDisplayName.classList.add('color-white')
        // nameWrapper.appendChild(casinoDisplayName);

        // let casinoDisplayCity = document.createElement('div');
        // casinoDisplayCity.classList.add('casino-display-city');
        // nameWrapper.appendChild(casinoDisplayCity);
        // casinoWrapper.appendChild(nameWrapper);
        // //----------------------------------------------------------//


        // //-------------------Casino saldo----------------------------//
        // let casinoDisplaySaldoWrapper = document.createElement('div');
        // casinoDisplaySaldoWrapper.classList.add('casino-display-saldo-wrapper');
        // casinoDisplaySaldoWrapper.classList.add('center')
        // casinoWrapper.appendChild(casinoDisplaySaldoWrapper);
        // //----------------------------------------------------------//


        // //----------------Casino total in-------------------------//
        // let casinoDisplayTotalInWrapper = document.createElement('div');
        // casinoDisplayTotalInWrapper.classList.add('casino-display-total-in-wrapper');

        // let casinoDisplayTotalIn = document.createElement('div');
        // casinoDisplayTotalIn.classList.add('casino-display-total-in')
        // casinoDisplayTotalIn.classList.add('align-right')
        // casinoDisplayTotalInWrapper.appendChild(casinoDisplayTotalIn);

        // let casinoDisplayTotalInValue = document.createElement('div');
        // casinoDisplayTotalInValue.classList.add('casino-display-total-in-value');
        // casinoDisplayTotalInValue.classList.add('color-white');
        // casinoDisplayTotalInValue.classList.add('align-right');
        // casinoDisplayTotalInWrapper.appendChild(casinoDisplayTotalInValue);
        // casinoWrapper.appendChild(casinoDisplayTotalInWrapper);
        // //----------------------------------------------------------//

        // //----------------Casino total in cashdesk-------------------------//
        // let casinoDisplayTotalInCashdeskWrapper = document.createElement('div');
        // casinoDisplayTotalInCashdeskWrapper.classList.add('casino-display-total-in-cashdesk-wrapper');

        // let casinoDisplayTotalInCashdesk = document.createElement('div');
        // casinoDisplayTotalInCashdesk.classList.add('casino-display-total-in-cashdesk')
        // casinoDisplayTotalInCashdesk.classList.add('align-right')
        // casinoDisplayTotalInCashdeskWrapper.appendChild(casinoDisplayTotalInCashdesk);

        // let casinoDisplayTotalInCashdeskValue = document.createElement('div');
        // casinoDisplayTotalInCashdeskValue.classList.add('casino-display-total-in-cashdesk-value');
        // casinoDisplayTotalInCashdeskValue.classList.add('color-white');
        // casinoDisplayTotalInCashdeskValue.classList.add('align-right');
        // casinoDisplayTotalInCashdeskWrapper.appendChild(casinoDisplayTotalInCashdeskValue);
        // casinoWrapper.appendChild(casinoDisplayTotalInCashdeskWrapper);
        // //----------------------------------------------------------//

        // //----------------Casino bills-------------------------//
        // let casinoDisplayTotalInCashdeskWrapper = document.createElement('div');
        // casinoDisplayTotalInCashdeskWrapper.classList.add('casino-display-bills-wrapper');

        // let casinoDisplayTotalInCashdesk = document.createElement('div');
        // casinoDisplayTotalInCashdesk.classList.add('casino-display-bills')
        // casinoDisplayTotalInCashdesk.classList.add('align-right')
        // casinoDisplayTotalInCashdeskWrapper.appendChild(casinoDisplayTotalInCashdesk);

        // let casinoDisplayTotalInCashdeskValue = document.createElement('div');
        // casinoDisplayTotalInCashdeskValue.classList.add('casino-display-bills-value');
        // casinoDisplayTotalInCashdeskValue.classList.add('color-white');
        // casinoDisplayTotalInCashdeskValue.classList.add('align-right');
        // casinoDisplayTotalInCashdeskWrapper.appendChild(casinoDisplayTotalInCashdeskValue);
        // casinoWrapper.appendChild(casinoDisplayTotalInCashdeskWrapper);
        // //----------------------------------------------------------//

        // //----------------Casino total in cashdesk-------------------------//
        // let casinoDisplayLastColumn = document.createElement('div');
        // casinoDisplayLastColumn.classList.add('casino-display-last-column');

        // let casinoDisplayPlayersWrapper = document.createElement('div');
        // casinoDisplayPlayersWrapper.innerHTML = ``
        // //----------------------------------------------------------//

        if (data.Id === -1) {
            casinoWrapper.innerHTML = `<div class="casino-display-all-wrapper center element-multilanguage" data-translation-key="AllCasinos"> All Casinos
            
        </div>`
        }
        else {
            casinoWrapper.innerHTML = `<div class="casino-display-name-wrapper">
        <div class="casino-display-status"></div>
        <div class="casino-display-name color-white">${data.CasinoName}</div>
        <div class="casino-display-city">${data.City}</div>
        </div>`
        }

        casinoWrapper.innerHTML += `
        <div class="casino-display-saldo-wrapper center">${data.Saldo}</div>

        

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

            <div class="casino-display-details center element-multilanguage" data-translation-key="Details">details</div>
        </div>`
        return casinoWrapper
    }

    return {
        generateView
    }

})();