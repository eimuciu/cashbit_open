import { db } from './config';
import {
  getDoc,
  doc,
  setDoc,
  updateDoc,
  addDoc,
  getDocs,
  deleteDoc,
  collection,
  WithFieldValue,
  DocumentData,
} from 'firebase/firestore';
import settingsData from '../data/settingsData.json';

import type { ExpenseData, IncomeData, SettingsData } from '../types/types';
//GENERAL HELPER FUNCTIONS
async function addToDb<T extends WithFieldValue<DocumentData>>(
  dbcollection: string,
  dataToAdd: T,
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, dbcollection), dataToAdd);
    return docRef.id;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function getDataFromDb<T>(dbcollection: string): Promise<T[]> {
  try {
    const expenseData: T[] = [];

    const querySnapshot = await getDocs(collection(db, dbcollection));
    querySnapshot.forEach((docObj) => {
      expenseData.push({ _id: docObj.id, ...docObj.data() } as T);
    });
    return expenseData;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function deleteDocFromDb(dbcollection: string, docId: string) {
  try {
    return await deleteDoc(doc(db, dbcollection, docId));
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function updateDocInDb(dbcollection: string, docObj: any) {
  try {
    const copyObj = { ...docObj };
    const docId = copyObj._id;
    delete copyObj._id;
    return await updateDoc(doc(db, dbcollection, docId), copyObj);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

//EXPENSE QUERIES
export function getExpenseFromDb(uid: string): Promise<ExpenseData[]> {
  return getDataFromDb<ExpenseData>(`expense${uid}`);
}

export function addExpenseToDb(
  uid: string,
  expenseData: ExpenseData,
): Promise<string> {
  return addToDb<ExpenseData>(`expense${uid}`, expenseData);
}

export function deleteExpenseDocFromDb(uid: string, docId: string) {
  return deleteDocFromDb(`expense${uid}`, docId);
}

export function updateExpenseDocInDb(uid: string, docObj: any) {
  return updateDocInDb(`expense${uid}`, docObj);
}

//INCOME QUERIES
export function getIncomeFromDb(uid: string): Promise<IncomeData[]> {
  return getDataFromDb<IncomeData>(`income${uid}`);
}

export function addIncomeToDb(
  uid: string,
  incomeData: IncomeData,
): Promise<string> {
  return addToDb<IncomeData>(`income${uid}`, incomeData);
}

export function deleteIncomeDocFromDb(uid: string, docId: string) {
  return deleteDocFromDb(`income${uid}`, docId);
}

export function updateIncomeDocInDb(uid: string, docObj: any) {
  return updateDocInDb(`income${uid}`, docObj);
}

// SETTINGS QUERIES
export function getSettingsfromDb(uid: string): Promise<SettingsData[]> {
  return getDataFromDb<SettingsData>(`settings${uid}`);
}

export function userSettingsExistInDb(uid: string): Promise<any> {
  return getDataFromDb<SettingsData>(`settings${uid}`).then((resp) => {
    if (resp && resp.length > 0) {
      return;
    }
    return addUserSettingsToDb(uid, settingsData);
  });
}

function addUserSettingsToDb(
  uid: string,
  settingsData: SettingsData,
): Promise<string> {
  return addToDb<SettingsData>(`settings${uid}`, settingsData);
}

export function updateUserSettingsInDb(uid: string, settingsObj: any) {
  return updateDocInDb(`settings${uid}`, settingsObj);
}

// USER QUERIES
export async function getUserDetailsFromDb(uid: string) {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  return docSnap.data();
}

export async function userDetailsExistInDb(uid: string) {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    return addUserDetailsToDb(uid);
  }
  return;
}

async function addUserDetailsToDb(uid: string) {
  const docRef = doc(db, 'users', uid);
  return await setDoc(docRef, {
    photoURL:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-fMXEWyzl7MNd3Q15JOeyzHxasfVIHK6K_A&usqp=CAU',
  });
}
