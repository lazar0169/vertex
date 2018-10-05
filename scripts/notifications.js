let notifications = function () {

    function showNotification(params) {
        let newElement = params.element;
        let messageCode = params.model.message;
        let messageType = params.model.type;
        if (messageType === 0) {
            newElement.classList.add('notification-success');
            newElement.classList.add('toast-success');
        } else if (messageCode === 1 || messageCode === 3) {
            newElement.classList.add('notification-error');
            newElement.classList.add('toast-error');
        } else (messageCode === 2)
        {
            newElement.classList.add('notification-info');
            newElement.classList.add('toast-warning');
        }
        console.log('params model', params.model);
        console.log(newElement);
        let parent = $$('.notifications-container')[0];
        console.log(parent);
        $$('.notifications-container')[0].appendChild(newElement);
    }


    on('notifications/render/finished', function (params) {
        showNotification(params);
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