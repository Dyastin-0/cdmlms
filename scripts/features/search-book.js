import { addRecentSearch, displayRecentSearches } from "../ui/home/search-ui.js";
import { findBookBy, formatBooks } from "./books.js";

const searchResult = document.querySelector("#search-results");

export async function search(by, input) {
    auth.onAuthStateChanged(user => {
        if (user) {
            addRecentSearch(user.uid, input);
            displayRecentSearches(user.uid);
        }
    });

    const search = await findBookBy(by, input);
    if (!search.error) {
        const formattedBook = formatBooks(search.results);
        formattedBook.forEach((book) => {
            searchResult.appendChild(book);
        });
    } else {
        const error = document.createElement('label');
        error.classList.add("error-label");
        error.textContent = search.error;
        searchResult.appendChild(error);
    }
}