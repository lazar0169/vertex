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
    let dateFrom = $$(`#datepicker-from-${data.data}`).dataset.value;

    let timeFromHour = $$(`#time-from-${data.data}`).children[1].children[0].children[0].dataset.value.slice(0, 2);
    let timeFromMinutes = $$(`#time-from-${data.data}`).children[1].children[1].children[0].dataset.value.slice(0, 2);

    let dateTo = $$(`#datepicker-to-${data.data}`).dataset.value;
    let timeToHour = $$(`#time-to-${data.data}`).children[1].children[0].children[0].dataset.value.slice(0, 2);
    let timeToMinutes = $$(`#time-to-${data.data}`).children[1].children[1].children[0].dataset.value.slice(0, 2);

    let tempArray = [dateFrom, `${timeFromHour}:${timeFromMinutes}`, dateTo, `${timeToHour}:${timeToMinutes}`];
    if (dateFrom === undefined || timeFromHour === '-' || timeFromMinutes === '-' || dateTo === undefined || timeToHour === '-' || timeToMinutes === '-') {
        alert('Wrong parameters, please check parameters.')
    }
    else {
        $$(`#ds-${data.data}`).children[0].innerHTML = 'Custom';
        $$(`#ds-${data.data}`).children[0].title = `Date from: ${tempArray[0]}, Time from: ${tempArray[1]}, Date to: ${tempArray[2]}, Time to: ${tempArray[3]}`;
        $$(`#ds-${data.data}`).dataset.value = tempArray;
        let jsonCustomDate = JSON.stringify($$(`#ds-${data.data}`).dataset.value);
        console.log(jsonCustomDate);
    }





});

on('set-date-datepicker', function (data) {
    $$(`#${data.pickerId}`).dataset.value = data.date;
    console.log($$(`#${data.pickerId}`).dataset.value)
});