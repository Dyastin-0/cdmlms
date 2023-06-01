import { getCollectionCount } from "../../firebase/firestore-api.js";

const pinContainer = document.querySelector("#statistic-pins");

const allUsers = pinContainer.querySelector("#total-users");
const pendingRequest = pinContainer.querySelector("#pending-requests");
const totalIssuedBook = pinContainer.querySelector("#total-issued-book");
const totalBooks = pinContainer.querySelector("#total-books");

export async function displayStatistics() {
    allUsers.textContent = await getCollectionCount('users');
    totalBooks.textContent = await getCollectionCount('books');
    pendingRequest.textContent = await getCollectionCount('requests');
}