'use server';

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

// 🔒 Type definitions for parameters and user
type SignUpParams = {
  uid: string;
  name: string;
  email: string;
};

type SignInParams = {
  email: string;
  idToken: string;
};

type User = {
  id: string;
  name: string;
  email: string;
};

// 🕒 Session duration: 1 week in seconds
const SESSION_DURATION = 60 * 60 * 24 * 7;

// 🍪 Set secure session cookie after login
export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies(); 
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_DURATION * 1000,
  });

  
cookieStore.set("session", sessionCookie, {
  maxAge: SESSION_DURATION,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  sameSite: "lax",
});

}

// 👤 Sign up a new user
export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    const userRecord = await db.collection("users").doc(uid).get();
    if (userRecord.exists)
      return {
        success: false,
        message: "User already exists. Please sign in.",
      };

    await db.collection("users").doc(uid).set({ name, email });

    return {
      success: true,
      message: "Account created successfully. Please sign in.",
    };
  } catch (error: any) {
    console.error("Error creating user:", error);

    if (error.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "This email is already in use",
      };
    }

    return {
      success: false,
      message: "Failed to create account. Please try again.",
    };
  }
}

// 🔑 Sign in an existing user
export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    // ✅ Validate token first
    const decodedToken = await auth.verifyIdToken(idToken);

    // 🔎 Check Firestore for user with that UID
    const userRecord = await db.collection("users").doc(decodedToken.uid).get();

    if (!userRecord.exists) {
      return {
        success: false,
        message: "User does not exist. Please sign up.",
      };
    }

    // 🍪 Set session cookie
    await setSessionCookie(idToken);

    return {
      success: true,
      message: "Signed in successfully",
    };
  } catch (error: any) {
    console.error("Sign-in error:", error);

    return {
      success: false,
      message: "Failed to log into account. Please try again.",
    };
  }
}

// 🚪 Sign out user by clearing session cookie
export async function signOut() {
 const cookieStore = await cookies();
cookieStore.delete("session");       

}

// 👀 Get the currently signed-in user from session cookie
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) return null;

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    const userRecord = await db.collection("users").doc(decodedClaims.uid).get();

    if (!userRecord.exists) return null;

    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User;
  } catch (error) {
    console.log("Error verifying session:", error);
    return null;
  }
}

// 🔐 Check if the user is authenticated (used for protecting routes)
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}
