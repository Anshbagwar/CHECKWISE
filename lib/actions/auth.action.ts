'use server';

import { auth, db } from '@/firebase/admin';
import { cookies } from 'next/headers';

type SignUpParams = {
  uid: string;
  name: string;
  email: string;
};

type SignInParams = {
  idToken: string;
};

type User = {
  id: string;
  name: string;
  email: string;
};

const SESSION_DURATION = 60 * 60 * 24 * 7; // 1 week in seconds

// 🍪 Set secure session cookie after login
export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_DURATION * 1000,
  });

  await cookieStore.set('session', sessionCookie, {
    maxAge: SESSION_DURATION,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
  });
}

// 👤 Sign up a new user
export async function signUp({ uid, name, email }: SignUpParams) {
  try {
    const userDoc = await db.collection('users').doc(uid).get();

    if (userDoc.exists) {
      return {
        success: false,
        message: 'User already exists. Please sign in.',
      };
    }

    await db.collection('users').doc(uid).set({ name, email });

    return {
      success: true,
      message: 'Account created successfully. Please sign in.',
    };
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'auth/email-already-exists'
    ) {
      return {
        success: false,
        message: 'This email is already in use',
      };
    }

    console.error('Sign-up error:', error);

    return {
      success: false,
      message: 'Failed to create account. Please try again.',
    };
  }
}

// 🔑 Sign in an existing user
export async function signIn({ idToken }: SignInParams) {
  try {
    const decodedToken = await auth.verifyIdToken(idToken);

    const userDoc = await db.collection('users').doc(decodedToken.uid).get();

    if (!userDoc.exists) {
      return {
        success: false,
        message: 'User does not exist. Please sign up.',
      };
    }

    await setSessionCookie(idToken);

    return {
      success: true,
      message: 'Signed in successfully',
    };
  } catch (error) {
    console.error('Sign-in error:', error);

    return {
      success: false,
      message: 'Failed to log into account. Please try again.',
    };
  }
}

// 🚪 Sign out user by clearing session cookie
export async function signOut() {
  const cookieStore = await cookies();
  await cookieStore.delete('session');
}

// 👀 Get the currently signed-in user from session
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionCookie = (await cookieStore.get('session'))?.value;

  if (!sessionCookie) return null;

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    const userDoc = await db.collection('users').doc(decodedClaims.uid).get();

    if (!userDoc.exists) return null;

    return {
      ...(userDoc.data() as Omit<User, 'id'>),
      id: userDoc.id,
    };
  } catch (error) {
    console.error('Error verifying session:', error);
    return null;
  }
}

// 🔐 Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user;
}
