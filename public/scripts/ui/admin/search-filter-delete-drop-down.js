import { displayDropDown, hideDropDown } from "../home/home-ui-utils.js";

const filterDropDown = document.querySelector("#delete-filter-drop-down");
const filterDropDownMenu = filterDropDown.querySelector("#delete-filter-drop-down-menu");

const selectedFilter = filterDropDown.querySelector("#delete-selected-filter");
const filterDropDownButton = filterDropDown.querySelector("#delete-filter-by-drop-down-button");
const filterChevron = filterDropDown.querySelector("#delete-filter-drop-down-chevron");

const titleFilter = filterDropDownMenu.querySelector("#delete-title-filter");
const authorFilter = filterDropDownMenu.querySelector("#delete-author-filter");
const categoryFilter = filterDropDownMenu.querySelector("#delete-category-filter");
const isbnFilter = filterDropDownMenu.querySelector("#delete-isbn-filter");

export function deleteFilterSearchInit() {
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
