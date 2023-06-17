import { displayDropDown, hideDropDown } from "./home-ui-utils.js";

const userDropDown = document.querySelector("#user-drop-down");
const userDropDownButton = document.querySelector("#user-drop-down-button");
const userPhoto = document.querySelector("#nav-user-photo");

export function userDropDownInit() {
    userDropDownButton.addEventListener('click', () => {
        if (!isOpen) {
            displayDropDown(userDropDown);
            isOpen = true;
            addGlobalClick();
        } else {
            hideDropDown(userDropDown);
            isOpen = false;
            document.removeEventListener('click', handleGlobalClick);
        }
    });
}

let isOpen = false;
function handleGlobalClick(e) {
    const isClicked = userDropDownButton.contains(e.target);
    if (!isClicked) {
        hideDropDown(userDropDown);
        isOpen = false;
        document.removeEventListener('click', handleGlobalClick);
    }
}

function addGlobalClick() {
    document.addEventListener('click', handleGlobalClick);
}