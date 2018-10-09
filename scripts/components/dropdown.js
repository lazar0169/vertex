const dropdown = (function () {

    let proba = $$('#aft-advance-table-filter-date-range');
    let nekiniz = ['-', 'selektuje', 'samo', 'jedan', 'element'];

    window.addEventListener('load', function () {
        proba.appendChild(singleSelect(nekiniz));
    });

    // funkcija za selektovanje jednog podatka
    let indexSsId = 0;
    function singleSelect(dataSelect) {
        let select = document.createElement('div');
        select.dataset.selectId = `ss-${indexSsId}`;
        select.classList.add('default-select');
        let selected = document.createElement('div');
        selected.innerHTML = dataSelect[0];
        selected.title = selected.innerHTML;
        selected.dataset.items = JSON.stringify(selected.innerHTML);
        let optionGroup = document.createElement('div');
        optionGroup.classList.add('hidden');
        for (let element of dataSelect) {
            let option = document.createElement('div');
            option.classList.add('single-option');
            option.innerHTML = element;
            option.title = option.innerHTML;
            optionGroup.appendChild(option);
            optionGroup.classList.add('overflow-y');
            option.addEventListener('click', function (e) {
                e.preventDefault();
                selected.innerHTML = option.innerHTML;
                selected.title = selected.innerHTML;
                selected.dataset.items = JSON.stringify(selected.innerHTML);
            });
        }
        select.appendChild(selected);
        select.appendChild(optionGroup);
        window.addEventListener('click', function (e) {
            e.stopPropagation();
            if (e.target.parentNode.dataset.selectId === select.dataset.selectId || e.target.parentNode.parentNode.dataset.selectId === select.dataset.selectId) {
                optionGroup.classList.toggle('hidden');
            }
            else {
                optionGroup.classList.add('hidden');
            }
        });
        indexSsId++;
        return select;
    }
})();