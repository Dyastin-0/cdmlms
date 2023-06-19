import { displayDropDown, hideDropDown } from "../home/home-ui-utils.js";

const statusDropDown = document.querySelector("#edit-status-drop-down");
const statusDropDownMenu = statusDropDown.querySelector("#edit-status-drop-down-menu");

const selectedStatus = statusDropDown.querySelector("#edit-user-status");
const statusDropDownButton = statusDropDown.querySelector("#edit-status-by-drop-down-button");
const statusChevron = statusDropDown.querySelector("#edit-status-drop-down-chevron");

const good = statusDropDownMenu.querySelector("#status-good");
const warning = statusDropDownMenu.querySelector("#status-warning");
const blocked = statusDropDownMenu.querySelector("#status-blocked");

export function editStatusDropDownInit() {
    bindEvents();
}

function bindEvents() {
    statusDropDownButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (!isOpen) {
            statusChevron.style.transform = 'rotate(180deg)';
            displayDropDown(statusDropDownMenu);
            isOpen = true;
            addGlobalClick();
        } else {
            statusChevron.style.transform = 'rotateY(360deg)';
            hideDropDown(statusDropDownMenu);
            isOpen = false;
            document.removeEventListener('click', handleGlobalClick);
        }
    });

    good.addEventListener('click', (e) => {
        e.preventDefault();
        selectedStatus.textContent = good.textContent; 
    });

    warning.addEventListener('click', (e) => {
        e.preventDefault();
        selectedStatus.textContent = warning.textContent; 
    });

    blocked.addEventListener('click', (e) => {
        e.preventDefault();
        selectedStatus.textContent = blocked.textContent; 
    });
}

let isOpen = false;
function handleGlobalClick(e) {
    const isClicked = statusDropDownButton.contains(e.target);

    if (!isClicked) {
        hideDropDown(statusDropDownMenu);
        isOpen = false;
        statusChevron.style.transform = 'rotateY(360deg)';
        document.removeEventListener('click', handleGlobalClick);
    }
}

function addGlobalClick() {
    document.addEventListener('click', handleGlobalClick);
}
