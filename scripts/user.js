import { isTokenValid, deleteToken } from "./auth-token.js";
import { fetchAllBooks, formatBook, findBookBy } from "./books.js";
import { addRecentSearch, displayRecentSearches, bindSearchEvent, generateSearchResultItem, generateErrorResult } from "./ui/home/search-ui.js";

let allBooks = await fetchAllBooks();
let myBooks = {};
const username = document.getElementById("username");
const logout = document.getElementById("log-out");
const featured = document.getElementById("featured");
const searchInput = document.getElementById("search-input");
const searchBy = document.getElementById("search-by");
const searchResult = document.getElementById("search-results");

async function init() {
    bindEvents();
    await redirect();
    bindSearchEvent();
    renderData(fetchSession());
    const userId = fetchSession().id;
    displayRecentSearches(userId);
}

async function bindEvents() {
    await logout.addEventListener('click', async () => await logOut());
    await searchInput.addEventListener('keyup', async (e) => {
        if (e.key === "Enter") {
            await search(searchBy.value, searchInput.value);
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

    if (location === '/index.html' || location === '/') {
        return;
    }

    if (token === null) {
        alert("TEST")
        window.location.href = './index.html';
        return;
    }

    if (! await isTokenValid(token)) {
        alert("Session expired.");
        window.location.href = "./index.html";
    }
    
    if (window.location.pathname !== '/home.html') {
        window.location.href = './home.html';
    }
}

async function renderData(token) {
    const querySnapshot = await db
    .collection('users')
    .where('id', '==', token.id)
    .get();

    const userData = querySnapshot.docs[0].data();
    username.textContent = userData.username;

    allBooks.books.forEach(book => {
        const pin = formatBook(book);
        featured.appendChild(pin);
    });
}

async function logOut() {
    const token = fetchSession();
    try {
        localStorage.removeItem("session");
        await deleteToken(token);
        await redirect();
    } catch (error) {
        console.log(error);
    }
}

export async function search(by, input) {
    const id = fetchSession().id;
    addRecentSearch(id, searchInput.value);
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