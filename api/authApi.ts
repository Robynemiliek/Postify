import { auth } from "@/firebaseConfig";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
} from "firebase/auth";

// Login med eksisterende konto
export async function signInWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

// registrer ny konto
export async function signUpWithEmail(
  email: string,
  password: string,
  name: string,
) {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);

  await updateProfile(user, {
    displayName: name,
  });

  return user;
}

// Logg ut
export async function signOutUser() {
  return signOut(auth);
}

// User-friendly sign-in error messages
export function getSignInErrorMessage(code?: string): string {
  switch (code) {
    case "auth/invalid-email":
      return "please enter a valid email adress";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    default:
      return "Something went wrong. Please try again.";
  }
}

// User-friendly registration error messages
export function getSignUpErrorMessage(code?: string): string {
  switch (code) {
    case "auth/email-already-in-use":
      return "This email is already registered.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    default:
      return "Could not create account. Please try again.";
  }
}
