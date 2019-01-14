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
            if (roleData.RoleList[count].MainRoleEnabled) {
                checkedSwitch = 'checked';
                checkedSwitchMode = 'On';
            }
            else {
                checkedSwitch = '';
                checkedSwitchMode = 'Off';
            }
            roleWrapper.innerHTML = `<div class="form-section-content" >
                <figure class="element-form-check vertex-form-checkbox add-new-user-checked" data-target="${roleData.RoleList[count].MainRoleName}-role">
                    <label class="form-switch">
                        <input name="${roleData.RoleList[count].MainRoleName}-role" data-type="int" class="element-form-data add-new-user-checked-status" type="checkbox" ${checkedSwitch}>
                        <i class="form-icon"></i>
                    </label>
                    <div id="${roleData.RoleList[count].MainRoleName}-role-enable" class="element-form-mode checkbox-label element-dynamic-translatable" data-translation-key="${roleData.RoleList[count].MainRoleName}"></div>
                    <div id="${roleData.RoleList[count].MainRoleName}-role-enable-mode" class="element-form-mode checkbox-label element-dynamic-translatable" data-translation-key="${checkedSwitchMode}"></div>
                </figure>
            </div>
            
            <div class="add-new-user-role-list form-section-content hidden">
            
            </div>  
            `
            addNewUserRoleSettings.appendChild(roleWrapper);
            let addNewUserRoleList = $$('.add-new-user-role-list');
            if (addNewUserRoleList[count].parentNode.children[0].children[0].children[0].children[0].checked) {
                addNewUserRoleList[count].classList.remove('hidden');
            }

            for (let nesto = 0; nesto < roleData.RoleList[count].MainRoleList.length; nesto++) {
                let categoryRoleWrapper = document.createElement('div');
                let checkedBox;

                if (roleData.RoleList[count].MainRoleList[nesto].Enabled) {
                    checkedBox = 'checked';

                }
                else {
                    checkedBox = '';

                }
                categoryRoleWrapper.innerHTML = `<figure class="element-form-check vertex-form-checkbox-box add-new-user-checked">
                    <label class="form-checkbox" >
                        <input type="checkbox" class="add-new-user-checked-status" ${checkedBox}>
                        <i class="form-icon" data-elementId = "${roleData.RoleList[count].MainRoleList[nesto].Name}"></i> <div data-translation-key="${roleData.RoleList[count].MainRoleList[nesto].Name}">${roleData.RoleList[count].MainRoleList[nesto].Name}</div>
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
                    })
                    break;

                case 'checkbox':
                    element.addEventListener('click', function (e) {
                        if (element.getElementsByClassName('add-new-user-checked-status')[0].checked) {
                            element.getElementsByClassName('add-new-user-checked-status')[0].checked = false;
                        }
                        else {
                            element.getElementsByClassName('add-new-user-checked-status')[0].checked = true;
                        }
                    })
                    break;
            }
        }
    }

    on('users/generate-role', function (data) {
        generateRole(data.role);
        setClickAndChangeCheckedStatus();
    })
})();