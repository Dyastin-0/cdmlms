import { search } from "../../user.js";

//desktop view ui elements
const searchInput = document.getElementById("search-input");
const searchBy = document.getElementById("search-by");
const recentSearchModal = document.getElementById("recent-searches-modal");
const recentSearch = document.getElementById("recent-searches");
const searchModal = document.getElementById("search-modal");
const searchResult = document.getElementById("search-results");
const searchButton = document.getElementById("search-button");
const overlay = document.getElementById("overlay");

//mobile view ui elements
const backButton = document.getElementById("back-button-search-modal-mobile");
const recentSearchModalMobile = document.getElementById("recent-search-modal-mobile");
const searchByMobile = document.getElementById("search-by-mobile");
const searchInputMobile = document.getElementById("search-input-mobile");
const recentSearchesMobile = document.getElementById("recent-searches-modal-mobile");
const recentSearchMobile = document.getElementById("recent-search-mobile");

export function bindSearchEvent() {
    //desktop view
    searchInput.addEventListener('click', () => {
        displayRecentSearch();
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
        if (e.key === "Enter" && searchInputMobile.value != '') {
            displaySearchResult();
            searchInputMobile.value = '';
            overlay.classList.add("active");
        }
    });

    searchButton.addEventListener('click', () => {
        displayRecentSearchModalMobile();
    });

    backButton.addEventListener('click', () => {
        hideRecentSearchModalMobile();
        hideSearchResult();
        overlay.classList.remove("active");
    });

    //global
    overlay.addEventListener('click', () => {
        hideSearchResult();
        overlay.classList.remove("active");
    })
}

//global click for the searchInput on desktop view, specifically for hiding its modal
function addGlobalClick() {
    document.addEventListener('click', (e) => {
        handleGlobalClick(e, searchInput, searchBy)
    });
}

function handleGlobalClick(e, input, by) {
    const isClicked = input.contains(e.target);
    const isSearhByClicked = by.contains(e.target);
    const target = e.target.id ? e.target.id : null;

    let isChild = null;

    if (target) isChild = recentSearchModal.querySelector("#" + e.target.id) ? true : false;

    if (!isClicked && !isChild && !isSearhByClicked) {
        hideRecentSearch();
        document.removeEventListener('click', handleGlobalClick);
    }
}

//hide && display of modals
function hideRecentSearchModalMobile() {
    recentSearchModalMobile.style.opacity = '0';
    recentSearchModalMobile.style.pointerEvents = 'none';
}

function displayRecentSearchModalMobile() {
    recentSearchModalMobile.style.opacity = '1';
    recentSearchModalMobile.style.pointerEvents = 'all';
}

export function displayRecentSearchMobile() {
    recentSearchesMobile.style.transform = "scaleY(1)";
    recentSearchesMobile.style.opacity = "1";
}

function hideRecentSearch() {
    recentSearchModal.style.transform = "scaleY(0)";
    recentSearchModal.style.opacity = "0";
    searchResult.innerHTML = "";

}

function displayRecentSearch() {
    recentSearchModal.style.transform = "scaleY(1)";
    recentSearchModal.style.opacity = "1";
}

function displaySearchResult() {
    searchModal.style.transform = "translate(-50%, -50%) scale(1)";
    searchModal.style.opacity = "1";
}

function hideSearchResult() {
    searchModal.style.transform = "translate(-50%, -50%) scale(0)";
    searchModal.style.opacity = "0";   
    hideRecentSearch(); 
}

//Search result item
export function generateSearchResultItem(data) {
    const container = document.createElement("div");
    const titleLabel = document.createElement("label");
    const authorLabel = document.createElement("label");

    container.classList.add("result-item");
    titleLabel.classList.add("title");
    authorLabel.classList.add("author");

    titleLabel.textContent = data.title;
    authorLabel.textContent = data.author;

    container.appendChild(titleLabel);
    container.appendChild(authorLabel);

    return container;
}

export function generateErrorResult(error) {
    const container = document.createElement("div");
    const errorLabel = document.createElement("label");

    container.classList.add("result-item");
    errorLabel.classList.add("error");

    errorLabel.textContent = error;

    container.appendChild(errorLabel);

    return container;
}

// Recent search items
export function addRecentSearch(id, input) {
    if (!input) return;

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

        container.classList.add("wrapper");
        container.classList.add("space-between");
        container.id = 'recent-search-container';
    
        label.classList.add("recent-search");
        label.textContent = searchItem;
        label.id = 'recent-search-label';

        button.classList.add("delete-button");
        button.classList.add("fa");
        button.classList.add("fa-close");
        button.id = 'delete-recent-button';

        container.appendChild(label);
        container.appendChild(button);
        
        label.addEventListener('click', () => {
            search(by.value, label.textContent, searchResult);
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