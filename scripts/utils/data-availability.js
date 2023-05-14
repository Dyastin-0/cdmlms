import { getQueryOneField } from '../firebase/firestore-api.js';

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