let blackArea = $$('#black-area');
if (typeof blackArea !== 'undefined' && blackArea !== null){
$$('#black-area').addEventListener('click', function () {
    trigger('show/app');
});
}