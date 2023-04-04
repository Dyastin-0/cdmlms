import { isTokenValid, deleteToken } from "./auth-token.js";
import { fetchAllBooks, formatBooks, findBookBy } from "./books.js";
import { getQueryOneField } from "./firestore-api.js";
import { userDropDownInit } from "./ui/home/user-drop-down-ui.js";
import { addRecentSearch, displayRecentSearches, bindSearchEvent, 
    generateSearchResultItem, generateErrorResult, displayRecentSearchMobile } from "./ui/home/search-ui.js";

let cachedFeatured = {};
let myBooks = {};
const username = document.querySelector("#username");
const logout = document.querySelector("#log-out");
const featured = document.querySelector("#featured");
const searchInput = document.querySelector("#search-input");
const searchBy = document.querySelector("#search-by");
const searchResult = document.querySelector("#search-results");
const searchInputMobile = document.querySelector("#search-input-mobile");
const searchByMobile = document.querySelector("#search-by-mobile");

async function init() {
    bindEvents();
    await redirect();
    bindSearchEvent();
    userDropDownInit();
    cachedFeatured = await fetchAllBooks();
    await renderData(fetchSession());
    const id = fetchSession().id;
    displayRecentSearches(id);
    displayRecentSearchMobile();
    observerScroll();
}

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
}

function fetchSession() {
    const token = JSON.parse(localStorage.getItem("session"));
    return token;
}

export async function redirect() {
    const token = fetchSession();
    const location = window.location.pathname;

    if (location === '/' && token === null) {
        return;
    }

    if (token === null) {
        window.location.href = './';
        return;
    }
    
    if (!await isTokenValid(token)) {
        alert("Session expired.");
        window.location.href = "./";
    }
    
    if (window.location.pathname !== '/home.html') {
        window.location.href = './home.html';
    }
}

async function renderData(token) {
    const querySnapshot = await getQueryOneField('users',
    'id',
    token.id);

    const userData = querySnapshot.docs[0].data();
    username.textContent = userData.username;

    const formattedBooks = formatBooks(cachedFeatured.books);

    formattedBooks.forEach((formattedBook) => {
        featured.appendChild(formattedBook);
    });
}

async function logOut() {
    const token = fetchSession();
    try {
        localStorage.removeItem("session");
        await deleteToken(token);
        await redirect();
    } catch (error) {
        console.error(error)
    }
}

export async function search(by, input) {
    const id = fetchSession().id;

    addRecentSearch(id, input);
    displayRecentSearches(id);

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

if (window.location.pathname === '/home.html') {
    init();
}