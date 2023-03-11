export var validate = {
    init: function() {
        this.cacheDom();
    },
    cacheDom: function() {
        this.warningLabel = document.getElementById("sign-up-warning");
    },
    password: function(password) {
        if (password == "") {
            this.warning("", "red");
            return;
        }
    
        if (password.length <= 6) {
            this.warning("Password must be greater than 6 characters.", "red");
            return false;
        }
        let previous = "";
        let consec = 0;
        for (var i = 0; i < password.length; i ++) {
            if (password[i] == previous) {
                consec += 1;
            }
            previous = password[i];
            if (consec >= 5) {
                this.warning("Same consecutive characters is not allowed.", "red");
                return false;
            }
        }
    
        this.warning("Lookin' good!", "rgb(11, 240, 22)");
        return true;
    },
    username: async function(username) {
        if (username == "") {
            this.warning("Enter a username.", "red")
            return;
        }
        let isAvail = true;
        let response = await db.collection('users')
        .where('username', '==', username)
        .get().then((data) => {
            data.forEach(element => {
                this.warning(element.data().username + " is already used, try another.", "red");
                isAvail = false;
            });
        })
        return isAvail;
    },
    email: function(email) {
        if (email == "") {
            this.warning("", "red")
            return;
        }
        let regEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (regEx.test(email)) {
            this.warning("Lookin' good!", "rgb(11, 240, 22)");
            return true;
        }
        this.warning(email + " is invalid.", "red");
        return false;
    },
    warning: function(message, color) {
        this.warningLabel.style.color = color;
        this.warningLabel.textContent = message;
    },
    toSha256: async function(input) {
        const textAsBuffer = new TextEncoder().encode(input);
        const hashBuffer = await window.crypto.subtle.digest("SHA-256", textAsBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hash = hashArray
            .map((item) => item.toString(16).padStart(2, "0"))
            .join("");
        return hash;
    }
}