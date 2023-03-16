const warningLogin = document.getElementById("log-in-warning");
const warningSignup = document.getElementById("sign-up-warning");

export function isPasswordValid(password) {
    if (!password) {
        warning("", "sign-up");
        return false;
    }

    const regEx =/^(?!.*([a-zA-Z0-9])\1{3,}).{6,}$/;
    if(regEx.test(password)) {
        warning("", "sign-up");
        return true;
    }

    warning("Password must be 6 characters and contains non-consecutive.", "sign-up");
    return false;
}

export async function isUsernameAndPasswordMatched(username, password) {
    let result = {error: null, data: null};

    if (!username || !password) {
        result.error = "Input username and password.";
        return result;
    }

    try {
        const querySnapshot0 = await db
        .collection('users')
        .where('username' , '==', username)
        .where('password', '==', await toSha256(password))
        .get();

        const querySnapshot1 = await db
        .collection('users')
        .where('id' , '==', await toSha256(username))
        .where('password', '==', await toSha256(password))
        .get();

        if (!querySnapshot0.empty) {
            const userData = querySnapshot0.docs[0].data();
            result.data = userData;
            return result;
        }

        if (!querySnapshot1.empty) {
            const userData = querySnapshot1.docs[0].data();
            result.data = userData;
            return result;
        } 

        result.error = "Invalid username or password.";
        return result;
    } catch (err) {
        result.error = err;
        return result;
    }
}

export async function isUsernameAvailable(username) {
    if (!username) {
        throw warning("Enter a username.", "sign-up");
    }

    let result = {result: null, username: null};
    
    const querySnapshot = await db
    .collection('users')
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

export async function isIdAvailable(id) {
    let result = {result: null, id: null};

    const querySnapshot = await db
    .collection('users')
    .where('id', '==', await toSha256(id))
    .get();

    if (!querySnapshot.empty) {
        result.result = false;
        result.id = id;
        return result;
    }
    
    result.result = true;
    return result;
}

export async function isIdValid(id) {
    if (!id) {
        warning("", "sign-up");
        return;
    }
    const regEx = /^\d{2}-\d{5}$/;
    if (regEx.test(id) && id.length === 8) {
        warning("", "sign-up");
        return true;
    }
    warning("Invalid ID format.", "sign-up");
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

export function warning(message, where) {
    if (!message && where == "log-in") {
        warningLogin.style.display = "none";
        return;
    }

    if (!message && where == "sign-up") {
        warningSignup.style.display = "none";
        return;
    }

    if (where == "log-in") {
        warningLogin.textContent = message;
        warningLogin.style.display = "flex";
    }
    if (where == "sign-up") {
        warningSignup.textContent = message;
        warningSignup.style.display = "flex";
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