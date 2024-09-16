import firebaseApp from "./firebaseConfig";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const collectionRef = collection(db, "articles")

export const signInEmailPassword = async (email, password) => {
  let err = null;
  let res = null;
  try {
    res = await signInWithEmailAndPassword(auth, email, password);
    return [res, err];
  } catch (error) {
    err = error.message;
    return [res, err];
  }
};

export const signOut = async () => {
  try {
    await firebase.auth().signOut();
  } catch (error) {
    throw new Error(error);
  }
};
