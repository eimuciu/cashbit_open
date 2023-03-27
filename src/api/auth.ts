import { auth } from './config';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { userSettingsExistInDb, userDetailsExistInDb } from './db';

export function signup(email: string, password: string): any {
  return createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredentials) => {
      await userSettingsExistInDb(userCredentials.user.uid);
      await userDetailsExistInDb(userCredentials.user.uid);
      return mapCredentials(userCredentials.user);
    })
    .catch((err) => {
      console.log(err);
    });
}

export function signin(email: string, password: string): any {
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredentials) => {
      return mapCredentials(userCredentials.user);
    })
    .catch((err) => {
      console.log(err);
    });
}

export function googlesignin(): any {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider)
    .then(async (userCredentials) => {
      await userSettingsExistInDb(userCredentials.user.uid);
      await userDetailsExistInDb(userCredentials.user.uid);
      return mapCredentials(userCredentials.user);
    })
    .catch((err) => {
      console.log(err);
    });
}

// Helper functions
function mapCredentials(userCredentials: any) {
  return { email: userCredentials.email, uid: userCredentials.uid };
}
