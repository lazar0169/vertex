let casino = (function () {
    // let casinoChangeView = $$('#casino-display-change-view');
    let casinosAllCasinosContent = $$('#casinos-display-all-casinos-content');
    let searchCasino = $$('#casinos-search-casino');
    let searchCasinoButton = $$('#casinos-search-casino-button');
    let casinoSortOrder = $$('.casino-sort')
    let casinoFilterWrapper = $$('#casino-display-filter-wrapper').children[0].children[1];
    let activeShift = $$('#casinos-tabs-wrapper').getElementsByClassName('tab-active');
    let casinoDepositBoxWrapper = $$('#casinos-vaults-display-wrapper');


    for (let sort of casinoSortOrder) {
        sort.onclick = function () {
            removeActiveFilter();

            sort.classList.add('color-white');
            sort.classList.add('sort-active');

            sort.parentNode.dataset.id = sort.dataset.id;

            let data = {};
            data.EndpointId = casinosAllCasinosContent.settings.EndpointId;
            data.Filter = parseInt(activeShift[0].dataset.id);
            //uslov zbog imena sortiranje A-Z, ili po vrednosti vrednost prve celije > od vrednosti druge celije
            if (parseInt(sort.parentNode.dataset.id) === 1) {
                data.SortOrder = 1;
            } else {
                data.SortOrder = 2;
            }
            data.SortName = parseInt(sort.parentNode.dataset.id);

            trigger(communication.events.casinos.previewAllCasinos, { data });
        }
    }

    searchCasinoButton.onclick = function () {
        searchCasino.classList.remove('hidden');
        searchCasino.children[0].focus();
    }

    //------------ ne brisi mozda ostaje, sluzi za menjanje tabelarnog prikaza u grid prikaz -------------------//
    // casinoChangeView.onclick = function () {
    //     changeDisplayView();
    // }

    // function changeDisplayView() {
    //     casinosAllCasinosContent.classList.toggle('casino-display-grid-view-wrapper')
    //     for (let casino of casinosAllCasinosContent.children) {
    //         casino.classList.toggle('casino-display-table-view');
    //         casino.classList.toggle('casino-display-grid-view');
    //     }
    // }
    //-----------------------------------------------------------------//
    // function removeChildren(div) {
    //     while (div.children.length > 0) {
    //         div.children[0].remove();
    //     }
    // }

    function findCasino(termin, data) {
        let searchTermin = termin.toLowerCase()
        removeAllChildren(casinosAllCasinosContent);
        for (let value of data) {
            if (value.Id !== -1) {
                let valueName = value.CasinoName.toLowerCase();
                let valueCity = value.City.toLowerCase();
                let index = valueName.indexOf(searchTermin);
                let index1 = valueName.indexOf(` ${searchTermin}`);
                let index2 = valueCity.indexOf(searchTermin);
                let index3 = valueCity.indexOf(` ${searchTermin}`)
                if (index === 0 ||
                    index1 !== -1 ||
                    index2 === 0 ||
                    index3 !== -1) {
                    casinosAllCasinosContent.appendChild(casinoDisplay.generateView(value))
                }
            }
        }
        if (casinosAllCasinosContent.children.length === 0) {
            casinosAllCasinosContent.innerHTML = `<div class="color-white">Ne postoji podatak</div>`
        }
    }

    const events = {
        activated: 'casinos/activated',
        getAllCasinos: 'casinos/get',
        previewAllCasinos: 'casinos/preview',
        getDepositBoxes: 'casinos/get-deposit-boxes'
    };
    function removeActiveFilter() {
        for (let sort of casinoSortOrder) {
            sort.classList.remove('color-white');
            sort.classList.remove('sort-active');
        }
    }

    //------------------- smene u kazinu -------------------//
    on('casinos/casino-tab', function (params) {

        let urlArray = window.location.pathname.split("/");
        let endpointId = urlArray[2];
        casinoFilterWrapper.dataset.id = 1;
        removeActiveFilter();

        casinoFilterWrapper.children[0].classList.add('color-white');
        casinoFilterWrapper.children[0].classList.add('sort-active');

        let data = {};
        data.EndpointId = parseInt(endpointId);
        data.Filter = parseInt(activeShift[0].dataset.id);
        data.SortName = 1;
        data.SortOrder = 1;

        trigger(communication.events.casinos.previewAllCasinos, { data });
    });
    //------------------------------------------------------//

    on(events.activated, function (params) {
        $$('#casinos-vaults-wrapper').classList.add('hidden');
        $$('#casinos-all-casinos-wrapper').classList.remove('hidden');
        selectTab('casinos-tab-current-shift');
        // let casinoId = params.params[0].value;
        // trigger(communication.events.casinos.previewAllCasinos, { data: { EndpointId: casinoId, Filter: 6, SortOrder: 1, SortName: 1 } });
    });
    //getAllCasinos ne mora da postoji posto se odma sortira po imenu kazina i potrebno je poslati SortName 1
    // on(events.getAllCasinos, function (params) {

    //     let casinoDataList = params.data.CasinoDataList;
    //     let allCasinos = $$('#casinos-display-all-casinos');
    //     casinosAllCasinosContent.settings = params.data;

    //     searchCasino.children[0].addEventListener('keyup', function (event) {
    //         findCasino(searchCasino.children[0].value, casinoDataList)
    //     });

    //     removeChildren(allCasinos);
    //     removeChildren(casinosAllCasinosContent);

    //     for (let data of casinoDataList) {
    //         if (data.Id === -1) {
    //             $$('#casinos-display-all-casinos').appendChild(casinoDisplay.generateView(data));
    //         } else {
    //             casinosAllCasinosContent.appendChild(casinoDisplay.generateView(data));
    //         }
    //     }
    //     trigger('preloader/hide');
    // });
    on(events.previewAllCasinos, function (params) {

        let casinoDataList = params.data.CasinoDataList;
        let allCasinos = $$('#casinos-display-all-casinos');
        casinosAllCasinosContent.settings = params.data;

        searchCasino.children[0].addEventListener('keyup', function (event) {
            findCasino(searchCasino.children[0].value, casinoDataList)
        });

        removeAllChildren(allCasinos);
        removeAllChildren(casinosAllCasinosContent);

        for (let data of casinoDataList) {
            if (data.Id === -1) {
                $$('#casinos-display-all-casinos').appendChild(casinoDisplay.generateView(data));
            } else {
                casinosAllCasinosContent.appendChild(casinoDisplay.generateView(data));
            }
        }
    });

    on(events.getDepositBoxes, function (params) {
        console.log(params);
        let depositBoxes = params.data.DepositBoxes;
        let depositBoxtransferList = params.data.DepositBoxTransferList;
        let depositBoxCashDesks = params.data.DepositBoxCashDesks;
        removeAllChildren(casinoDepositBoxWrapper);
        for (let box of depositBoxes) {
            casinoDepositBoxWrapper.appendChild(casinosVaults.generateView(box));
        }

        //--------------------- vault to vault -------------------//
        let cashTransferFrom = $$('#casino-cash-transfer-vault-to-vault-from')
        dropdown.generate({ values: depositBoxtransferList, parent: cashTransferFrom });

        let cashTransferTo = $$('#casino-cash-transfer-vault-to-vault-to')
        dropdown.generate({ values: depositBoxtransferList, parent: cashTransferTo });
        //---------------------------------------------------------//

        //--------------------- vault to/from cashdesk -------------------//
        let cashTransferVaultToCashdeskFrom = $$('#casino-cash-transfer-vault-to-from-cashdesk-from')
        dropdown.generate({ values: depositBoxtransferList, parent: cashTransferVaultToCashdeskFrom });

        let cashTransferVaultCashdeskTo = $$('#casino-cash-transfer-vault-to-from-cashdesk-to')
        dropdown.generate({ values: depositBoxCashDesks[cashTransferVaultToCashdeskFrom.children[1].get()], parent: cashTransferVaultCashdeskTo });
        //--------------------------------------------------------------//
        //------------------- other transfer from ----------------------//
        let cashTransferOtherTransferFrom = $$('#casino-cash-transfer-other-transfer-vault-from');
        dropdown.generate({ values: depositBoxtransferList, parent: cashTransferOtherTransferFrom });

        //-------------------------------------------------------------//
    });


    on('casinos/add', function (e) {
        let model = e.model;
        trigger('template/render', {
            model: model,
            templateElementSelector: "#casino-template",
            callbackEvent: 'casino/load'
        });
    });

    on('casino/load', function (e) {
        let element = e.element;
        //Multiple ways to place HTML element inside HTML document:
        //$$('.casino-list')[0].innerHTML = element.innerHTML;
        $$('.casino-list')[0].appendChild(element);
    });

    on('casino/display-casino-info/', function (e) {

    });

    on('casino/display-casino-info/error', function (e) {
        data = e.data;
        alert('An error occured.');
    });

    // on(communication.events.casinos.getAllCasinos, function (params) {
    //     trigger('preloader/show');
    //     let route = communication.apiRoutes.casinos.getAllCasinos;
    //     let request = communication.requestTypes.post;
    //     let data = params.data
    //     let successEvent = events.getAllCasinos;
    //     let errorEvent = '';
    //     trigger('communicate/createAndSendXhr', {
    //         route: route,
    //         requestType: request,
    //         data: data,
    //         additionalData: params.data.EndpointId,
    //         successEvent: successEvent,
    //         errorEvent: errorEvent
    //     });
    // });
    //preview casinos
    on(communication.events.casinos.previewAllCasinos, function (params) {
        let route = communication.apiRoutes.casinos.previewAllCasinos;
        let request = communication.requestTypes.post;
        let data = params.data
        let successEvent = events.previewAllCasinos;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            requestType: request,
            data: data,
            additionalData: params.data.EndpointId,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //casinos GetDepositBoxes
    on(communication.events.casinos.getDepositBoxes, function (params) {
        let route = communication.apiRoutes.casinos.getDepositBoxes;
        let request = communication.requestTypes.post;
        let data = params.data;
        let successEvent = events.getDepositBoxes;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            requestType: request,
            data: data,
            additionalData: params.data.EndpointId,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

})();