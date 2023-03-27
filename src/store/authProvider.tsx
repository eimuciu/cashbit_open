import { useContext, createContext, useState } from 'react';
import { UserObj } from '../types/types';
import { signOut } from 'firebase/auth';
import { auth } from '../api/config';

const AuthContext = createContext({});

interface Props {
  children: JSX.Element;
}

function getUserFromStorage() {
  const usr = sessionStorage.getItem('usr');
  if (!usr) return '';
  return JSON.parse(usr);
}

function AuthProvider({ children }: Props) {
  const [user, setUser] = useState(getUserFromStorage());

  const login = (user: string) => {
    sessionStorage.setItem('usr', JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    signOut(auth)
      .then(() => {
        sessionStorage.removeItem('usr');
        setUser('');
      })
      .catch((err) => {
        console.log('Signing out error, ', err);
      });
  };

  const addUserDetails = (credsToAdd: any) => {
    setUser((prev: any) => ({ ...prev, ...credsToAdd }));
  };

  const ctx = { login, logout, isUserLoggedIn: !!user, user, addUserDetails };

  return <AuthContext.Provider value={ctx}>{children}</AuthContext.Provider>;
}

export function useAuthCtx(): any {
  return useContext(AuthContext);
}

export default AuthProvider;
