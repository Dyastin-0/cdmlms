import { db } from "../../firebase/firebase.js";
import { onSnapshot,
    query,
    collection,
    orderBy, startAt, endAt
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

import { formatRequest, formatReturnRequest } from "./requests.js";

const searchCard = document.querySelector("#search-admin");
const searchResultContainer = searchCard.querySelector("#search-result-admin");
const searchInput = searchCard.querySelector("#search-input-admin");
const searchWhere = searchCard.querySelector("#where-filter-admin");

export function bindAdminSearchEvents() {
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === "Enter" && searchInput.value !== '') {
            searchFor(searchInput.value.trim(), searchWhere.textContent);
        }
    });
}

function formatUser(user) {
    const container = document.createElement("div");

    const name = document.createElement("label");
    const email = document.createElement("label");
    const gender = document.createElement("label");
    const id = document.createElement("label");
    const courseYear = document.createElement("label");

    container.classList.add("pin");
    container.classList.add("small");

    name.classList.add("title");
    name.textContent = `${user.firstName} ${user.middleName} ${user.lastName}`;

    email.classList.add("other-details");
    email.textContent = user.email;

    gender.classList.add("other-details");
    gender.textContent = `${user.sex}`;

    id.classList.add("other-details");
    id.textContent = `${user.id}`;

    courseYear.classList.add("other-details");
    courseYear.textContent = `${user.course}, ${user.year} year`;

    container.appendChild(name);
    container.appendChild(gender);
    container.appendChild(id);
    container.appendChild(courseYear);

    return container;
}

function formatReturnedTransaction(transaction) {
    const container = document.createElement("div");

    const title = document.createElement("label");
    const isbn = document.createElement("label");
    const status = document.createElement("label");
    const by = document.createElement("label");
    const date = document.createElement("label");

    container.classList.add("pin");
    container.classList.add("large");

    title.classList.add("title");
    title.textContent = transaction.bookTitle;

    isbn.classList.add("other-details");
    isbn.textContent = transaction.bookIsbn;

    by.classList.add("other-details");
    by.textContent = transaction.requestedBy;

    status.classList.add("other-details");
    status.textContent = `Status: ${transaction.status}`;

    date.classList.add("time");
    date.textContent = transaction.status === "Approved" ? 
        `Return by: ${transaction.returnDue}` :
        `Date returned: ${transaction.dateReturned}`;

    container.appendChild(title);
    container.appendChild(isbn);
    container.appendChild(by);
    container.appendChild(status);
    container.appendChild(date);

    return container;
}

async function searchFor(input, col) {
    if (col === "Transactions") { searchTransanctions(input, col); return }
    if (col === "Requests") { searchRequests(input, col); return }
    if (col === "Users") { searchUsers(input, col); }
}

async function searchUsers(input, col) {
    const colRef = collection(db, col.toLowerCase());
    const colQuery = await query(colRef,
        orderBy('id'),
        startAt(input),
        endAt(input  + "\uf8ff")
    );

    onSnapshot(colQuery, (querySnapshot) => {
        searchResultContainer.innerHTML = "";
        querySnapshot.forEach((doc) => {
            const formatted = formatUser(doc.data());
            searchResultContainer.appendChild(formatted);
        });
    });
}

async function searchRequests(input, col) {
    const colRef = collection(db, col.toLowerCase());
    const colQuery = await query(colRef,
        orderBy('requestedBy'),
        startAt(input),
        endAt(input  + "\uf8ff")
    );
    
    const secondColQuery = await query(colRef,
        orderBy('returnedBy'),
        startAt(input),
        endAt(input  + "\uf8ff") 
    );

    onSnapshot(colQuery, (querySnapshot) => {
        searchResultContainer.innerHTML = "";
        querySnapshot.forEach((doc) => {
            const formatted = formatRequest(doc.data(), doc.ref);
            searchResultContainer.appendChild(formatted);
        });
    });

    onSnapshot(secondColQuery, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const secondFormatted = formatReturnRequest(doc.data(), doc.ref);
            searchResultContainer.appendChild(secondFormatted);
        });
    });
}

async function searchTransanctions(input, col) {
    const colRef = collection(db, col.toLowerCase());
    const colQuery = await query(colRef,
        orderBy('requestedBy'),
        startAt(input),
        endAt(input  + "\uf8ff")
    );

    onSnapshot(colQuery, (querySnapshot) => {
        searchResultContainer.innerHTML = "";
        querySnapshot.forEach((doc) => {
            const formatted = formatReturnedTransaction(doc.data());
            searchResultContainer.appendChild(formatted);
        });
    });
}