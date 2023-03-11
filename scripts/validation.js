const warningLogin = document.getElementById("sign-up-warning");
const warningSignup = document.getElementById("log-in-warning");

export function testFunc() {
    console.log("TEST MOTHERFUCKER")
}

export function password(password) {
    if (password == "") {
        warning("", "red", "sign-up");
        return;
    }

    if (password.length <= 6) {
        warning("Password must be greater than 6 characters.", "red", "sign-up");
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
            warning("Same consecutive characters is not allowed.", "red", "sign-up");
            return false;
        }
    }

    warning("Lookin' good!", "rgb(11, 240, 22)", "sign-up");
    return true;
}

export async function isInputMatched(username, password) {
    if (username == "" || password == "") {
        warning("Incorrect username or password.", "red", "log-in");
        return;
    }
}

export async function username(username) {
    if (username == "") {
        warning("Enter a username.", "red", "sign-up");
        return;
    }
    let isAvail = true;
    let response = await db.collection('users')
    .where('username', '==', username)
    .get().then((data) => {
        data.forEach(element => {
            warning(element.data().username + " is already used, try another.", "red", "sign-up");
            isAvail = false;
        });
    })
    return isAvail;
}

export function email(email) {
    if (email == "") {
        warning("", "red", "sign-up");
        return;
    }
    let regEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (regEx.test(email)) {
        warning("Lookin' good!", "rgb(11, 240, 22)", "sign-up");
        return true;
    }
    warning(email + " is invalid.", "red", "sign-up");
    return false;
}

export function warning(message, color, where) {
    warningSignup.textContent = message
    if (where == "") return;
    if (where == "log-in") {
        warningLogin.style.color = color;
        warningLogin.textContent = message;
    }
    if (where == "sign-up") {
        warningSignup.style.color = color;
        warningSignup.textContent = message;
    }
}

export async function toSha256(input) {
    const textAsBuffer = new TextEncoder().encode(input);
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", textAsBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray
        .map((item) => item.toString(16).padStart(2, "0"))
        .join("");
    return hash;
}