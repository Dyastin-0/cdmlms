import { toSha256 } from "./validation.js";

const user = {
    init: function() {
        this.cacheDom();
        this.bindEvents();
        this.fetchLocalStorage();
    },
    cacheDom: function() {
        this.username = document.getElementById("username");
    },
    bindEvents: function() {

    },
    fetchLocalStorage: function() {
        this.username.textContent = localStorage.getItem(toSha256("data"));
    }
}

user.init();

