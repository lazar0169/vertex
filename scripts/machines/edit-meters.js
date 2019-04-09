let detailsBareditMeters = (function () {
    let enumMeters = {
        0: 'TotalIn',
        1: 'TotalOut',
        2: 'TotalBet',
        3: 'TotalWin',
        4: 'TotalJackpot',
        5: 'KeyIn',
        6: 'KeyOut',
        7: 'BillIn',
        8: 'RecyclerOut',
        9: 'CoinIn',
        10: 'HopperOut',
        11: 'TicketInCashable',
        12: 'TicketInPromo',
        13: 'TicketOutCashable',
        14: 'TicketOutPromo',
        15: 'RemoteInCashable',
        16: 'RemoteInPromo',
        17: 'RemoteOutCashable',
        18: 'RemoteOutPromo',
        19: 'GamesPlayed',
        20: 'GamesWin',
        21: 'DepositBox',
        22: 'TotalWinWithoutJP',
        23: 'TicketIn',
        24: 'TicketOut',
        25: 'RemoteIn',
        26: 'RemoteOut',
        27: 'CurrentCredits',
        28: 'Handpay',
        29: 'None',
        30: 'HandpayJp',
        31: 'AdminBonus',
        32: 'OtherBonus',
        33: 'CashDeskBonus'
    }

    let metersDetail = $$('#details-bar-edit-meters');
    let categories = $$('#details-bar-edit-meters').getElementsByClassName('opened-closed-wrapper');
    let saveMetersButton = $$('#details-edit-meters-save').children[0];

    for (let category of categories) {
        category.onclick = function () {

            for (let element of categories) {
                if (category === element) {
                    element.parentNode.children[1].classList.toggle('hidden')
                    trigger('opened-arrow', { div: category });
                }
                else {
                    element.parentNode.children[1].classList.add('hidden');
                    element.children[1].classList.remove('opened-arrow');
                }
            }
        }
    }

    on('machines/details-meters-edit', function (params) {
        let data = params.data.Data;
        let settings = {};
        settings.EndpointId = data.EndpointId;
        settings.Gmcid = data.Gmcid;
        settings.EventTime = data.EventTime;
        settings.MeterGroupId = data.MeterGroupId
        metersDetail.settings = settings;
        metersDetail.classList.remove('hidden');
        fillMeters(data.Values);
    });

    function fillMeters(data) {
        let allMeters = metersDetail.getElementsByClassName('form-input');

        for (let meter of allMeters) {
            validation.init(meter, {});
            if (meter.dataset.type === 'float') {
                currencyInput.generate(meter);
            }
        }

        for (let i = 0; i < data.length; i++) {
            for (let meter of allMeters) {
                if (meter.name === enumMeters[i]) {
                    meter.value = data[i]
                    meter.dataset.value = data[i]
                    if (meter.dataset.type === 'float') {
                        meter.value = formatFloatValue(meter.value / 100);
                    }
                    break;
                }
            }
        }
    }

    saveMetersButton.onclick = function () {
        let Values = getMetersValue();
        let data = {};
        let EntryData = metersDetail.settings
        EntryData.Values = Values;
        data.successAction = 'machines/details-meters-save';

        trigger(communication.events.machines.saveMachineMeters, { data, EntryData });
    }

    function getMetersValue() {
        let allMeters = metersDetail.getElementsByClassName('form-input');
        let values = [];

        for (let i in enumMeters) {
            for (let meter of allMeters) {
                if (meter.name === enumMeters[i]) {
                    values.push(meter.dataset.value)
                    break;
                }
            }
        }
        return values;
    }
})();