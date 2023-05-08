import { getQueryOneField, getQueryTwoFields } from './firestore-api.js';
import { toSha256 } from './validation.js';

export async function isUsernameAndPasswordMatched(username, password) {
    let result = {error: null, data: null};

    if (!username || !password) {
        result.error = "Input username and password.";
        return result;
    }

    try {
        const querySnapshot0 = await getQueryTwoFields('users',
         'username', 'password',
          username, await toSha256(password));

        const querySnapshot1 = await getQueryTwoFields('users',
         'id', 'password',
          await toSha256(username), await toSha256(password));

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

export async function isEmailAvailable(email) {
    let result = {result: null, email: null};

    try {
        const querySnapshot = await getQueryOneField('users',
        'email',
        email);

        if (!querySnapshot.empty) {
            result.result = false;
            result.email = email;
            return result;
        }

        result.result = true;
        return result;
    } catch (error) {
        console.error(error);
    }
}

export async function isDisplayNameAvailable(displayName) {
    let result = {result: null, displayName: null};
    
    try {
        const querySnapshot = await getQueryOneField('users',
         'displayName',
          displayName);

        if (!querySnapshot.empty) {
            result.result = false;
            result.displayName = displayName;
            return result;
        }

    result.result = true;
    return result;
    } catch (error) {
        console.error(error)
    }
}

export async function isIdAvailable(id) {
    let result = {result: null, id: null};

    const querySnapshot = await getQueryOneField('users',
    'id',
     await id);

    if (!querySnapshot.empty) {
        result.result = false;
        result.id = id;
        return result;
    }
    
    result.result = true;
    return result;
}