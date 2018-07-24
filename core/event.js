let eventList;

function on(event, callback, count = Number.MAX_SAFE_INTEGER) {
    if (!eventList) eventList = {};
    if (!eventList[event]) eventList[event] = [];
    eventList[event].push({
        callback: callback,
        count: count
    });
}

function trigger(name, data) {
    if (!eventList) return;
    if (!eventList[name]) return;
    for (let event of eventList[name]) {
        if (event.count > 0) {
            event.callback(data);
            event.count--;
        } else {
            eventList[name].splice(eventList[name].indexOf(event), 1);
        }
    }
}


