const usersAddNewUser = (function () {
    trigger('preloader/hide');

    function generateRole(roleData) {
        let addNewUserRoleSettings = $$('#add-new-user-role-settings');

        for (let count = 0; count < roleData.RoleList.length; count++) {

            let roleWrapper = document.createElement('div');
            roleWrapper.classList.add('form-section');
            roleWrapper.classList.add('border-bottom-role');
            let checkedSwitch;
            let checkedSwitchMode;
            let hidden;
            if (roleData.RoleList[count].MainRoleEnabled) {
                checkedSwitch = 'checked';
                checkedSwitchMode = 'On';
                hidden = ''
            }
            else {
                checkedSwitch = '';
                checkedSwitchMode = 'Off';
                hidden = 'hidden';
            }
            roleWrapper.innerHTML = `<div class="form-section-content switch-and-select-all" >
                <figure class="element-form-check vertex-form-checkbox add-new-user-checked" data-target="${roleData.RoleList[count].MainRoleName}-role">
                    <label class="form-switch">
                        <input name="${roleData.RoleList[count].MainRoleName}-role" data-type="int" class="element-form-data add-new-user-checked-status" type="checkbox" ${checkedSwitch}>
                        <i class="form-icon"></i>
                    </label>
                    <div id="${roleData.RoleList[count].MainRoleName}-role-enable" class="element-form-mode checkbox-label element-dynamic-translatable" data-translation-key="${roleData.RoleList[count].MainRoleName}"></div>
                    <div id="${roleData.RoleList[count].MainRoleName}-role-enable-mode" class="element-form-mode checkbox-label element-dynamic-translatable" data-translation-key="${checkedSwitchMode}"></div>
                </figure>
                <a class="button-link ${hidden} role-select-all-button">Select all</a>
            </div>
            
            <div class="add-new-user-role-list form-section-content hidden">
            
            </div>  
            `
            addNewUserRoleSettings.appendChild(roleWrapper);
            let addNewUserRoleList = $$('.add-new-user-role-list');
            if (addNewUserRoleList[count].parentNode.children[0].children[0].children[0].children[0].checked) {

                addNewUserRoleList[count].classList.remove('hidden');
            }

            for (let countRole = 0; countRole < roleData.RoleList[count].MainRoleList.length; countRole++) {
                let categoryRoleWrapper = document.createElement('div');
                let checkedBox;

                if (roleData.RoleList[count].MainRoleList[countRole].Enabled) {
                    checkedBox = 'checked';
                }
                else {
                    checkedBox = '';
                }
                categoryRoleWrapper.innerHTML = `<figure class="element-form-check vertex-form-checkbox-box add-new-user-checked">
                    <label class="form-checkbox" >
                        <input type="checkbox" class="add-new-user-checked-status" ${checkedBox}>
                        <i class="form-icon" data-elementId = "${roleData.RoleList[count].MainRoleList[countRole].Name}"></i> <div data-translation-key="${roleData.RoleList[count].MainRoleList[countRole].Name}">${roleData.RoleList[count].MainRoleList[countRole].Name}</div>
                    </label>
                </figure>`
                addNewUserRoleList[count].appendChild(categoryRoleWrapper);
            }
        }
    }

    function setClickAndChangeCheckedStatus() {
        let checkbox = $$('.add-new-user-checked');

        for (let element of checkbox) {

            switch (element.getElementsByClassName('add-new-user-checked-status')[0].type) {

                case 'radio':
                    element.addEventListener('click', function () {
                        element.getElementsByClassName('add-new-user-checked-status')[0].checked = true;


                        switch (element.getElementsByClassName('add-new-user-checked-status')[0].name) {

                            case 'user-role':

                                if (element.getElementsByClassName('add-new-user-checked-status')[0].dataset.value === 'user-role-manager') {
                                    element.parentNode.parentNode.children[2].children[0].classList.add('hidden');
                                }
                                else {
                                    element.parentNode.parentNode.children[2].children[0].classList.remove('hidden');
                                }
                                break;

                            case 'apply-role-on':
                                if (element.getElementsByClassName('add-new-user-checked-status')[0].dataset.value === 'chooseCasino') {
                                    element.parentNode.children[3].classList.remove('hidden');
                                }
                                else {
                                    element.parentNode.children[3].classList.add('hidden');
                                }
                                break;
                        }



                    });
                    break;

                case 'checkbox':
                    element.addEventListener('click', function (e) {
                        if (element.getElementsByClassName('add-new-user-checked-status')[0].checked) {
                            element.getElementsByClassName('add-new-user-checked-status')[0].checked = false;
                            if (element.getElementsByClassName('form-switch')[0]) {
                                for (let checkedElement of element.parentNode.parentNode.children[1].getElementsByClassName('add-new-user-checked-status')) {
                                    checkedElement.checked = false;
                                }
                                element.parentNode.children[1].classList.add('hidden');
                                element.parentNode.parentNode.children[1].classList.add('hidden');
                                element.children[2].innerHTML = "Off";
                            }
                        }
                        else {
                            element.getElementsByClassName('add-new-user-checked-status')[0].checked = true;
                            if (element.getElementsByClassName('form-switch')[0]) {
                                element.parentNode.parentNode.children[1].classList.remove('hidden');
                                element.parentNode.children[1].classList.remove('hidden');
                                element.children[2].innerHTML = "On";
                            }
                        }
                    });
                    if (element.getElementsByClassName('form-switch')[0]) {
                        element.parentNode.children[1].addEventListener('click', function () {
                            for (let checkedElement of element.parentNode.parentNode.children[1].getElementsByClassName('add-new-user-checked-status')) {
                                checkedElement.checked = true;
                            }

                        });
                    }
                    break;
            }
        }
    }

    on('users/generate-role', function (data) {
        generateRole(data.role);

        $$('#add-new-user-role-apply').appendChild(jackpotChooseParticipatingMachines.createJackpotFilterCasinos(casinoData));



        setClickAndChangeCheckedStatus();
    })
})();