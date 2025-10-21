import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, googleProvider } from '../services/firebase';
import { 
    onAuthStateChanged, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    signInWithPopup,
    signInWithPhoneNumber,
    RecaptchaVerifier,
    ConfirmationResult,
    User 
} from 'firebase/auth';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signup: (email: string, password: string) => Promise<any>;
    login: (email: string, password: string) => Promise<any>;
    logout: () => Promise<void>;
    signInWithGoogle: () => Promise<any>;
    signInWithPhone: (phoneNumber: string, verifier: RecaptchaVerifier) => Promise<ConfirmationResult>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const signup = (email: string, password: string) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const login = (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        return signOut(auth);
    };

    const signInWithGoogle = () => {
        return signInWithPopup(auth, googleProvider);
    };
    
    const signInWithPhone = (phoneNumber: string, verifier: RecaptchaVerifier) => {
        return signInWithPhoneNumber(auth, phoneNumber, verifier);
    }

    const value = {
        user,
        loading,
        signup,
        login,
        logout,
        signInWithGoogle,
        signInWithPhone,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};