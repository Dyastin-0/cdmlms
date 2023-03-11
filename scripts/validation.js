const warningLogin = document.getElementById("log-in-warning");
const warningSignup = document.getElementById("sign-up-warning");

export function isPasswordValid(password) {
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

export async function isUsernameAndPasswordMatched(username, password) {
    let result = {error: null, data: null};

    if (!username || !password) {
        result.error = "Input username and password.";
        return result;
    }

    try {
        const querySnapshot = await db
        .collection('users')
        .where('username' , '==', username)
        .where('password', '==', await toSha256(password))
        .get();

        if (querySnapshot.empty) {
            result.error = "Invalid username or password.";
            return result;
        }
        
        const userData = querySnapshot.docs[0].data();
        result.data = userData;
        return result;
    } catch (err) {
        result.error = "An error occured while trying to log in.";
        return result;
    }
}

export async function isUsernameAvailable(username) {
    let result = {result: null, username: null};
    if (!username) {
        throw warning("Enter a username.", "red", "sign-up");
    }

    let querySnapshot = await db.collection('users')
    .where('username', '==', username)
    .get();
    
    if (!querySnapshot.empty) {
        result.result = false;
        result.username = username;
        return result;
    }

    result.result = true;
    return result;
}

export function isEmailValid(email) {
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