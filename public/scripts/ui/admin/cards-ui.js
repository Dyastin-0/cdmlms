const leftNav = document.querySelector("#left-nav");
const dashBoards = document.querySelector("#admin-dashboard");

const homeButton = leftNav.querySelector("#left-home-button");
const homeCard = dashBoards.querySelector("#statistics");

const addBookButton = leftNav.querySelector("#left-add-button");
const addBookCard = dashBoards.querySelector("#add-book");

const requestButton = leftNav.querySelector("#left-requests-button");
const requestCard = dashBoards.querySelector("#issue-requests");

const searchButton = leftNav.querySelector("#left-search-button");
const searchCard = dashBoards.querySelector("#search-admin");

const editButton = leftNav.querySelector("#left-edit-button");
const editCard = dashBoards.querySelector("#edit-book");

const deleteButton = leftNav.querySelector("#left-delete-button");
const deleteCard = dashBoards.querySelector("#delete-book");

const recordsButton = leftNav.querySelector("#left-records-button");
const recordsCard = dashBoards.querySelector("#records");

const usersButton = leftNav.querySelector("#left-users-button");
const usersCard = dashBoards.querySelector("#recent-users");

const reportsButton = leftNav.querySelector("#left-reports-button");
const reportsCard = dashBoards.querySelector("#user-reports");

const cards = [
    homeCard,
    addBookCard,
    requestCard,
    searchCard,
    editCard,
    deleteCard,
    recordsCard,
    usersCard,
    reportsCard
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
    usersButton.addEventListener('click', () => {
        if (!usersCard.classList.contains("active")) {
            hideCards();
            usersCard.classList.add("active");
        }
    });

    reportsButton.addEventListener('click', () => {
        if (!reportsCard.classList.contains("active")) {
            hideCards();
            reportsCard.classList.add("active");
        }
    });
}

function hideCards() {
    cards.forEach((card) => {
        if (card.classList.contains("active")) card.classList.remove("active");
    });
}