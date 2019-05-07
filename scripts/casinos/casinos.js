let casino = (function () {
    let casinoChangeView = $$('#casino-display-change-view');
    let casinosAllCasinosContent = $$('#casinos-display-all-casinos-content');

    casinoChangeView.onclick = function () {
        console.log('promeni izgled')

        changeDisplayView();
    }

    function changeDisplayView() {

        casinosAllCasinosContent.classList.toggle('casino-display-grid-view-wrapper')
        for (let casino of casinosAllCasinosContent.children) {
            casino.classList.toggle('casino-display-table-view');
            casino.classList.toggle('casino-display-grid-view');
        }

    }

    // let testDataTableCasinos = [
    //     {
    //         "period": "4/1/2018",
    //         "totalBet": 1,
    //         "totalWin": 2
    //     },
    //     {
    //         "period": "4/2/2018",
    //         "totalBet": 1,
    //         "totalWin": 2
    //     },
    //     {
    //         "period": "4/3/2018",
    //         "totalBet": 1,
    //         "totalWin": 2
    //     },
    //     {
    //         "period": "4/4/2018",
    //         "totalBet": 11.6,
    //         "totalWin": 1.5
    //     },
    //     {
    //         "period": "4/5/2018",
    //         "totalBet": 1,
    //         "totalWin": 2
    //     },
    //     {
    //         "period": "4/6/2018",
    //         "totalBet": 1,
    //         "totalWin": 2
    //     },
    //     {
    //         "period": "4/7/2018",
    //         "totalBet": 1,
    //         "totalWin": 2
    //     },
    //     {
    //         "period": "4/8/2018",
    //         "totalBet": 1,
    //         "totalWin": 2
    //     },
    //     {
    //         "period": "4/8/2018",
    //         "totalBet": 1,
    //         "totalWin": 2
    //     },
    //     {
    //         "period": "4/8/2018",
    //         "totalBet": 1,
    //         "totalWin": 2
    //     },
    //     {
    //         "period": "4/8/2018",
    //         "totalBet": 1,
    //         "totalWin": 2
    //     },
    //     {
    //         "period": "4/8/2018",
    //         "totalBet": 1,
    //         "totalWin": 2
    //     }
    // ];
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

        console.log(params)
        $$('#casinos-display-all-casinos').appendChild(casinoDisplay.generateView('1'));

        $$('#casinos-display-all-casinos-content').appendChild(casinoDisplay.generateView('1'));

        $$('#casinos-display-all-casinos-content').appendChild(casinoDisplay.generateView('1'));

        $$('#casinos-display-all-casinos-content').appendChild(casinoDisplay.generateView('1'));

        $$('#casinos-display-all-casinos-content').appendChild(casinoDisplay.generateView('1'));

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