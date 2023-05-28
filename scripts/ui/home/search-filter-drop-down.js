import { displayDropDown, hideDropDown } from "./home-ui-utils.js";

const filterDropDown = document.querySelector("#filter-drop-down");
const filterDropDownMenu = filterDropDown.querySelector("#filter-drop-down-menu");

const selectedFilter = filterDropDown.querySelector("#selected-filter");
const filterDropDownButton = filterDropDown.querySelector("#filter-by-drop-down-button");
const filterChevron = filterDropDown.querySelector("#filter-drop-down-chevron");

const titleFilter = filterDropDownMenu.querySelector("#title-filter");
const authorFilter = filterDropDownMenu.querySelector("#author-filter");
const categoryFilter = filterDropDownMenu.querySelector("#category-filter");
const isbnFilter = filterDropDownMenu.querySelector("#isbn-filter");

export function filterSearchInit() {
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

    titleFilter.addEventListener('click', () => {
        selectedFilter.textContent = titleFilter.textContent; 
    });

    authorFilter.addEventListener('click', () => {
        selectedFilter.textContent = authorFilter.textContent; 
    });

    categoryFilter.addEventListener('click', () => {
        selectedFilter.textContent = categoryFilter.textContent;
    });

    isbnFilter.addEventListener('click', () => {
        selectedFilter.textContent = isbnFilter.textContent; 
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
