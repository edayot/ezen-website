import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import firebaseApp from "./firebaseConfig";

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
export const collectionRef = collection(db, "articles_revamp");

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

export const signOutGlobal = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(error);
  }
};
