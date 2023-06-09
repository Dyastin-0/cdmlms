import { displayDropDown, hideDropDown } from "../home/home-ui-utils.js";

const roleDropDown = document.querySelector("#edit-role-drop-down");
const roleDropDownMenu = roleDropDown.querySelector("#edit-role-drop-down-menu");

const selectedRole = roleDropDown.querySelector("#edit-user-role");
const roleDropDownButton = roleDropDown.querySelector("#edit-role-by-drop-down-button");
const roleChevron = roleDropDown.querySelector("#edit-role-drop-down-chevron");

const admin = roleDropDownMenu.querySelector("#edit-admin");
const user = roleDropDownMenu.querySelector("#edit-user");

export function editRoleDropDownInit() {
    bindEvents();
}

function bindEvents() {
    roleDropDownButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (!isOpen) {
            roleChevron.style.transform = 'rotate(180deg)';
            displayDropDown(roleDropDownMenu);
            isOpen = true;
            addGlobalClick();
        } else {
            roleChevron.style.transform = 'rotateY(360deg)';
            hideDropDown(roleDropDownMenu);
            isOpen = false;
            document.removeEventListener('click', handleGlobalClick);
        }
    });

    admin.addEventListener('click', (e) => {
        e.preventDefault();
        selectedRole.textContent = admin.textContent; 
    });

    user.addEventListener('click', (e) => {
        e.preventDefault();
        selectedRole.textContent = user.textContent; 
    });
}

let isOpen = false;
function handleGlobalClick(e) {
    const isClicked = roleDropDownButton.contains(e.target);

    if (!isClicked) {
        hideDropDown(roleDropDownMenu);
        isOpen = false;
        roleChevron.style.transform = 'rotateY(360deg)';
        document.removeEventListener('click', handleGlobalClick);
    }
}

function addGlobalClick() {
    document.addEventListener('click', handleGlobalClick);
}
