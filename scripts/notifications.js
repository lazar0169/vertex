let notifications = function(){

    function showNotification() {

    }

/*
    on('notifications/success', function(params){

    });


    on('notifications/error', function(params){

    });


    on('notifications/error/username-password', function(params){

    });*/

    on('render/finished', function(param){
        let newElement = param.element;
        console.log(newElement);
        let parent = $$('.notifications-container')[0];
        console.log(parent);
        $$('.notifications-container')[0].appendChild(newElement);
    });


    on('notifications/error/communication', function(params){
        let message = params.message;
        trigger('template/render', {templateElementSelector: '#notification-template', model: message});

    });

}();