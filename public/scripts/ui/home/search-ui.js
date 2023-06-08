import { searchBooks } from "../../features/user.js";
import { displayDropDown, hideDropDown } from "./home-ui-utils.js";

//desktop view ui elements
const searchInput = document.querySelector("#search-input");
const searchBy = document.querySelector("#selected-filter");
const recentSearchModal = document.querySelector("#recent-searches-modal");
const recentSearch = document.querySelector("#recent-searches");
const searchModal = document.querySelector("#search-modal");
const overlay = document.querySelector("#overlay");

//mobile view ui elements
const searchButton = document.querySelector("#search-button");
const backButton = document.querySelector("#back-button-search-modal-mobile");
const recentSearchModalMobile = document.querySelector("#recent-search-modal-mobile");
const searchByMobile = document.querySelector("#selected-filter-mobile");
const searchInputMobile = document.querySelector("#search-input-mobile");
const recentSearchesMobile = document.querySelector("#recent-searches-modal-mobile");
const recentSearchMobile = document.querySelector("#recent-search-mobile");

export function bindSearchEvent() {
    //desktop view
    searchInput.addEventListener('click', () => {
        displayDropDown(recentSearchModal);
        addGlobalClick();
    });

    searchInput.addEventListener('keyup', (e) => {
        if (e.key === "Enter" && searchInput.value != '') {
            searchInput.value = '';
            displaySearchResult();
            overlay.classList.add("active");
        }
    });

    //mobile view
    searchInputMobile.addEventListener('keyup', (e) => {
        e.preventDefault();
        if (e.key === "Enter" && searchInputMobile.value != '') {
            displaySearchResult();
            searchInputMobile.value = '';
            overlay.classList.add("active");
        }
    });

    searchButton.addEventListener('click', () => {
        displayDropDown(recentSearchModalMobile);
    });

    backButton.addEventListener('click', () => {
        hideDropDown(recentSearchModalMobile);
        hideSearchResult();
        overlay.classList.remove("active");
    });
}

//global click for the searchInput on desktop view, specifically for hiding its modal
function addGlobalClick() {
    const globalClickListener = function(e) {
        handleGlobalClick(e, searchInput, globalClickListener);
    }
    document.addEventListener('click', globalClickListener);
}

function handleGlobalClick(e, input, eventRef) {
    const isClicked = input.contains(e.target);
    const target = e.target.id ? e.target.id : null;

    let isChild = null;
    if (target) isChild = recentSearchModal.querySelector("#" + e.target.id) ? true : false;
    if (!isClicked && !isChild) {
        hideRecentSearch();
        document.removeEventListener('click', eventRef);
    }
}

//hide && display of modals

function hideRecentSearch() {
    hideDropDown(recentSearchModal);
}

export function displayRecentSearchMobile() {
    recentSearchesMobile.style.transform = "scaleY(1)";
    recentSearchesMobile.style.opacity = "1";
}

function displaySearchResult() {
    searchModal.style.transform = "translate(-50%, -50%) scale(1)";
    searchModal.style.opacity = "1";
}

export function hideSearchResult() {
    searchModal.style.transform = "translate(-50%, -50%) scale(0)";
    searchModal.style.opacity = "0";
}

// Recent search items
export function addRecentSearch(id, input) {
    if (!input) return;
    input = input.toString();
    const key = "cached_searches_" + id;
    const fetched = localStorage.getItem(key);
    const cachedSearches = fetched ? JSON.parse(fetched) : fetched;
    
    const index = cachedSearches ? cachedSearches.indexOf(input) : -1;

    if (index !== -1) {
        moveRecentSearchToTop(key, input, cachedSearches);
        return;
    }

    const searchHistory = cachedSearches ? cachedSearches : [];

    searchHistory.unshift(input);
  
    const cachedSearchHistory = searchHistory.slice(0, 5);

    localStorage.setItem(key, JSON.stringify(cachedSearchHistory));
}
export function displayRecentSearches(id) {
    recentSearch.innerHTML = "";
    recentSearchMobile.innerHTML = "";
    
    const key = "cached_searches_" + id;
    const fetched = localStorage.getItem(key);
    const cachedSearches = fetched ? JSON.parse(fetched) : fetched;

    if (!cachedSearches) return;
    generateRecentSearchItem(key, id, cachedSearches, recentSearch, searchBy);
    generateRecentSearchItem(key, id, cachedSearches, recentSearchMobile, searchByMobile);
}

function generateRecentSearchItem(key, id, cachedSearches, wrapper, by) {
    cachedSearches.forEach((searchItem) => {
        const container = document.createElement("div");
        const label = document.createElement("label");
        const button = document.createElement("button");
        const icon = document.createElement('i');

        container.classList.add("wrapper");
        container.classList.add("space-between");
        container.id = 'recent-search';
    
        label.classList.add("recent-search");
        label.textContent = searchItem;
        label.id = 'recent-search';

        button.classList.add("delete-button");
        
        icon.classList.add('fa');
        icon.classList.add('fa-close');

        button.appendChild(icon);

        const buttonId = 'recent-search';
        icon.id = buttonId;
        button.id = buttonId;
        button.ariaLabel = buttonId;

        container.appendChild(label);
        container.appendChild(button);
    
        label.addEventListener('click', async () => {
            await searchBooks(by.textContent.toLowerCase().trim(), label.textContent);
            moveRecentSearchToTop(key, label.textContent, cachedSearches);
            displayRecentSearches(id);
            displaySearchResult();
            overlay.classList.add("active");
        });
    
        button.addEventListener('click', () => {
            deleteRecentSearch(label.textContent, key, cachedSearches);
            displayRecentSearches(id);
        });

        wrapper.appendChild(container);
    });
}

function deleteRecentSearch(target, key, cachedSearches) {
    const index = cachedSearches.indexOf(target);

    cachedSearches.splice(index, 1);

    localStorage.setItem(key, JSON.stringify(cachedSearches));
}

function moveRecentSearchToTop(key, target, cachedSearches) {
    const index = cachedSearches.indexOf(target);

    if (index === 0) return;

    cachedSearches.splice(index, 1);

    cachedSearches.unshift(target);

    localStorage.setItem(key, JSON.stringify(cachedSearches));
}