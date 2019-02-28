let columnName = [{ Name: '-', Id: -1 },
{ Name: 'Column1', Id: 0 },
{ Name: 'Column2', Id: 1 },
{ Name: 'Column3', Id: 2 }];

let machinesNumber = [{ Name: '50', Id: 50 },
{ Name: '25', Id: 25 },
{ Name: '10', Id: 10 },
{ Name: '5', Id: 5 }];

let pictureName = [{ Name: 'Belgrade', Id: 0 },
{ Name: 'New York', Id: 1 },
{ Name: 'Surdulica', Id: 2 },
{ Name: 'Nis', Id: 3 }];

let machinesVendors = [{ Name: '-', Id: -1 },
{ Name: 'Fazi', Id: 6 },
{ Name: 'Admiral', Id: 5 },
{ Name: 'Favorit', Id: 3 }];

let machinesStatus = [{ Name: '-', Id: -1 },
{ Name: 'Online', Id: 6 },
{ Name: 'Offline', Id: 5 },
{ Name: 'Disabled', Id: 1 }];

let machinesType = [{ Name: '-', Id: -1 },
{ Name: 'Slot machine', Id: 5 },
{ Name: 'Rulet', Id: 6 }];

let dateFormatArray = [{ Name: 'dd.MM.yyyy.', Id: 0 },
{ Name: 'dd/MM/yyyy', Id: 1 },
{ Name: 'yyyy-MM-dd', Id: 2 },
{ Name: 'dd-MM-yyyy', Id: 3 },
{ Name: 'MM/dd/yyyy', Id: 4 }];

let timeFormatArray = [{ Name: 'hh:mm', Id: 0 },
{ Name: 'hh:mm:ss', Id: 1 },
{ Name: 'HH:mm', Id: 2 },
{ Name: 'HH:mm:ss', Id: 3 }
];

let machinesSerial = [{ Name: 'X00000', Id: 0 },
{ Name: 'X11111', Id: 1 },
{ Name: 'X22222', Id: 2 },
{ Name: 'X33333', Id: 3 }];

let hours = [{ Name: '-', Id: -1 },
{ Name: '00 h', Id: 0 },
{ Name: '01 h', Id: 1 },
{ Name: '02 h', Id: 2 },
{ Name: '03 h', Id: 3 },
{ Name: '04 h', Id: 4 },
{ Name: '05 h', Id: 5 },
{ Name: '06 h', Id: 6 },
{ Name: '07 h', Id: 7 },
{ Name: '08 h', Id: 8 },
{ Name: '09 h', Id: 9 },
{ Name: '10 h', Id: 10 },
{ Name: '11 h', Id: 11 },
{ Name: '12 h', Id: 12 },
{ Name: '13 h', Id: 13 },
{ Name: '14 h', Id: 14 },
{ Name: '15 h', Id: 15 },
{ Name: '16 h', Id: 16 },
{ Name: '17 h', Id: 17 },
{ Name: '18 h', Id: 18 },
{ Name: '19 h', Id: 19 },
{ Name: '20 h', Id: 20 },
{ Name: '21 h', Id: 21 },
{ Name: '22 h', Id: 22 },
{ Name: '23 h', Id: 23 }];

let minutes = [{ Name: '-', Id: -1 },
{ Name: '00 min', Id: 0 },
{ Name: '01 min', Id: 1 },
{ Name: '02 min', Id: 2 },
{ Name: '03 min', Id: 3 },
{ Name: '04 min', Id: 4 },
{ Name: '05 min', Id: 5 },
{ Name: '06 min', Id: 6 },
{ Name: '07 min', Id: 7 },
{ Name: '08 min', Id: 8 },
{ Name: '09 min', Id: 9 },
{ Name: '10 min', Id: 10 },
{ Name: '11 min', Id: 11 },
{ Name: '12 min', Id: 12 },
{ Name: '13 min', Id: 13 },
{ Name: '14 min', Id: 14 },
{ Name: '15 min', Id: 15 },
{ Name: '16 min', Id: 16 },
{ Name: '17 min', Id: 17 },
{ Name: '18 min', Id: 18 },
{ Name: '19 min', Id: 19 },
{ Name: '20 min', Id: 20 },
{ Name: '21 min', Id: 21 },
{ Name: '22 min', Id: 22 },
{ Name: '23 min', Id: 23 },
{ Name: '24 min', Id: 24 },
{ Name: '25 min', Id: 25 },
{ Name: '26 min', Id: 26 },
{ Name: '27 min', Id: 27 },
{ Name: '28 min', Id: 28 },
{ Name: '29 min', Id: 29 },
{ Name: '30 min', Id: 30 },
{ Name: '31 min', Id: 31 },
{ Name: '32 min', Id: 32 },
{ Name: '33 min', Id: 33 },
{ Name: '34 min', Id: 34 },
{ Name: '35 min', Id: 35 },
{ Name: '36 min', Id: 36 },
{ Name: '37 min', Id: 37 },
{ Name: '38 min', Id: 38 },
{ Name: '39 min', Id: 39 },
{ Name: '40 min', Id: 40 },
{ Name: '41 min', Id: 41 },
{ Name: '42 min', Id: 42 },
{ Name: '43 min', Id: 43 },
{ Name: '44 min', Id: 44 },
{ Name: '45 min', Id: 45 },
{ Name: '46 min', Id: 46 },
{ Name: '47 min', Id: 47 },
{ Name: '48 min', Id: 48 },
{ Name: '49 min', Id: 49 },
{ Name: '50 min', Id: 50 },
{ Name: '51 min', Id: 51 },
{ Name: '52 min', Id: 52 },
{ Name: '53 min', Id: 53 },
{ Name: '54 min', Id: 54 },
{ Name: '55 min', Id: 55 },
{ Name: '56 min', Id: 56 },
{ Name: '57 min', Id: 57 },
{ Name: '58 min', Id: 58 },
{ Name: '59 min', Id: 59 }];

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
