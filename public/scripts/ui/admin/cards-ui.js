const leftNav = document.querySelector("#left-nav");

const homeButton = leftNav.querySelector("#left-home-button");
const homeCard = document.querySelector("#statistics");

const addBookButton = leftNav.querySelector("#left-add-button");
const addBookCard = document.querySelector("#add-book");

const requestButton = leftNav.querySelector("#left-requests-button");
const requestCard = document.querySelector("#issue-requests");

const searchButton = document.querySelector("#left-search-button");
const searchCard = document.querySelector("#search-admin");

const editButton = leftNav.querySelector("#left-edit-button");
const editCard = document.querySelector("#edit-book");

const deleteButton = leftNav.querySelector("#left-delete-button");
const deleteCard = document.querySelector("#delete-book");

const recordsButton = leftNav.querySelector("#left-records-button");
const recordsCard = document.querySelector("#records");

const cards = [
    homeCard,
    addBookCard,
    requestCard,
    searchCard,
    editCard,
    deleteCard,
    recordsCard
];

bindEvents();

function bindEvents() {
    addBookButton.addEventListener('click', () => {
        if (!addBookCard.classList.contains("active")) {
            hideCards();
            addBookCard.classList.add("active");
        }
    });
    homeButton.addEventListener('click', () => {
        if (!homeCard.classList.contains("active")) {
            hideCards();
            homeCard.classList.add("active");
        }
    });
    requestButton.addEventListener('click', () => {
        if (!requestCard.classList.contains("active")) {
            hideCards();
            requestCard.classList.add("active");
        }
    });
    searchButton.addEventListener('click', () => {
        if (!searchCard.classList.contains("active")) {
            hideCards();
            searchCard.classList.add("active");
        }
    });
    editButton.addEventListener('click', () => {
        if (!editCard.classList.contains("active")) {
            hideCards();
            editCard.classList.add("active");
        }
    });
    deleteButton.addEventListener('click', () => {
        if (!deleteCard.classList.contains("active")) {
            hideCards();
            deleteCard.classList.add("active");
        }
    });
    recordsButton.addEventListener('click', () => {
        if (!recordsCard.classList.contains("active")) {
            hideCards();
            recordsCard.classList.add("active");
        }
    });
}

function hideCards() {
    cards.forEach((card) => {
        if (card.classList.contains("active")) card.classList.remove("active");
    });
}