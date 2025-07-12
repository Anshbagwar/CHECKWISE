import * as dotenv from 'dotenv';
dotenv.config();

import { getApps, getApp, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!projectId || !clientEmail || !privateKey) {
  throw new Error('Missing Firebase Admin configuration.');
}
console.log("Starts with BEGIN:", privateKey?.startsWith("-----BEGIN PRIVATE KEY-----")); // ✅
console.log("Ends with END:", privateKey?.trim().endsWith("-----END PRIVATE KEY-----"));   // ✅
console.log("Includes line breaks:", privateKey?.includes("\n"));                           // ✅


const app =
  getApps().length === 0
    ? initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      })
    : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);