

let aftAddTransactions = (function () {

    let promo = $$('#add-transaction-promo');
    let cashable = $$('#add-transaction-cashable');
    let expiration = $$('#add-transaction-expiration');
    let addTransaction = $$('#add-transaction-save-button').children[0];
    function initInputByFilter(dropdown) {
        initInputByFilter(dropdown.children[0].dataset.value)
        for (let option of dropdown.children[1].children) {
            option.addEventListener('click', function () {
                initInputByFilter(option.dataset.value)
            })
        }
        function initInputByFilter(data) {
            switch (data) {
                case 'BonusWinHostToMachine':
                    promo.classList.add('hidden');
                    cashable.classList.remove('hidden');
                    expiration.classList.add('hidden');
                    break;
                case 'InHouseHostToMachine':
                    promo.classList.remove('hidden');
                    cashable.classList.remove('hidden');
                    expiration.classList.remove('hidden');
                    break;
                case 'InHouseMachineToHost':
                    promo.classList.add('hidden');
                    cashable.classList.add('hidden');
                    expiration.classList.add('hidden');
                    break;


            }
        }
    }

    addTransaction.addEventListener('click', function () {
        let data = {}
        let form = addTransaction.parentNode.parentNode;
        let inputs = form.getElementsByClassName('element-form-data');
        for (let input of inputs) {
            if (!input.parentNode.classList.contains('hidden')) {
                if (input.dataset.type === 'single-select') {
                    data[input.children[0].dataset.name] = parseInt(input.children[0].dataset.id);
                    data['MachineName'] = input.children[0].dataset.value;
                }
                else if (input.name === 'EndpointId') {
                    data[input.name] = parseInt(input.dataset.value);
                }
                else {
                    data[input.name] = input.value === "" ? 0 : input.dataset.value;
                }
            }
            else {
                data[input.name] = input.name === 'ExpirationInDays' ? 30 : 0;
            }
        }
        data['EndpointName'] = JSON.parse(sessionStorage.categoryAndLink).server

        trigger(communication.events.aft.transactions.addTransaction, { data: data })
        console.log(data)
    });

    on('aft/aft-add-transaction', function (params) {
        initInputByFilter(params.dropdown)
    });

    on('aft/add-transaction-success', function (params) {
        $$('#black-area').classList.remove('show');
        $$('#add-transaction-wrapper').classList.add('hidden');
        trigger('notifications/show', {
            message: localization.translateMessage(params.data.MessageCode),
            type: params.data.MessageType,
        });

        aftFilters.clearAftFilters();



    });
})();