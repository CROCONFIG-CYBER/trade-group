import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { firebase, FirebaseUser } from "@/lib/firebase";
import { User } from "firebase/auth";

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<FirebaseUser>;
  signup: (email: string, password: string, name: string, role?: string) => Promise<FirebaseUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebase.onAuthStateChanged(async (firebaseUser: User | null) => {
      if (firebaseUser) {
        const userData = await firebase.getUserData(firebaseUser.uid);
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          ...userData
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string): Promise<FirebaseUser> => {
    const user = await firebase.login(email, password);
    setUser(user);
    return user;
  };

  const signup = async (email: string, password: string, name: string, role: string = 'customer'): Promise<FirebaseUser> => {
    const user = await firebase.signup(email, password, name, role);
    setUser(user);
    return user;
  };

  const logout = async (): Promise<void> => {
    await firebase.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
