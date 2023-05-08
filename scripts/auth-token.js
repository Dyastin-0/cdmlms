import { deleteQuery, getQueryTwoFields, saveQuery } from "./firestore-api.js";

export function generateToken(id) {
    const date = new Date();
    const token = {
        expiration: (date.getTime() + (30 * 60 * 1000)),
        id: userData.id,
    }
    return token;
}

export async function saveToken(token) {
    await saveQuery('authTokens', crypto.randomUUID(), token);
}

export async function deleteToken(token) {
    await deleteQuery('authTokens',
     'expiration', 'id',
      token.expiration, token.id);
}

export async function isTokenValid(token) {
    try {
        const response = await getQueryTwoFields('authTokens',
         'expiration', 'id', 
         token.expiration, token.id);

        const currentTime = new Date().getTime();
        const fetchedToken = response.docs[0].data(); 

        if (fetchedToken.expiration > currentTime) return true;

        await deleteToken(token);
        localStorage.removeItem("session");

        return false;
    } catch (error) {
        console.error(error);
    }
}