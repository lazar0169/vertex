let nekiniz6 = ['-', 'Column1', 'Column2', 'Column3', 'Column4', 'Column5'];
let fixedDays = ['-', 'Today', 'Yesterday', 'Last 7 Days', 'Last 14 Days', 'This Month', 'Last Month', 'Custom'];
let columnName = [{ Name: '-' }, { Name: 'Column1' }, { Name: 'Column2' }, { Name: 'Column3' }]
let machinesNumber = ['50', '25', '10', '5'];
let pictureName = ['Belgrade', 'New York', 'Surdulica', 'Nis'];
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
            City: 'Nis',
            checked: true
        },
        {
            Id: 26,
            Name: 'Kalca c',
            City: 'Nis',
            checked: true
        },
        {
            Id: 27,
            Name: 'Marger c',
            City: 'Surdulica',
            checked: true
        },
        {
            Id: 28,
            Name: 'Durlan c',
            City: 'Beograd',
            checked: true
        },
        {
            Id: 29,
            Name: 'Durlan',
            City: 'Nis',
            checked: true
        },
        {
            Id: 30,
            Name: 'Novi Beograd',
            City: 'Beograd',
            checked: true
        },
        {
            Id: 31,
            Name: 'Spin Surdulica',
            City: 'Surdulica',
            checked: true
        },
    ]
}
/*
let icons = ['poker-chip', 'currency-usd', 'ticket', 'bank', 'gamepad-variant', 'file-document', 'account', 'wrench'];
*/


let roleData = {
    "UserType": "1",
    "UserName": "Maja",
    "Password": "maja00",
    "ConfirmPassword": "maja00",
    "MainRole": "0",
    "RoleList": [
        {
            "MainRoleName": "Casino",
            "MainRoleEnabled": false,
            "MainRoleList": [
                {
                    "Name": "AllCasinos",
                    "Enabled": false
                },
                {
                    "Name": "Machines",
                    "Enabled": false
                },
                {
                    "Name": "Acceptors",
                    "Enabled": false
                },
                {
                    "Name": "ResetBillAcceptor",
                    "Enabled": false
                }
            ]
        },
        {
            "MainRoleName": "TITO",
            "MainRoleEnabled": true,
            "MainRoleList": [
                {
                    "Name": "PreviewTickets",
                    "Enabled": true
                },
                {
                    "Name": "SmsSettings",
                    "Enabled": false
                },
                {
                    "Name": "ApperanceSettings",
                    "Enabled": false
                },
                {
                    "Name": "MinMaxValueSettings",
                    "Enabled": true
                }
            ]
        },
        {
            "MainRoleName": "Jackpot",
            "MainRoleEnabled": false,
            "MainRoleList": [
                {
                    "Name": "PreviewJackpot",
                    "Enabled": false
                },
                {
                    "Name": "Edit",
                    "Enabled": false
                },
                {
                    "Name": "Delete",
                    "Enabled": false
                },
                {
                    "Name": "Add",
                    "Enabled": false
                },
                {
                    "Name": "History",
                    "Enabled": false
                },
                {
                    "Name": "Settings",
                    "Enabled": false
                },
                {
                    "Name": "Delete",
                    "Enabled": false
                },
                {
                    "Name": "Animation settings",
                    "Enabled": false
                },
            ]
        },
        {
            "MainRoleName": "AFT",
            "MainRoleEnabled": false,
            "MainRoleList": [
                {
                    "Name": "PreviewAft",
                    "Enabled": false
                },
                {
                    "Name": "EnableTransaction",
                    "Enabled": false
                },
                {
                    "Name": "NotificationSettings",
                    "Enabled": false
                }
            ]
        }

    ],
    "CasinoList": [{
        "Name": "Bolnica",
        "Enabled": true
    },
    {
        "Name": "Marger",
        "Enabled": true
    },
    {
        "Name": "Bulevar3",
        "Enabled": true
    },
    {
        "Name": "Tvrdjava",
        "Enabled": true
    }]
}
