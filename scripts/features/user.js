import { fetchAllFeaturedBooks, formatBooks } from "./books.js";
import { userDropDownInit } from "../ui/home/user-drop-down-ui.js";
import { signOutFirebaseAuth } from "../firebase/auth-api.js";
import { displayProfile } from "./user-profile.js";
import { bindSearchEvent, displayRecentSearches, displayRecentSearchMobile } from "../ui/home/search-ui.js";
import { search } from "./search-book.js";

let cachedFeatured = {};
let myBooks = {};

const logout = document.querySelector("#log-out");
const featured = document.querySelector("#featured");
const searchInput = document.querySelector("#search-input");
const searchBy = document.querySelector("#search-by");
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

export async function userInit(user, currentUserData) {
    userDropDownInit();
    cachedFeatured = await fetchAllFeaturedBooks();
    renderData(user, currentUserData);
    bindSearchEvent();
    displayRecentSearches(user.uid);
    displayRecentSearchMobile();
    observerScroll();
}

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

export async function logOut() {
    await signOutFirebaseAuth();
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

    indexButton.addEventListener('click', () => {
        window.location.href = './';
    });
}