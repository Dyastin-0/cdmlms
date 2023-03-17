import { toSha256 } from './validation.js';

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
    let result = {result: null, username: null};
    
    try {
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
    } catch (error) {
        console.log(error)
    }
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