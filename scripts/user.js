import { isTokenValid, deleteToken } from "./authToken.js";

export const user = {
    init: function() {
        this.cacheDom();
        this.bindEvents();
        this.redirect();
    },
    cacheDom: function() {
        this.username = document.getElementById("username");
        this.logout = document.getElementById("log-out");
    },
    bindEvents: async function() {
        await this.logout.addEventListener('click', async () => await this.logOut());
    },
    fetchSession: function() {
        const token = JSON.parse(localStorage.getItem("session"));
        return token;
    },
    redirect: async function() {
        const token = this.fetchSession();

        if(window.location.pathname == '/index.html') {
            return;
        }

        if(token === null) {
            window.location.href = './index.html';
            return;
        }

        if(!isTokenValid(token)) {
            alert("Session expired, log in again.");
            window.location.href = "./index.html";
        }

        if(window.location.pathname !== '/home.html') {
            window.location.href = './home.html';
            await this.renderData(token);
        } else {
            await this.renderData(token);
        }
    },
    renderData: async function(token) {
        const querySnapshot = await db
        .collection('users')
        .where('id', '==', token.id)
        .get();

        const userData = querySnapshot.docs[0].data();

        this.username.textContent = userData.username;
    }, 
    logOut: async function() {
        const token = this.fetchSession();
        try {
            localStorage.removeItem("session");
            await deleteToken(token);
            await this.redirect();
        } catch (error) {
            console.log(error);
        }
    }
}

if (window.location.pathname === '/home.html') {
    user.init();
}