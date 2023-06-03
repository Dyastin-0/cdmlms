import { db } from "../../firebase/firebase.js";
import { onSnapshot,
    query,
    collection,
    orderBy
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const issueContainer = document.querySelector("#request-pins");

export async function displayRequests() {
    const colRef = collection(db, 'requests');
    const colQuery = query(colRef,
        orderBy('timeRequested', 'asc')
    );

    onSnapshot(colQuery, (querySnapshot) => {
        issueContainer.innerHTML = "";
        querySnapshot.forEach((doc) => {
            const formattedRequest = formatRequest(doc.data());
            issueContainer.appendChild(formattedRequest);
        });
    });
}

function formatRequest(requestInfo) {
    const request = document.createElement("div");

    const title = document.createElement("label");
    const isbn = document.createElement("label");
    const id = document.createElement("label");
    const time = document.createElement("label");

    request.classList.add("pin");
    request.classList.add("large");

    title.classList.add("title");
    title.textContent = `${requestInfo.title}`;

    isbn.classList.add("isbn");
    isbn.textContent = `${requestInfo.isbn}`;

    id.classList.add("email");
    id.textContent = `${requestInfo.id}`;

    time.classList.add("time");
    time.textContent = `${requestInfo.timeRequested}`;

    request.appendChild(title);
    request.appendChild(isbn);
    request.appendChild(id);
    request.appendChild(time);

    return request;
}