import { search } from "../../user.js";

const searchInput = document.getElementById("search-input");
const searchBy = document.getElementById("search-by");
const recentSearchModal = document.getElementById("recent-searches-modal");
const recentSearch = document.getElementById("recent-searches");
const searchModal = document.getElementById("search-modal");
const searchResult = document.getElementById("search-results");
const searchButton = document.getElementById("search-button");
const overlay = document.getElementById("overlay");
//mobile
const backButton = document.getElementById("back-button-search-modal-mobile");
const recentSearchModalMobile = document.getElementById("recent-search-modal-mobile");
const searchByMobile = document.getElementById("search-by-mobile");
const searchInputMobile = document.getElementById("search-input-mobile");
const recentSearchesMobile = document.getElementById("recent-searches-modal-mobile");
const searchResultMobile = document.getElementById("search-results-mobile");

export function bindSearchEvent() {
    searchInput.addEventListener('click', () => {
        displayRecentSearch();
        addGlobalClick();
    });

    searchInputMobile.addEventListener('click', () => {
        displayRecentSearchMobile();
        addGlobalClickMobile();
    });

    searchResultMobile.addEventListener('keyup', () => {
        if (e.key === "Enter" && searchInput.value != '') {
            displaySearchResultMobile();
        }
    });

    overlay.addEventListener('click', () => {
        hideSearchResult();
        overlay.classList.remove("active");
    })

    searchInput.addEventListener('keyup', (e) => {
        if (e.key === "Enter" && searchInput.value != '') {
            document.activeElement.blur();
            searchInput.value = '';
            displaySearchResult();
            overlay.classList.add("active");
        }
    });

    searchButton.addEventListener('click', () => {
        displayRecentSearchModalMobile();
    });

    backButton.addEventListener('click', () => {
        hideRecentSearchModalMobile();
    });
}

function hideRecentSearchModalMobile() {
    recentSearchModalMobile.style.opacity = '0';
    recentSearchModalMobile.style.pointerEvents = 'none';
}

function displayRecentSearchModalMobile() {
    recentSearchModalMobile.style.opacity = '1';
    recentSearchModalMobile.style.pointerEvents = 'all';
}

function addGlobalClick() {
    document.addEventListener('click', (e) => {
        handleGlobalClick(e, searchInput, searchBy)
    });
}

function addGlobalClickMobile() {
    document.addEventListener('click', (e) => {
        handleGlobalClickMobile(e, searchInputMobile, searchByMobile);
    });
}

function handleGlobalClickMobile(e, input, by) {
    const isClicked = input.contains(e.target);
    const isSearhByClicked = by.contains(e.target);
    const target = e.target.id ? e.target.id : null;

    let isChild = null;

    if (target) isChild = recentSearchModal.querySelector("#" + e.target.id) ? true : false;

    if (!isClicked && !isChild && !isSearhByClicked) {
        hideRecentSearch(recentSearchesMobile, searchInputMobile);
        document.removeEventListener('click', handleGlobalClickMobile);
    }
}

function handleGlobalClick(e, input, by) {
    const isClicked = input.contains(e.target);
    const isSearhByClicked = by.contains(e.target);
    const target = e.target.id ? e.target.id : null;

    let isChild = null;

    if (target) isChild = recentSearchModal.querySelector("#" + e.target.id) ? true : false;

    if (!isClicked && !isChild && !isSearhByClicked) {
        hideRecentSearch(recentSearchModal, searchResult);
        document.removeEventListener('click', handleGlobalClick);
    }
}

function displayRecentSearchMobile() {
    recentSearchesMobile.style.transform = "scaleY(1)";
    recentSearchesMobile.style.opacity = "1";
}

function hideRecentSearch(container, input) {
    container.style.transform = "scaleY(0)";
    container.style.opacity = "0";
    input.innerHTML = "";

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
}

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

export function addRecentSearch(id, input) {
    if (!input) return;

    const key = "cached_searches_" + id;
    const cachedSearches = localStorage.getItem(key).empty ? JSON.parse(localStorage.getItem(key)) : localStorage.getItem(key);
  
    const index = cachedSearches ? cachedSearches.indexOf(input) : -1;

    if (index !== -1) {
        moveRecentSearchToTop(key, input, cachedSearches);
        return;
    }

    console.log(cachedSearches)

    const searchHistory = cachedSearches ? JSON.parse(cachedSearches) : [];

    searchHistory.unshift(input);
  
    const cachedSearchHistory = searchHistory.slice(0, 5);

    localStorage.setItem(key, JSON.stringify(cachedSearchHistory));
}

export function displayRecentSearches(id) {
    recentSearch.innerHTML = "";
    const key = "cached_searches_" + id;
    const cachedSearches = JSON.parse(localStorage.getItem(key));

    if (!cachedSearches) return;

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

        button.classList.add("button");
        button.classList.add("fit");
        button.classList.add("fa");
        button.classList.add("fa-close");
        button.id = 'delete-recent-button';

        container.appendChild(label);
        container.appendChild(button);
        
        label.addEventListener('click', () => {
            search(searchBy.value, label.textContent, searchResult);
            moveRecentSearchToTop(key, label.textContent, cachedSearches);
            displayRecentSearches(id);
            displaySearchResult();
            overlay.classList.add("active");
        });
    
        button.addEventListener('click', () => {
            deleteRecentSearch(label.textContent, key, cachedSearches);
            displayRecentSearches(id);
        });

        const clone = container.cloneNode(true);
        recentSearch.appendChild(container);
        recentSearchesMobile.appendChild(clone);
        
    });
}

function deleteRecentSearch(target, key, cachedSearches) {
    const index = cachedSearches.indexOf(target);

    cachedSearches.splice(index, 1);

    localStorage.setItem(key, JSON.stringify(cachedSearches));
}

function moveRecentSearchToTop(key, target, cachedSearches) {
    const index = cachedSearches.indexOf(target);
    console.log(index, target)
    if (index === 0) return;

    console.log(cachedSearches)

    cachedSearches.splice(index, 1);

    cachedSearches.unshift(target);

    localStorage.setItem(key, JSON.stringify(cachedSearches));
}