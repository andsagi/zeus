import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { supabase } from './supabase';

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  language: 'pt' | 'en';
  theme: 'dark' | 'light';
  specialization: string;
  trialStartDate?: any; // Using any for Timestamp/FieldValue
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
      if (u && supabase) {
        // Fetch from Supabase
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', u.uid)
          .maybeSingle();

        if (error) {
          console.error("User data fetch error from Supabase:", error);
          setLoading(false);
          return;
        }

        if (!data) {
          // Create new user profile since it doc doesn't exist
          const newData = {
            id: u.uid,
            email: u.email,
            displayName: u.displayName || 'User',
            photoURL: u.photoURL,
            language: 'pt',
            theme: 'dark',
            specialization: 'Assistente Pessoal',
            subscriptionStatus: 'trial',
          };
          const { error: insertErr } = await supabase.from('users').insert(newData);
          if (insertErr) {
             console.error('Failed to create user:', insertErr);
          } else {
             // Map id to uid for our frontend
             setUserData({ ...newData, uid: newData.id } as UserData);
          }
        } else {
          // User exists mapping
          setUserData({ ...data, uid: data.id } as UserData);
        }
        setLoading(false);
      } else {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const updateUserData = async (data: Partial<UserData>) => {
    if (!user || !supabase) return;
    const { error } = await supabase.from('users').update(data).eq('id', user.uid);
    if (!error) {
      setUserData(prev => prev ? { ...prev, ...data } : null);
    } else {
      console.error('Error updating user on Supabase:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, userData, loading, updateUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
