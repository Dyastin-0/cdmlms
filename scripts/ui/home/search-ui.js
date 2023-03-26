const searchInput = document.getElementById("search-input");
const recentSearch = document.getElementById("recent-searches");
const searchResult = document.getElementById("search-results");

const overlay = document.getElementById("overlay");

export function bindSearchEvent() {
    searchInput.addEventListener('click', () => displayRecentSearch());

    searchInput.addEventListener('focusout', () => hideDisplaySearch());

    overlay.addEventListener('click', () => {
        hideSearchResult();
        overlay.classList.remove("active");
    })

    searchInput.addEventListener('keyup', (e) => {
        if (e.key === "Enter") {
            document.activeElement.blur();
            displaySearchResult();
            overlay.classList.add("active");
        }
    });
}

function hideDisplaySearch() {
    recentSearch.style.transform = "translateY(0) scaleY(0)";
        recentSearch.style.opacity = "0";
}

function displayRecentSearch() {
    recentSearch.style.transform = "translateY(0) scaleY(1)";
        recentSearch.style.opacity = "1";
}

function displaySearchResult() {
    searchResult.style.transform = "translate(-50%, -50%) scale(1)";
    searchResult.style.opacity = "1";
}

function hideSearchResult() {
    searchResult.style.transform = "translate(-50%, -50%) scale(0)";
    searchResult.style.opacity = "0";
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