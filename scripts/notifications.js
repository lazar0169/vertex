let notifications = function () {

    const messageTypes = {
        ok: '0',
        warning: '1',
        info: '2',
        error: '3'
    };

    const messageCodes = {
        22: 'Invalid username and / or password!',
        23: 'Logout error!'
    };

    console.log(messageCodes["22"]);

    function showNotification(params) {
        let newElement = params.element;
        let messageType = params.model.type;
        if (messageType === messageTypes.ok) {
            newElement.classList.add('notification-success');
            newElement.classList.add('toast-success');
        } else if (messageType ===  messageTypes.warning || messageType === messageTypes.error) {
            newElement.classList.add('notification-error');
            newElement.classList.add('toast-error');
        } else (messageType === messageTypes.info)
        {
            newElement.classList.add('notification-info');
            newElement.classList.add('toast-warning');
        }
        $$('.notifications-container')[0].appendChild(newElement);
    }


    on('notifications/render/finished', function (params) {
        showNotification(params);
    });

    on('notifications/show', function (params) {
        let messageCode = params.message;
        let paramsMessageCode = messageCodes[messageCode];
        let paramsMessageType = params.type;

        let notificationModel = {
            message: paramsMessageCode,
            type: paramsMessageType
        };

        trigger('template/render', {
            templateElementSelector: '#notification-template',
            model: notificationModel,
            callbackEvent: 'notifications/render/finished'
        });
    });

}();