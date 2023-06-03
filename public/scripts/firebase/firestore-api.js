import { db } from "./firebase.js";
import { collection,
    doc,
    setDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    limit, orderBy, startAt, endAt,
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

export async function deleteQuery(collection, firstField, secondField, firstValue, secondValue) {
    try {
        const querySnapshot = await getQueryTwoFields(collection, 
            firstField, secondField, 
            firstValue, secondValue);

        const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
    } catch (error) {
        console.error(error)
    }
}

export async function getQueryTwoFields(col, firstField, secondField, firstValue, secondValue) {
    try {  
        const colRef = collection(db, col);
        const colQuery = query(colRef,
            where(firstField, "==", firstValue),
            where(secondField, "==", secondValue)
        );

        const querySnapshot = await getDocs(colQuery);
        
        return querySnapshot;
    } catch (error) {
        console.error(error);
    }
}

export async function getQueryOneField(col, firstField, firstValue) {
    try {
        const colRef = collection(db, col);
        const colQuery = query(colRef,
            where(firstField, "==", firstValue)
        );

        const querySnapshot = await getDocs(colQuery);
        
        return querySnapshot;
    } catch (error) {
        console.error(error)
    }
}

export async function getQuery(col) {
    try {
        const colRef = collection(db, col);
        const querySnapshot = await getDocs(colRef);

        return querySnapshot;
    } catch (error) {
        console.error(error);
    }
}

export async function getQueryWithLimit(col, lmt) {
    try {
        const colRef = collection(db, col);
        const colQuery = query(colRef,
            limit(lmt)
        );
        const querySnapshot = await getDocs(colQuery);

        return querySnapshot;
    } catch (error) {
        console.error(error);
    }
}

export async function saveQuery(col, documentID, document) {
    try {
        const colRef = doc(db, col, documentID)
        await setDoc(colRef, document);
    } catch (error) {
        console.error(error);
    }
}

export async function updateQuery(docRef, updatedDoc) {
    try {
        await updateDoc(docRef, updatedDoc);
    } catch (error) {
        console.error(error);
    }
}

export async function searchQuery(col, ob, st, ea) {
    try {
        const colRef = collection(db, col);
        const colQuery = query(colRef,
            orderBy(ob),
            startAt(st),
            endAt(ea  + "\uf8ff")
        )

        const querySnapshot = await getDocs(colQuery);
        return querySnapshot;   
    } catch (error) {
        console.error(error)
    }
}