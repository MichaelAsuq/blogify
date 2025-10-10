"use client";
import { useState } from "react";
import { auth, googleProvider, facebookProvider, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", username: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      await updateProfile(user, { displayName: form.username });

      await setDoc(doc(db, "users", user.uid), {
        username: form.username,
        email: user.email,
        createdAt: new Date(),
      });

      // Send verification email
      await sendEmailVerification(user);

      setSuccessMsg(
        "Account created! A verification email has been sent to your email address. Please verify before logging in."
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError("");
    try {
      const { user } = await signInWithPopup(auth, googleProvider);
      await setDoc(doc(db, "users", user.uid), {
        username: user.displayName,
        email: user.email,
        provider: "google",
        createdAt: new Date(),
      });

      setSuccessMsg(
        "Account created via Google! Please verify your email if not already verified."
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookSignUp = async () => {
    setLoading(true);
    setError("");
    try {
      const { user } = await signInWithPopup(auth, facebookProvider);
      await setDoc(doc(db, "users", user.uid), {
        username: user.displayName,
        email: user.email,
        provider: "facebook",
        createdAt: new Date(),
      });

      setSuccessMsg(
        "Account created via Facebook! Please verify your email if not already verified."
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 sm:p-10 transition-all duration-300 hover:shadow-xl">
        <h2 className="text-3xl sm:text-4xl font-semibold text-center mb-6 text-gray-900 font-serif tracking-tight">
          Join Blogify
        </h2>
        <p className="text-center text-gray-500 text-sm sm:text-base mb-8 font-light">
          Create your free account to share and explore ideas.
        </p>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        {successMsg && (
          <p className="text-green-500 text-sm text-center mb-4">{successMsg}</p>
        )}

        <form onSubmit={handleEmailSignUp} className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-1">
            <label className="text-gray-700 text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black placeholder-gray-400"
              required
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-gray-700 text-sm font-medium">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Choose a username"
              value={form.username}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black placeholder-gray-400"
              required
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-gray-700 text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black placeholder-gray-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white py-2.5 rounded-lg hover:bg-gray-800 transition duration-300 mt-2"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className="flex items-center justify-center my-6">
          <span className="h-px bg-gray-300 w-1/4"></span>
          <span className="px-2 text-gray-500 text-sm">or</span>
          <span className="h-px bg-gray-300 w-1/4"></span>
        </div>

        <div className="flex flex-col sm:flex-row sm:space-x-3 sm:space-y-0 space-y-3">
          <button
            onClick={handleGoogleSignUp}
            className="flex items-center justify-center w-full border text-black border-gray-500 py-2 rounded-lg hover:bg-gray-50 transition duration-300 text-sm font-medium"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            Continue with Google
          </button>

        </div>

        <p className="text-center text-sm text-gray-600 mt-8">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-black font-medium hover:underline hover:text-gray-800 transition"
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
