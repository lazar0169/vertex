let notifications = function () {

    const messageTypes = {
        ok: 0,
        warning: 1,
        info: 2,
        error: 3
    };

    function showNotification(params) {
        let newElement = params.element;
        let messageType = params.model.type;
        if (messageType === messageTypes.ok) {
            newElement.classList.add('toast-success');
        } else if (messageType === messageTypes.warning || messageType === messageTypes.error) {
            newElement.classList.add('toast-error');
        } else if (messageType === messageTypes.info) {
            newElement.classList.add('toast-warning');
        }
        $$('.notifications-container')[0].appendChild(newElement);
        //ToDo: refaktorisati querySelector u get element by class name
        newElement.querySelector('.btn-clear').addEventListener('click', function () {
            newElement.remove();
        });
        setTimeout(function () {
            newElement.classList.add('fade-out');
            newElement.remove();
        }, 3000);
    }

    on('notifications/render/finished', function (params) {
        showNotification(params);
    });

    on('notifications/show', function (params) {
        let paramsMessageCode = params.message;
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

    //shortcut event za error
    on('notifications/show/error', function (message) {
       trigger('notification/show',{
          type:messageTypes.error,
          message:message
       });
    });
    on('notifications/show/success', function (message) {
        trigger('notification/show',{
            type:messageTypes.ok,
            message:message
        });
    });

}();