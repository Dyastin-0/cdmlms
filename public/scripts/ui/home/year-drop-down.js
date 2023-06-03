import { displayDropDown, hideDropDown } from "./home-ui-utils.js";

const yearDropDown = document.querySelector("#year-drop-down");
const yearDropDownMenu = yearDropDown.querySelector("#year-drop-down-menu");

const selectedYear = yearDropDown.querySelector("#setup-selected-year");
const yearDropDownButton = yearDropDown.querySelector("#year-drop-down-button");
const yearChevron = yearDropDown.querySelector("#year-drop-down-chevron");

const firstYear = document.querySelector("#year-1");
const secondYear = document.querySelector("#year-2");
const thirdYear = document.querySelector("#year-3");
const fourthYear = document.querySelector("#year-4");

export function yearDropDownInit() {
    bindEvents();
}

function bindEvents() {
    yearDropDownButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (!isOpen) {
            yearChevron.style.transform = 'rotate(180deg)';
            displayDropDown(yearDropDownMenu);
            isOpen = true;
            addGlobalClick();
        } else {
            yearChevron.style.transform = 'rotateY(360deg)';
            hideDropDown(yearDropDownMenu);
            isOpen = false;
            document.removeEventListener('click', handleGlobalClick);
        }
    });

    firstYear.addEventListener('click', (e) => {
        e.preventDefault();
        selectedYear.textContent = firstYear.textContent; 
    });

    secondYear.addEventListener('click', (e) => {
        e.preventDefault();
        selectedYear.textContent = secondYear.textContent; 
    });

    thirdYear.addEventListener('click', (e) => {
        e.preventDefault();
        selectedYear.textContent = thirdYear.textContent; 
    });

    fourthYear.addEventListener('click', (e) => {
        e.preventDefault();
        selectedYear.textContent = fourthYear.textContent; 
    });
}

let isOpen = false;
function handleGlobalClick(e) {
    const isClicked = yearDropDownButton.contains(e.target);

    if (!isClicked) {
        hideDropDown(yearDropDownMenu);
        isOpen = false;
        yearChevron.style.transform = 'rotateY(360deg)';
        document.removeEventListener('click', handleGlobalClick);
    }
}

function addGlobalClick() {
    document.addEventListener('click', handleGlobalClick);
}
