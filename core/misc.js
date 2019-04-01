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
        if (tabSelected.dataset && tabSelected.dataset.route) {
            console.log(tabSelected.dataset.route);
        }
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
    let dateFrom = $$(`#datepicker-from-${data.selectId}`).value;
    let timeFromHour = $$(`#time-from-${data.selectId}`).children[1].children[0].children[0].dataset.value.slice(0, 2);
    let timeFromMinutes = $$(`#time-from-${data.selectId}`).children[1].children[1].children[0].dataset.value.slice(0, 2);

    let dateTo = $$(`#datepicker-to-${data.selectId}`).value;
    let timeToHour = $$(`#time-to-${data.selectId}`).children[1].children[0].children[0].dataset.value.slice(0, 2);
    let timeToMinutes = $$(`#time-to-${data.selectId}`).children[1].children[1].children[0].dataset.value.slice(0, 2);

    let tempArray = [dateFrom, `${timeFromHour}:${timeFromMinutes}`, dateTo, `${timeToHour}:${timeToMinutes}`];
    if (timeFromHour === '-' || timeFromMinutes === '-' || timeToHour === '-' || timeToMinutes === '-') {
        alert('Wrong parameters, please check parameters.');
        delete data.target.dataset.value;
    }
    else {
        $$(`#ds-${data.selectId}`).children[0].children[0].innerHTML = 'Custom';
        $$(`#ds-${data.selectId}`).children[0].title = `From: ${tempArray[0]} ${tempArray[1]}:00, To: ${tempArray[2]} ${tempArray[3]}:00`;
        $$(`#ds-${data.selectId}`).children[0].dataset.value = `${tempArray[0]}T${tempArray[1]}:00, ${tempArray[2]}T${tempArray[3]}:00`;
        data.target.dataset.value = 'Apply custom date'
    }
});

on('cancel-custom-date', function (data) {
    $$(`#datepicker-from-${data.selectId}`).setToday();
    let timeFromHour = $$(`#time-from-${data.selectId}`).children[1].children[0];
    timeFromHour.reset();
    let timeFromMinutes = $$(`#time-from-${data.selectId}`).children[1].children[1];
    timeFromMinutes.reset();
    let timeToHour = $$(`#time-to-${data.selectId}`).children[1].children[0];
    timeToHour.reset();
    let timeToMinutes = $$(`#time-to-${data.selectId}`).children[1].children[1];
    timeToMinutes.reset();
    $$(`#datepicker-to-${data.selectId}`).setToday();
});

function openCloseArrow(div) {
    div.children[1].classList.toggle('opened-arrow')
}

on('opened-arrow', function (data) {
    openCloseArrow(data.div)
})

//popups
function dimissPopUp(target) {
    if (target === undefined || target === null) {
        return false;
    }
    let popup = target.closest('.element-pop-up');
    if (popup !== undefined && popup !== null) {
        popup.parentNode.removeChild(popup);
    }
}
