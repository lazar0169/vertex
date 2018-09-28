const aftTabContent = (function () {
    let aftNotificationEmail = $$('#aft-notification-send-email');
    let aftAnotherEmail = $$('#aft-notification-another-email');
    let aftNotificationMobile = $$('#aft-notification-send-mobile');
    let aftAnotherMobile = $$('#aft-notification-another-phone');
    let emailCounter = 0;
    let mobileCounter = 0;


    aftAnotherMobile.addEventListener('click', function () {

        let temp = document.createElement('input');
        temp.placeholder = "Your another mobile number";
        temp.classList = "form-input";
        aftNotificationMobile.insertBefore(temp, aftNotificationMobile.childNodes[2 + mobileCounter]);
        mobileCounter++;
    });

    aftAnotherEmail.addEventListener('click', function () {

        let temp = document.createElement('input');
        temp.placeholder = "Your another email address";
        temp.classList = "form-input";
        aftNotificationEmail.insertBefore(temp, aftNotificationEmail.childNodes[2 + emailCounter]);
        emailCounter++;
    });
})();