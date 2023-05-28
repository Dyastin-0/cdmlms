import { addRecentSearch, displayRecentSearches } from "../ui/home/search-ui.js";
import { findBookBy, formatBook } from "./books.js";

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
        searchResult.innerHTML = "";
        search.results.forEach((book) => {
            const formattedBook = formatBook(book.details, book.ref);
            searchResult.appendChild(formattedBook);
        });
    } else {
        const error = document.createElement('label');
        error.classList.add("error-label");
        error.textContent = search.error;
        searchResult.appendChild(error);
    }
}