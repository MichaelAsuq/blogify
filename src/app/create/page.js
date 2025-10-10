"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function CreatePost() {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Load draft from localStorage before form renders
  useEffect(() => {
    const savedTitle = localStorage.getItem("draftTitle") || "";
    const savedContent = localStorage.getItem("draftContent") || "";
    setTitle(savedTitle);
    setContent(savedContent);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Auto-save draft
  useEffect(() => {
    if (title || content) {
      localStorage.setItem("draftTitle", title);
      localStorage.setItem("draftContent", content);
    }
  }, [title, content]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      alert("Please fill in all fields");
      return;
    }

    if (!user) {
      alert("You must be logged in to post");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "posts"), {
        title,
        content,
        author: user.displayName,
        authorPhoto: user.photoURL,
        authorId: user.uid,
        createdAt: serverTimestamp(),
      });

      localStorage.removeItem("draftTitle");
      localStorage.removeItem("draftContent");

      router.push("/");
    } catch (error) {
      console.error("Error adding post:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
        <p className="text-xl text-gray-700 font-serif mb-6">
          ✍️ You must be signed in to write a story.
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-5 py-2 bg-black text-white rounded-full hover:bg-gray-900 transition"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 md:px-10 py-16">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-2 text-gray-900">
            Write a New Story
          </h1>
          <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto">
            Share your thoughts, ideas, or experiences. Every story matters.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 bg-white shadow-md rounded-2xl p-8 sm:p-10 transition-all"
        >
          <div className="flex flex-col">
            <label className="text-gray-700 text-sm font-medium mb-2">
              Story Title
            </label>
            <input
              type="text"
              placeholder="Your story title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-serif p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 text-sm font-medium mb-2">
              Story Content
            </label>
            <textarea
              placeholder="Start writing your story..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="text-lg p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
            />
          </div>

          <p className="text-sm text-gray-500">
            Your draft is automatically saved locally.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-900 transition disabled:opacity-50"
          >
            {loading ? "Publishing..." : "Publish Story"}
          </button>
        </form>
      </div>
    </div>
  );
}
