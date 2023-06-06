import { db } from "../../firebase/firebase.js";
import { onSnapshot,
    query,
    collection,
    orderBy, where, limit
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

import { acceptRequest, confirmReturnRequest } from "./transaction.js";

const requests = document.querySelector("#request-pins");
const returnRequests = document.querySelector("#return-request-pins");

export async function displayRequests() {
    const colRef = collection(db, 'requests');
    const colQuery = query(colRef,
        where('type', '==', 'Request'),
        orderBy('timeRequested', 'asc'),
        limit(10)
    );

    onSnapshot(colQuery, (querySnapshot) => {
        requests.innerHTML = "";
        querySnapshot.forEach((doc) => {
            const formattedRequest = formatRequest(doc.data(), doc.ref);
            requests.appendChild(formattedRequest);
        });
    });
}

export async function displayReturnRequests() {
    const colRef = collection(db, 'requests');
    const colQuery = query(colRef,
        where('type', '==', 'Return'),
        orderBy('timeRequested', 'asc'),
        limit(10)
    );

    onSnapshot(colQuery, (querySnapshot) => {
        returnRequests.innerHTML = "";
        querySnapshot.forEach((doc) => {
            const formatted = formatReturnRequest(doc.data(), doc.ref);
            returnRequests.appendChild(formatted);
        });
    });
}

export function formatRequest(requestInfo, requestRef) {
    const request = document.createElement("div");

    const title = document.createElement("label");
    const isbn = document.createElement("label");
    const id = document.createElement("label");
    const time = document.createElement("label");

    const wrapper = document.createElement("div");
    const accept = document.createElement("button");
    const deleteReq = document.createElement("button");

    request.classList.add("pin");
    request.classList.add("large");
    request.classList.add("nh");

    title.classList.add("title");
    title.textContent = `${requestInfo.bookTitle}`;

    isbn.classList.add("isbn");
    isbn.textContent = `${requestInfo.bookIsbn}`;

    id.classList.add("email");
    id.textContent = `${requestInfo.requestedBy}`;

    time.classList.add("time");
    time.textContent = `${requestInfo.timeRequested}`;

    accept.textContent = "Accept";
    accept.addEventListener('click', () => {
        acceptRequest(requestInfo, requestRef);
    });

    deleteReq.classList.add("red");
    deleteReq.textContent = "Delete";
    deleteReq.addEventListener('click', () => {
        deleteTransaction(requestRef);
    });

    wrapper.classList.add("wrapper");
    wrapper.appendChild(accept);
    wrapper.appendChild(deleteReq);

    request.appendChild(title);
    request.appendChild(isbn);
    request.appendChild(id);
    request.appendChild(time);
    request.appendChild(wrapper);

    return request;
}

export function formatReturnRequest(requestInfo, requestRef) {
    const request = document.createElement("div");

    const title = document.createElement("label");
    const isbn = document.createElement("label");
    const id = document.createElement("label");
    const time = document.createElement("label");

    const wrapper = document.createElement("div");
    const confirm = document.createElement("button");

    request.classList.add("pin");
    request.classList.add("large");
    request.classList.add("nh");

    title.classList.add("title");
    title.textContent = `${requestInfo.bookTitle}`;

    isbn.classList.add("isbn");
    isbn.textContent = `${requestInfo.bookIsbn}`;

    id.classList.add("email");
    id.textContent = `${requestInfo.returnedBy}`;

    time.classList.add("time");
    time.textContent = `${requestInfo.timeRequested}`;

    confirm.textContent = "Confirm";
    confirm.classList.add("yellow");
    confirm.addEventListener('click', () => {
        confirmReturnRequest(requestInfo, requestRef);
    });

    wrapper.classList.add("wrapper");
    wrapper.appendChild(confirm);

    request.appendChild(title);
    request.appendChild(isbn);
    request.appendChild(id);
    request.appendChild(time);
    request.appendChild(wrapper);

    return request;
}