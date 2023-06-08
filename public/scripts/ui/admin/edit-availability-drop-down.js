import { displayDropDown, hideDropDown } from "../home/home-ui-utils.js";

const availabilityDropDown = document.querySelector("#edit-availability-drop-down");
const availabilityDropDownMenu = availabilityDropDown.querySelector("#edit-availability-drop-down-menu");

const selectedAvailability = availabilityDropDown.querySelector("#edit-book-availability");
const availabilityDropDownButton = availabilityDropDown.querySelector("#edit-availability-by-drop-down-button");
const availabilityChevron = availabilityDropDown.querySelector("#edit-availability-drop-down-chevron");

const available = availabilityDropDownMenu.querySelector("#edit-available");
const notAvailable = availabilityDropDownMenu.querySelector("#edit-not-available");

export function editAvailabilityDropDownInit() {
    bindEvents();
}

function bindEvents() {
    availabilityDropDownButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (!isOpen) {
            availabilityChevron.style.transform = 'rotate(180deg)';
            displayDropDown(availabilityDropDownMenu);
            isOpen = true;
            addGlobalClick();
        } else {
            availabilityChevron.style.transform = 'rotateY(360deg)';
            hideDropDown(availabilityDropDownMenu);
            isOpen = false;
            document.removeEventListener('click', handleGlobalClick);
        }
    });

    available.addEventListener('click', (e) => {
        e.preventDefault();
        selectedAvailability.textContent = available.textContent; 
    });

    notAvailable.addEventListener('click', (e) => {
        e.preventDefault();
        selectedAvailability.textContent = notAvailable.textContent; 
    });
}

let isOpen = false;
function handleGlobalClick(e) {
    const isClicked = availabilityDropDownButton.contains(e.target);

    if (!isClicked) {
        hideDropDown(availabilityDropDownMenu);
        isOpen = false;
        availabilityChevron.style.transform = 'rotateY(360deg)';
        document.removeEventListener('click', handleGlobalClick);
    }
}

function addGlobalClick() {
    document.addEventListener('click', handleGlobalClick);
}
