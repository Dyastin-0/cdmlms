import { displayDropDown, hideDropDown } from "../home/home-ui-utils.js";

const filterDropDown = document.querySelector("#filter-drop-down-admin");
const filterDropDownMenu = filterDropDown.querySelector("#filter-drop-down-menu-admin");

const selectedFilter = filterDropDown.querySelector("#where-filter-admin");
const filterDropDownButton = filterDropDown.querySelector("#filter-by-drop-down-button-admin");
const filterChevron = filterDropDown.querySelector("#filter-drop-down-chevron-admin");

const userFilter = filterDropDownMenu.querySelector("#user-filter");
const requestFilter = filterDropDownMenu.querySelector("#request-filter");
const trasactionFilter = filterDropDownMenu.querySelector("#transaction-filter");


export function adminFilterInit() {
    bindEvents();
}

function bindEvents() {
    filterDropDownButton.addEventListener('click', () => {
        if (!isOpen) {
            filterChevron.style.transform = 'rotate(180deg)';
            displayDropDown(filterDropDownMenu);
            isOpen = true;
            addGlobalClick();
        } else {
            filterChevron.style.transform = 'rotateY(360deg)';
            hideDropDown(filterDropDownMenu);
            isOpen = false;
            document.removeEventListener('click', handleGlobalClick);
        }
    });

    userFilter.addEventListener('click', () => {
        selectedFilter.textContent = userFilter.textContent; 
    });

    requestFilter.addEventListener('click', () => {
        selectedFilter.textContent = requestFilter.textContent; 
    });

    trasactionFilter.addEventListener('click', () => {
        selectedFilter.textContent = trasactionFilter.textContent;
    });
}

let isOpen = false;
function handleGlobalClick(e) {
    const isClicked = filterDropDownButton.contains(e.target);

    if (!isClicked) {
        hideDropDown(filterDropDownMenu);
        isOpen = false;
        filterChevron.style.transform = 'rotateY(360deg)';
        document.removeEventListener('click', handleGlobalClick);
    }
}

function addGlobalClick() {
    document.addEventListener('click', handleGlobalClick);
}
