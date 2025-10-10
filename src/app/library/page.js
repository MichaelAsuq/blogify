"use client";

import { useState, useEffect } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Link from "next/link";
import { BookmarkIcon as SolidBookmarkIcon } from "@heroicons/react/24/solid";

export default function Library() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // 🔒 Auth check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        window.location.href = "/login";
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, []);

  // 📚 Fetch saved posts
  useEffect(() => {
    const fetchLibraryPosts = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, "library"),
          where("savedBy", "==", user.uid),
          orderBy("savedAt", "desc")
        );
        const snapshot = await getDocs(q);
        const fetchedPosts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching library posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLibraryPosts();
  }, [user]);

  // 🚪 Logout
  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fafafa]">
        <p className="text-gray-500 text-lg animate-pulse font-serif">
          Loading saved stories...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] px-4 sm:px-6 md:px-10 lg:px-20 py-12 sm:py-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-gray-900">
            My Library
          </h1>

          {user && (
            <div className="flex items-center gap-3">
              <Link
                href="/create"
                className="px-4 py-1.5 bg-black text-white text-md rounded-md hover:bg-gray-900 transition"
              >
                + New Blog
              </Link>

              <Link
                href="/"
                className="px-4 py-1.5 border border-black text-black rounded-md hover:bg-black hover:text-white transition"
              >
                Blogs
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-1.5 border border-black text-black rounded-md hover:bg-black hover:text-white transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Intro */}
        <div className="text-center mb-10 sm:mb-14">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-snug">
            Your Saved Stories
          </h1>
          <p className="text-gray-600 mt-3 sm:mt-4 text-base sm:text-lg font-light max-w-2xl mx-auto px-2">
            All the blogs you’ve bookmarked to read later.
          </p>
        </div>

        {/* Posts */}
        {posts.length === 0 ? (
          <p className="text-center text-gray-500 text-base sm:text-lg">
            No saved blogs yet. Go{" "}
            <Link href="/" className="text-black underline font-medium">
              explore blogs
            </Link>{" "}
            and bookmark your favorites!
          </p>
        ) : (
          <div className="flex flex-col gap-10">
            {posts.map((post) => (
              <div
                key={post.id}
                className="relative bg-white shadow-sm rounded-lg p-6 flex flex-col space-y-4 hover:shadow-md transition"
              >
                {/* Bookmark icon */}
                <div className="absolute top-4 right-4 p-2 rounded-full bg-black text-white">
                  <SolidBookmarkIcon className="w-5 h-5" />
                </div>

                {/* Author & Date */}
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>{post.author || "Anonymous"}</span>
                  <span>·</span>
                  <span>
                    {post.createdAt?.toDate
                      ? post.createdAt.toDate().toLocaleString("en-US", {
                          month: "long",
                          year: "numeric",
                        })
                      : ""}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-gray-900 hover:underline">
                  <Link href={`/post/${post.id}`}>{post.title}</Link>
                </h2>

                {/* Content snippet */}
                <p className="text-gray-700 text-base sm:text-lg line-clamp-4">
                  {post.content.length > 300
                    ? post.content.slice(0, 300) + "..."
                    : post.content}
                </p>

                {/* Read more */}
                <div>
                  <Link
                    href={`/post/${post.id}`}
                    className="text-black font-medium hover:underline"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
