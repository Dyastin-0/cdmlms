import { getQueryOneField } from '../firebase/firestore-api.js';

export async function isIdAvailable(id) {
    let result = {result: null, error: null};

    const querySnapshot = await getQueryOneField('enrolledStudents',
    'id', await id);

    const isEmpty = querySnapshot.empty;

    if (isEmpty) {
        result.result = false;
        result.error = `The id '${id}' is not found, you are currently not enrolled.`;
        return result;
    }

    const studentId = querySnapshot.docs[0].data();
    const isAvailable = studentId.isAvailable;
    if (!isAvailable) {
        result.result = false;
        result.error = `${id} is already used, contact an admin if there is a problem.`;
        return result;
    }
    
    result.result = true;
    return result;
}