import { search } from "../../user.js";

const searchInput = document.getElementById("search-input");
const searchBy = document.getElementById("search-by");
const recentSearchModal = document.getElementById("recent-searches-modal");
const recentSearch = document.getElementById("recent-searches");
const searchModal = document.getElementById("search-modal");
const searchResult = document.getElementById("search-results");

const overlay = document.getElementById("overlay");

export function bindSearchEvent() {
    searchInput.addEventListener('click', () => displayRecentSearch());

    searchInput.addEventListener('focusout', () => hideRecentSearch());

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
    const cachedSearches = localStorage.getItem(key);
  
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

        label.classList.add("recent-search");
        label.textContent = searchItem;

        button.classList.add("fit");
        button.classList.add("fa");
        button.classList.add("fa-close");

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

    cachedSearches.splice(index, 1);

    cachedSearches.unshift(target);

    localStorage.setItem(key, JSON.stringify(cachedSearches));
}