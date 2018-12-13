const dropdown = (function () {
    //index of single select 
    let indexSsId = 0;
    //single select array
    let singleSelectArray = [];

    //generate single dropdown
    function generate(dataSelect) {
        // wrapper select
        let select = document.createElement('div');
        select.id = `ss-${indexSsId}`;
        select.dataset.selectId = indexSsId;
        select.classList.add('default-select');
        //selected option
        let selected = document.createElement('div');
        selected.innerHTML = dataSelect[0];
        selected.title = selected.innerHTML;
        selected.dataset.value = dataSelect[0];
        selected.addEventListener('click', function () {
            optionGroup.classList.toggle('hidden');
            select.classList.toggle('active-single-select');
        });
        //wrapper options group
        let optionGroup = document.createElement('div');
        optionGroup.classList.add('hidden');
        optionGroup.classList.add('overflow-y');
        for (let element of dataSelect) {
            //option with functionality
            let option = document.createElement('div');
            option.classList.add('single-option');
            option.innerHTML = element;
            option.title = option.innerHTML;
            option.dataset.value = element;
            option.dataset.translationKey = element;
            optionGroup.appendChild(option);

            option.addEventListener('click', function (e) {
                e.preventDefault();
                selected.innerHTML = option.innerHTML;
                selected.title = selected.innerHTML;
                selected.dataset.value = option.dataset.value;
                select.classList.remove('active-single-select');
                optionGroup.classList.add('hidden');
            });
        }
        select.appendChild(selected);
        select.appendChild(optionGroup);

        indexSsId++;
        singleSelectArray.push(select.id);
        return select;
    }

    window.addEventListener('click', function (e) {
        e.preventDefault();
        for (let selectId of singleSelectArray) {
            if (e.target.parentNode.id != selectId) {
                $$(`#${selectId}`).classList.remove('active-single-select');
                $$(`#${selectId}`).children[1].classList.add('hidden');
            }
        }
    });

    return {
        generate
    };
})();