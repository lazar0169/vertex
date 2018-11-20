let nekiniz2 = ['-', 'Name1', 'Name2', 'Name3', 'Name4'];
let nekiniz3 = ['-', 'Jackpot1', 'Jackpot2', 'Jackpot3'];
let nekiniz4 = ['-', 'Type1', 'Type2', 'Type3', 'Type4', 'Type5'];
let nekiniz5 = ['-', 'Status1', 'Status2', 'Status3'];
let nekiniz6 = ['-', 'Column1', 'Column2', 'Column3', 'Column4', 'Column5'];
let nekiniz = ['-', 'Today', 'Yesterday', 'Last7Days', 'Last14Days', 'ThisMonth', 'LastMonth', 'CustomDate'];
let columnName = [{Name: '-'}, { Name: 'Column1' }, { Name: 'Column2' }, { Name: 'Column3' }]
let machinesNumber = ['50', '25', '10', '5'];
let machinesVendors = [{ Name: '-' }, { Name: 'Fazi' }, { Name: 'Admiral' }, { Name: 'Favorit' }];
let machinesStatus = [{ Name: '-' }, { Name: 'Online' }, { Name: 'Offline' }, { Name: 'Disabled' }];
let machinesType = [{ Name: '-' }, { Name: 'Slot machine' }, { Name: 'Rulet' }];
let machinesSerial = ['-', 'X00000', 'X11111', 'X22222', 'X33333'];
let hours = ['-', '00 h', '01 h', '02 h', '03 h', '04 h', '05 h', '06 h', '07 h', '08 h', '09 h', '10 h', '11 h', '12 h', '13 h', '14 h', '15 h', '16 h', '17 h', '18 h', '19 h', '20 h', '21 h', '22 h', '23 h'];
let minutes = ['-', '00 min', '01 min', '02 min', '03 min', '04 min', '05 min', '06 min', '07 min', '08 min', '09 min', '10 min', '11 min', '12 min', '13 min', '14 min', '15 min', '16 min', '17 min', '18 min', '19 min', '20 min', '21 min', '22 min', '23 min', '24 min', '25 min', '26 min', '27 min', '28 min', '29 min', '30 min', '31 min', '32 min', '33 min', '34 min', '35 min', '36 min', '37 min', '38 min', '39 min', '40 min', '41 min', '42 min', '43 min', '44 min', '45 min', '46 min', '47 min', '48 min', '49 min', '50 min', '51 min', '52 min', '53 min', '54 min', '55 min', '56 min', '57 min', '58 min', '59 min'];

let casinoData = {
    List: 'Casino',
    Value: [
        {
            Id: 25,
            Name: 'Bolnica c',
            City: 'Nis'
        },
        {
            Id: 26,
            Name: 'Kalca c',
            City: 'Nis'
        },
        {
            Id: 27,
            Name: 'Marger c',
            City: 'Surdulica'
        },
        {
            Id: 28,
            Name: 'Durlan c',
            City: 'Beograd'
        },
        {
            Id: 29,
            Name: 'Durlan',
            City: 'Nis'
        },
        {
            Id: 30,
            Name: 'Novi Beograd',
            City: 'Beograd'
        },
        {
            Id: 31,
            Name: 'Spin Surdulica',
            City: 'Surdulica'
        },
    ]
}
/*
let icons = ['poker-chip', 'currency-usd', 'ticket', 'bank', 'gamepad-variant', 'file-document', 'account', 'wrench'];
*/
//test
$$('#aft-add-transaction').children[0].addEventListener('click', function () {
    //test for translation
    trigger('translate-language');
})
on('translate-language', function () {
    for (let translate of $$('.for-translate')) {
        translate.innerHTML = localization.translateMessage(translate.dataset.translationKey);
        translate.title = translate.innerHTML;
    }
});