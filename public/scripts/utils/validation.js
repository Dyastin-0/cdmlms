const warningLogin = document.getElementById("sign-in-warning");
const warningSignup = document.getElementById("sign-up-warning");
const warningSetup = document.getElementById("setup-warning");
const editWarning = document.getElementById("edit-warning");

export function isPasswordValid(password) {
    if (!password) {
        warning("", "sign-up");
        return false;
    }

    const regEx = /^(?!.*([a-zA-Z0-9])\1{3,}).{6,}$/;
    if(regEx.test(password)) {
        warning("", "sign-up");
        return true;
    }

    warning("Password must be at least 6 characters, and not contain the same character consecutively.", "sign-up");
    return false;
}

export function isIdValid(id) {
    if (!id) {
        warning("", "setup");
        return;
    }
    const regEx = /^\d{2}-\d{5}$/;
    if (regEx.test(id) && id.length === 8) {
        warning("", "setup");
        return true;
    }
    warning("Invalid ID format.", "setup");
    return false;
}

export function isEmailValid(email) {
    if (email == "") {
        warning("", "sign-up");
        return;
    }

    let regEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (regEx.test(email)) {
        warning("", "sign-up");
        return true;
    }

    warning(email + " is invalid.", "sign-up");
    return false;
}

export function isEmailValidSignIn(email) {
    if (email == "") {
        warning("", "sign-in");
        return;
    }

    let regEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (regEx.test(email)) {
        warning("", "sign-in");
        return true;
    }

    warning(email + " is invalid.", "sign-in");
    return false;
}

export function warning(message, where) {
    if (!message && where == "edit") {
        editWarning.style.display = "none";
    }

    if (!message && where == "sign-in") {
        warningLogin.style.display = "none";
        return;
    }

    if (!message && where == "sign-up") {
        warningSignup.style.display = "none";
        return;
    }

    if (!message && where == "setup") {
        warningSetup.style.display = "none";
        return;
    }

    if (where == "edit") {
        editWarning.textContent = message;
        editWarning.style.display = "flex";
    }

    if (where == "sign-in") {
        warningLogin.textContent = message;
        warningLogin.style.display = "flex";
        return;
    }

    if (where == "sign-up") {
        warningSignup.textContent = message;
        warningSignup.style.display = "flex";
        return;
    }
    
    if (where == "setup") {
        warningSetup.textContent = message;
        warningSetup.style.display = "flex";
        return;
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