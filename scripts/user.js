import { isTokenValid, deleteToken } from "./authToken.js";

const username = document.getElementById("username");
const logout = document.getElementById("log-out");

function init() {
    bindEvents();
    redirect();
    renderData(fetchSession());
}

async function bindEvents() {
    await logout.addEventListener('click', async () => await logOut());
}

function fetchSession() {
    const token = JSON.parse(localStorage.getItem("session"));
    return token;
}

export async function redirect() {
    const token = fetchSession();

    if(window.location.pathname == '/index.html') {
        return;
    }

    if(token === null) {
        window.location.href = './index.html';
        return;
    }

    if(!isTokenValid(token)) {
        window.location.href = "./index.html";
    }

    if(window.location.pathname !== '/home.html') {
        window.location.href = './home.html';
    }
}

async function renderData(token) {
    const querySnapshot = await db
    .collection('users')
    .where('id', '==', token.id)
    .get();

    const userData = querySnapshot.docs[0].data();

    username.textContent = userData.username;
}

async function logOut() {
    const token = fetchSession();
    try {
        localStorage.removeItem("session");
        await deleteToken(token);
        await redirect();
    } catch (error) {
        console.log(error);
    }
}

if (window.location.pathname === '/home.html') {
    init();
}