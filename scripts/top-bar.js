let topBar = (function () {
    let topBarPath = $$('#top-bar').children[0];
    let openUserProfile = $$('#top-bar-logout-user');
    let userProfile = $$('#user-profile');
    let previousTopBar;

    if (sessionStorage.token) {
        openUserProfile.innerHTML = decodeToken(sessionStorage.token).preferred_username;
    }
    function showTopBar(value) {
        if (value.category && value.casino) {
            topBarPath.children[1].innerHTML = `${value.category}/${value.casino}`;
        }
        else {
            topBarPath.children[1].innerHTML = `${value.category}`;
        }
        let currentTopBar = $$(`#top-bar-${value.category.toLowerCase()}`);
        if (previousTopBar) {
            previousTopBar.classList.add('hidden');
        }
        if (currentTopBar) {
            currentTopBar.classList.remove('hidden');
            previousTopBar = currentTopBar;
        }
    }
    function showProfile() {
        $$('#black-area').classList.add('show');
        userProfile.classList.toggle('hidden');
    }
    openUserProfile.addEventListener('click', function () {
        showProfile();
    });

    function topBarInfoBoxValue(data) {

        let categoryAndLink = JSON.parse(sessionStorage.categoryAndLink);
        if ($$(`#top-bar-${categoryAndLink.category.toLowerCase()}`)) {

            switch (categoryAndLink.category.toLowerCase()) {
                case 'tickets':
                    let numberOfPromoTickets = 0;
                    let numberOfCashableTickets = 0;
                    let valueCashable = 0;
                    let valuePromo = 0;
                    for (let ticketData of data) {
                        if (ticketData.Status === 'TicketStacked') {

                            if (ticketData.TicketType === 'PromoTicket') {
                                valuePromo += parseFloat(ticketData.Amount);
                                numberOfPromoTickets++;
                            }
                            else {
                                valueCashable += parseFloat(ticketData.Amount);
                                numberOfCashableTickets++;
                            }
                        }
                    }
                    let topBarValueCashable = $$('#top-bar-tickets').getElementsByClassName('element-cashable-active-tickets-value');
                    topBarValueCashable[0].innerHTML = valueCashable;
                    let topBarNumberOfCashableTickets = $$('#top-bar-tickets').getElementsByClassName('element-cashable-active-tickets-number');
                    topBarNumberOfCashableTickets[0].innerHTML = `/${numberOfCashableTickets}`;

                    let topBarInfoPromoValue = $$('#top-bar-tickets').getElementsByClassName('element-promo-active-tickets-value');
                    topBarInfoPromoValue[0].innerHTML = valuePromo;
                    let topBarnumberOfPromoTickets = $$('#top-bar-tickets').getElementsByClassName('element-promo-active-tickets-number');
                    topBarnumberOfPromoTickets[0].innerHTML = `/${numberOfPromoTickets}`;
                    break;
            }

        }
    }

    on('showing-top-bar-value', function (data) {
        topBarInfoBoxValue(data.tableData);
    });






    on('show/app', function () {
        userProfile.classList.add('hidden');
    });

    on('topBar/category', function (data) {
        showTopBar(data);
    });

})();