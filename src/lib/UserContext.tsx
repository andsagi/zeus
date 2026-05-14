import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp, FieldValue } from 'firebase/firestore';
import { auth, db } from './firebase';

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  language: 'pt' | 'en';
  theme: 'dark' | 'light';
  specialization: string;
  trialStartDate: any; // Using any for Timestamp/FieldValue
  subscriptionStatus: 'trial' | 'active' | 'expired' | 'premium';
}

interface UserContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  updateUserData: (data: Partial<UserData>) => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  userData: null,
  loading: true,
  updateUserData: async () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const userRef = doc(db, 'users', u.uid);
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) {
          const newData = {
            uid: u.uid,
            email: u.email,
            displayName: u.displayName || 'User',
            photoURL: u.photoURL,
            language: 'pt',
            theme: 'dark',
            specialization: 'Assistente Pessoal',
            trialStartDate: serverTimestamp(),
            subscriptionStatus: 'trial',
          };
          await setDoc(userRef, newData);
        }

        // Listen for real-time updates
        const unsubDoc = onSnapshot(userRef, (doc) => {
          if (doc.exists()) {
            setUserData(doc.data() as UserData);
            setLoading(false);
          }
        }, (error) => {
          console.error("User data fetch error:", error);
          setLoading(false);
        });
        return () => unsubDoc();
      } else {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const updateUserData = async (data: Partial<UserData>) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, data, { merge: true });
  };

  return (
    <UserContext.Provider value={{ user, userData, loading, updateUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
