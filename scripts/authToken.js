export function generateToken(userData) {
    const date = new Date();
    const token = {
        expiration: (date.getTime() + (30 * 60 * 1000)),
        id: userData.id,
        isAdmin: userData.isAdmin
    }
    return token;
}

export async function saveToken(token) {
    await db.collection('authTokens')
    .doc(crypto.randomUUID())
    .set(token)
    .catch(err => {
        console.log(err)
    })
}

export async function deleteToken(token) {
    console.log("Deleting token " + token)
    try {
        const querySnapshot = await db
        .collection('authTokens')
        .where('expiration', '==', token.expiration)
        .where('id', '==', token.id)
        .get();
        
        const deletePromises = querySnapshot.docs.map(doc => doc.ref.delete());
        await Promise.all(deletePromises);
    } catch (error) {
        console.log(error)
    }
    console.log("token delete");
}

export async function isTokenValid(token) {
    try {
        const response = await db.collection('authTokens')
        .where('id', '==', token.id)
        .where('expiration', '==', token.expiration)
        .get();

        const currentTime = new Date().getTime();
        const fetchedToken = response.docs[0].data(); 
        if (fetchedToken.expiration > currentTime) return true;
        await deleteToken(token);
        localStorage.removeItem("session");
        return false;
    } catch (error) {
        console.log(error)
    }
}