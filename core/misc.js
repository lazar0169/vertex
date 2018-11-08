let blackArea = $$('#black-area');
if (typeof blackArea !== 'undefined' && blackArea !== null) {
    $$('#black-area').addEventListener('click', function () {
        trigger('show/app');
    });
}

// tab listener
let tabs = $$('.tabs');
window.addEventListener('load', function () {
    setTabListener();
});

function setTabListener() {
    for (let tab of tabs) {
        tab.addEventListener('click', function () {
            selectTab(tab.id);
            selectInfoContent(tab.id)
        });
    }
}


// highlight chosen tab
let previousTabSelected;

function selectTab(name) {
    if (previousTabSelected) {
        previousTabSelected.classList.remove('tab-active');
    }
    let tabSelected = $$(`#${name}`);
    if (tabSelected) {

        tabSelected.classList.add('tab-active');
        previousTabSelected = tabSelected;
    }
}

//shows content for selected tab
let previousInfoContSelected;
function selectInfoContent(name) {
    if (previousInfoContSelected) {
        previousInfoContSelected.classList.remove('active-content');
        previousInfoContSelected.classList.add('hidden');

    }
    let infoContSelected = $$(`#${name}-info`);
    if (infoContSelected) {
        infoContSelected.classList.remove('hidden');
        infoContSelected.classList.add('active-content');
        previousInfoContSelected = infoContSelected;
    }
}

// custom date 
on('apply-custom-date', function (data) {
    let dateFrom = $$(`#datepicker-from-${data.selectId}`).dataset.value;

    let timeFromHour = $$(`#time-from-${data.selectId}`).children[1].children[0].children[0].dataset.value.slice(0, 2);
    let timeFromMinutes = $$(`#time-from-${data.selectId}`).children[1].children[1].children[0].dataset.value.slice(0, 2);

    let dateTo = $$(`#datepicker-to-${data.selectId}`).dataset.value;
    let timeToHour = $$(`#time-to-${data.selectId}`).children[1].children[0].children[0].dataset.value.slice(0, 2);
    let timeToMinutes = $$(`#time-to-${data.selectId}`).children[1].children[1].children[0].dataset.value.slice(0, 2);

    let tempArray = [dateFrom, `${timeFromHour}:${timeFromMinutes}`, dateTo, `${timeToHour}:${timeToMinutes}`];
    if (dateFrom === undefined || timeFromHour === '-' || timeFromMinutes === '-' || dateTo === undefined || timeToHour === '-' || timeToMinutes === '-') {
        alert('Wrong parameters, please check parameters.');
        delete data.target.dataset.value

    }
    else {
        $$(`#ds-${data.selectId}`).children[0].innerHTML = 'Custom';
        $$(`#ds-${data.selectId}`).children[0].title = `Date from: ${tempArray[0]}, Time from: ${tempArray[1]}, Date to: ${tempArray[2]}, Time to: ${tempArray[3]}`;
        $$(`#ds-${data.selectId}`).dataset.value = tempArray;
        data.target.dataset.value = 'Apply custom date'
        let jsonCustomDate = JSON.stringify($$(`#ds-${data.selectId}`).dataset.value);
        console.log(jsonCustomDate);
    }
});
on('cancel-custom-date', function (data) {
    delete $$(`#datepicker-from-${data.selectId}`).dataset.value;
    let timeFromHour = $$(`#time-from-${data.selectId}`).children[1].children[0].children[0];
    timeFromHour.innerHTML = hour[0];
    timeFromHour.dataset.value = hour[0];
    let timeFromMinutes = $$(`#time-from-${data.selectId}`).children[1].children[1].children[0];
    timeFromMinutes.innerHTML = minutes[0];
    timeFromMinutes.dataset.value = minutes[0];
    delete $$(`#datepicker-to-${data.selectId}`).dataset.value;
    let timeToHour = $$(`#time-to-${data.selectId}`).children[1].children[0].children[0];
    timeToHour.innerHTML = hour[0];
    timeToHour.dataset.value = hour[0];
    let timeToMinutes = $$(`#time-to-${data.selectId}`).children[1].children[1].children[0];
    timeToMinutes.innerHTML = minutes[0];
    timeToMinutes.dataset.value = minutes[0];
    delete $$(`#ds-${data.selectId}`).dataset.value;
    $$(`#ds-${data.selectId}`).children[0].innerHTML = nekiniz[0];
    $$(`#ds-${data.selectId}`).children[0].title = nekiniz[0];
    delete target.dataset.value;

});

on('set-date-datepicker', function (data) {
    $$(`#${data.pickerId}`).dataset.value = data.date;
    console.log($$(`#${data.pickerId}`).dataset.value)
});