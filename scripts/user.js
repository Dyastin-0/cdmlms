import { fetchAllFeaturedBooks, formatBooks, findBookBy } from "./books.js";
import { userDropDownInit } from "./ui/home/user-drop-down-ui.js";
import { addRecentSearch, displayRecentSearches, bindSearchEvent, 
    generateSearchResultItem, generateErrorResult, displayRecentSearchMobile } from "./ui/home/search-ui.js";
import { signOutFirebaseAuth } from "./auth-api.js";
import { displayProfile } from "./user-profile.js";

let cachedFeatured = {};
let myBooks = {};

const logout = document.querySelector("#log-out");
const featured = document.querySelector("#featured");
const searchInput = document.querySelector("#search-input");
const searchBy = document.querySelector("#search-by");
const searchResult = document.querySelector("#search-results");
const searchInputMobile = document.querySelector("#search-input-mobile");
const searchByMobile = document.querySelector("#search-by-mobile");

const indexButton = document.querySelector("#index-button");

auth.onAuthStateChanged(user => {
    if (user) {
        user.getIdTokenResult()
        .then(async (IdTokenResult) => {
            const expiration = Date.parse(IdTokenResult.expirationTime);
            const dateNow = new Date().getTime();
            if (dateNow > expiration) {
                await signOutFirebaseAuth();
                window.location.href = './';
            }
        });
    } else {
        window.location.href = './';
    }
});

bindEvents();

//initialize data
export async function userInit(user, currentUserData) {
    bindSearchEvent();
    userDropDownInit();
    cachedFeatured = await fetchAllFeaturedBooks();
    await renderData(user, currentUserData);
    displayRecentSearches(user.uid);
    displayRecentSearchMobile();
    observerScroll();
}

//data rendering
async function renderData(user, currentUserData) {
    displayProfile(user, currentUserData);
    renderBooks();
}

function renderBooks() {
    const formattedBooks = formatBooks(cachedFeatured.books);
    formattedBooks.forEach((formattedBook) => {
        featured.appendChild(formattedBook);
    });
}

//user functions
export async function logOut() {
    await signOutFirebaseAuth();
}

export async function search(by, input) {
    auth.onAuthStateChanged(user => {
        if (user) {
            addRecentSearch(user.uid, input);
            displayRecentSearches(user.uid);
        }
    });

    const search = await findBookBy(by, input);

    if (search.error === null) {
        search.results.forEach((book) => {
            const result = generateSearchResultItem(book);
            searchResult.appendChild(result);
        });
    } else {
        const error = generateErrorResult(search.error);
        searchResult.appendChild(error);
    }
}

//bind DOM element events
async function bindEvents() {
    logout.addEventListener('click', async () => await logOut());

    searchInput.addEventListener('keyup', async (e) => {
        if (e.key === "Enter" && searchInput.value !== '') {
            await search(searchBy.value, searchInput.value);
        }
    });

    searchInputMobile.addEventListener('keyup', async (e) => {
        if (e.key === "Enter" && searchInputMobile.value !== '') {
            await search(searchByMobile.value, searchInputMobile.value);
        }
    });

    indexButton.addEventListener('click', () => {
        window.location.href = './';
    });
}