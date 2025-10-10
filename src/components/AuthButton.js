"use client";
import { useState, useEffect } from "react";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

export default function AuthButton() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleLogin = async () => {
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <div className="flex justify-end p-4">
            {user ? (
                <div className="flex items-center gap-3">
                    <img
                        src={user.photoURL}
                        alt={user.displayName}
                        className="w-8 h-8 rounded-full"
                    />
                    <p className="text-gray-700 text-sm font-medium">{user.displayName}</p>
                    <button
                        onClick={handleLogout}
                        className="text-sm bg-black text-white px-3 py-1 rounded-full hover:bg-gray-800 transition"
                    >
                        Logout
                    </button>
                </div>
            ) : (
                <button
                    onClick={handleLogin}
                    className="bg-black text-white px-5 py-2 rounded-full hover:bg-gray-900 transition"
                >
                    Sign in with Google
                </button>
            )}
        </div>
    );
}
