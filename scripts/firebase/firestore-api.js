export async function deleteQuery(collection, firstField, secondField, firstValue, secondValue) {
    try {
        const querySnapshot = await getQueryTwoFields(collection, 
            firstField, secondField, 
            firstValue, secondValue);

        const deletePromises = querySnapshot.docs.map(doc => doc.ref.delete());
        await Promise.all(deletePromises);
    } catch (error) {
        console.error(error)
    }
}

export async function getQueryTwoFields(collection, firstField, secondField, firstValue, secondValue) {
    try {
        const querySnapshot = await db
        .collection(collection)
        .where(firstField, '==', firstValue)
        .where(secondField, '==', secondValue)
        .get();
        
        return querySnapshot;
    } catch (error) {
        console.error(error);
    }
}

export async function getQueryOneField(collection, firstField, firstValue) {
    try {
        const querySnapshot = await db
        .collection(collection)
        .where(firstField, '==', firstValue)
        .get();
        
        return querySnapshot;
    } catch (error) {
        console.error(error)
    }
}

export async function getQuery(collection) {
    try {
        const querySnapshot = await db
        .collection(collection)
        .get();

        return querySnapshot;
    } catch (error) {
        console.error(error);
    }
}

export async function getQueryWithLimit(collection, limit) {
    try {
        const querySnapshot = await db
        .collection(collection)
        .limit(limit)
        .get();

        return querySnapshot;
    } catch (error) {
        console.error(error);
    }
}

export async function saveQuery(collection, documentID, document) {
    console.log(document)
    try {
        await db.collection(collection)
        .doc(documentID)
        .set(document);
    } catch (error) {
        console.error(error);
    }
}

export async function searchQuery(collection, orderBy, startAt, endAt) {
    try {
        const querySnapshot = await db
        .collection(collection)
        .orderBy(orderBy)
        .startAt(startAt)
        .endAt(endAt + "\uf8ff")
        .get();

        return querySnapshot;
    } catch (error) {
        console.error(error)
    }
}