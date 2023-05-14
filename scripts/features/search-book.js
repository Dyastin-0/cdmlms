import { addRecentSearch,
    displayRecentSearches,
    generateSearchResultItem,
    generateErrorResult } from "../ui/home/search-ui.js";
import { findBookBy } from "./books.js";

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
        search.results.forEach((book) => {
            const result = generateSearchResultItem(book);
            searchResult.appendChild(result);
        });
    } else {
        const error = generateErrorResult(search.error);
        searchResult.appendChild(error);
    }
}