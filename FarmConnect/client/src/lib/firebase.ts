import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User } from "firebase/auth";
import { getDatabase, ref, set, get } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDwCsIenLB6vNffeDU1gaMehNfy8PTHC1s",
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "leaflearn-fublm"}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "leaflearn-fublm",
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "leaflearn-fublm"}.firebasestorage.app`,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1069384281099",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1069384281099:web:47d75108f603e4b59e2b0e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export interface FirebaseUser {
  uid: string;
  email: string;
  name?: string;
  role?: string;
}

export const firebase = {
  async login(email: string, password: string): Promise<FirebaseUser> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userData = await this.getUserData(userCredential.user.uid);
    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email!,
      ...userData
    };
  },

  async signup(email: string, password: string, name: string, role: string = 'customer'): Promise<FirebaseUser> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await this.saveUserData(userCredential.user.uid, { name, role });
    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email!,
      name,
      role
    };
  },

  async logout(): Promise<void> {
    await signOut(auth);
  },

  async saveUserData(uid: string, data: { name: string; role: string }): Promise<void> {
    await set(ref(db, 'users/' + uid), data);
  },

  async getUserData(uid: string): Promise<{ name?: string; role?: string }> {
    const snapshot = await get(ref(db, 'users/' + uid));
    return snapshot.exists() ? snapshot.val() : {};
  },

  getCurrentUser(): User | null {
    return auth.currentUser;
  },

  onAuthStateChanged(callback: (user: User | null) => void) {
    return auth.onAuthStateChanged(callback);
  }
};
