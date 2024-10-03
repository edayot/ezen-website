import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";
import firebaseApp from "./firebaseConfig";

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
export const collectionRef = collection(db, "articles_revamp");
export const mapRef = ref(storage, "map.png");

export const signInEmailPassword = async (email: string, password: string) => {
  let err = null;
  let res = null;
  try {
    res = await signInWithEmailAndPassword(auth, email, password);
    return [res, err];
  } catch (error: any) {
    err = error.message;
    return [res, err];
  }
};

export const signOutGlobal = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};
