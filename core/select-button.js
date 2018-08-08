window.addEventListener('load', function () {
    selectSelected();
    openCloseSelect();
});

function selectSelected() {
    let container = $$('.select-div');
    for (let count = 0; count < container.length; count++) {
        for (let select of container[count].children[1].children) {
            select.addEventListener('click', function () {
                container[count].dataset.id = select.dataset.id;
                container[count].children[0].children[0].innerHTML = select.innerHTML;
                closeSelect(container[count]);
            });
        }
    }
}

function openCloseSelect() {
    let container = $$('.select-div');
    for (let select of container) {
        select.children[0].addEventListener('click', function () {
            closeSelect(select);
        });
    }
}

function closeSelect(container) {

    if (container.classList.contains('show')) {
        container.classList.remove('show');
        container.children[0].children[1].innerHTML = '&#9660';
    }
    else {
        container.classList.add('show');
        container.children[0].children[1].innerHTML = '&#9650';
    }
}