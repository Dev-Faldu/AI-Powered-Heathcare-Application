
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithPopup, 
  sendPasswordResetEmail, 
  sendEmailVerification,
  updateProfile,
  AuthError
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from '@/lib/firebase';
import { toast } from '@/hooks/use-toast';

export type UserRole = 'patient' | 'doctor' | null;

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  isVerified: boolean;
  phoneNumber?: string | null;
  createdAt?: any;
  lastLogin?: any;
}

interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  isLoading: boolean;
  signUp: (email: string, password: string, role: UserRole, displayName: string, phoneNumber?: string) => Promise<User | null>;
  login: (email: string, password: string) => Promise<User | null>;
  loginWithGoogle: (role: UserRole) => Promise<User | null>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<UserData>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data() as Omit<UserData, 'uid' | 'email' | 'displayName' | 'photoURL' | 'isVerified'>;
            
            // Update last login time
            await updateDoc(userDocRef, {
              lastLogin: serverTimestamp()
            });
            
            setUserData({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              isVerified: user.emailVerified,
              ...userData
            });
          } else {
            setUserData({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              role: null,
              isVerified: user.emailVerified
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast({
            title: "Error",
            description: "Failed to load user data",
            variant: "destructive"
          });
        }
      } else {
        setUserData(null);
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, role: UserRole, displayName: string, phoneNumber?: string): Promise<User | null> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile with display name
      await updateProfile(user, { displayName });
      
      // Send email verification
      await sendEmailVerification(user);
      
      // Store user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        role: role,
        phoneNumber: phoneNumber || null,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      });
      
      toast({
        title: "Account created successfully",
        description: "Please check your email to verify your account"
      });
      
      return user;
    } catch (error: any) {
      console.error("Error during signup:", error);
      let errorMessage = "Failed to create account";
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Email already in use";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password is too weak";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Invalid email address";
      }
      
      toast({
        title: "Signup Error",
        description: errorMessage,
        variant: "destructive"
      });
      
      return null;
    }
  };

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (!userCredential.user.emailVerified) {
        toast({
          title: "Email not verified",
          description: "Please check your inbox and verify your email",
          variant: "destructive"
        });
        await logout();
        return null;
      }
      
      // Update last login time
      const userDocRef = doc(db, "users", userCredential.user.uid);
      await updateDoc(userDocRef, {
        lastLogin: serverTimestamp()
      });
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${userCredential.user.displayName || email}!`
      });
      
      return userCredential.user;
    } catch (error: any) {
      console.error("Error during login:", error);
      let errorMessage = "Failed to sign in";
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = "Invalid email or password";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed login attempts. Try again later";
      }
      
      toast({
        title: "Login Error",
        description: errorMessage,
        variant: "destructive"
      });
      
      return null;
    }
  };

  const loginWithGoogle = async (role: UserRole): Promise<User | null> => {
    try {
      console.log("Starting Google login process...");
      
      // Clear any previous auth errors
      await signOut(auth);
      
      // Configure Google provider with custom parameters
      googleProvider.setCustomParameters({
        prompt: 'select_account'
      });
      
      console.log("Initiating Google popup...");
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Google popup completed successfully");
      
      const user = result.user;
      
      // Check if user exists in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        console.log("Creating new user document for:", user.uid);
        // New user, set role and create profile
        await setDoc(userDocRef, {
          role: role,
          phoneNumber: user.phoneNumber || null,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp()
        });
        
        toast({
          title: "Account created",
          description: `Welcome to ApneDoctors, ${user.displayName}!`
        });
      } else {
        console.log("Updating existing user document for:", user.uid);
        // Existing user, update last login
        await updateDoc(userDocRef, {
          lastLogin: serverTimestamp()
        });
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${user.displayName}!`
        });
      }
      
      return user;
    } catch (error: any) {
      console.error("Error during Google login:", error);
      
      // Handle specific error codes
      let errorMessage = "Failed to sign in with Google";
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = "Login canceled - popup was closed";
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = "Popup was blocked by the browser. Please enable popups for this site.";
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = "Multiple popup requests were canceled";
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = "Network error occurred. Please check your connection.";
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = "This domain is not authorized for Firebase authentication. Please use a registered domain or contact support.";
        // You can add additional instructions for development environment
        if (window.location.hostname.includes('lovableproject.com') || 
            window.location.hostname === 'localhost' || 
            window.location.hostname === '127.0.0.1') {
          errorMessage += " (Development environment detected: You need to add this domain to Firebase authorized domains)";
        }
      }
      
      toast({
        title: "Google Login Error",
        description: errorMessage,
        variant: "destructive"
      });
      
      return null;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out"
      });
    } catch (error) {
      console.error("Error during logout:", error);
      toast({
        title: "Logout Error",
        description: "Failed to log out",
        variant: "destructive"
      });
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Password reset email sent",
        description: "Check your inbox for further instructions"
      });
    } catch (error: any) {
      console.error("Error during password reset:", error);
      let errorMessage = "Failed to send password reset email";
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = "No account found with this email";
      }
      
      toast({
        title: "Password Reset Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const updateUserProfile = async (data: Partial<UserData>): Promise<void> => {
    if (!currentUser) {
      throw new Error("No user logged in");
    }
    
    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      
      // Update Firestore data
      const firestoreData: Record<string, any> = {};
      if (data.role) firestoreData.role = data.role;
      if (data.phoneNumber) firestoreData.phoneNumber = data.phoneNumber;
      
      if (Object.keys(firestoreData).length > 0) {
        await updateDoc(userDocRef, firestoreData);
      }
      
      // Update Auth profile if needed
      if (data.displayName || data.photoURL) {
        await updateProfile(currentUser, {
          displayName: data.displayName || currentUser.displayName,
          photoURL: data.photoURL || currentUser.photoURL
        });
      }
      
      // Refresh user data
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data() as Omit<UserData, 'uid' | 'email' | 'displayName' | 'photoURL' | 'isVerified'>;
        setUserData({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
          isVerified: currentUser.emailVerified,
          ...userData
        });
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated"
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    }
  };

  const value = {
    currentUser,
    userData,
    isLoading,
    signUp,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
