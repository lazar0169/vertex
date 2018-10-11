const ticketAppearance = (function () {
    let ticketAppearanceAdvance = $$('#wrapper-ticket-appearance-advanced').children[0];
    let ticketAppearanceAdvanceShow = $$('#wrapper-ticket-appearance-advanced').children[1];

    ticketAppearanceAdvance.addEventListener('click', function () {
        ticketAppearanceAdvanceShow.classList.toggle('hidden');
    });

})();