import { displayDropDown, hideDropDown } from "./home-ui-utils.js";

const userDropDown = document.querySelector("#user-drop-down");
const userDropDownButton = document.querySelector("#user-drop-down-button");
const chevron = document.querySelector("#user-drop-down-chevron");

export function userDropDownInit() {
    userDropDownButton.addEventListener('click', () => {
        if (!isOpen) {
            chevron.style.transform = 'rotate(180deg)';
            displayDropDown(userDropDown);
            isOpen = true;
            addGlobalClick();
        } else {
            chevron.style.transform = 'rotateY(360deg)';
            hideDropDown(userDropDown);
            isOpen = false;
            document.removeEventListener('click', handleGlobalClick);
        }
    });
}

let isOpen = false;
function handleGlobalClick(e) {
    const isClicked = userDropDownButton.contains(e.target);

    const target = e.target.id ? e.target.id : null;

    let isChild = null;
    if (target) isChild = userDropDown.querySelector("#" + e.target.id) ? true : false;

    if (!isClicked && !isChild) {
        hideDropDown(userDropDown);
        isOpen = false;
        chevron.style.transform = 'rotateY(360deg)';
        document.removeEventListener('click', handleGlobalClick);
    }
}

function addGlobalClick() {
    document.addEventListener('click', handleGlobalClick);
}