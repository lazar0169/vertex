let notifications = function () {

    function showNotification() {

    }

    /*
        on('notifications/success', function(params){

        });


        on('notifications/error', function(params){

        });


        on('notifications/error/username-password', function(params){

        });*/
/*
    info
    error
    success*/

    on('notifications/render/finished', function (params) {
        let newElement = params.element;
        //TODO dodaj klasu notifikaciji na osnovu poruke
        console.log(newElement);
        let parent = $$('.notifications-container')[0];
        console.log(parent);
        $$('.notifications-container')[0].appendChild(newElement);
    });

//todo u params prosledim koji je tip poruke notifikacije


    on('notifications/show', function (params) {
        let notificationModel = {
            message: params.message,
            type: params.type
        };
        trigger('template/render', {templateElementSelector: '#notification-template', model: notificationModel, callbackEvent:'notifications/render/finished'});
    });

}();