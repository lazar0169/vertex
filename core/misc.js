

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
            table.removeTransactionPopup();
            selectTab(tab.id);
            selectInfoContent(tab.id);
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
    if (timeFromHour === '-' || timeFromMinutes === '-' || timeToHour === '-' || timeToMinutes === '-') {
        alert('Wrong parameters, please check parameters.');
        delete data.target.dataset.value;

    }
    else {
        $$(`#ds-${data.selectId}`).children[0].innerHTML = 'Custom';
        $$(`#ds-${data.selectId}`).children[0].title = `From: ${tempArray[0]} ${tempArray[1]}:00, To: ${tempArray[2]} ${tempArray[3]}:00`;
        $$(`#ds-${data.selectId}`).children[0].dataset.value = `${tempArray[0]}T${tempArray[1]}:00, ${tempArray[2]}T${tempArray[3]}:00`;
        data.target.dataset.value = 'Apply custom date'
        let jsonCustomDate = JSON.stringify($$(`#ds-${data.selectId}`).children[0].dataset.value);
        console.log(jsonCustomDate);
    }
});
on('cancel-custom-date', function (data) {
    let date = new Date();
    let apiString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    trigger(`set-date-datepicker`, { pickerId: `datepicker-from-${data.selectId}`, date: apiString });
    let timeFromHour = $$(`#time-from-${data.selectId}`).children[1].children[0].children[0];
    timeFromHour.innerHTML = hours[0];
    timeFromHour.dataset.value = hours[0];
    let timeFromMinutes = $$(`#time-from-${data.selectId}`).children[1].children[1].children[0];
    timeFromMinutes.innerHTML = minutes[0];
    timeFromMinutes.dataset.value = minutes[0];
    let timeToHour = $$(`#time-to-${data.selectId}`).children[1].children[0].children[0];
    timeToHour.innerHTML = hours[0];
    timeToHour.dataset.value = hours[0];
    let timeToMinutes = $$(`#time-to-${data.selectId}`).children[1].children[1].children[0];
    timeToMinutes.innerHTML = minutes[0];
    timeToMinutes.dataset.value = minutes[0];
    trigger(`set-date-datepicker`, { pickerId: `datepicker-to-${data.selectId}`, date: apiString, isCancel: true });
    $$(`#ds-${data.selectId}`).children[0].innerHTML = fixedDays[0];
    $$(`#ds-${data.selectId}`).children[0].title = fixedDays[0];
    $$(`#ds-${data.selectId}`).children[0].dataset.value = fixedDays[0];
    delete data.target.dataset.value;
});

on('set-date-datepicker', function (data) {
    if (data.isCancel) {
        console.log('ukloni is-selected na td, i isti postavi na danasnji datum');
    }
    $$(`#${data.pickerId}`).dataset.value = data.date;
    $$(`#${data.pickerId}`).value = data.date;
});


function openCloseArrow(div) {

    div.children[0].children[1].classList.toggle('opened-arrow')

}

on('opened-arrow', function (data) {
    openCloseArrow(data.div)
})