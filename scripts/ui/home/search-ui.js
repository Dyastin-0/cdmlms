import { search } from "../../user.js";

const searchInput = document.getElementById("search-input");
const searchBy = document.getElementById("search-by");
const recentSearchModal = document.getElementById("recent-searches-modal");
const recentSearch = document.getElementById("recent-searches");
const searchModal = document.getElementById("search-modal");
const searchResult = document.getElementById("search-results");
const searchButton = document.getElementById("search-button");
const searchDropDown = document.getElementById("search-drop-down");
const userDropDown = document.getElementById("user-drop-down");
const userNotification = document.getElementById("user-notification");

const overlay = document.getElementById("overlay");

export function bindSearchEvent() {
    searchInput.addEventListener('click', () => {
        displayRecentSearch();
        addGlobalClickSearch();
    });

    overlay.addEventListener('click', () => {
        hideSearchResult();
        overlay.classList.remove("active");
    })

    searchInput.addEventListener('keyup', (e) => {
        if (e.key === "Enter") {
            document.activeElement.blur();
            searchInput.value = '';
            displaySearchResult();
            overlay.classList.add("active");
        }
    });

    searchButton.addEventListener('click', () => {
        addGlobalClickButton();
        displaySearchBar('130px');
        hideNavElements();
    });
}

function hideSearchBar() {
    searchDropDown.style.display = 'none';
    searchInput.style.width = '0';
}

function displaySearchBar(width) {
    searchDropDown.style.display = 'flex';
    searchInput.style.width = width;
}

function hideNavElements() {
    searchButton.style.display = 'none';
    userDropDown.style.display = 'none';
    userNotification.style.display = 'none';
}

function displayNavElements() {
    userDropDown.style.display = 'flex';
    userNotification.style.display = 'flex';
    searchButton.style.display = 'none';
}

function addGlobalClickSearch() {
    document.addEventListener('click', handleGlobalClickSearch);
}

function addGlobalClickButton() {
    document.addEventListener('click', handleGlobalClickButton);
}

function handleGlobalClickButton(e) {
    const elements = [searchButton, searchInput, searchBy, overlay];
    const isClicked = elements.some(element => element.contains(e.target));
    const target = e.target.id;
    let isChild = null;

    if (target) isChild = recentSearchModal.querySelector("#" + e.target.id) ? true : false;

    if (!isClicked && !isChild) {
        hideSearchBar();
        displayNavElements();
        document.removeEventListener('click', handleGlobalClickButton);
    }
}

function handleGlobalClickSearch(e) {
    const isClicked = searchInput.contains(e.target);
    const isSearhByClicked = searchBy.contains(e.target);
    const target = e.target.id ? e.target.id : null;

    let isChild = null;

    if (target) isChild = recentSearchModal.querySelector("#" + e.target.id) ? true : false;

    if (!isClicked && !isChild && !isSearhByClicked) {
        hideRecentSearch();
        document.removeEventListener('click', handleGlobalClickSearch);
    }
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
    const cachedSearches = JSON.parse(localStorage.getItem(key));
  
    const index = cachedSearches ? cachedSearches.indexOf(input) : -1;

    if (index !== -1) {
        moveRecentSearchToTop(key, input, cachedSearches);
        return;
    }

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

        button.classList.add("fit");
        button.classList.add("fa");
        button.classList.add("fa-close");
        button.id = 'delete-recent-button';

        container.appendChild(label);
        container.appendChild(button);
        
        label.addEventListener('click', () => {
            search(searchBy.value, label.textContent);
            moveRecentSearchToTop(key, label.textContent, cachedSearches);
            displayRecentSearches(id);
            displaySearchResult();
            overlay.classList.add("active");
        });

        button.addEventListener('click', () => {
            deleteRecentSearch(label.textContent, key, cachedSearches);
            displayRecentSearches(id);
        });

        recentSearch.appendChild(container);
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