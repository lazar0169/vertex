let casino = (function () {
    let casinoChangeView = $$('#casino-display-change-view');
    let casinosAllCasinosContent = $$('#casinos-display-all-casinos-content');
    let searchCasino = $$('#casinos-search-casino').children[0];

    casinoChangeView.onclick = function () {
        changeDisplayView();
    }

    function changeDisplayView() {
        casinosAllCasinosContent.classList.toggle('casino-display-grid-view-wrapper')
        for (let casino of casinosAllCasinosContent.children) {
            casino.classList.toggle('casino-display-table-view');
            casino.classList.toggle('casino-display-grid-view');
        }
    }

    function removeChildren(div) {
        while (div.children.length > 0) {
            div.children[0].remove();
        }
    }

    function findCasino(termin, data) {
        let searchTermin = termin.toLowerCase()
        removeChildren(casinosAllCasinosContent);
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
        previewAllCasinos: 'casinos/preview'
    };

    on(events.activated, function (params) {
        selectTab('casinos-tab-current-shift');
        let casinoId = params.params[0].value;
        trigger(communication.events.casinos.getAllCasinos, { data: { EndpointId: casinoId, Filter: 6 } });
    });

    on(events.getAllCasinos, function (params) {

        casinosAllCasinosContent.classList.remove('casino-display-grid-view-wrapper')
        let casinoDataList = params.data.CasinoDataList;
        let allCasinos = $$('#casinos-display-all-casinos');

        searchCasino.addEventListener('keyup', function (event) {
            findCasino($$('#casinos-search-casino').children[0].value, casinoDataList)
        });

        removeChildren(allCasinos);
        removeChildren(casinosAllCasinosContent);

        for (let data of casinoDataList) {
            if (data.Id === -1) {
                $$('#casinos-display-all-casinos').appendChild(casinoDisplay.generateView(data));
            } else {
                $$('#casinos-display-all-casinos-content').appendChild(casinoDisplay.generateView(data));
            }
        }
        trigger('preloader/hide');
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


    on(communication.events.casinos.getAllCasinos, function (params) {
        trigger('preloader/show');
        let route = communication.apiRoutes.casinos.getAllCasinos;
        let request = communication.requestTypes.post;
        let data = params.data
        let successEvent = events.getAllCasinos;
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