let casinoDisplay = (function () {

    function generateView(data) {
        let casinoWrapper = document.createElement('div');
        casinoWrapper.classList.add('casino-display-table-view');

        casinoWrapper.innerHTML = `<div class="casino-display-name-wrapper">
        <div class="casino-display-status"></div>
        <div class="casino-display-name color-white">Spin Palilula</div>
        <div class="casino-display-city">Nis</div>
        </div>

        <div class="casino-display-saldo-wrapper center">48001.00</div>

        <div class="casino-display-total-in-wrapper">
        <div class="casino-display-total-in align-right">total in</div>
        <div class="casino-display-total-in-value color-white align-right">12345</div>
        </div>

        <div class="casino-display-total-in-cashdesk-wrapper">
        <div class="casino-display-total-in-cashdesk align-right">total in cashdesk</div>
        <div class="casino-display-total-in-cashdesk-value color-white align-right">54321</div>
        </div>
        
        <div class="casino-display-bills-wrapper">
        <div class="casino-display-bills align-right">bills</div>
        <div class="casino-display-bills-value color-white align-right">987</div>
        </div>

        <div class="casino-display-last-column"> 
            <div class="casino-display-players-wrapper color-white center">
            <div>&#9924;</div>
            <div>5/21</div>
            </div>

            <div class="casino-display-warning center color-white">!</div>

            <div class="casino-display-details center">details</div>
        </div>`
        return casinoWrapper
    }

    return {
        generateView
    }

})();