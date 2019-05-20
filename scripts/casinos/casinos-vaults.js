let casinosVaults = (function () {

    let vaultsButton = $$('#casinos-all-casinos-buttons-wrapper').children[1];
    let casinosVaults = $$('#casinos-vaults-wrapper');
    let casinosAllCasinos = $$('#casinos-all-casinos-wrapper');
    let vaultsButtonBack = $$('#casinos-vaults-header-wrapper').children[0];
    let vaultsCashTransferButton = $$('#casinos-vaults-cash-transfer-button').children[0];
    let casinoCashTransferWrapper = $$('#casinos-cash-transfer-wrapper');
    let closeCasinoCashTransfer = $$('#casinos-valuts-close-cash-transfer');

    let cashTransferDetails = function () {
        return {
            hide: function () {
                casinoCashTransferWrapper.classList.add('collapse');
                blackArea.classList.remove('show');
            },
            show: function () {
                blackArea.classList.add('show');
                casinoCashTransferWrapper.classList.remove('collapse');
            }
        };
    }();


    vaultsCashTransferButton.onclick = function () {
        selectTab('casinos-vaults-tab-vault-to-vault');
        cashTransferDetails.show();
    }

    on('show/app', function () {
        casinoCashTransferWrapper.classList.add('collapse');
    });

    closeCasinoCashTransfer.onclick = function () {
        cashTransferDetails.hide();
    }


    vaultsButtonBack.onclick = function () {
        casinosVaults.classList.add('hidden');
        casinosAllCasinos.classList.remove('hidden');
    }

    vaultsButton.onclick = function () {
        let data = {};
        data.EndpointId = 0

        trigger(communication.events.casinos.getDepositBoxes, { data });

        console.log('obrati se serveru za podatke "GetDepositBoxes", prikazi podatke na stranici ');
        casinosAllCasinos.classList.add('hidden');
        casinosVaults.classList.remove('hidden');
    }

    function generateView(data) {
        let casinoDepositBoxDisplay = document.createElement('div');
        casinoDepositBoxDisplay.settings = data;
        casinoDepositBoxDisplay.classList.add('casino-vault-display-wrapper')

        casinoDepositBoxDisplay.innerHTML = `<div class="casino-vaults-casino-name">
                                                <div class="color-white">${data.Name}</div>
                                                <div>${data.CasinoList.join(', ')}</div>
                                            </div>
                                            <div class="center color-white casino-vaults-value">${formatFloatValue(data.Value)}</div>
                                            <div class="casino-vaults-history">history</div>`
        return casinoDepositBoxDisplay;
    }

    return {
        generateView
    }

})();