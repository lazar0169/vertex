let ticketsMaxValue = (function(){
        let ticketsMaxValueTab = $$('#tickets-max-value-tab');

        ticketsMaxValueTab.addEventListener('click', function(){
            selectTab('tickets-max-value-tab');
            selectInfoContent('tickets-max-value-tab');
        });
})();