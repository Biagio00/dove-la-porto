import fireAdmin, {ServiceAccount} from 'firebase-admin';
import serviceAccount from "../firebase-adminsdk-pkey.json";

fireAdmin.initializeApp({
    credential: fireAdmin.credential.cert(serviceAccount as ServiceAccount)
});


const fireDB = fireAdmin.firestore();

export {fireAdmin, fireDB};
