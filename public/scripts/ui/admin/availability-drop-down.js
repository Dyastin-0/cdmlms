import { displayDropDown, hideDropDown } from "../home/home-ui-utils.js";

const availabilityDropDown = document.querySelector("#availability-drop-down");
const availabilityDropDownMenu = availabilityDropDown.querySelector("#availability-drop-down-menu");

const selectedAvailability = availabilityDropDown.querySelector("#add-book-availability");
const availabilityDropDownButton = availabilityDropDown.querySelector("#availability-by-drop-down-button");
const availabilityChevron = availabilityDropDown.querySelector("#availability-drop-down-chevron");

const available = availabilityDropDownMenu.querySelector("#available");
const notAvailable = availabilityDropDownMenu.querySelector("#not-available");

export function availabilityDropDownInit() {
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
