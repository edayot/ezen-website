import firebaseApp from "@/utils/firebaseConfig";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
export const articlesRef = collection(db, "articles_revamp");
export const footerRef = collection(db, "footer");
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
