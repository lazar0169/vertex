let casino = (function () {

    on('casino/add',function(e) {
        let model = e.model;
        trigger('template/render', {
            model: model,
            templateElementSelector: "#casino-template",
            callbackEvent: 'casino/load'
        });
    });

    on('casino/load',function(e) {
        let element = e.element;
        console.log(e);
        //Multiple ways to place HTML element inside HTML document:
        //$$('.casino-list')[0].innerHTML = element.innerHTML;
        $$('.casino-list')[0].appendChild(element);
    });

/*    //Testing cloned button
    $$('.cloning-test')[0].onclick = function (event) {
        alert('Test.');
    };*/

})();

/*
//We use this trigger to trigger adding casino models
trigger('casino/add',{
model: {
casino: {
name:"neiski",
address:"drugi",
}}});
 */