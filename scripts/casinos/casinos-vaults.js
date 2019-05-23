let casinosVaults = (function () {

    let vaultsButton = $$('#casinos-all-casinos-buttons-wrapper').children[1];
    let casinosVaults = $$('#casinos-vaults-wrapper');
    let casinosAllCasinos = $$('#casinos-all-casinos-wrapper');
    let vaultsButtonBack = $$('#casinos-vaults-header-wrapper').children[0];
    let vaultsCashTransferButton = $$('#casinos-vaults-cash-transfer-button').children[0];
    let casinoCashTransferWrapper = $$('#casinos-cash-transfer-wrapper');
    let closeCasinoCashTransfer = $$('#casinos-vaults-close-cash-transfer');
    let swapCashTransferPosition = $$('#swap-cash-transfer-position');

    let vaultToVaultTransferButton = $$('#casino-cash-transfer-vault-to-vault-button-wrapper').children[0];
    let cashTransferValutFrom = $$('#casino-cash-transfer-vault-to-vault-from');
    let cashTransferValutTo = $$('#casino-cash-transfer-vault-to-vault-to');
    let valutToValutDescription = $$('#casinos-cash-transfer-vault-to-vault-textarea').children[0];

    let vaultToFromCashdeskButton = $$('#casino-cash-transfer-vault-to-from-cashdesk-button-wrapper').children[0];
    let cashTransferVaultCashdeskFrom = $$('#casino-cash-transfer-vault-to-from-cashdesk-from');
    let cashTransferVaultCashdeskTo = $$('#casino-cash-transfer-vault-to-from-cashdesk-to');
    let valutToFromCashdeskDescription = $$('#casino-cash-transfer-vault-to-from-cashdesk-textarea').children[0];

    let vaultOthertransferButton = $$('#casino-cash-transfer-other-transfer-wrapper').children[0];
    let cashTransferOtherTransferFrom = $$('#casino-cash-transfer-other-transfer-vault-from');
    let vaultOtherTransferDescription = $$('#casino-cash-transfer-other-transfer-textarea').children[0];

    let inputVaultToVaultValue = $$('#casino-cash-transfer-vault-to-vault-value');
    validation.init(inputVaultToVaultValue, {});
    currencyInput.generate(inputVaultToVaultValue, {});

    let inputVaulToFromCashdesk = $$('#casino-cash-transfer-vault-to-from-cashdesk-value');
    validation.init(inputVaulToFromCashdesk, {});
    currencyInput.generate(inputVaulToFromCashdesk, {});

    let inputOtherTransferValue = $$('#casino-cash-transfer-other-transfer-value');
    validation.init(inputOtherTransferValue, {});
    currencyInput.generate(inputOtherTransferValue, {});

    vaultToVaultTransferButton.onclick = function () {
        let data = {}
        data.EndpointId = 0;
        data.FromId = parseInt(cashTransferValutFrom.children[1].get());
        data.ToId = parseInt(cashTransferValutTo.children[1].get());
        data.Money = parseInt(inputVaultToVaultValue.dataset.value);
        data.DepositBoxId = parseInt(cashTransferValutFrom.children[1].get());
        data.Description = valutToValutDescription.value;
        console.log(data);
        trigger(communication.events.casinos.vaultToVaultTransfer, { data });
    }

    vaultToFromCashdeskButton.onclick = function () {
        let data = {}
        data.EndpointId = 0;
        data.Money = parseInt(inputVaulToFromCashdesk.dataset.value);
        data.Description = valutToFromCashdeskDescription.value;
        data.FromId = parseInt(cashTransferVaultCashdeskFrom.children[1].get());
        data.ToId = parseInt(cashTransferVaultCashdeskTo.children[1].get());
        data.DepositBoxId = parseInt(cashTransferVaultCashdeskFrom.children[1].get());

        if (isSwapedActive()) {
            data.Type = 0;
        } else {
            data.Type = 1;
        }

        console.log(data);
        trigger(communication.events.casinos.moveToFromCashdesk, { data });
    }

    vaultOthertransferButton.onclick = function () {
        let data = {}
        data.EndpointId = 0;
        data.Money = parseInt(inputVaulToFromCashdesk.dataset.value);
        data.DepositBoxId = parseInt(cashTransferOtherTransferFrom.children[1].get());
        data.Description = vaultOtherTransferDescription.value;
        console.log(data);
        trigger(communication.events.casinos.changeDepositBox, { data });
    }

    function generateDropdownToByFrom(dd) {
        for (let option of dd.children[1].children) {
            option.addEventListener('click', function () {
                if (isSwapedActive()) {
                    cashTransferVaultCashdeskFrom.children[1].remove()
                    dropdown.generate({ values: casinoCashTransferWrapper.settings.DepositBoxCashDesks[dd.get()], parent: cashTransferVaultCashdeskFrom });
                } else {
                    cashTransferVaultCashdeskTo.children[1].remove();
                    dropdown.generate({ values: casinoCashTransferWrapper.settings.DepositBoxCashDesks[dd.get()], parent: cashTransferVaultCashdeskTo });
                }
            });
        }
    }

    function isSwapedActive() {
        if (swapCashTransferPosition.classList.contains('swaped-active')) {
            return true
        }
        return false;
    }
    on('casinos/vault-cashdesk-dropdown', function (data) {
        generateDropdownToByFrom(data.dropdown)
    });

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

    swapCashTransferPosition.onclick = function () {
        swapCashTransferPosition.classList.toggle('color-white');
        swapCashTransferPosition.classList.toggle('swaped-active');

        let nextElement = swapCashTransferPosition.nextElementSibling.children[1];
        let prevElement = swapCashTransferPosition.previousElementSibling.children[1];

        swapCashTransferPosition.nextElementSibling.appendChild(prevElement);
        swapCashTransferPosition.previousElementSibling.appendChild(nextElement);
    }

    vaultsCashTransferButton.onclick = function () {
        selectTab('casinos-vaults-tab-vault-to-vault');
        selectInfoContent('casinos-vaults-tab-vault-to-vault');
        // remove active class form swap button
        swapCashTransferPosition.classList.remove('color-white');
        swapCashTransferPosition.classList.remove('swaped-active');
        // reset input and text area values
        inputVaultToVaultValue.value = formatFloatValue('0');
        inputVaulToFromCashdesk.value = formatFloatValue('0');
        inputOtherTransferValue.value = formatFloatValue('0');

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
    // ne treba mi jer imam funkcije selectTab i selectInfoContent koje se mogu iskoristiti
    // on('casinos/cash-transfer-vault-to-vault', function () {
    //     console.log('vault to vault');
    // });

    // on('casinos/cash-transfer-vault-to-from-cashdesk', function () {
    //     console.log('vault to from');
    // });

    // on('casinos/cash-transfer-other-transfer', function () {
    //     console.log('other');
    // });

    // on('casinos/cash-transfer-tab', function () {
    //     let aktivniTab = $$('#casinos-vaults-tabs-wrapper').getElementsByClassName('tab-active');
    //     console.log(aktivniTab)
    // });
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
    window.addEventListener('keyup', function (event) {
        if (event.keyCode == 27) {
            cashTransferDetails.hide();
        }
    });

    return {
        generateView
    }

})();