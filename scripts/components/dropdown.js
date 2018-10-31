const dropdown = (function () {
    //index of single select 
    let indexSsId = 0;
    //generate single dropdown
    function generate(dataSelect) {
        // wrapper select
        let select = document.createElement('div');
        select.dataset.selectId = `ss-${indexSsId}`;
        select.classList.add('default-select');
        //selected option
        let selected = document.createElement('div');
        selected.innerHTML = dataSelect[0];
        selected.title = selected.innerHTML;
        selected.dataset.items = JSON.stringify(selected.innerHTML);
        //wrapper options group
        let optionGroup = document.createElement('div');
        optionGroup.classList.add('hidden');
        for (let element of dataSelect) {
            //option with functionality
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
                select.classList.toggle('active-select');
            }
            else {
                optionGroup.classList.add('hidden');
                select.classList.remove('active-select');
            }
        });
        indexSsId++;
        return select;
    }
    return {
        generate
    };
})();