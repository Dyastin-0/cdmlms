import { displayDropDown, hideDropDown } from "./home-ui-utils.js";

const courseDropDown = document.querySelector("#course-drop-down");
const courseDropDownMenu = courseDropDown.querySelector("#course-drop-down-menu");

const selectedCourse = courseDropDown.querySelector("#setup-selected-course");
const courseDropDownButton = courseDropDown.querySelector("#course-drop-down-button");
const courseChevron = courseDropDown.querySelector("#course-drop-down-chevron");

const bscpe = document.querySelector("#course-bscpe");
const bsit = document.querySelector("#course-bsit");
const bsed = document.querySelector("#course-bsed");
const bsba = document.querySelector("#course-bsba");

export function courseDropDownInit() {
    bindEvents();
}

function bindEvents() {
    courseDropDownButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (!isOpen) {
            courseChevron.style.transform = 'rotate(180deg)';
            displayDropDown(courseDropDownMenu);
            isOpen = true;
            addGlobalClick();
        } else {
            courseChevron.style.transform = 'rotateY(360deg)';
            hideDropDown(courseDropDownMenu);
            isOpen = false;
            document.removeEventListener('click', handleGlobalClick);
        }
    });

    bscpe.addEventListener('click', (e) => {
        e.preventDefault();
        selectedCourse.textContent = bscpe.textContent; 
    });

    bsit.addEventListener('click', (e) => {
        e.preventDefault();
        selectedCourse.textContent = bsit.textContent; 
    });

    bsed.addEventListener('click', (e) => {
        e.preventDefault();
        selectedCourse.textContent = bsed.textContent; 
    });

    bsba.addEventListener('click', (e) => {
        e.preventDefault();
        selectedCourse.textContent = bsba.textContent; 
    });
}

let isOpen = false;
function handleGlobalClick(e) {
    const isClicked = courseDropDownButton.contains(e.target);

    if (!isClicked) {
        hideDropDown(courseDropDownMenu);
        isOpen = false;
        courseChevron.style.transform = 'rotateY(360deg)';
        document.removeEventListener('click', handleGlobalClick);
    }
}

function addGlobalClick() {
    document.addEventListener('click', handleGlobalClick);
}
